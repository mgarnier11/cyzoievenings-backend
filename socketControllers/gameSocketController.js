const gameService = require('../services/gameService');

function gameSocketController(socket, io) {
    socket.on('getListGames', async () => {
        socket.emit('returnListGames', await gameService.listGames());
    });

    socket.on('getGameById', async (gameId) => {
        socket.emit('returnGame', await gameService.getGameById(gameId));
    });


};

module.exports = gameSocketController;