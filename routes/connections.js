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
var Connection = require('../models/connections').Connection;

// ENDPOINT: /connections METHOD: GET
exports.getConnections = function (req, res) {
    // Use the 'Connection' model to find all connections
    Connection.find(function (err, connections) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            res.send(err);
            return;
        }
        // success
        res.json(connections);
    });
};

// ENDPOINT: /connections/:id METHOD: GET
// ENDPOINT: /connections/count METHOD: GET
exports.getConnectionById = function (req, res, next) {
    // LOGIN OR BANKS ENDPOINT CALLED
    if (req.params.id == 'login') {
        next();
        return;
    }
    // COUNT ENDPOINT CALLED
    if (req.params.id == 'count') {
        Connection.count({}, function (err, countAdmin) {
            // Check for errors and show message
            if (err) {
                logger.error(err);
                res.send(err);
            }
            // Success
            res.json({message: "The complete count of connections", data: countAdmin});
        });
        return;
    }

    // Use the 'Connection' model to find all connections
    Connection.findById(req.params.id, function (err, murmur) {
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

// ENDPOINT: /connections METHOD: POST
exports.postConnection = function (req, res) {
    // Create a new instance of the Connection model
    var murmur = new Connection();

    // Set the Connection properties that came from the POST data
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

// ENDPOINT: /connections/:id METHOD: PUT
exports.putConnection = function (req, res) {
    Connection.findById(req.params.id, function (err, murmur) {
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

// ENDPOINT: /connections/:id METHOD: PATCH
exports.patchConnection = function (req, res) {
    Connection.findById(req.params.id, function (err, murmur) {
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

// ENDPOINT: /connections/:id METHOD: DELETE
exports.deleteConnection = function (req, res) {
    Connection.findByIdAndRemove(req.params.id, function (err) {
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
