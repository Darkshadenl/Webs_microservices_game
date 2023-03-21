const got = require('got');
const FormData = require('form-data');

const apiKey = process.env.IMAGGA_API_KEY;
const apiSecret = process.env.IMAGGA_API_SECRET;

const API_ENDPOINT = 'https://api.imagga.com/v2';
const CATEGORIZER = 'general_v3'; // The default general purpose categorizer
const SIMILARITYENDPOINT = `${API_ENDPOINT}/images-similarity/categories/${CATEGORIZER}`;

async function imaggaSimCheck(imageBase64, imageBase264){
    const formData = new FormData();
    formData.append('image_base64', imageBase64);
    formData.append('image2_base64', imageBase264);

    const simCheckBody = {
        body: formData,
        username: apiKey,
        password: apiSecret
    };

    try {
        const res = await got.post(SIMILARITYENDPOINT, simCheckBody);
        const response = JSON.parse(res.body);
        console.log(response);
        return response;
    } catch (error) {
        console.log('error');
        console.log(error);
    }
}

module.exports = {
    imaggaUpload: imaggaSimCheck
};
