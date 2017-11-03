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
var async = require('async');
var logger = require('../utils/logger').logger;
var Admin = require('../models/admins').Admin;
var Client = require('../models/clients').Client;
var Connection = require('../models/connections').Connection;
var Murmur = require('../models/murmurs').Murmur;
var User = require('../models/users').User;

// ENDPOINT: /admin METHOD: GET
exports.getAdmins = function (req, res) {
    // Use the 'Admin' model to find all admin
    Admin.find(function (err, admin) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            res.send(err);
            return;
        }
        // success
        res.json(admin);
    });
};

// ENDPOINT: /admin/:id METHOD: GET
// ENDPOINT: /admin/count METHOD: GET
exports.getAdminById = function (req, res, next) {
    // LOGIN OR BANKS ENDPOINT CALLED
    if (req.params.id === 'login') {
        next();
        return;
    }
    // COUNT ENDPOINT CALLED
    if (req.params.id === 'count') {
        Admin.count({}, function (err, countAdmin) {
            // Check for errors and show message
            if (err) {
                logger.error(err);
                res.send(err);
            }
            // Success
            res.json({message: "The complete count of admin", data: countAdmin});
        });
        return;
    }

    // Use the 'Admin' model to find all admin
    Admin.findById(req.params.id, function (err, admin) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            res.send(err);
            return;
        }
        // success
        res.json(admin);
    });
};

// ENDPOINT: /admin/login METHOD: GET
exports.getAdminLogin = function (req, res) {
    // Use the 'Admin' model to find all admin
    Admin.findById(req.user._id, function (err, admin) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            res.send(err);
            return;
        }
        // success
        res.json({message: "Login authenticated successfully", data: admin});
    });
};

// ENDPOINT: /admin METHOD: POST
exports.postAdmin = function (req, res) {
    // Create a new instance of the Admin model
    var admin = new Admin();

    // Set the Admin properties that came from the POST data
    admin.email = req.body.email;
    admin.password = req.body.password;
    admin.emailVefified = (req.body.status === 'undefined') ? process.env.PARAM_AUTOACTIVATE_USER : req.body.status;
    admin.status = (req.body.status === 'undefined') ? process.env.PARAM_AUTOACTIVATE_USER : req.body.status;

    admin.save(function (err) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            res.send(err);
            return;
        }
        //Success
        res.json({message: 'Admin created successfully!', data: admin});
    });
};

// ENDPOINT: /admin/:id METHOD: PUT
exports.putAdmin = function (req, res) {
    Admin.findById(req.params.id, function (err, admin) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            res.send(err);
            return;
        }

        // Set the Admin properties that came from the PUT data
        admin.firstName = req.body.firstName;
        admin.lastName = req.body.lastName;
        admin.password = req.body.password ? req.body.password : admin.password;
        ;
        admin.status = req.body.status;
        // Embed docs
        // TODO:// Add the related documents
        admin.save(function (err) {
            // Check for errors and show message
            if (err) {
                logger.error(err);
                res.send(err);
            }
            // success
            res.json({message: 'Admin updated successfully', data: admin});
        });
    });
};

// ENDPOINT: /admin/:id METHOD: PATCH
exports.patchAdmin = function (req, res) {
    Admin.findById(req.params.id, function (err, admin) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            res.send(err);
            return;
        }

        admin.status = req.body.status;

        admin.save(function (err) {
            // Check for errors and show message
            if (err) {
                logger.error(err);
                res.send(err);
                return;
            }
            var message = '';
            if (admin.status === true) {
                message = 'Admin enabled successfully';
            } else {
                message = 'Admin disbled successfully';
            }
            // success
            res.json({message: message, data: admin});
        });
    });
};

// ENDPOINT: /admin/:id METHOD: DELETE
exports.deleteAdmin = function (req, res) {
    Admin.findByIdAndRemove(req.params.id, function (err) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            res.send(err);
            return;
        }
        // success
        res.json({message: 'Admin deleted successfully!'});
    });
};

// ENDPOINT: /admin/entities/count METHOD: GET
exports.getAllEntitiesCouns = function (req, res) {
    // Using all entites to get the total of documents in it
    var counts = {};
    // Async lib function waterfall to create the global object
    async.waterfall([
        function (done) {
            Admin.count({status: true}, function (err, count) {
                // Check for errors and show message
                if (err) {
                    logger.error(err);
                }
                // success
                counts.admins = count;
                done(null, counts);
            });
        },
        function (objCount, done) {
            Client.count({}, function (err, count) {
                // Check for errors and show message
                if (err) {
                    logger.error(err);
                }
                // success
                objCount.clients = count;
                done(null, counts);
            });
        },
        function (objCount, done) {
            Connection.count({status: true}, function (err, count) {
                // Check for errors and show message
                if (err) {
                    logger.error(err);
                }
                // success
                objCount.connections = count;
                done(null, counts);
            });
        },
        function (objCount, done) {
            // Murmur published
            Murmur.count({status: true, published: true}, function (err, count) {
                // Check for errors and show message
                if (err) {
                    logger.error(err);
                }
                // success
                objCount.murmurs = count;
                done(null, counts);
            });
        },
        function (objCount, done) {
            // Murmur unpublished
            Murmur.count({status: true, published: false}, function (err, count) {
                // Check for errors and show message
                if (err) {
                    logger.error(err);
                }
                // success
                objCount.unmurmurs = count;
                done(null, counts);
            });
        },
        function (objCount, done) {
            User.count({status: true}, function (err, count) {
                // Check for errors and show message
                if (err) {
                    logger.error(err);
                }
                // success
                objCount.users = count;
                done(null, counts);
            });
        }
    ], function (err, result) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            return res.send(err);
        }
        // success
        res.json(result);
    });

};