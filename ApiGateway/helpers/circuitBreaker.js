const { default: axios } = require('axios');
const CircuitBreaker = require('opossum');
const Interceptor = require('../../config/interceptor');

class CircuitBreakerService {
    options = {
        timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
        errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
        resetTimeout: 3000 // After 3 seconds, try again.
    };

    createNewCircuitBreaker(endpoint) {
        console.log(`endpoint ${endpoint}`)
        const axiosInstance = axios.create({
            baseURL: this.formatWithSlashes(endpoint),
            headers: {
                'Content-Type': 'application/json'
            }
        });

         axiosInstance.interceptors.request.use(Interceptor);

        return new CircuitBreaker(
            (method, resource, body, user) => {

                console.log(`resource ${resource}`)

                if (user) {
                    return axiosInstance[method](resource, body, {
                        headers: {
                            'UserId': user._id
                        }
                    });
                }

                return axiosInstance[method](resource, body);
            },
            this.options
        );
    }


    // Helper function to add a trailing slash to an endpoint if it doesn't exist
    formatWithSlashes(endpoint) {
        return (endpoint.endsWith('/')) ? endpoint : `${endpoint}/`;
    }
}

module.exports = new CircuitBreakerService();
