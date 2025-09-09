import { FlowersCollections } from "db/models/flowers"

export const getFlowersByShop = async (shopId) => {
    const flowers = await FlowersCollections.find({shopId});
    return flowers;
}

export const getFlowerById = async (flowerId) => {
    const flower = await FlowersCollections.findById(flowerId);
    return flower;
}
