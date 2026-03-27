'use strict';

import User from './../user/user.model';
import Router from 'express';
import * as auth from './../auth/auth.service';


const loginRouter = new Router();

loginRouter.post('/',(req,res) => {
        var {email, password} = req.body;
        User.findOne({email: email}, (err, user) => {
            if(err) { res.status(500).json(err) }
            else if(user && user.validPassword(password)) {
                const payload = {id: user._id, role: user.role}
                console.log(payload)
                const token = auth.signToken(user._id,user.role)
                res.status(200).json({msg: `Hi ${user.name}, welcome!`,token})
            } else {
                res.status(401).json({msg: 'Username or password are wrong. Check your credentials!'})
            }
        })
})
User.findOne({email: 'carlos.config@gmail.com'}, function(err, user){
    
})

export default loginRouter;

 