const gameDao = require('../daos/gameDao');

function getGameById(gameId) {
    return new Promise(async (resolve, reject) => {
        try {
            let game = await gameDao.findGameById(gameId);

            resolve(game);
        } catch (error) {
            reject(error);
        }
    });
}

function getGameByMongoId(gameMongoId) {
    return new Promise(async (resolve, reject) => {
        try {
            let game = await gameDao.findGameByMongoId(gameMongoId);

            resolve(game);
        } catch (error) {
            reject(error);
        }
    });
}

function list() {
    return new Promise(async (resolve, reject) => {
        try {
            let games = await gameDao.listGames();

            resolve(game);
        } catch (error) {
            reject(error);
        }
    });
}

function upsertGame(newGame) {
    return new Promise(async (resolve, reject) => {
        try {
            var result = await gameDao.upsertGame(newGame);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

function deleteGame(game) {
    return new Promise(async (resolve, reject) => {
        try {
            var result = await deleteGameById(game.id);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

function deleteGameById(gameId) {
    return new Promise(async (resolve, reject) => {
        try {
            var result = await gameDao.deleteGameById(gameId);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


var gameService = {
    getGameById: getGameById,

    getGameByMongoId: getGameByMongoId,

    upsertGame: upsertGame,

    list: list,

    deleteGame: deleteGame,

    deleteGameById: deleteGameById,
}

module.exports = gameService;