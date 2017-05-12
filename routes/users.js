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
var User = require('../models/users').User;

// ENDPOINT: /users METHOD: GET
exports.getUsers = function(req, res){
  
    // Use the 'User' model to find all users
    User.find(function (err, users) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
            return;
        }
        // success
        res.json(users);
    });
};

// ENDPOINT: /users/:id METHOD: GET
// ENDPOINT: /users/count METHOD: GET
exports.getUserById = function(req, res){
    // COUNT ENDPOINT CALLED
    if (req.params.id == 'count'){
        User.count({}, function (err, countUser) {
            // Check for errors and show message
            if(err){
                logger.error(err);
                res.send(err);
            }
            // Success
            res.json({ message:"The complete count of users", data: countUser });
        });
        return;
    }

    // Use the 'User' model to find all users
    User.findById(req.params.id, function (err, user) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
            return;
        }
        // success
        res.json(user);
    });
};

// ENDPOINT: /login METHOD: GET
exports.getLogin = function (req, res) {
    // Use the 'User' model to find all users
    User.findById(req.user._id, function (err, user) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
            return;
        }
        // success
        res.json({ message:"Login authenticated successfully", data: user });
    });
};

// ENDPOINT: /users METHOD: POST
exports.postUser = function (req, res) {
    // Create a new instance of the User model
    var user = new User();

    // Set the User properties that came from the POST data
    // TODO: enviar el correo de confirmacion de email despues de crearlo
    // TODO: los codigos y los correos que no sea confirmados en 1 mes deben ser eliminados
    user.email = req.body.email;
    user.password = req.body.password;
    user.emailVefified = false;
    user.enabled = false;

    // Embed docs
    // TODO:// Add the related documents

    user.save(function(err){
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
            return;
        }
        //Success
        res.json({ message: 'User created successfully!', data: user });
    });
};

// ENDPOINT: /users/:id METHOD: PUT
exports.putUser = function(req, res){
    User.findById(req.params.id, function (err, user) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
            return;
        }

        // Set the User properties that came from the PUT data
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.identification = req.body.identification;
        user.email = req.body.email;
        user.password = req.body.password;
        user.address = req.body.address;
        user.telephone = req.body.telephone;
        user.isColombian = req.body.isColombian;
        user.enabled = req.body.enabled;
        // Embed docs
        // TODO:// Add the related documents
        user.save(function(err){
            // Check for errors and show message
            if(err){
                logger.error(err);
                res.send(err);
            }
            // success
            res.json({message: 'User updated successfully', data: user });
        });
    });
};

// ENDPOINT: /users/:id METHOD: PATCH
exports.patchUser = function(req, res){
    User.findById(req.params.id, function (err, user) {
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
            return;
        }

        user.enabled = req.body.enabled;

        user.save(function(err){
            // Check for errors and show message
            if(err){
                logger.error(err);
                res.send(err);
                return;
            }
            var message = '';
            if(user.enabled === true){
                message = 'User enabled successfully';
            }else{
                message = 'User disbled successfully';
            }
            // success
            res.json({message: message, data: user });
        });
    });
};

// ENDPOINT: /users/:id METHOD: DELETE
exports.deleteUser = function(req, res){
    User.findByIdAndRemove(req.params.id, function(err){
        // Check for errors and show message
        if(err){
            logger.error(err);
            res.send(err);
            return;
        }
        // success
        res.json({ message: 'User deleted successfully!' });
    });
};
