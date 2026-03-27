
const User = require('./user.model');
import config from '../../config';
import mongoose from 'mongoose';
import path from 'path';
const assert = require('assert');

mongoose.connect(config.paths.db);
        
      describe('User Tests',function(){
            it('Get user and Users', function(done) {
                // let user = new User({email:'carlos@gmail.com',name:'uniqueunique', password: 'adsfa', lastname: 'adfadsf'});

                User.find({name:'uniqueunique'},function(err, user) {
                    if(!err) {
                        assert.deepEqual(1,user.length)
                    } else {
                        console.log(err)
                    }
                        done()
                  })
            });
  });
