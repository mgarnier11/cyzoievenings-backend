const questionService = require('../services/questionService');
const typeService = require('../services/typeService');

function questionSocketController(socket, io) {
    socket.on('getListQuestions', async () => {
        socket.emit('returnListQuestions', await questionService.listQuestions());
    });

    socket.on('getRandomQuestion', async () => {
        socket.emit('returnQuestion', await questionService.getRandomQuestion());
    });

    socket.on('getQuestionById', async (questionId) => {
        socket.emit('returnQuestion', await questionService.getQuestionById(questionId));
    });

    socket.on('addQuestion', async (question) => {
        await questionService.upsertQuestion(question);

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
        if (res.modifiedCount != 0) {
            question = await questionService.getQuestionById(question.id);

            io.sockets.emit('questionModified', question);
        } else if (res.upsertedCount != 0) {
            question = await questionService.getQuestionByMongoId(res.upsertedId._id);

            io.sockets.emit('questionAdded', question);
        }
    });

    socket.on('switchHideQuestion', async (question) => {
        question.hidden = !question.hidden;

        await questionService.upsertQuestion(question);

        io.sockets.emit('questionModified', question);
    })
};

module.exports = questionSocketController;