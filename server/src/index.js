require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import config from './config';
import mongoose from 'mongoose';
import path from 'path';
import passport from 'passport';
import cors from 'cors';
import session from 'express-session';
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
global.paths = config.paths;
mongoose.connect(paths.db);



const User = require('./api/user/user.model');
const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
    // genid: function(req) {
    //     return genuuid() // use UUIDs for session IDs
    //   }
  }));


mongoose.connection.on('error',function(req,res, next) {
      console.log(res)
})

app.use(cors({
    origin: process.env.CLIENT_HOST || 'http://localhost:4200',
    credentials: true
  }))
app.use(passport.initialize());




// app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


//Routes
app.use('/api',require('./routes').default);

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(config.app.port, function() {
    console.log('Server running on port ' + this.address().port) 
});

