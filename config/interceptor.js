var jwt = require('jsonwebtoken');

const interceptor = function (request) {
    const id = request.headers['UserId'];
    if (id !== undefined) {
        const token = jwt.sign({ process.env.API_KEY, id }, process.env.JWT_SECRET);
        request.headers.Authorization = `Bearer ${token}`;
        delete request.headers['UserId'];
    } else {
        const token = jwt.sign({ process.env.API_KEY }, process.env.JWT_SECRET);
        request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
};

module.exports = interceptor;
