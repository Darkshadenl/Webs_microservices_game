const JwtStrategy = require('passport-jwt').Strategy;
const jwtOptions = require('../../config/passportStrategy').options

    const strategy = new JwtStrategy(jwtOptions, (jwt_payload, done) => {
        console.log("jwt_payload")
        console.log(jwt_payload)
        // Check if JWT contains user uid
        if (jwt_payload.id !== undefined) {
            return done(null, jwt_payload);
        }
        return done(null, false);
    });

    module.exports = strategy;

