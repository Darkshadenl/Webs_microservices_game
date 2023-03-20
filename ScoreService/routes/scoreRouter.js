const express = require('express');
const multer = require("multer");
const router = express.Router();


/*
 * Stap voor stap:
 *
 * Een target is geupload naar targetservice.
 * Iemand schiet een foto in om in de buurt te komen van een target.
 * Deze wordt naar scoreservice gestuurd.
 *
 * Scoreservice moet weten om welke target het gaat.
 * Hiervoor heeft ie een username nodig en een targetid/index van welke positie in de array van targets.
 *
 * Nu heb ik de target foto en de foto van de gebruiker.
 * Stuur die naar imagga.
 *
 * Nu kan ik de score opslaan in de database bij de gebruiker.
 * Hierbij vermeld ik ook de targetid/index van welke positie in de array van targets.
 *
 */

const upload = multer();
const scoreUpload = upload.fields([
    {name: 'image', maxCount: 1},
    {name: 'target', maxCount: 1},
]);
router.post('/:username',
    scoreUpload,
    function (req, res, next) {
        const scorerUsername = req.params.username;
        const targetJson = JSON.parse(req.body.target);
        const image = req.files.image[0];
        console.log(targetJson);

        const { username, targetId, targetIndex } = targetJson;

        if (!username) {
            res.status(400).send('No username provided');
        } else {
            if (targetId) {
                console.trace('targetId: ' + targetId)

            } else if (targetIndex) {
                // TODO optional idea
                console.trace('targetIndex: ' + targetIndex)
            } else {
                res.status(400).send('No targetId or targetIndex provided');
            }
        }

        res.status(200).send('Score post works.');
});

module.exports = router;
