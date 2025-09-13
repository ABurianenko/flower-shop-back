import { SORT_ORDER, SortOrder } from "constants/index";
import { FlowersCollections } from "db/models/flowers"
import { calculatePaginationData } from "utils/calculatePaginationData";

type SortBy = 'price' | 'createdAt' | '_id';

export const getFlowersByShop = async ({
    shopId,
    page = 1,
    perPage = 4,
    sortOrder = SORT_ORDER.ASC,
    sortBy = 'createdAt',
}: {
    shopId: string,
    page?: number,
    perPage?: number,
    sortOrder?: SortOrder,
    sortBy?: SortBy,
 }) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;
    const query = { shopId };

    const flowersQuery = FlowersCollections.find(query)

    const dir: 1 | -1 = sortOrder === SORT_ORDER.ASC ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortBy]: dir };

    const [count, flowers] = await Promise.all([
        FlowersCollections.countDocuments(query),
        flowersQuery.sort(sort).skip(skip).limit(limit),
    ]);

    const paginationData = calculatePaginationData(count, page, perPage);

    return {
        data: flowers,
        ...paginationData,
    };
}

export const getFlowerById = async (flowerId) => {
    const flower = await FlowersCollections.findById(flowerId);
    return flower;
}
