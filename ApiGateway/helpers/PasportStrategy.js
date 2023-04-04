const JwtStrategy = require('passport-jwt').Strategy;
const jwtOptions = require('../../config/passportStrategy').options

    const strategy = new JwtStrategy(jwtOptions, (jwt_payload, done) => {
        // Check if JWT contains user uid
        console.log("payload = " + jwt_payload)
        if (jwt_payload.id !== undefined) {
            console.log("jwt defined")

            return done(null, jwt_payload);
        }
        console.log("jwt undefined")
        return done(null, false);
    });

    module.exports = strategy;

