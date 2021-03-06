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
var logger = require('./logger').logger;
var mongoose = require('mongoose');

/**
 * SetupMongoDB
 *
 * @description Configures and initiates the connection with the NoSQL MongoDB database.
 *
 * @param {String}      DBName      Name of the database to connect.
 * @param {String}      HostUri     Connection Uri to MongoDB server.
 */

function SetupMongoDB (HostUri, DBName){
    mongoose.connect(HostUri + DBName, { useMongoClient: true });
    logger.info('Connecting to MongoDB server, database: ' + DBName);

    var con = mongoose.connection;
    // logger conexión con la base de datos
    con.once('open', function () {
        logger.info('Connected to MongoDB successfully!');
    });
}

/**
 * Export the function that initialize the connection
 */
module.exports.SetupMongoDB = SetupMongoDB;