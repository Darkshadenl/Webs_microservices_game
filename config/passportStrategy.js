const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const options = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'secret'
};
const InternalStrategy = new JwtStrategy(options, (jwt_payload, done) => {
    // Check if the apiKey is valid or return 401
    if (jwt_payload.apiKey === process.env.secret_api_key) {
        // Extract user id from payload
        return done(null, {
            uid: jwt_payload.uid
        });
    } else {
        return done(null, false);
    }
});



module.exports =  {
    InternalStrategy,
    options
};
