var jwt = require('jsonwebtoken');

const apiKey = process.env.API_KEY;

// Axios JWT Interceptor
const interceptor = function (config) {


    // Get X-Interceptor-Uid header and unset it
    const uid = config.headers['X-Interceptor-Uid'];
    // delete config.headers['X-Interceptor-Uid'];

    // Check if uid is set and add to token if it is
    if (uid) {
        console.log("interceptor 1");
        console.log(process.env.JWT_SECRET)
        console.log(apiKey)
        const token = jwt.sign({ apiKey, uid }, process.env.JWT_SECRET);
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.log("interceptor2");
        console.log(process.env.JWT_SECRET)
        console.log(apiKey)
        // Sign key and add to headers
        const token = jwt.sign({ apiKey }, process.env.JWT_SECRET);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

module.exports = interceptor;
