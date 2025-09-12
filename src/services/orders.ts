import { FlowersCollections } from "db/models/flowers";
import { OrdersCollection } from "db/models/orders";
import { ShopsCollection } from "db/models/shops";
import createHttpError from "http-errors";
import { Types } from "mongoose";

export const getAllOrders = async () => {
    const orders = await OrdersCollection.find();
    return orders;
};

export const getOrderById = async (orderId) => {
    const order = await OrdersCollection.findById(orderId);
    return order;
};

export const createOrder = async (payload) => {
    const { shopId, customer, deliveryAddress, items, type, address }
        = payload;

    if (!shopId || !type || !customer || !items) {
        throw createHttpError(400, 'Missing required fields');
    };

    const wanted = items.map((item) => {
        const { flowerId, quantity } = item;
        const qty = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;
        return { flowerId: new Types.ObjectId(flowerId), quantity: qty };
    })

    const shopObjectId = new Types.ObjectId(shopId);
    const flowerIds = wanted.map((item) => item.flowerId);
    const flowers = await FlowersCollections.find({
        _id: { $in: flowerIds },
        shopId: shopObjectId,
    });

    const byId = new Map(flowers.map(f => [String(f._id), f]));
    const orderItems = wanted.map(w => {
        const f = byId.get(String(w.flowerId));
        if (!f?.available) {
            throw createHttpError(400, `Flower ${f?.title} is not available`);
        }
        if (f.stock < w.quantity) {
            throw createHttpError(400, `Insufficient stock for flower ${f.title}`);
        }
        return {
            flowerId: f._id,
            quantity: w.quantity,
            price: f.price,
            currency: f.currency || 'EUR',
            title: f.title,
            image_url: f?.image_url,
            type: f.type,
        };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const preparedOrderData = {
        shopId: shopObjectId,
        customer,
        type,
        deliveryAddress: type === 'delivery' ? deliveryAddress : address,
        items: orderItems,
        totalAmount,
        currency: 'EUR',
        status: 'pending',
    };

    if (type === 'delivery') {
        if (!deliveryAddress.city || !deliveryAddress.street || !deliveryAddress.postalCode) {
            throw createHttpError(400, 'Missing required delivery address fields');
        }
    }

    if (type === 'pickup') {
        const shop = await ShopsCollection.findById(shopId);
        if (!shop) {
            throw createHttpError(400, 'Shop not found for pickup');
        }

        const shopAddress = {
            city: shop.address.city,
            street: shop.address.street,
            building: shop.address.building,
        };

        preparedOrderData.deliveryAddress = shopAddress;
    }

    if (flowers.length !== flowerIds.length) {
        throw createHttpError(400, 'One or more flowers are not found in the specified shop');
    };

    const decrementStockOperations = orderItems.map(item => ({
        updateOne: {
            filter: { _id: item.flowerId, available: true, stock: { $gte: item.quantity } },
            update: { $inc: { stock: -item.quantity } }
        }
    }));

    const bulkResult = await FlowersCollections.bulkWrite(decrementStockOperations, { ordered: true });

    bulkResult.modifiedCount, 'expected:', orderItems.length);
    const modifiedCount = bulkResult.modifiedCount;
    const expectedCount = orderItems.length;

    if (modifiedCount !== expectedCount) {
        const ids = orderItems.map(i => i.flowerId);
        const fresh = await FlowersCollections.find({ _id: { $in: ids } })
            .select({ title: 1, stock: 1, available: 1, shopId: 1 })
            .lean();
        console.warn('[stock-conflict]', {
            wanted: orderItems.map(i => ({ id: String(i.itemId), qty: i.quantity })),
            fresh,
        });
        throw createHttpError(409, 'Failed to update stock for one or more items');
    };

    let createdOrder;

    try {
        createdOrder = await OrdersCollection.create(preparedOrderData);
    } catch (error) {
        const incrementStockOperations = orderItems.map(item => ({
            updateOne: {
                filter: { _id: item.flowerId },
                update: { $inc: { stock: +item.quantity } }
            }
        }));
        await FlowersCollections.bulkWrite(incrementStockOperations, { ordered: false });
        console.error('[createOrder] order create failed:', error.name, error.message);
        throw error;
    }

    return createdOrder;
};
