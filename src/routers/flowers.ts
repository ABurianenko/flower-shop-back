import { getFlowerByIdController, getFlowersByShopController } from "controllers/flowers";
import { Router } from "express";

const router = Router();

router.get('/shops/:shopId/flowers', getFlowersByShopController);

router.get('/flowers/:flowerId', getFlowerByIdController)

export default router;
