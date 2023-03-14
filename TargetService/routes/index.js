const {deleteTarget, saveUser, userExists, saveUserTarget, retrieveTarget} = require('../repos/targetRepo')

const express = require('express');
const router = express.Router();

const {createPayload} = require("../payloadHandling/payloadCreator");
const publisher = require("../rabbitMQ/publisher");
const createError = require("http-errors");
const multer = require('multer')

const upload = multer();



router.post('/target/test',
    async (req, res, next) => {
    const saveuser = await saveUser('test').catch((e) => { console.log(e) });

    // const user = await retrieveTarget('test')
    //     .catch((e) => { console.log(e) });

    console.log(saveuser)

    saveuser.targets.push({
        location: 'test',
        base64: 'test'
    })
    saveuser.save().catch((e) => { console.log(e) });

    console.log(saveuser)
    res.status(200).send('OK');
});

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

        await userExists(username).then((user) => {
            if (user !== null && user !== undefined) {
                saveUserTarget(user, {location, image})
                    .catch((e) => { console.log(e) });
            } else {
                // User does not exist, create user and save target to user
                saveUser(username)
                    .then((user) => { saveUserTarget(user, {location, image})
                    })
                    .catch((e) => { console.log(e) });
            }
        })
        res.status(200).send('OK');
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
            console.log(`${m.message}`);
            res.send(m.message);
        }
        res.send(`${m.message}: ${id}`);
    }).catch(err => {
        console.trace(`Deleting target ${id} failed: ${err}`);
    });

    const payloadCreator = createPayload('delete', `${id}`, "user", {});
    await publisher(payloadCreator.getPayload())
        .catch(err => {
            console.trace("Sending delete message to rabbitMQ failed: " + err);
            next(new Error('Messaging failed'));
        });
})

module.exports = router;
