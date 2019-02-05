const gameService = require('../services/gameService');
const questionService = require('../services/questionService');
const typeService = require('../services/typeService');



function gameSocketController(socket, io) {
    async function onNextQuestion(gameId, cb) {
        let game = await gameService.getGameById(gameId);

        game.actualPlayer = game.playersOrder.shift();

        game.actualType = await typeService.randomW();

        if (game.actualPlayer && game.actualType) {
            game.actualQuestion = await questionService.randomTMDPG(game.actualType.id, game.maxDifficulty, game.lstPlayers.length - 1, game.actualPlayer.gender);

            game.processedQuestion = await gameService.processQuestion(game.actualQuestion, game);

            await gameService.upsertGame(game);

            io.to(game.id).emit('returnGame', game);
            //socket.emit('returnGame', game);
            if (typeof cb === 'function') cb(game);
        }
    }

    async function onGetGameById(gameId, cb) {
        let game = await gameService.getGameById(gameId);

        if (game) {
            socket.join(game.id);

            socket.gameId = game.id;

            socket.emit('returnGame', game);

            if (typeof cb === 'function') cb(game);
        }
    }

    async function onActualQuestion(gameId, cb) {
        let game = await gameService.getGameById(gameId);

        if (game.processedQuestion) {
            socket.emit('returnGame', game);
            if (typeof cb === 'function') cb(game);
        }
        else onNextQuestion(gameId, cb);
    }

    async function onCreateGame(game, cb) {
        try {
            let res = await gameService.upsertGame(game);

            if (res.upsertedCount > 0) {
                let newGame = await gameService.getGameByMongoId(res.upsertedId._id);

                socket.emit('returnGame', newGame);

                if (typeof cb === 'function') cb(newGame.id);
            }
        } catch (error) {
            socket.emit('errorGame', error);
        }
    }

    socket.on('getGameById', onGetGameById);

    socket.on('actualQuestion', onActualQuestion);

    socket.on('nextQuestion', onNextQuestion);

    socket.on('createGame', onCreateGame);
};

module.exports = gameSocketController;