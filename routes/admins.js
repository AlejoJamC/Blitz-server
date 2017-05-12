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
var logger      = require('../utils/logger').logger;
var Admin       = require('../models/admins').Admin;

// ENDPOINT: /admin METHOD: GET
exports.getAdmins = function(req, res){
    // Use the 'Admin' model to find all admin
    Admin.find(function (err, admin) {
        // Check for errors and show message
        if(err){
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
exports.getAdminById = function(req, res, next){
    // LOGIN OR BANKS ENDPOINT CALLED
    if(req.params.id == 'login'){
        next();
        return;
    }
    // COUNT ENDPOINT CALLED
    if (req.params.id == 'count'){
        Admin.count({}, function (err, countAdmin) {
            // Check for errors and show message
            if(err){
                logger.error(err);
                res.send(err);
            }
            // Success
            res.json({ message:"The complete count of admin", data: countAdmin });
        });
        return;
    }

    // Use the 'Admin' model to find all admin
    Admin.findById(req.params.id, function (err, admin) {
        // Check for errors and show message
        if(err){
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
        if(err){
            logger.error(err);
            res.send(err);
            return;
        }
        // success
        res.json({ message:"Login authenticated successfully", data: admin });
    });
};

// ENDPOINT: /admin/password/reset METHOD: POST
exports.postAdminPasswordReset = function (req, res) {
    // TODO: implementar el mailer
    var emailRequest = req.body.email;
    // Use the 'Admin' model to find one admin with this email address
    // Validate email provided exist on database
    Admin.find({ email: emailRequest }, function (err, admin) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.json({ message: 'Email provided doesn`t Exists'});
            //res.send(err);
            return;
        }

        // Get Admin data values
        var idAdmin = admin[0]._id;
        var fullName = admin[0].name + ' ' + admin[0].lastName;

        // Generate random code, with the size of 8 characters mixing numbers and letters
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var sizeCode = 8;
        var codeResult = '';
        for (var i = sizeCode; i > 0; --i) codeResult += chars[Math.round(Math.random() * (chars.length - 1))];
        //logger.info(codeResult);

        //Get current year
        var currentYear = new Date().getFullYear();
        //logger.info(currentYear);

        // Get sent_at date
        //var sendAtDate = '2015-01-01 12:12:12';
        //logger.info(sendAtDate);

        res.json({ message: 'Email sent successfully!, ' + codeResult });
    });
};

// ENDPOINT: /admin/password/reset/:code METHOD: PATCH
exports.PatchAdminPasswordReset = function (req, res) {
    var codeRequest = req.params.code;
    // Use the 'AdminReset' model to find one admin with this email address
    AdminReset.findOne({code: codeRequest}, function (err, adminReset) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.json({ message: 'Code doesn`t exists'});
            res.send(err);
            return;
        }

        // Change the password for the new sent
        //var emailRequest = req.body.email;
        //logger.info(emailRequest);
        var passRequest = req.body.password;
        logger.info(passRequest);
        //logger.info(userReset[0].idAdmin);
        var idAdminRequest = adminReset._id;

        // Find the admin and update de password value
        Admin.findById(idAdminRequest, function (err, admin) {
            if(err){
                logger.error(err);
                res.send(err);
                return;
            }

            // Change the password value
            admin.password = passRequest;

            admin.save(function(err){
                // Check for errors and show message
                if(err){
                    logger.error(err);
                    res.send(err);
                    return;
                }
                // Now deleted the code from the collection
                AdminReset.findByIdAndRemove(idAdminRequest, function(err){
                    // Check for errors and show message
                    if(err){
                        logger.error(err);
                        res.send(err);
                        return;
                    }
                    // success
                    // success
                    res.json({ message: 'Admin password changed and code: ' + codeRequest +' deleted successfully!' });
                });
            });
        });
    });
};

// ENDPOINT: /admin METHOD: POST
exports.postAdmin = function (req, res) {
    // Create a new instance of the Admin model
    var admin = new Admin();

    // Set the Admin properties that came from the POST data
    // TODO: enviar el correo de confirmacion de email despues de crearlo
    // TODO: los codigos y los correos que no sea confirmados en 1 mes deben ser eliminados
    admin.email = req.body.email;
    admin.password = req.body.password;
    admin.emailVefified = false;
    admin.enabled = false;

    // Embed docs
    // TODO:// Add the related documents

    admin.save(function(err){
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
            return;
        }
        //Success
        res.json({ message: 'Admin created successfully!', data: admin });
    });
};

// ENDPOINT: /admin/:id METHOD: PUT
exports.putAdmin = function(req, res){
    Admin.findById(req.params.id, function (err, admin) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
            return;
        }

        // Set the Admin properties that came from the PUT data
        admin.firstName = req.body.firstName;
        admin.lastName = req.body.lastName;
        admin.identification = req.body.identification;
        admin.email = req.body.email;
        admin.password = req.body.password;
        admin.address = req.body.address;
        admin.telephone = req.body.telephone;
        admin.isColombian = req.body.isColombian;
        admin.enabled = req.body.enabled;
        // Embed docs
        // TODO:// Add the related documents
        admin.save(function(err){
            // Check for errors and show message
            if(err){
                logger.error(err);
                res.send(err);
            }
            // success
            res.json({message: 'Admin updated successfully', data: admin });
        });
    });
};

// ENDPOINT: /admin/:id METHOD: PATCH
exports.patchAdmin = function(req, res){
    Admin.findById(req.params.id, function (err, admin) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
            return;
        }

        admin.enabled = req.body.enabled;

        admin.save(function(err){
            // Check for errors and show message
            if(err){
                logger.error(err);
                res.send(err);
                return;
            }
            var message = '';
            if(admin.enabled === true){
                message = 'Admin enabled successfully';
            }else{
                message = 'Admin disbled successfully';
            }
            // success
            res.json({message: message, data: admin });
        });
    });
};

// ENDPOINT: /admin/:id METHOD: DELETE
exports.deleteAdmin = function(req, res){
    Admin.findByIdAndRemove(req.params.id, function(err){
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
            return;
        }
        // success
        res.json({ message: 'Admin deleted successfully!' });
    });
};
