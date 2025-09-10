import { getAllShops, getShopById } from "services/shops";

export const getAllShopsController = async (req, res) => {
    const shops = await getAllShops();

    res.status(200).json({
        data: shops,
    });
}
 export const getShopByIdController = async (req, res, next) => {
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
}
