const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const options = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'secret'
};
const InternalStrategy = new JwtStrategy(options, (jwt_payload, done) => {
    if (jwt_payload.apiKey === process.env.secret_api_key) {
        return done(null, {id: jwt_payload.id, role:jwt_payload.role, username: jwt_payload.username });
    } else {
        return done(null, false);
    }
});



module.exports =  {
    InternalStrategy,
    options
};
