/**
 * Copyright (c) 2016-present, Uparki <@uparki>.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree or translated in the assets folder.
 */

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

/**
 * Define 'User Reset Password' schema.
 */
var UserResetSchema = new mongoose.Schema({
    name:  {
        type        : String,
        required    : true
    },
    userId:  {
        type        : mongoose.Schema.Types.ObjectId,
        required    : true
    },
    email:  {
        type        : String,
        required    : true
    },
    code:  {
        type        : String,
        required    : true
    }
}, {
    timestamps  : true
});

/**
 * Expose 'UserReset'.
 */
module.exports.UserReset = mongoose.model('UserReset', UserResetSchema);