import { OrdersCollection } from "db/models/orders";

export const getAllOrders = async () => {
    const orders = await OrdersCollection.find();
    return orders;
};

export const getOrderById = async (orderId) => {
    const order = await OrdersCollection.findById(orderId);
    return order;
};

export const createOrder = async (payload) => {
    const newOrder = await OrdersCollection.create(payload);
    return newOrder;
};
