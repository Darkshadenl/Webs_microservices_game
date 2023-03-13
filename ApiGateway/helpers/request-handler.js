const createError = require('http-errors');

class RequestHandler {
    constructor(circuitBreaker) {
        this.circuitBreaker = circuitBreaker;
    }
    send(method, path) {
        method = method.toLowerCase();
        return (req, res, next) => {
            this.circuitBreaker.fire(method, path || req.url, req.body, req.user)
                .then(  response => {
                    console.log("fire")
                    res.status(response.status).json(response.data)
                })
                .catch(error => {
                    if (error.response) {
                        res.status(error.response.status).send(error.response.data);
                    }
                    next(createError(
                        error.status || 500,
                        error.message || 'Internal server error',
                    ))
                });
        }
    }
    static createNewRequestHandler(circuitBreaker) {
        return new RequestHandler(circuitBreaker);
    }
}

module.exports = RequestHandler;
