const gameService = require('../services/gameService');
const questionService = require('../services/questionService');
const typeService = require('../services/typeService');



function gameSocketController(socket, io) {
    async function onNextQuestion(cb) {
        try {
            let game = await gameService.getGameById(socket.gameId);

            game.actualPlayerId = game.playersOrder.shift();
            game.actualTypeId = (await typeService.randomW()).id;

            let i = game.lstPlayers.findIndex(p => p.id == game.actualPlayerId);
            game.lstPlayers[i].nbQuestions++;

            if (game.actualPlayerId > -1 && game.actualTypeId > -1) {
                let question = await questionService.randomTMDP(game.actualTypeId, game.maxDifficulty, game.lstPlayers.length - 1);

                game.actualQuestionId = question.id

                game.processedQuestion = await gameService.processQuestion(question, game);

                await gameService.upsertGame(game);

                io.to(game.id).emit('returnGame', game);

                //socket.emit('returnGame', game);

                if (typeof cb === 'function') cb(game);
            }
        } catch (error) {
            socket.emit('errorGame', error);
        }
    }

    async function onGetGameById(gameId, cb) {
        try {
            let game = await gameService.getGameById(gameId);

            if (game) {
                socket.join(game.id);

                socket.gameId = game.id;

                if (game.processedQuestion) {
                    socket.emit('returnGame', game);
                    if (typeof cb === 'function') cb(game);
                }
                else onNextQuestion(gameId, cb);
            }
        } catch (error) {
            socket.emit('errorGame', error);
        }
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

    async function onQuestionDone(done, cb) {
        try {
            let game = await gameService.getGameById(socket.gameId);
            let i = game.lstPlayers.findIndex(p => p.id == game.actualPlayerId);

            if (done) {
                game.lstPlayers[i].nbDone++;
            } else {
                game.lstPlayers[i].nbDrinked += game.processedQuestion.toDrink;
            }

            await gameService.upsertGame(game);
        } catch (error) {
            socket.emit('errorGame', error);
        }
    }

    socket.on('getGameById', onGetGameById);

    socket.on('nextQuestion', onNextQuestion);

    socket.on('questionDone', onQuestionDone);

    socket.on('createGame', onCreateGame);
};

module.exports = gameSocketController;