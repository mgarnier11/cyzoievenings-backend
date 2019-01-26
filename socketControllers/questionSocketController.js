var questionService = require('../services/questionService');

function questionSocketController(socket, io) {
    socket.on('getListQuestions', async () => {
        socket.emit('returnListQuestions', await questionService.findAllQuestions());
    });

    socket.on('getListTypes', async () => {
        socket.emit('returnListTypes', await questionService.getTypes());
    });

    socket.on('addQuestion', async (question) => {
        await questionService.createQuestion(question);

        io.sockets.emit('questionAdded', question);
    });


    socket.on('deleteQuestion', async (question) => {
        await questionService.deleteQuestion(question);

        io.sockets.emit('questionDeleted', question);
    });

    socket.on('modifyQuestion', async (question) => {
        await questionService.upsertQuestion(question);

        io.sockets.emit('questionModified', question);
    });

    socket.on('upsertQuestion', async (question) => {
        var res = await questionService.upsertQuestion(question);
        question = await questionService.findQuestionById(question.uuid);
        if (res.modifiedCount != 0) {
            io.sockets.emit('questionModified', question);
        } else if (res.upsertedCount != 0) {
            io.sockets.emit('questionAdded', question);
        }
    });

    socket.on('switchHideQuestion', async (question) => {
        question.hidden = !question.hidden;

        if (typeof question.type == 'object') question.type = question.type.id;
        if (question._id != undefined) delete question._id;

        await questionService.upsertQuestion(question);

        io.sockets.emit('questionModified', question);
    })
};

module.exports = questionSocketController;