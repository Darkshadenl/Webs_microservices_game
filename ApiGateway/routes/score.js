const express = require('express');
const router = new express.Router();

const scoreService    =  process.env.SCOREURL || 'http://localhost:3000/'
const messageSender = require('../helpers/messageSender').send
const roles = require('../helpers/authorizationRole');
const multer = require('multer');



const circuitBreaker = require('../helpers/circuitBreaker')
    .createNewCircuitBreaker(scoreService);


router.get('/test',roles('admin'), messageSender(circuitBreaker,'get'));
router.get('/', messageSender(circuitBreaker,'get'));
router.post('', messageSender(circuitBreaker,'post','score'))
router.get('/getAllScores/:username',
    messageSender(circuitBreaker, 'get', 'scores'));
router.get('/getMyScores', messageSender(circuitBreaker, 'get', 'scores'));

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5000000 } // optional file size limit
});
router.post('/convertImage', upload.single('image'), (req, res) => {
    const file = req.file; // the uploaded file
    if (!file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }
    const base64String = file.buffer.toString('base64');
    res.send(base64String);
})


module.exports = router
