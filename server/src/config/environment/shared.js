'use strict';
import path from 'path';
import {ExtractJwt} from 'passport-jwt';

console.log(path.normalize(`${__dirname}/../..`))
const all = {
    paths:{
        root: path.normalize(`${__dirname}/../..`),
        db: process.env.DB_URI || "mongodb://localhost:27017/prysmas",
        clientHost: process.env.CLIENT_HOST || 'http://localhost:4200',
        serverHost: process.env.SERVER_HOST || 'http://localhost:3000'
    },
    db: {
        port: process.env.DB_PORT || '27017',
        user: process.env.DB_USER,
        pass: process.env.DB_PASS
    },
    app: {
        port: process.env.PORT || 3000
    },
    passportJwtConfig : {
        jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey : process.env.JWT_SECRET
    },
    email: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587
        // host: 'smtp-mail.outlook.com',
        // port:  587
    }
}

module.exports = all;