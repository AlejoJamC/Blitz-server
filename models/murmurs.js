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

/**
 * Define 'Murmur' schema.
 */
var MurmurSchema = new mongoose.Schema({
    name: String,
    title: String,
    description: String,
    url: String,
    type: String,
    value: String,
    audio: String,
    status: Boolean
});

/**
 * Expose 'Admin' model.
 */
module.exports.Murmur = mongoose.model('Murmur', MurmurSchema);