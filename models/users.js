/**
 * Copyright (c) 2017-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree or translated in the assets folder.
 */

/**
 * Module dependencies.
 */
var Logger = require('../utils/logger');
var logger = Logger.logger;
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Define 'User' schema.
 */
var UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    emailVefified: Boolean,
    code: String,
    password: {
        type: String,
        required: true
    },
    status: Boolean
}, {
    timestamps: true
});

// Execute before each user.save() call
UserSchema.pre('save', function (callback) {
    var user = this;

    // Break out if the password hasn't changed
    if (!user.isModified('password')) return callback();

    // Password changed so we need to hash it
    bcrypt.genSalt(5, function (err, salt) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            return callback(err);
        }

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            // Check for errors and show message
            if (err) {
                logger.error(err);
                return callback(err);
            }

            user.password = hash;
            callback();
        });
    })
});

UserSchema.methods.verifyPassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            return callback(err);
        }
        // Make the comparation and send the answer
        callback(null, isMatch);
    });
};

/**
 * Expose 'User' model.
 */
module.exports.User = mongoose.model('User', UserSchema);