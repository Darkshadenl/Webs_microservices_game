const got = require('got');
const FormData = require('form-data');

const apiKey = process.env.IMAGGA_API_KEY;
const apiSecret = process.env.IMAGGA_API_SECRET;

const API_ENDPOINT = 'https://api.imagga.com/v2';
const CATEGORIZER = 'general_v3'; // The default general purpose categorizer
const SIMILARITYENDPOINT = `${API_ENDPOINT}/images-similarity/categories/${CATEGORIZER}`;

async function imaggaSimCheck(imageBase64, imageBase264){
    if (!imageBase64 || !imageBase264 || imageBase64 === "No image found" || imageBase264 === "No image found") {
        console.error("Missing image data", {
            imageBase64: imageBase64,
            imageBase264: imageBase264
        });
        throw new Error("Missing image data");
    }

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
        return JSON.parse(res.body);
    } catch (error) {
        console.trace("Imagga gave an error", {
            images: {
                imageBase64: imageBase64,
                imageBase264: imageBase264
            },
            error: error,
            body: simCheckBody,
        });
        throw new Error("Imagga gave an error")
    }
}

module.exports = {
    imaggaUpload: imaggaSimCheck
};
