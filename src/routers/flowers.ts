import { Router } from "express";
import { getFlowerById, getFlowersByShop } from "services/flowers";

const router = Router();

router.get('/shops/:shopId/flowers', async (req, res, next) => {
    const { shopId } = req.params;
    const flowers = await getFlowersByShop(shopId);

    res.status(200).json({
        data: flowers,
    });
});

router.get('/flowers/:flowerId', async (req, res, next) => {
    const { flowerId } = req.params;
    const flower = await getFlowerById(flowerId);

    if (!flower) {
        res.status(404).json({
            message: 'Flower not found',
        });
        return;
    };

    res.status(200).json({
        data: flower,
    })
})

export default router;
