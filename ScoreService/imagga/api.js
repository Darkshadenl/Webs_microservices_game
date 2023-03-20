const got = require('got');

const apiKey = process.env.IMAGGA_API_KEY;
const apiSecret = process.env.IMAGGA_API_SECRET;

const imageUrl = 'https://imagga.com/static/images/tagging/wind-farm-538576_640.jpg';
const url = 'https://api.imagga.com/v2/tags?image_url=' + encodeURIComponent(imageUrl);

async function imaggaConnect() {
    try {
        const response = await got(url, {username: apiKey, password: apiSecret});
        const p = JSON.parse(response.body);
        console.log(p);
    } catch (error) {
        console.log(error.response.body);
    }
}

module.exports = imaggaConnect;

