const express = require('express');
const multer = require("multer");
const { imaggaUpload } = require("../imagga/api");
const {binaryToBase64} = require("../tools/image");
const createError = require("http-errors");
const createPayload = require("../payloadHandling/payloadCreator");
const publish = require("../rabbitMQ/publisher");
const {rpcMessage} = require("../rabbitMQ/rpc");
const router = express.Router();

/*
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

router.get('/rpc', async function (req, res, next) {

    const reply = await rpcMessage({msg: 'hi from route /rpc'});

    res.send(reply);
});

const upload = multer();
const scoreUpload = upload.fields([
    {name: 'image', maxCount: 1},
    {name: 'target', maxCount: 1},
]);
router.post('/',
    scoreUpload,
    async function (req, res, next) {
        const targetJson = JSON.parse(req.body.target);
        const image = req.files.image[0]['buffer'];
        const base64Image = binaryToBase64(image)

        const {username, targetUsername, targetId} = targetJson;

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
            console.log('targetImage: ');
            console.log(targetImage);


            // now compare using imaga.
            // const simCheckResult = await imaggaUpload(base64Image, base642Image).catch((error) => {
            //     console.log('error');
            //     return next(createError(400, 'Missing parameters'))
            // });

            // res.json(simCheckResult)
            res.json({msg: 'hi from route /'})
        }
})
;

module.exports = router;
