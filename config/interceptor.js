var jwt = require('jsonwebtoken');
const apiKey = process.env.API_KEY;

const interceptor = function (config) {
    const id = config.headers['UserId'];
    if (id !== undefined) {
        const token = jwt.sign({ apiKey, id }, process.env.JWT_SECRET);
        config.headers.Authorization = `Bearer ${token}`;
        delete config.headers['UserId'];
    } else {
        const token = jwt.sign({ apiKey }, process.env.JWT_SECRET);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

module.exports = interceptor;
