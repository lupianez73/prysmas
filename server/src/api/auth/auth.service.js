'use strict';
const jwt = require('jsonwebtoken')

/**
 * Returns a jwt token signed by the app secret
 */
export function signToken(id, role) {
    return jwt.sign({ _id: id, role }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 5
    });
}