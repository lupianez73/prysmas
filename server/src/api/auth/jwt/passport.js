'use strict';

import {Strategy} from 'passport-jwt';
import passport from 'passport';
import {signToken} from '../auth.service';

// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';


export function setup(User, config) {
    const opts = config.passportJwtConfig;

     passport.use(new Strategy(opts, function(jwt_payload, done) {
   
        const user_id = jwt_payload._id;
        User.findOne({_id: user_id}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        });
    }))
}
