import createHttpError from "http-errors";
import { createOrder, getAllOrders, getOrderById } from "../services/orders";

export const getAllOrdersController = async (req, res, next) => {
    const orders = await getAllOrders();

    res.status(200).json({
        status: 200,
        message: 'Orders retrieved successfully',
        data: orders,
    });
}

export const getOrderByIdController = async (req, res, next) => {
    const { orderId } = req.params;
    const order = await getOrderById(orderId);

    if (!order) {
        throw createHttpError(404, 'Order not found');
    };

    res.status(200).json({
        status: 200,
        message: `Order #${orderId} found`,
        data: order,
    })
}

export const createOrderController = async (req, res, next) => {
    const created = await createOrder(req.body);

    res.status(201).json({
        status: 201,
        message: 'Order created',
        data: created,
    });
}
