const {deleteTarget, saveUser, userExists, saveUserTarget, retrieveTarget} = require('../repos/targetRepo')

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

        const user = await userExists(username);
        let response = ""

        try {
            if (user !== null && user !== undefined) {
                await saveUserTarget(user, {location, image})
                response = "User already existed, target is saved to user."
            } else {
                // User does not exist, create user and save target to user
                await saveUser(username)
                    .then((user) => {
                        saveUserTarget(user, {location, image})
                    })
                response = "User did not exist, user was created and target is saved to user."
            }
            res.status(200).send(`Target created. ${response}..`);
        } catch (e) {
            next(createError(400, `Something went wrong. Check picture filesize.`))
            console.trace(`Something went wrong ${e}`)
        }
    })

router.get('/target/:username/:index',
    async (req, res, next) => {
        const id = req.params.id;
        const index = req.params.index;

        if (!id || !index) {
            next(new Error(`Incorrect format. id:${id} index:${index}`));
        }

        res.render('image', {id: '10', username: 'quinten', location: 'ams'});
    })


router.get('/target/:id',
    async (req, res, next) => {
        const id = req.params.id;

        if (!id) {
            next(new Error('Incorrect format.'));
        }

        res.render('image', {id: '10', username: 'quinten', location: 'ams'});
    })

router.delete('/target/:id', async (req,
                                    res,
                                    next) => {
    const id = req.params.id;

    if (!id) {
        next(new Error('Incorrect format.'));
    }

    await deleteTarget(id).then((m) => {
        if (m.code === 0) {
            res.send(m.message);
        }
        res.send(`${m.message}: ${id}`);
    }).catch(err => {
        console.trace(`Deleting target ${id} failed: ${err}`);
    });
     // TODO fix payload
    // const payloadCreator = createPayload('delete', `${id}`, "user", {});
    // await publisher(payloadCreator.getPayload())
    //     .catch(err => {
    //         console.trace("Sending delete message to rabbitMQ failed: " + err);
    //         next(new Error('Messaging failed'));
    //     });
})

module.exports = router;
