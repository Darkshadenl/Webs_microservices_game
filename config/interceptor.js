var jwt = require('jsonwebtoken');
const api = process.env.API_KEY;

const interceptor = function (request) {
    const id = request.headers['UserId'];
    const role = request.headers['RoleId'];
    const username = request.headers['Username'];

    if (id !== undefined && role !== undefined && username !== undefined ) {
        const token = jwt.sign({ api, id, role, username }, process.env.JWT_SECRET);
        request.headers.Authorization = `Bearer ${token}`;
        delete request.headers['UserId'];
        delete request.headers['Username'];
        delete request.headers['RoleId'];
    } else {
        const token = jwt.sign({ api }, process.env.JWT_SECRET);
        request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
};

const InterceptorError = (error) => {
    // Handle errors
    console.log(error)
    return Promise.reject(error);
};

module.exports = {interceptor, InterceptorError};
