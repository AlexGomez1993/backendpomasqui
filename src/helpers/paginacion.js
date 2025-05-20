export const getPagination = (query) => {
    const { page, limit } = query;

    if (!page || !limit) {
        return { limit: null, offset: null, page: null };
    }

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (parsedPage - 1) * parsedLimit;

    return {
        limit: parsedLimit,
        offset,
        page: parsedPage,
    };
};
