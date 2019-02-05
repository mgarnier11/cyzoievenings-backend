const gameDao = require('../daos/gameDao');

let findM = '{PlayerM}';
let findF = '{PlayerF}';
let findP = '{Player}';

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function beforeInsertGame(game) {
    let newGame = {};

    newGame.id = (game.id || Math.random().toString(36).substr(2, 5));

    if (game.lstPlayers.length < 2) throw 'You need at least 2 players';

    newGame.lstPlayers = (game.lstPlayers || []);
    newGame.nbDrinksMin = (game.nbDrinksMin || 1);
    newGame.nbDrinksMax = (game.nbDrinksMax || 10);
    newGame.maxDifficulty = (game.maxDifficulty || 5);
    newGame.nbTurns = (game.nbTurns || 50);

    newGame.actualPlayer = (game.actualPlayer || null);
    newGame.actualType = (game.actualType || null);
    newGame.actualQuestion = (game.actualQuestion || null);
    newGame.processedQuestion = (game.processedQuestion || null);

    newGame.playersOrder = (game.playersOrder || []);

    if (!game.playersOrder) {
        for (let i = 0; i < game.nbTurns; i++) {
            newGame.playersOrder.push(game.lstPlayers[i % game.lstPlayers.length]);
        }

        newGame.playersOrder = shuffle(newGame.playersOrder);
    }

    return newGame;
}

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
            var result = await gameDao.upsertGame(beforeInsertGame(newGame));
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

function processQuestion(question, game) {
    return new Promise(async (resolve, reject) => {
        try {
            let lstPlayers = shuffle(game.lstPlayers.filter(player => {
                return player.id != game.actualPlayer.id;
            }));

            indexes(question.text, findM).forEach(strike => {
                let p = getPlayerByGenderFromLst(lstPlayers, 0);
                if (p) {
                    question.text = question.text.replace(findM, p.name);
                    lstPlayers = deletePlayerFromLst(lstPlayers, p.id);
                }
            });

            indexes(question.text, findF).forEach(strike => {
                let p = getPlayerByGenderFromLst(lstPlayers, 1);
                if (p) {
                    question.text = question.text.replace(findF, p.name);
                    lstPlayers = deletePlayerFromLst(lstPlayers, p.id);
                }
            });

            indexes(question.text, findP).forEach(strike => {
                let p = getPlayerByGenderFromLst(lstPlayers, -1);
                if (p) {
                    question.text = question.text.replace(findP, p.name);
                    lstPlayers = deletePlayerFromLst(lstPlayers, p.id);
                }
            });

            question.toDrink = parseInt(getRndDrinks());

            resolve(question);

            function getRndDrinks() {
                let rnd = Math.floor(Math.random() * game.nbDrinksMax) + game.nbDrinksMin;

                let eff = question.nbDone * 100 / question.nbPicked;

                return rnd * (1 + (question.difficulty / 10)) * (1 + (eff / 20));
            }
        } catch (error) {
            reject(error);
        }
    });
}

function getPlayerByGenderFromLst(lstPlayers, gender) {
    if (gender == 0 && gender == 1) return lstPlayers.find(p => p.gender == gender);
    else return lstPlayers[0];
}

function indexes(source, find) {
    var result = [];
    for (i = 0; i < source.length; ++i) {
        // If you want to search case insensitive use 
        // if (source.substring(i, i + find.length).toLowerCase() == find) {
        if (source.substring(i, i + find.length) == find) {
            result.push(i);
        }
    }
    return result;
}

function deletePlayerFromLst(lstPlayers, playerId) {
    var index = lstPlayers.findIndex(player => player.id === playerId);
    if (index > -1) {
        lstPlayers.splice(index, 1);
    }

    return lstPlayers;
}


var gameService = {
    getGameById: getGameById,

    getGameByMongoId: getGameByMongoId,

    upsertGame: upsertGame,

    list: list,

    deleteGame: deleteGame,

    deleteGameById: deleteGameById,

    processQuestion, processQuestion
}

module.exports = gameService;