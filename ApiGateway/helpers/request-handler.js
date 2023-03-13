const createError = require('http-errors');

class RequestHandler {
    constructor(circuitBreaker) {
        this.circuitBreaker = circuitBreaker;
    }

    /**
     * Function that will send the request to the circuit breaker and handle any errors and return the response
     * @param {String} method  - post or get
     * @param {String} path - path to the endpoint exluding the base url
     * @returns
     */
    send(method, path) {
        method = method.toLowerCase();

        return (req, res, next) => {
            this.circuitBreaker.fire(method, path || req.url, req.body, req.user)
                .then(  response => {
                    console.log(path)
                    res.status(response.status).json(response.data)
                })
                .catch(error => {
                    console.log("invalid path")
                    console.log(path)
                    console.log(method)

                    // Return error from response if it exists
                    if (error.response) {
                        res.status(error.response.status).send(error.response.data);
                    }
                    // Return error from circuit breaker if it exists
                    next(createError(
                        error.status || 500,
                        error.message || 'Internal server error',
                    ))
                });
        }
    }

    /**
     * Function that will create a new RequestHandler instance
     * @param {helpers} circuitBreaker - helpers instance for one microservice
     * @returns {RequestHandler} - RequestHandler instance
     */
    static createNewRequestHandler(circuitBreaker) {
        return new RequestHandler(circuitBreaker);
    }
}

module.exports = RequestHandler;
