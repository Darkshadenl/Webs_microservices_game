const express = require('express');
const paginate = require('../middleware/pagination');
const {getAllScores} = require("../repos/scoreRepo");
const router = express.Router();

router.get('/getAllScores/:username', paginate, (req, res, next) => {
    const { startIndex, endIndex } = res.pagination;
    let paginatedData;
    const username = req.params.username;

    getAllScores(username).then(
        (result) => {
            paginatedData = result.slice(startIndex, endIndex);
            res.json({
                pagination: {
                    totalItems: result.length,
                    currentPage: req.query.page || 1,
                    totalPages: Math.ceil(result.length / res.pagination.limit),
                    items: paginatedData,
                },
                data: result
            });
        }
    ).catch(e => {
        console.info('error: ', e)
        return next(new Error('Something went wrong'))
    });
});

module.exports = router;
