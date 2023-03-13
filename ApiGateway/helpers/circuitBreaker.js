const { default: axios } = require('axios');
const CircuitBreaker = require('opossum');
const Interceptor = require('../../config/interceptor');

// This singleton service is used to create a helpers instance for each microservice
class CircuitBreakerService {
    options = {
        timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
        errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
        resetTimeout: 3000 // After 3 seconds, try again.
    };

    // Returns a new helpers instance which should be used for one microservice
    createNewCircuitBreaker(endpoint) {
        // Setup an Axios instance with the base URL and headers
        const axiosInstance = axios.create({
            baseURL: this.formatWithSlashes(endpoint),
            headers: {
                'Content-Type': 'application/json'
            }
        });

         axiosInstance.interceptors.request.use(Interceptor);

        return new CircuitBreaker(
            (method, resource, body, user) => {
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
