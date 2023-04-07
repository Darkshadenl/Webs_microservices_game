const express = require('express');
const paginate = require('../middleware/pagination');
const {getScoresByUserAndTarget, getAllScores, getScoresByTargetUsername, deleteScore, deletePictureOnTarget} = require("../repos/scoreRepo");
const router = express.Router();


/**
 * Gets all scores for a given user. Either a player or a target uploader.
 *
 * @param {string} username - The username for which to fetch the scores
 * @returns {Object} An object containing paginated data and metadata about the paginated data.
 */
router.get('/getAllScores', paginate,
    async (req,
     res, next) => {
        const {startIndex, endIndex} = res.pagination;
        let paginatedData;
        const username = req.user.username;

        await getAllScores(username).then(
            (result) => {
                if (!result) {
                    return res.send("nothing found");
                }

                paginatedData = result.slice(startIndex, endIndex);
                res.json({
                    pagination: {
                        totalItems: result.length,
                        currentPage: req.query.page || 1,
                        totalPages: Math.ceil(result.length / res.pagination.limit),
                        items: paginatedData,
                    },
                });
            }
        ).catch(e => {
            console.info('error: ', e)
            return next(new Error('Something went wrong'))
        });
    });

// Mijn score op een bepaalde target kunnen inzien
// Authentication
router.get('/getMyScoreOnTarget/:targetUsername/:targetId', async (req, res,
         next) => {
    const { targetUsername, targetId} = req.params;
    const username = req.user.username;

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

router.get('/scoresOnMyTarget/:targetId', paginate, async (req, res, next) => {
    const {startIndex, endIndex} = res.pagination;
    let paginatedData;
    const username = req.user.username;

    const scores = await getScoresByTargetUsername(username);

    if (!scores || scores.length === 0) {
        return res.send("nothing found");
    }

    paginatedData = scores.slice(startIndex, endIndex);
    res.json({
        pagination: {
            totalItems: scores.length,
            currentPage: req.query.page || 1,
            totalPages: Math.ceil(scores.length / res.pagination.limit),
            items: paginatedData,
        }
    });
});

// delete user score on a target
router.delete('/deleteMyScoreOnTarget/:targetUsername/:targetId', async (req, res, next) => {
    const targetUsername = req.params.targetUsername;
    const targetId = req.params.targetId;
    const username = req.user.username;

    try {
        const response = await deleteScore(username, targetUsername, targetId);
        res.status(response.status).json({ message: response.message, updatedDocument: response.updatedDocument });
    } catch (e) {
        console.error('Error deleting score:', e);
        next(new Error('Something went wrong while deleting the score.'));
    }
});

router.delete('/deletePictureOnTarget/:scoreId', async (req, res, next) => {
    const targetId = req.params.targetId;
    const scoreId = req.params.scoreId;
    const targetUploader = req.user.username;

    try {
        const response = await deletePictureOnTarget(scoreId, targetUploader);
        res.status(response.status).json({ message: response.message, updatedDocument: response.updatedDocument });
    } catch (e) {
        console.error('Error deleting picture:', e);
        next(new Error('Something went wrong while deleting the picture.'));
    }
});


module.exports = router;
