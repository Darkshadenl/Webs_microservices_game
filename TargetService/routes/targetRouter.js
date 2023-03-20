const {deleteTarget, saveUser, findTargetByUsername, saveUserTarget, findTargetById} = require('../repos/targetRepo')

const express = require('express');
const router = express.Router();

const {createPayload} = require("../payloadHandling/payloadCreator");
const publisher = require("../rabbitMQ/publisher");
const createError = require("http-errors");
const multer = require('multer')
const {binaryToBase64} = require("../tools/image");

const upload = multer();

const targetUpload = upload.fields([
    {name: 'image', maxCount: 1},
    {name: 'target', maxCount: 1}
]);

router.post('/',
    targetUpload,
    async (req, res, next) => {
        const data = JSON.parse(req.body.target);
        const image = req.files.base64[0]['buffer'];
        const {username, location} = data;

        if (!username || !location || !image) {
            return next(createError(400, 'Missing parameters'))
        }

        const user = await findTargetByUsername(username);
        let response = ""

        try {
            const base64 = binaryToBase64(image);
            if (user !== null && user !== undefined) {
                await saveUserTarget(user, {location, base64})
                response = "User already existed, target is saved to user."
            } else {
                // User does not exist, create user and save target to user
                await saveUser(username)
                    .then((user) => {
                        saveUserTarget(user, {location, base64})
                    })
                response = "User did not exist, user was created and target is saved to user."
            }
            res.status(200).send(`Target created. ${response}..`);
        } catch (e) {
            next(createError(400, `Something went wrong.`))
            console.trace(`Something went wrong ${e}`)
        }
    })

/**
 * Get a single target by username.
 * Can use query filters to filter on index or on id. If id is provided, index is ignored.
 */
router.get('/byUsername/:username',
    async (req, res, next) => {
        const index = req.query.index;
        const id = req.query.id;
        let page = req.query.page || 1;
        const username = req.params.username.charAt(0).toUpperCase() + req.params.username.slice(1);

        page = parseInt(page);

        const pageLimit = 10;
        const offset = (page - 1) * pageLimit;

        if (!username || typeof username !== 'string') {
            next(new Error('Incorrect format'));
        }

        await findTargetByUsername(username).then(t => {
            if (index) {
                res.json(t.targets[index])
            } else if (id) {
                res.json(t.targets.id(id))
            } else {
                res.json(t.targets.slice(offset, offset + pageLimit));
            }
        }).catch(e => {
            next(createError(400, `Something went wrong.`))
        })

    })

/**
 * Get a full target. This means a full target container, not just a single target.
 * So this will return user details and all targets.
 */
router.get('/:id',
    async (req, res, next) => {
        const id = req.params.id;

        if (!id) {
            next(new Error('Incorrect format. _id is missing.'));
        }

        console.trace(`id: ${id}`)
        await findTargetById(id).then(t => {
            res.json(t)
        } ).catch(e => {
            console.trace(`Something went wrong ${e}`)
            next(createError(400, `Something went wrong.`))
        })
 })


/**
 * Delete target by id.
 * This means a full target container, not just a single target.
 */
router.delete('/:id', async (req,
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

router.get('/', async (req, res, next) => {
    res.render('index', {title: 'target'})
})

module.exports = router;
