
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port:  587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'carlos.config@gmail.com',  
        pass: 'Password#0', 
    }
});
// var htmlstream = fs.createReadStream('/Users/cl/Desktop/prysmas/server/src/services/mail/templates/welcome.html');
// // create template based sender function
// transport.sendMail({html: htmlstream}, function(err){
//     if(err){
//         // check if htmlstream is still open and close it to clean up
//     }
// });
// var sendPwdReminder = transporter.templateSender({
//     subject: 'Password reminder for {{username}}!',
//     text: 'Hello, {{username}}, Your password is: {{ password }}',
//     html: htmlstream
// }, {
//     from: 'sender@example.com',
// });

// // use template based sender to send a message
// sendPwdReminder({
//     to: 'carlos.config@gmail.com'
// }, {
//     confirmationHash: 'asdf',
//     email: 'adsfasdf'
// }, function(err, info){
//     if(err){
//        console.log('Error');
//     }else{
//         console.log('carlos.config@gmail.com');
//     }
// });
var Handlebars = require('handlebars');
var hbs = require('nodemailer-express-handlebars');
 var options = {
    viewEngine: {
        extname: '.hbs',
        layoutsDir: 'views/email/',
        partialsDir : 'views/partials/',
        compilerOptions: {

        }
    },
    viewPath: '/Users/cl/Desktop/prysmas/server/src/services/mail/templates',
    extName: '.hbs'
};

transporter.use('compile', hbs(options));

transporter.sendMail({
     from: 'carlos.config@gmail.com',
     to: 'carlos.config@gmail.com',
     subject: 'Any Subject',
     template: 'test',
     context: {
        confirmationHash : 'value1',
        email : 'value2',
        link: link
     }
 }, function (error, response) {
     console.log(error)
     console.log('mail sent to');
     transporter.close();
 });