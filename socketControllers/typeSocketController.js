const typeService = require('../services/typeService');

function typeSocketController(socket, io) {
    socket.on('getListTypes', async () => {
        socket.emit('returnListTypes', await typeService.listTypes());
    });

    socket.on('getRandomType', async () => {
        socket.emit('returnType', await typeService.getRandomType());
    });

    socket.on('getTypeById', async (typeId) => {
        socket.emit('returnType', await typeService.getTypeById(typeId));
    });
};

module.exports = typeSocketController;