const {deleteTarget, saveUser, findTargetByUsername, saveUserTarget, findTargetById, findSingleTargetById} = require('../repos/targetRepo')

const express = require('express');
const router = express.Router();

const createError = require("http-errors");
const multer = require('multer')


router.post('/addtargets/:username',
    async (req, res, next) => {
        const image = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const username = req.params.username.charAt(0).toUpperCase() + req.params.username.slice(1);
        const location = "test"
        const user = await findTargetByUsername(username);

        console.log("user: ", user)
        console.log("image: ", image)

        try {
            if (user !== null && user !== undefined) {
                await saveUserTarget(user, {location: location, base64: image})
            } else {
                await saveUser(username)
                    .then((user) => {
                        saveUserTarget(user, {location: location, base64: image})
                    })
            }
            res.status(200).send(`Target created.`);
        } catch (e) {
            next(createError(400, `Something went wrong.`))
            console.trace(`Something went wrong ${e}`)
        }
    })




module.exports = router;
