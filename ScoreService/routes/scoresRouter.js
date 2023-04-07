const express = require('express');
const paginate = require('../middleware/pagination');
const {getAllScores, getScoresByTargetUsername, getScoresByTargetIndex,
    getScoresByUserAndTarget
} = require("../repos/scoreRepo");
const router = express.Router();

/**
 * Gets all scores for a given user. Either a player or a target uploader.
 *
 * @param {string} username - The username for which to fetch the scores
 * @param {string} [targetUsername] - Optional. Boolean. If true, search for targetUsername. If false, search for username.
 * @returns {Object} An object containing paginated data and metadata about the paginated data.
 */
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

router.get('/getMyScore/:username/:index',
        async (req,
        res, next) => {

    const index = parseInt(req.params.index);
    const targetUsername = req.params.username;

    console.info('username: ', targetUsername)

    if (isNaN(index)) {
        return next(new Error('Invalid index'));
    }

    if (!targetUsername) {
        return next(new Error('Invalid target username'));
    }

    try {
        const result = await getScoresByTargetIndex(targetUsername, index);
        if (!result) {
            return res.json({
                message: 'No score found for the given target and index',
                data: null
            });
        }
        console.log(result)

        res.json({
            message: 'Score retrieved successfully',
            data: result
        });
    } catch (e) {
        console.error('Error retrieving score by target index:', e);
        return next(new Error('Something went wrong'));
    }
})

// Mijn score op een bepaalde target kunnen inzien
// Authentication
router.get('/getMyScoreOnTarget/:username/:targetUsername/:targetId', async (req, res,
         next) => {

    const { targetUsername, targetId, username } = req.params;

    console.info(req.params)

    try {
        const score = await getScoresByUserAndTarget(username, targetUsername, targetId);

        if (!score) {
            return res.json({
                message: 'No score found for the given user, target username, and target ID',
                data: null
            });
        }

        res.json({
            message: 'Score retrieved successfully',
            data: score
        });
    } catch (e) {
        console.error('Error retrieving score by user and target:', e);
        return next(new Error('Something went wrong'));
    }
});

// Je kunt jou eigen upload verwijderen
// Authentication


module.exports = router;
