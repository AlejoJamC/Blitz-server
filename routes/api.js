/**
 * Copyright (c) 2017-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree or translated in the assets folder.
 */

/**
 * Module dependencies
 */
var logger = require('../utils/logger').logger;
var moment = require('moment');

/**
 * setupRouter
 *
 * @description Configure all routes on express router
 *
 * @param {express.Router}      router      The varaible router used by the server
 */
function SetupRouter(router) {

    // logger for all request will first hits this middleware
    router.use(function (req, res, next) {
        var now = moment(new Date());

        var date = now.format("DD-MM-YYYY HH:mm");
        logger.info('%s %s %s', req.method, req.url, date);
        next();
    });

    /**
     *  Declare all routes
     */
    var adminRoutes = require('./admins');
    var authRoutes = require('./auth');
    var connectionRoutes = require('./connections');
    var murmurnRoutes = require('./murmurs');
    var clientRoutes = require('./clients');
    var oauth2Routes = require('./oauth2');
    var userRoutes = require('./users');


    /**
     *  Document:  USERS.JS
     *  Define routes where they are stored endpoints
     */
    // ENDPOINT: /admin
    router.route('/admin')
        .get(authRoutes.isAdminAuthenticated, adminRoutes.getAdmins)
        .post(authRoutes.isAdminAuthenticated, adminRoutes.postAdmin);

    // ENDPOINT: /admin/:id
    // ENDPOINT: /admin/count
    // ENDPOINT: /admin/count?initialDate=yyyy-mm-dd&endDate=yyyy-mm-dd
    router.route('/admin/:id')
        .get(authRoutes.isAdminAuthenticated, adminRoutes.getAdminById)
        .put(authRoutes.isAdminAuthenticated, adminRoutes.putAdmin)
        .patch(authRoutes.isAdminAuthenticated, adminRoutes.patchAdmin)
        .delete(authRoutes.isAdminAuthenticated, adminRoutes.deleteAdmin);

    // ENDPOINT: /admin/login
    router.route('/admin/login')
        .get(authRoutes.isAdminLoginAuthenticated, adminRoutes.getAdminLogin);
    /**
     * ====================================================================
     */


    /**
     *  Document:  CLIENTS.JS
     *  Define routes where they are stored endpoints
     */
    // ENDPOINT: /clients
    router.route('/clients')
        .get(authRoutes.isAuthenticated, clientRoutes.getClientByIdClient)
        .post(authRoutes.isAuthenticated, clientRoutes.postClient);

    // ENDPOINT: /clients/:id
    router.route('/clients/:id')
        .delete(authRoutes.isAuthenticated, clientRoutes.deleteClient);
    /**
     * ====================================================================
     */


    /**
     *  Document:  CONNECTIONS.JS
     *  Define routes where they are stored endpoints
     */
    // ENDPOINT: /connections
    router.route('/connections')
        .get(authRoutes.isAdminAuthenticated, connectionRoutes.getConnections)
        .post(authRoutes.isAdminAuthenticated, connectionRoutes.postConnection);

    // ENDPOINT: /connections/:id
    // ENDPOINT: /connections/count
    router.route('/connections/:id')
        .get(authRoutes.isAdminAuthenticated, connectionRoutes.getConnectionById)
        .put(authRoutes.isAdminAuthenticated, connectionRoutes.putConnection)
        .patch(authRoutes.isAdminAuthenticated, connectionRoutes.patchConnection)
        .delete(authRoutes.isAdminAuthenticated, connectionRoutes.deleteConnection);
    /**
     * ====================================================================
     */


    /**
     *  Document:  MURMURS.JS
     *  Define routes where they are stored endpoints
     */
    // ENDPOINT: /murmurs
    router.route('/murmurs')
        .get(authRoutes.isAdminAuthenticated, murmurnRoutes.getMurmurs)
        .post(authRoutes.isAdminAuthenticated, murmurnRoutes.postMurmur);

    // ENDPOINT: /murmurs/:id
    // ENDPOINT: /murmurs/count
    router.route('/murmurs/:id')
        .get(authRoutes.isAdminAuthenticated, murmurnRoutes.getMurmurById)
        .put(authRoutes.isAdminAuthenticated, murmurnRoutes.putMurmur)
        .patch(authRoutes.isAdminAuthenticated, murmurnRoutes.patchMurmur)
        .delete(authRoutes.isAdminAuthenticated, murmurnRoutes.deleteMurmur);
    /**
     * ====================================================================
     */


    /**
     *  Document:  OAUTH2.JS
     *  Create endpoint handlers for oauth2 authorize
     */
    // ENDPOINT: /oauth2/authorize
    router.route('/oauth2/authorize')
        .get(authRoutes.isAuthenticated, oauth2Routes.authorization)
        .post(authRoutes.isAuthenticated, oauth2Routes.decision);

    // ENDPOINT: /oauth2/token
    router.route('/oauth2/token')
        .post(authRoutes.isClientAuthenticated, oauth2Routes.token);
    /**
     * ====================================================================
     */


    /**
     *  Document:  USERS.JS
     *  Define routes where they are stored endpoints
     */
    // ENDPOINT: /users
    router.route('/users')
        .get(authRoutes.isAuthenticated, userRoutes.getUsers)
        .post(authRoutes.isAuthenticated, userRoutes.postUser);

    // ENDPOINT: /users/:id
    // ENDPOINT: /users/count
    // ENDPOINT: /users/count?initialDate=yyyy-mm-dd&endDate=yyyy-mm-dd
    router.route('/users/:id')
        .get(authRoutes.isAuthenticated, userRoutes.getUserById)
        .put(authRoutes.isAuthenticated, userRoutes.putUser)
        .patch(authRoutes.isAuthenticated, userRoutes.patchUser)
        .delete(authRoutes.isAuthenticated, userRoutes.deleteUser);

    // ENDPOINT: /login
    router.route('/login')
        .get(authRoutes.isLoginAuthenticated, userRoutes.getLogin);
    /**
     * ====================================================================
     */
}

// Export the function that initialize all routes
module.exports.SetupRouter = SetupRouter;