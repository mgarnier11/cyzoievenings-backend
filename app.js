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
const myPort = (process.env.PORT ? process.env.PORT : 3000);

const apiQuestionController = require('./controllers/apiQuestionController');

const questionSocketController = require('./socketControllers/questionSocketController');




console.log('connecting to db...');
mongoClient.connect(myDbUrl, { useNewUrlParser: true }, async (err, db) => {
    if (err) throw err;
    console.log('connected to db !');
    global.db = db.db(myDbName);//change it for your db name

    var app = express();

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));


    //app.use('/', indexController);
    //app.use('/questions', questionController);
    app.use('/questions/api', apiQuestionController);

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
        res.render('error');
    });

    var server = http.createServer(app);

    server.listen(myPort);
    server.on('error', onError);
    server.on('listening', onListening);

    var io = require('socket.io')(server);

    io.on('connection', (socket) => {
        console.log('an user connected');
        questionSocketController(socket, io);
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




