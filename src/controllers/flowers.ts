import { getFlowerById, getFlowersByShop } from "services/flowers";

export const getFlowersByShopController = async (req, res, next) => {
    const { shopId } = req.params;
    const flowers = await getFlowersByShop(shopId);

    res.status(200).json({
        data: flowers,
    });
}

export const getFlowerByIdController = async (req, res, next) => {
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
}
