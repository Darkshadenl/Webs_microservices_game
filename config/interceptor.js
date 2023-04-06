var jwt = require('jsonwebtoken');
const api = process.env.API_KEY;

const interceptor = function (request) {
    const id = request.headers['UserId'];
    console.log('api' + api)
    console.log('id' + id)

    if (id !== undefined) {
        const token = jwt.sign({ api, id }, process.env.JWT_SECRET);
        request.headers.Authorization = `Bearer ${token}`;
        delete request.headers['UserId'];
    } else {
        const token = jwt.sign({ api }, process.env.JWT_SECRET);
        request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
};

const InterceptorError = (error) => {
    // Handle errors
    return Promise.reject(error);
};

module.exports = {interceptor, InterceptorError};
