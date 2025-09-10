import { Router } from "express";
import { getAllShops, getShopById } from "services/shops";

const router = Router();

router.get('/shops', async (req, res) => {
    const shops = await getAllShops();

    res.status(200).json({
        data: shops,
    });
});

router.get('/shops/:shopId', async (req, res, next) => {
    const { shopId } = req.params;
    const shop = await getShopById(shopId);

    if (!shop) {
        res.status(404).json({
            message: 'Shop not found'
        });
        return;
    }

    res.status(200).json({
        data: shop,
    });
});

export default router;
