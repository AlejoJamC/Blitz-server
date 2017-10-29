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
var logger = require('../utils/logger').logger;
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Define 'Admin' schema.
 */
var AdminSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    emailVerified: Boolean,
    password: {
        type: String,
        required: true
    },
    status: Boolean
}, {
    timestamps: true
});

// Execute before each user.save() call
AdminSchema.pre('save', function(callback) {
    var admin = this;

    // Break out if the password hasn't changed
    if (!admin.isModified('password')) return callback();

    // Password changed so we need to hash it
    bcrypt.genSalt(5, function(err, salt) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            return callback(err);
        }

        bcrypt.hash(admin.password, salt, null, function(err, hash) {
            // Check for errors and show message
            if (err) {
                logger.error(err);
                return callback(err);
            }

            admin.password = hash;
            callback();
        });
    })
});

AdminSchema.methods.verifyPassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
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
 * Expose 'Admin' model.
 */
module.exports.Admin = mongoose.model('Admin', AdminSchema);