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
var SparkPost = require('sparkpost');
var emailClient = new SparkPost(process.env.MAILER_TOKEN);
var User = require('../models/users').User;
var Reset = require('../models/userReset').UserReset;

// ENDPOINT: /users METHOD: GET
exports.getUsers = function (req, res) {
    // Use the 'User' model to find all users
    User.find(function (err, users) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            return res.json({message: 'Error trying to list users', data: err});
        }
        // success
        res.status(200).json(users);
    });
};

// ENDPOINT: /users/:id METHOD: GET
// ENDPOINT: /users/count METHOD: GET
exports.getUserById = function (req, res) {
    // COUNT ENDPOINT CALLED
    if (req.params.id === 'count') {
        User.count({}, function (err, countUser) {
            // Check for errors and show message
            if (err) {
                logger.error(err);
                return res.json({message: 'Error trying to count users', data: err});
            }
            // Success
            res.status(200).json({message: "The complete count of users", data: countUser});
        });
        return;
    }

    // Use the 'User' model to find all users
    User.findById(req.params.id, function (err, user) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            return res.json({message: 'Error trying to get the user information', data: err});
        }
        // success
        res.status(200).json(user);
    });
};

// ENDPOINT: /login METHOD: GET
exports.getLogin = function (req, res) {
    // Use the 'User' model to find all users
    User.findById(req.user._id, function (err, user) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            return res.json({message: 'Error trying to login this user', data: err});
        }
        // success
        if (user.status === false || user.emailVefified === false) {
            return res.status(401).json({message: 'User not avialable to login', data: user});
        } else {
            res.status(200).json({message: "Login authenticated successfully", data: user});
        }
    });
};

// ENDPOINT: /users METHOD: POST
exports.postUser = function (req, res) {
    // Create a new instance of the User model
    var user = new User();

    // Set the User properties that came from the POST data
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.emailVefified = (typeof req.body.emailVefified === 'undefined') ? process.env.PARAM_AUTOACTIVATE_USER : req.body.status;
    user.status = (typeof req.body.status === 'undefined') ? process.env.PARAM_AUTOACTIVATE_USER : req.body.status;

    // Generate activation code
    var emailRequest = req.body.email;
    // Use the 'User' model to find one User with this email address
    // Validate email provided exist on database

    // Generate random code, with the size of 8 characters mixing numbers and letters
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var sizeCode = 10;
    var codeResult = '';
    var fakeId = '';
    var fakeVar = '';
    for (var i = sizeCode; i > 0; --i) codeResult += chars[Math.round(Math.random() * (chars.length - 1))];
    for (var i = 15; i > 0; --i) fakeId += chars[Math.round(Math.random() * (chars.length - 1))];
    for (var i = 8; i > 0; --i) fakeVar += chars[Math.round(Math.random() * (chars.length - 1))];

    user.code = codeResult;

    user.save(function (err) {
        // Check for errors and show message
        if (err) {
            logger.error('Error trying to create a user: ' + err);
            return res.status(422).send({
                message: 'Error trying to create a user.',
                error: err
            });
        }
        // Success
        // Send welcome email
        var from = process.env.BLITZ_EMAIL;
        var to = emailRequest;
        var name = emailRequest;
        var code = process.env.USER_VALIDATION_URL + '?email=' + emailRequest + '&active=' + fakeId
            + '&c=' + codeResult + '&alter=' + fakeVar;

        if (typeof req.body.mailer === 'undefined') {
            var options = {};
            var transmissions = {
                content: {
                    name: "Proyecto Blitz",
                    from: from,
                    reply_to: 'Información Proyecto Blitz <' + from + '>',
                    subject: 'Verificar cuenta | Proyecto Blitz',
                    template_id: 'verify'
                },
                substitution_data: {
                    code: code
                },
                recipients: [
                    {
                        address: {
                            email: to,
                            name: name
                        }
                    }
                ]
            };

            emailClient.transmissions.send(transmissions, options)
                .then(function (data) {
                    res.send(data);
                })
                .catch(function (err) {
                    res.send(err);
                });

            res.status(200).json({message: 'User created successfully!', data: user});
        } else {
            //Success
            res.status(200).json({message: 'User created successfully!', data: user});
        }
    });
};

// ENDPOINT: /users/:id METHOD: PUT
exports.putUser = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            return res.json(err);
        }

        // Set the User properties that came from the PUT data
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.password = req.body.password ? req.body.password : user.password;
        user.status = req.body.status;

        user.save(function (err) {
            // Check for errors and show message
            if (err) {
                logger.error(err);
                return res.json({message: 'Error trying to update user information', data: err});
            }
            // success
            res.status(200).json({message: 'User updated successfully', data: user});
        });
    });
};

// ENDPOINT: /users/:id METHOD: PATCH
exports.patchUser = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            return res.json(err);
        }

        user.status = req.body.status;

        user.save(function (err) {
            // Check for errors and show message
            if (err) {
                logger.error(err);
                return res.json({message: 'Error trying to change user status', data: err});
            }
            var message = '';
            if (user.enabled === true) {
                message = 'User enabled successfully';
            } else {
                message = 'User disbled successfully';
            }
            // success
            res.status(200).json({message: message, data: user});
        });
    });
};

// ENDPOINT: /users/:id METHOD: DELETE
exports.deleteUser = function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            return res.json({message: 'Error trying to delete user information', data: err});
        }
        // success
        res.status(200).json({message: 'User deleted successfully!'});
    });
};

// ENDPOINT: /activations/codes/:code METHOD: PATCH
exports.patchActivationCode = function (req, res) {
    var codeRequest = req.params.code;
    var email = req.body.email;

    // Use the 'User' model to find one User with this email address
    User.findOne({code: codeRequest, email: email}, function (err, user) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            return res.status(422).json({message: 'Code doesn`t exists', error: err});
        }
        if(user === null){
            return res.status(422).json({message: 'Code doesn`t exists', error: err});
        }

        // Change User 'emailVefified' state
        user.emailVefified = true;
        user.code = 'verified';
        user.status = true;

        user.save(function (err) {
            // Check for errors and show message
            if (err) {
                logger.error(err);
                return res.status(400).send(err);
            }

            // success
            res.json({message: 'User email verified by code: ' + codeRequest});
        });
    });
};

// ENDPOINT: /password/reset METHOD: POST
exports.postPasswordReset = function (req, res) {
    var emailRequest = req.body.email;
    // Use the 'User' model to find one User with this email address
    // Validate email provided exist on database
    User.find({email: emailRequest}, function (err, user) {
        // Check for errors and show message
        if (err) {
            logger.error('Error 1 trying to create the reset code: ' + err);
            return res.status(404).json({message: 'Email provided doesn`t Exists'});
        }

        if(typeof user === 'undefined' || user === null){
            logger.error('Error 2 trying to create the reset code: ' + err);
            return res.status(404).json({message: 'Email provided doesn`t Exists'});
        }


        // Get User data values
        var userId = user[0]._id;

        // Generate random code, with the size of 8 characters mixing numbers and letters
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var sizeCode = 10;
        var codeResult = '';
        var fakeId = '';
        var fakeVar = '';
        for (var i = sizeCode; i > 0; --i) codeResult += chars[Math.round(Math.random() * (chars.length - 1))];
        for (var i = 15; i > 0; --i) fakeId += chars[Math.round(Math.random() * (chars.length - 1))];
        for (var i = 8; i > 0; --i) fakeVar += chars[Math.round(Math.random() * (chars.length - 1))];

        // Save reset code
        var reset = new Reset();
        reset.name = emailRequest;
        reset.userId = userId;
        reset.email = emailRequest;
        reset.code = codeResult;

        reset.save(function (err) {
            // Check for errors and show message
            if (err) {
                logger.error('Error 3 trying to create the reset code: ' + err);
                return res.status(422).send({
                    message: 'Error trying to assign a reset code.',
                    error: err
                });
            }

            // Success
            // Send welcome email
            var from = process.env.BLITZ_EMAIL;
            var to = emailRequest;
            var name = emailRequest;
            var code = process.env.USER_PASSWORD_URL + '?email=' + emailRequest + '&active=' + fakeId
                + '&c=' + codeResult + '&alter=' + fakeVar;

            if (typeof req.body.mailer === 'undefined') {
                var options = {};
                var transmissions = {
                    content: {
                        name: "Proyecto Blitz",
                        from: from,
                        reply_to: 'Información Proyecto Blitz <' + from + '>',
                        subject: 'Recuperar contraseña | Proyecto Blitz',
                        template_id: 'password'
                    },
                    substitution_data: {
                        code: code,
                        emailrecovery: to
                    },
                    recipients: [
                        {
                            address: {
                                email: to,
                                name: name
                            }
                        }
                    ]
                };

                emailClient.transmissions.send(transmissions, options)
                    .then(function (data) {
                        return res.status(200).json({message: 'User created successfully!', data: user, mailer: data});
                    })
                    .catch(function (err) {
                        return res.status(200).json({message: 'User created successfully!', data: user, mailer: err});
                    });
            } else {
                //Success
                return  res.status(200).json({message: 'User created successfully!', data: user});
            }
        });
    });
};

// ENDPOINT: /password/confirmation/:code/:email METHOD: GET
exports.getConfirmationReset = function (req, res) {
    var codeRequest = req.params.code;
    var email = req.params.email;
    // Use the 'UserReset' model to find one User with this email address
    Reset.findOne({code: codeRequest, email: email}, function (err, userReset) {
        // Check for errors and show message
        if (err) {
            logger.error('Code doesn`t exists.' + err);
            return res.status(422).send({
                message: 'Code doesn`t exists.',
                error: err
            });
        }
        // success
        res.json({message: 'User and code verified', data: userReset});
    });
};

// ENDPOINT: /password/reset/:code METHOD: PATCH
exports.patchPasswordReset = function (req, res) {
    var codeRequest = req.params.code;
    var email = req.body.email;
    var passRequest = req.body.password;
    // Use the 'UserReset' model to find one User with this email address
    Reset.find({code: codeRequest, email: email}, function (err, userReset) {
        // Check for errors and show message
        if (err) {
            logger.error(err);
            return res.status(422).send({message: 'Code doesn`t exists', error: err});
        }
        // Find the User and update de password value
        User.findById(userReset[0].userId, function (err, user) {
            if (err) {
                logger.error(err);
                return res.status(422).send(err);
            }
            // Change the password value
            user.password = passRequest;

            user.save(function (err) {
                // Check for errors and show message
                if (err) {
                    logger.error(err);
                    return res.send(err);
                }
                // Now deleted the code from the collection
                Reset.remove({email: email}, function (err) {
                    // Check for errors and show message
                    if (err) {
                        logger.error(err);
                        return res.send(err);
                    }
                    // success
                    res.json({message: 'User password changed and code: ' + codeRequest + ' deleted successfully!'});
                });
            });
        });
    });
};