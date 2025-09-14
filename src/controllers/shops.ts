import createHttpError from "http-errors";
import { getAllShops, getShopById } from "../services/shops";

export const getAllShopsController = async (req, res) => {
    const shops = await getAllShops();

    res.status(200).json({
        status: 200,
        message: 'Shops retrieved successfully',
        data: shops,
    });
}

export const getShopByIdController = async (req, res, next) => {
    const { shopId } = req.params;
    const shop = await getShopById(shopId);

    if (!shop) {
        return next(createHttpError(404, 'Shop not found'));
    }

    res.status(200).json({
        status: 200,
        message: `Shop #${shopId} found`,
        data: shop,
    });
}
