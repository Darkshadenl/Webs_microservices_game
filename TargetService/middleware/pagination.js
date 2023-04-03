function paginate(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    res.pagination = {
        startIndex,
        endIndex,
        limit,
    };

    next();
}

module.exports = paginate;
