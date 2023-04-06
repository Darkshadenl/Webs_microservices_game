function send(circuitBreaker, method, basePath = '', path = undefined) {
    return (req, res, next) => {
        if (path === undefined){
            console.log(req.url);
            path = req.url;
        }
        console.log('path: ', path);
        const fullPath = basePath + path;
        console.log('fullPath: ', fullPath)
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

// function send(circuitBreaker, method, basePath = '', path = undefined) {
//     return (req, res, next) => {
//         if (path === undefined){
//             console.log(req.url);
//             path = req.url;
//         }
//
//         const fullPath = basePath + path;
//         circuitBreaker.fire(method, fullPath, req.body, req.user, req.query)
//             .then( response => {
//                 res.status(response.status).json(response.data)
//             })
//             .catch(error => {
//                 if (error.response) {
//                     res.status(error.response.status).send(error);
//                 }
//             });
//     }
// }

module.exports = send
