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
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Define 'Conntection' schema.
 */
var ConnectionSchema = new Schema({
    object:{
        id: String,
        name: String,
        description: String
    },
    activate: Boolean,
    socket:{
        id: String,
        url: String,
        status: String
    },
    status: Boolean
},{
    timestamps  : true
});

/**
 * Expose 'Connection' model.
 */
module.exports.Connection = mongoose.model('Connection', ConnectionSchema);