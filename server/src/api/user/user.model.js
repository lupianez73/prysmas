import mongoose from 'mongoose';
var crypto = require('crypto');
const uuidv1 = require('uuid/v1')

const userSchema = mongoose.Schema({
    name: {type: String, required: true}, 
    email: {type: String, required: true}, 
    lastname: {type: String, required: true},
    role: { type: String,  default: 'user'},
    provider: {type: String,  default: 'user'},
    password: {type: String, required: true},
    salt: String,
    active:{
        type: Boolean, 
        default: false
    },
    confirmationHash: {
        type:String, 
        default: 'secret0987654321'
    }
},{ timestamps: true });

userSchema.methods.validPassword = function (password) {
    var salt = new Buffer(this.salt, 'base64');
    let genPassword = crypto.pbkdf2Sync(password, salt, 1000,64, 'sha1').toString('base64');
    return this.password === genPassword;
}

userSchema.pre('save',function(next) {
        crypto.randomBytes(10, (err, salt) => { 
            if(err) next('salt creation error');
            this.salt = salt.toString('base64');
            this.password = crypto.pbkdf2Sync(this.password, salt, 1000,64, 'sha1').toString('base64');
            next();
        })

        this.confirmationHash = uuidv1();
});

module.exports = mongoose.model('User',userSchema);