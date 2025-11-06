const paginate = (query, { page = 1, limit = 10 }) => {
    const offset = (page - 1) * limit;
    return {
        ...query,
        offset: offset,
        limit: parseInt(limit)
    };
};

module.exports = {
    paginate,
    getPagination: (page, size) => {
        const limit = size ? +size : 10;
        const offset = page ? (page - 1) * limit : 0;
        return { limit, offset };
    },
    getPagingData: (data, page, limit) => {
        const { count: totalItems, rows: items } = data;
        const currentPage = page ? +page : 1;
        const totalPages = Math.ceil(totalItems / limit);
        
        return {
            items,
            meta: {
                totalItems,
                itemsPerPage: limit,
                totalPages,
                currentPage
            }
        };
    }
};