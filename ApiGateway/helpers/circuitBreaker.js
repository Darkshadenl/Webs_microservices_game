const { default: axios } = require('axios');
const CircuitBreaker = require('opossum');
const {interceptor, InterceptorError} = require('../../config/interceptor');

options = {
    timeout: 30000, // If our function takes longer than 30 seconds, trigger a failure
    errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
    resetTimeout: 3000 // After 3 seconds, try again.
};

function createNewCircuitBreaker(endpoint) {
    const options = {
        timeout: 30000, // If our function takes longer than 30 seconds, trigger a failure
        errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
        resetTimeout: 3000 // After 3 seconds, try again.
    };

    return new CircuitBreaker(
        (method, resource, body, user) => {
            // Create a new instance of axios for each request
            const axiosInstance = axios.create({
                baseURL: formatWithSlashes(endpoint),
                headers: {
                    'Content-Type': 'application/json',
                    'UserId': user ? user.id : undefined,
                    'RoleId': user ? user.role : undefined,
                    'Username': user ? user.username : undefined,
                }
            });

            axiosInstance.interceptors.request.use(interceptor, InterceptorError);

            return axiosInstance[method](resource, body);
        },
        options
    );
}


// Helper function to add a trailing slash to an endpoint if it doesn't exist
function formatWithSlashes(endpoint) {
    return (endpoint.endsWith('/')) ? endpoint : `${endpoint}/`;
}

module.exports = { createNewCircuitBreaker }
