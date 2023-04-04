function send(circuitBreaker, method, path) {
    return (req, res, next) => {
        circuitBreaker.fire(method, path || req.url, req.body, req.user)
            .then(  response => {
                res.status(response.status).json(response.data)
            })
            .catch(error => {
                if (error.response) {
                    res.status(error.response.status).send(error);
                }
            });
    }
}

module.exports = send
