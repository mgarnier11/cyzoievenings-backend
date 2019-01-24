var questionDao = require('../daos/questionDao');
const uuidv1 = require('uuid/v1');

function processQuestion(question) {
    var playerPos = searchMany(question.text, '{Player}');
    var playerMPos = searchMany(question.text, '{PlayerF}');
    var playerFPos = searchMany(question.text, '{PlayerM}');

    question.nbPlayers = playerPos.length + playerMPos.length + playerFPos.length;
    if (!question.nbPicked) question.nbPicked = 0;
    if (!question.nbDone) question.nbDone = 0;

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


const types = [
    { id: 1, value: "Vérité" },
    { id: 2, value: "Theme" },
    { id: 3, value: "Action" },
    { id: 4, value: "As-tu déja" },
    { id: 5, value: "Minijeu" }
]

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
    },
    getTypes: () => {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(types);
            } catch (error) {
                reject(error);
            }
        })
    }
};

module.exports = questionService;