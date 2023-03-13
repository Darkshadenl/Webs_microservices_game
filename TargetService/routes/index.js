const {deleteMessage, putMessage} = require('../repos/targetRepo')

const express = require('express');
const router = express.Router();

const {createPayload} = require("../payloadHandling/payloadCreator");
const publisher = require("../rabbitMQ/publisher");
const createError = require("http-errors");
const bodyParser = require("body-parser");

const multer = require('multer');
let upload = multer();


router.post('/target', async (req,
                              res,
                              next) => {

    const {username, base64, location} = req.body;

    if (!username || !base64 || !location) {
        return next(createError(400, 'Missing parameters'))
    }

    await putMessage(req.body)
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

router.post('/target/img',
    bodyParser.raw({type: 'image/*', limit: '5mb'}),
    async (req, res, next) => {
        const binaryData = Buffer.from(req.body, 'utf8');
        const base64EncodedData = binaryData.toString('base64');
        res.send(base64EncodedData);
    });

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
