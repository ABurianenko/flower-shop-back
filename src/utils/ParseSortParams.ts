import { SORT_ORDER } from "constants/index"

const parseSortOrder = (sortOrder) => {
    const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
    if (isKnownOrder) return sortOrder;
    return SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
    const keysOfFlower = ['price', 'createdAt'];

    if (keysOfFlower.includes(sortBy)) return sortBy;

    return '_id';
};

export const parseSortParams = (query) => {
    const { sortBy, sortOrder } = query;

    const parsedSortOrder = parseSortOrder(sortOrder);
    const parsedSortBy = parseSortBy(sortBy);

    return { sortBy: parsedSortBy, sortOrder: parsedSortOrder };
};
