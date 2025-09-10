import { getAllShopsController, getShopByIdController } from "controllers/shops";
import { Router } from "express";
import { getAllShops, getShopById } from "services/shops";

const router = Router();

router.get('/shops', getAllShopsController);

router.get('/shops/:shopId', getShopByIdController);

export default router;
