import { ShopsCollection } from "../db/models/shops"

export const getAllShops = async () => {
    const shops = await ShopsCollection.find();
    return shops;
}

export const getShopById = async (shopId) => {
    const shop = await ShopsCollection.findById(shopId);
    return shop;
}
