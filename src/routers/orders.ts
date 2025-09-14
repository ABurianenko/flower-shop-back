import { createOrderController, getAllOrdersController, getOrderByIdController } from "../controllers/orders";
import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper";

const router = Router();

router.get('/orders', ctrlWrapper(getAllOrdersController));

router.get('/orders/:orderId', ctrlWrapper(getOrderByIdController));

router.post('/orders', ctrlWrapper(createOrderController));

export default router;
