const {deleteMessage, putMessage} = require('../repos/targetRepo')

const express = require('express');
const router = express.Router();

const {createPayload} = require("../payloadHandling/payloadCreator");
const publisher = require("../rabbitMQ/publisher");
const createError = require("http-errors");
const multer = require('multer')
const upload = multer();

const targetUpload = upload.fields([
    {name: 'image', maxCount: 1},
    {name: 'target', maxCount: 1}
]);

router.post('/target',
    targetUpload,
    async (req, res, next) => {
    const data = JSON.parse(req.body.target);
    const image = req.files.image[0]['buffer'];

    const {username, location} = data;

    if (!username || !location || !image) {
        return next(createError(400, 'Missing parameters'))
    }

    const binaryData = Buffer.from(image, 'utf8');
    const base64EncodedData = binaryData.toString('base64');

    await putMessage(username, location, base64EncodedData)
        .then(answer => {
            res.status(202).send(`Target: (${answer.id}) is aangemaakt.`);
            return answer;
        })
        .then(answer => {
            const payload = createPayload(
                'create',
                `${answer.id}`,
                "user",
                {
                    uploadByUsername: answer.uploadByUsername,
                    base64: answer.base64,
                    location: answer.location
                },
            );
            publisher(payload);
        })
        .catch(err => {
            console.log("Saving to database failed or target already exists: " + err);
            next(new Error('Saving to database failed or target already exists.'));
        });
})

router.delete('/target/:id', async (req,
                                    res,
                                    next) => {

    const id = req.params.id;

    if (!id) {
        next(new Error('Incorrect format.'));
    }

    await deleteMessage(id).then((m) => {
        if (m.code === 0) {
            console.log(`${m.message}`);
            res.send(m.message);
        }
        res.send(`${m.message}: ${id}`);
    }).catch(err => {
        console.trace(`Deleting target ${id} failed: ${err}`);
    });

    // action,id,fieldName,dataValue
    const payloadCreator = new PayloadCreator('delete', `${id}`, "user", {});
    await publisher(payloadCreator.getPayload())
        .catch(err => {
            console.trace("Sending delete message to rabbitMQ failed: " + err);
            next(new Error('Messaging failed'));
        });
})

module.exports = router;
