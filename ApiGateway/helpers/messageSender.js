function send(circuitBreaker, method, basePath = '', path = undefined) {
    return (req, res) => {
        if (path === undefined){
            path = req.url;
        }
        console.log(`path: ${path}`)
        const fullPath = basePath + path;
        circuitBreaker.fire(method, fullPath, req.body, req.user)
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
