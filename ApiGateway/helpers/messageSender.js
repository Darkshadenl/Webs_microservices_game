function send(circuitBreaker, method, basePath = '', path = undefined) {
    return  (req, res, next) => {
        console.log(`path1 ${path}`)
        if (path === undefined){
            path = req.url;
        }
        console.log(`path2: ${path}`)
        console.log(`req url: ${req.url}`)
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
        path = undefined;
    }
}

module.exports = {
    send
}
