/**
 * Copyright (c) 2017-present, Agoo.com.co <http://www.agoo.com.co>.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree or translated in the assets folder.
 */

/**
 * Module dependencies.
 */
var logger = require('../utils/logger').logger;
var Murmur = require('../models/murmurs').Murmur;

// ENDPOINT: /murmurs METHOD: GET
exports.getMurmurs = function (req, res) {
    // Use the 'Murmur' model to find all murmurs
    Murmur.find(function (err, murmurs) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            res.send(err);
            return;
        }
        // success
        res.json(murmurs);
    });
};

// ENDPOINT: /murmurs/:id METHOD: GET
// ENDPOINT: /murmurs/count METHOD: GET
exports.getMurmurById = function (req, res) {
    // COUNT ENDPOINT CALLED
    if (req.params.id === 'count') {
        Murmur.count({}, function (err, countMurmur) {
            // Check for errors and show message
            if (err) {
                logger.error(err);
                res.send(err);
            }
            // Success
            res.json({message: "The complete count of murmurs", data: countMurmur});
        });
        return;
    }

    // Use the 'Murmur' model to find all murmurs
    Murmur.findById(req.params.id, function (err, murmur) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            res.send(err);
            return;
        }
        // success
        res.json(murmur);
    });
};

// ENDPOINT: /murmurs METHOD: POST
exports.postMurmur = function (req, res) {
    // Create a new instance of the Murmur model
    var murmur = new Murmur();

    // Set the Murmur properties that came from the POST data
    murmur.name = req.body.name;
    murmur.title = req.body.title;
    murmur.description = req.body.description;
    murmur.url = req.body.url;
    murmur.type = req.body.type;
    murmur.value = req.body.value;
    murmur.audio = req.body.audio;
    murmur.status = req.body.status;

    murmur.save(function (err) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            res.send(err);
            return;
        }
        //Success
        res.json({message: 'Murmur created successfully!', data: murmur});
    });
};

// ENDPOINT: /murmurs/:id METHOD: PUT
exports.putMurmur = function (req, res) {
    Murmur.findById(req.params.id, function (err, murmur) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            res.send(err);
            return;
        }

        // Set the Murmur properties that came from the PUT data
        murmur.name = req.body.name;
        murmur.title = req.body.title;
        murmur.description = req.body.description;
        murmur.url = req.body.url;
        murmur.type = req.body.type;
        murmur.value = req.body.value;
        murmur.audio = req.body.audio;
        murmur.status = req.body.status;

        murmur.save(function (err) {
            // Check for errors and show message
            if (err) {
                logger.error(err);
                res.send(err);
            }
            // success
            res.json({message: 'Murmur updated successfully', data: murmur});
        });
    });
};

// ENDPOINT: /murmurs/:id METHOD: PATCH
exports.patchMurmur = function (req, res) {
    Murmur.findById(req.params.id, function (err, murmur) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            res.send(err);
            return;
        }

        murmur.status = req.body.status;

        murmur.save(function (err) {
            // Check for errors and show message
            if (err) {
                logger.error(err);
                res.send(err);
                return;
            }
            var message = '';
            if (murmur.status === true) {
                message = 'Murmur enabled successfully';
            } else {
                message = 'Murmur disbled successfully';
            }
            // success
            res.json({message: message, data: murmur});
        });
    });
};

// ENDPOINT: /murmurs/:id METHOD: DELETE
exports.deleteMurmur = function (req, res) {
    Murmur.findByIdAndRemove(req.params.id, function (err) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            res.send(err);
            return;
        }
        // success
        res.json({message: 'Murmur deleted successfully!'});
    });
};
