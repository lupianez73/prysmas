'use strict';

import User from './user.model';
import * as auth from './../auth/auth.service';
import email from './../../services/mail';
import { multer } from 'multer';


export function update(req,res) {
   let id = req.params.id;

   res.status(200).json({image: req.body});

}


export function create(req, res) {

    var newUser = new User(req.body.user);
    
    newUser.provider = 'local';
    newUser.save()
      .then(function(user) {
        var token = auth.signToken( user._id ,user.role );
       
         email({
            from: 'carlos.config@gmail.com',
            to: user.email,
            subject: 'Account Confirmation',
            template: 'welcome',
            context: {
               confirmationHash : user.confirmationHash,
               email : user.email
            }
        },'welcome');
           
        res.json({ token });
      })
      .catch((err) => {
          console.log(err)
        res.status(400).json({msg: err.message + ' (model shema)'});
      });
  }

  export function emailVerification(req, res) {

     const hash = req.query.hash;
     const email = req.query.user;
     
     User.findOne({confirmationHash: hash, email: email}).then((user) => {

        if(user && user.active) { 
            res.status(200).json({result:{
                verified: true
            }, msg: 'Your account have been already activated. Use your email & password to access it!'});
        } else {
            user.update({active:true}).then(result => {
                if(result.nModified) {
                    res.status(200).json({result:{
                       verified: true
                    }, msg: 'Your account is now activated. Thank You!'});
                } else {
                    res.status(400).json({result:{
                       verified: false
                    }, msg: 'You could not be verified. Try again or contact support at: <a href="mailto:carlos.config@gmail.com">contact support</a>'})
                }
            }).catch(err => {
                res.status(500).json({result:{
                    verified: false
                }, msg: 'Database Error. Try again or contact support at: <a href="mailto:carlos.config@gmail.com">contact support</a>'})
            })
        } 
     })
  }

  export function getUserInfo(req, res) {
       let userId = req.params.id;
       User.find({_id: userId}).select({}).then(function(user, err) {
           if(user) {
                res.status(200).json({result:{
                    user,
                    status: 'ok'
                },  msg: 'success'});
           } else {
                res.status(400).json({result:{},status: 'no', msg: 'failed'});
           }
            console.log(user)
       });
  }