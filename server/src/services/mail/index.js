'use strict';

import nodemailer  from 'nodemailer';
import  * as config  from '../../config';
import * as _ from 'lodash';
import fs from 'fs';
import path from 'path';
var Handlebars = require('handlebars');
var hbs = require('nodemailer-express-handlebars');
const paths = config.paths;


const emailConfig = config.email;

let transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: false, // true for 465, false for other ports
    auth: {
        user: emailConfig.user,  
        pass: emailConfig.pass  
    }
});


// send mail with defined transport object
module.exports = function(context,template) {

     var options = {
        viewEngine: {
            extname: '.hbs',
            layoutsDir: 'views/email/',
            partialsDir : 'views/partials/',
            compilerOptions: {
    
            }
        },
        viewPath: path.join(paths.root,'/services/mail/templates'),
        extName: '.hbs'
    };
    
    transporter.use('compile', hbs(options));
    
    return transporter.sendMail(context, function (error, response) {
         if(!error) {
            console.log('mail sent to');
         } else {
             console.log(error)
         }
        
         transporter.close();
     });
};

