import request from 'express';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const mongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv').config();//you need a .env file with db infos in it

const myDbUrl = (process.env.DB ? process.env.DB : 'mongodb://localhost:27017');
const myDbName = (process.env.DB_NAME ? process.env.DB_NAME : 'game-database');
const myPort = (process.env.PORT ? process.env.PORT : 3001);

const apiQuestionController = require('./controllers/questionController');
const apiTypeController = require('./controllers/typeController');

const questionSocketController = require('./socketControllers/questionSocketController');
const typeSocketController = require('./socketControllers/typeSocketController');
const gameSocketController = require('./socketControllers/gameSocketController');




console.log('connecting to db...');
mongoClient.connect(myDbUrl, { useNewUrlParser: true }, async (err, db) => {
    if (err) throw err;
    console.log('connected to db !');
    global.db = db.db(myDbName);//change it for your db name

    var app = express();

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use('/questions', apiQuestionController);
    app.use('/types', apiTypeController);


    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.send('error');
    });

    var server = http.createServer(app);

    server.listen(myPort);
    server.on('error', onError);
    server.on('listening', onListening);

    var io = require('socket.io')(server);

    io.on('connection', (socket) => {
        console.log('an user connected');
        questionSocketController(socket, io);
        typeSocketController(socket, io);
        gameSocketController(socket, io);
    })

	/**
 	 * Event listener for HTTP server "error" event.
 	 */
    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof myPort === 'string'
            ? 'Pipe ' + myPort
            : 'Port ' + myPort;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }


	/**
	 * Event listener for HTTP server "listening" event.
	 */
    function onListening() {
        var addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'myPort ' + addr.port;
        console.log('Listening on ' + bind);
    }
});




