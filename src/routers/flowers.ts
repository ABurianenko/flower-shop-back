import { getFlowerByIdController, getFlowersByShopController } from "controllers/flowers";
import { Router } from "express";
import { ctrlWrapper } from "utils/ctrlWrapper";

const router = Router();

router.get('/shops/:shopId/flowers', ctrlWrapper(getFlowersByShopController));

router.get('/flowers/:flowerId', ctrlWrapper(getFlowerByIdController))

export default router;
