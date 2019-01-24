var questionDao = require('../daos/questionDao');
const uuidv1 = require('uuid/v1');

function processQuestion(question) {
    var playerPos = searchMany(question.text, '{Player}');
    var playerMPos = searchMany(question.text, '{PlayerF}');
    var playerFPos = searchMany(question.text, '{PlayerM}');

    question.nbPlayers = playerPos.length + playerMPos.length + playerFPos.length;

    return question;
}

function searchMany(source, find) {
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

var questionService = {
    createQuestion: (question) => {
        return new Promise(async (resolve, reject) => {
            question.uuid = uuidv1();

            question = processQuestion(question);

            try {
                var result = await questionDao.createQuestion(question);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    deleteQuestion: (question) => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await questionDao.deleteQuestion(question);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    findAllQuestions: () => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await questionDao.findAllQuestions();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    findQuestionById: (questionId) => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await questionDao.findQuestionById(questionId);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    upsertQuestion: (question) => {
        return new Promise(async (resolve, reject) => {

            question = processQuestion(question);

            try {
                var result = await questionDao.upsertQuestion(question);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    }
};

module.exports = questionService;