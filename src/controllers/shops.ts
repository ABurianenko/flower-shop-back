import createHttpError from "http-errors";
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
        throw createHttpError(404, 'Shop not found');
        return;
    }

    res.status(200).json({
        data: shop,
    });
}
