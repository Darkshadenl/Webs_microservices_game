const express = require('express');
const { imaggaUpload } = require("../imagga/api");
const createError = require("http-errors");
const createPayload = require("../payloadHandling/payloadCreator");
const {rpcMessage} = require("../rabbitMQ/rpc");
const {buildScoreEntry, saveScore} = require("../repos/scoreRepo");
const router = express.Router();

/**
 * Stap voor stap:
 *
 * Een target is geupload naar targetservice.
 * Iemand schiet een foto in om in de buurt te komen van een target.
 * Deze wordt naar scoreservice gestuurd.
 *
 * Scoreservice moet weten om welke target het gaat.
 * Hiervoor heeft ie een username nodig en een targetid.
 *
 * Nu heb ik de target foto en de foto van de gebruiker.
 * Stuur die naar imagga.
 *
 * Nu kan ik de score opslaan in de database bij de gebruiker.
 * Hierbij vermeld ik ook de targetid/index van welke positie in de array van targets.
 *
 */

router.post('/',
    async function (req, res, next) {
        const targetJson = req.body;
        const {username, targetUsername, targetId, base64} = targetJson;

        if (!username || !targetId || !targetUsername) {
            return next(createError(400, 'Invalid data provided'))
        } else {
            console.log('targetId: ' + targetId)

            // retrieve image from targetservice.
            const payloadObject = {
                "fromService": "score",
                "targetUsername": targetUsername,
                "targetId": targetId,
            }

            const payload = await createPayload('get', 'targets', payloadObject)
            const targetImage = await rpcMessage(payload);

            console.log('targetImage: ' + targetImage.substring(0, 20))

            if (!targetImage) {
                console.info('targetImage not found', targetImage)
                return next(createError(400, 'Something went wrong'))
            }

            // now compare using imaga.
            const simCheckResult = await imaggaUpload(base64, targetImage).catch((error) => {
                console.error('imaggeUpload error: ', error);
                return next(createError(400, error))
            });

            if (!simCheckResult) {
                console.error('simCheckResult not found', simCheckResult)
                return next(createError(400, 'Something went wrong'))
            }

            // save score in database.
            const scoreEntry = buildScoreEntry(base64, targetJson, simCheckResult.result.distance);
            await saveScore(scoreEntry);

            res.json({
                "username": username,
                "targetId": targetId,
                "targetUsername": targetUsername,
                "difference between images": simCheckResult.result.distance
            })
        }
});

module.exports = router;
