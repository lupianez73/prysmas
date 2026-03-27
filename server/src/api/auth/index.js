'use strict';
import express from 'express';
import path from 'path';
const config =  require('../../config');
import User from './../user/user.model';


// Passport Configuration
require('./jwt/passport').setup(User, config);

var router = express.Router();

// router.use('/', require('./jwt').default);

export default router;