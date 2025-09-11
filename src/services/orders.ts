import { FlowersCollections } from "db/models/flowers";
import { OrdersCollection } from "db/models/orders";
import { stat } from "fs";
import createHttpError from "http-errors";
import mongoose, { Types } from "mongoose";

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

    if (!shopId || !type || !customer || !deliveryAddress || !items) {
        throw new Error('Missing required fields');
    };

    if (type === 'delivery') {
        if (!deliveryAddress.city || !deliveryAddress.street || !deliveryAddress.postalCode) {
            throw new Error('Missing required delivery address fields');
        }
    }

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

    if (flowers.length !== flowerIds.length) {
        throw createHttpError(400, 'One or more flowers are not found in the specified shop');
    };

    const byId = new Map(flowers.map(f => [String(f._id), f]));
    const orderItems = wanted.map(w => {
        const f = byId.get(String(w.flowerId));
        if (!f?.isAvailable) {
            throw createHttpError(400, `Flower ${f?.title} is not available`);
        }
        if (f.stock < w.quantity) {
            throw createHttpError(400, `Insufficient stock for flower ${f.title}`);
        }
        return {
            itemId: f._id,
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

    const decrementStockOperations = orderItems.map(item => ({
        updateOne: {
            filter: { _id: item.itemId, isAvailable: true, stock: { $gte: item.quantity } },
            update: { $inc: { stock: -item.quantity } }
        }
    }));

    const bulkResult = await FlowersCollections.bulkWrite(decrementStockOperations, { ordered: true });

    const modifiedCount = bulkResult.modifiedCount;
    const expectedCount = orderItems.length;

    if (modifiedCount !== expectedCount) {
        throw createHttpError(409, 'Failed to update stock for one or more items');
    };

    let createdOrder;

    try {
        createdOrder = await OrdersCollection.create(preparedOrderData);
    } catch (error) {
        const incrementStockOperations = orderItems.map(item => ({
            updateOne: {
                filter: { _id: item.itemId },
                update: { $inc: { stock: +item.quantity } }
            }
        }));
        await FlowersCollections.bulkWrite(incrementStockOperations, { ordered: false });
        throw error;
    }

    return createdOrder;
};
