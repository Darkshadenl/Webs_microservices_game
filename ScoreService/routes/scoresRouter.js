const express = require('express');
const paginate = require('../middleware/pagination');
const {getAllScores, getScoresByTargetUsername} = require("../repos/scoreRepo");
const router = express.Router();

router.get('/getAllScores/:username', paginate,
    (req,
     res, next) => {
    const { startIndex, endIndex } = res.pagination;
    let paginatedData;
    const username = req.params.username;
    const { targetUsername } = req.query;

    if (targetUsername) {
        getScoresByTargetUsername(username).then(
            (result) => {
                if (!result) {
                    return res.json({
                        pagination: {
                            totalItems: 0,
                            currentPage: req.query.page || 1,
                            totalPages: 0,
                            items: [],
                        },
                        data: []
                    });
                }
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
    } else {
        getAllScores(username).then(
            (result) => {
                if (!result) {
                    return res.json({
                        pagination: {
                            totalItems: 0,
                            currentPage: req.query.page || 1,
                            totalPages: 0,
                            items: [],
                        },
                        data: []
                    });
                }
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
    }
});

router.get('/getMyScores', paginate,
    (req,
     res, next) => {
        const { startIndex, endIndex } = res.pagination;
        let paginatedData;

        console.info('username: ', req.headers.authorization)

        // getScoresByTargetUsername(username).then(
        //     (result) => {
        //         if (!result) {
        //             return res.json({
        //                 pagination: {
        //                     totalItems: 0,
        //                     currentPage: req.query.page || 1,
        //                     totalPages: 0,
        //                     items: [],
        //                 },
        //                 data: []
        //             });
        //         }
        //         paginatedData = result.slice(startIndex, endIndex);
        //         res.json({
        //             pagination: {
        //                 totalItems: result.length,
        //                 currentPage: req.query.page || 1,
        //                 totalPages: Math.ceil(result.length / res.pagination.limit),
        //                 items: paginatedData,
        //             },
        //             data: result
        //         });
        //     }
        // ).catch(e => {
        //     console.info('error: ', e)
        //     return next(new Error('Something went wrong'))
        // });

        res.json({  });
    })

module.exports = router;
