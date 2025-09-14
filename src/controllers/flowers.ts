import createHttpError from "http-errors";
import { getFlowerById, getFlowersByShop } from "../services/flowers";
import { parsePaginationParams } from "../utils/parsePaginationParams";
import { parseSortParams } from "../utils/ParseSortParams";

export const getFlowersByShopController = async (req, res, next) => {
    const { shopId } = req.params;
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const flowers = await getFlowersByShop({
        shopId,
        page,
        perPage,
        sortBy,
        sortOrder,
    });

    res.status(200).json({
        status: 200,
        message: 'Flowers retrieved successfully',
        data: flowers,
    });
}

export const getFlowerByIdController = async (req, res, next) => {
    const { flowerId } = req.params;
    const flower = await getFlowerById(flowerId);

    if (!flower) {
        throw createHttpError(404, 'Flower not found');
    };

    res.status(200).json({
        status: 200,
        message: `Flower #${flowerId} found`,
        data: flower,
    })
}
