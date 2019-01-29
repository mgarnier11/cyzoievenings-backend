const questionDao = require('../daos/questionDao');
const typeService = require('./typeService');
const uuidv1 = require('uuid/v1');

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

function beforeInsertQuestion(question) {
    let playerPos = searchMany(question.text, '{Player}');
    let playerMPos = searchMany(question.text, '{PlayerF}');
    let playerFPos = searchMany(question.text, '{PlayerM}');

    let newQuestion = {};

    newQuestion.id = (question.id || uuidv1());
    newQuestion.text = question.text;
    newQuestion.nbPlayers = playerPos.length + playerMPos.length + playerFPos.length;
    newQuestion.difficulty = (question.difficulty || 1);
    newQuestion.typeId = (question.typeId || (question.type ? question.type.id : 1));
    newQuestion.nbPicked = (question.nbPicked || 0);
    newQuestion.nbDone = (question.nbDone || 0);
    newQuestion.hidden = (question.hidden || false);

    return newQuestion;
}

function beforeReturnQuestion(question) {
    return new Promise(async (resolve, reject) => {
        question.type = await typeService.getTypeById(question.typeId);

        resolve(question);
    })
}

async function beforeReturnLstQuestions(lstQuestions) {
    for (let i = 0; i < lstQuestions.length; i++) {
        lstQuestions[i] = await beforeReturnQuestion(lstQuestions[i]);
    }

    return lstQuestions;
}

function getQuestionById(questionId) {
    return new Promise(async (resolve, reject) => {
        try {
            let question = await questionDao.findQuestionById(questionId);

            resolve(beforeReturnQuestion(question));
        } catch (error) {
            reject(error);
        }
    });
}

function getQuestionByMongoId(questionMongoId) {
    return new Promise(async (resolve, reject) => {
        try {
            let question = await questionDao.findQuestionByMongoId(questionMongoId);

            resolve(beforeReturnQuestion(question));
        } catch (error) {
            reject(error);
        }
    });
}

function getRandomQuestion() {
    return new Promise(async (resolve, reject) => {
        try {
            let allQuestions = await listQuestions();

            resolve(beforeReturnQuestion(allQuestions[Math.floor(Math.random() * allQuestions.length)]));
        } catch (error) {
            reject(error);
        }
    });
}

function getRandomQuestionMaxDiff(maxDiff) {
    return new Promise(async (resolve, reject) => {
        try {
            let questions = await listQuestionsMaxDiff(maxDiff);

            resolve(beforeReturnQuestion(questions[Math.floor(Math.random() * questions.length)]));
        } catch (error) {
            reject(error);
        }
    });
}

function getRandomQuestionMaxDiffByTypeId(maxDiff, typeId) {
    return new Promise(async (resolve, reject) => {
        try {
            let questions = await listQuestionsMaxDiffByTypeId(maxDiff, typeId);

            resolve(beforeReturnQuestion(questions[Math.floor(Math.random() * questions.length)]));
        } catch (error) {
            reject(error);
        }
    });
}

function getRandomQuestionMaxDiffByTypeIdAndMaxPlayers(maxDiff, typeId, maxPlayers) {
    return new Promise(async (resolve, reject) => {
        try {
            let questions = await listQuestionsMaxDiffByTypeIdAndMaxPlayers(maxDiff, typeId, maxPlayers);

            resolve(beforeReturnQuestion(questions[Math.floor(Math.random() * questions.length)]));
        } catch (error) {
            reject(error);
        }
    });
}

function getRandomQuestionByTypeId(typeId) {
    return new Promise(async (resolve, reject) => {
        try {
            let typeQuestions = await listQuestionsByTypeId(typeId);

            resolve(beforeReturnQuestion(typeQuestions[Math.floor(Math.random() * typeQuestions.length)]));
        } catch (error) {
            reject(error);
        }
    });
}

function getRandomQuestionByDifficulty(difficulty) {
    return new Promise(async (resolve, reject) => {
        try {
            let diffQuestions = await listQuestionsByDifficulty(difficulty)

            resolve(beforeReturnQuestion(diffQuestions[Math.floor(Math.random() * diffQuestions.length)]));
        } catch (error) {
            reject(error);
        }
    });
}

function getRandomQuestionByDifficultyAndTypeId(typeId, difficulty) {
    return new Promise(async (resolve, reject) => {
        try {
            let filteredQuestions = await listQuestionsByDifficultyAndTypeId(typeId, difficulty);

            resolve(beforeReturnQuestion(filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)]));
        } catch (error) {
            reject(error);
        }
    });
}

function upsertQuestion(newQuestion) {
    return new Promise(async (resolve, reject) => {
        try {
            var result = await questionDao.upsertQuestion(beforeInsertQuestion(newQuestion));
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

function listQuestions() {
    return new Promise(async (resolve, reject) => {
        try {
            let allQuestions = await questionDao.listQuestions();

            resolve(beforeReturnLstQuestions(allQuestions));
        } catch (error) {
            reject(error);
        }
    });
}

function listQuestionsMaxDiff(maxDiff) {
    return new Promise(async (resolve, reject) => {
        try {
            let allQuestions = await questionDao.listQuestions();

            let questions = allQuestions.filter(question => question.difficulty <= maxDiff)

            resolve(beforeReturnLstQuestions(questions));
        } catch (error) {
            reject(error);
        }
    });
}

function listQuestionsMaxDiffByTypeId(maxDiff, typeId) {
    return new Promise(async (resolve, reject) => {
        try {
            let typeQuestions = await listQuestionsByTypeId(typeId);

            let questions = typeQuestions.filter(question => question.difficulty <= maxDiff)

            resolve(beforeReturnLstQuestions(questions));
        } catch (error) {
            reject(error);
        }
    });
}

function listQuestionsMaxDiffByTypeIdAndMaxPlayers(maxDiff, typeId, maxPlayers) {
    return new Promise(async (resolve, reject) => {
        try {
            let typeQuestions = await listQuestionsByTypeId(typeId);

            let questions = typeQuestions.filter(question => question.difficulty <= maxDiff && question.nbPlayers <= maxPlayers);

            resolve(beforeReturnLstQuestions(questions));
        } catch (error) {
            reject(error);
        }
    });
}

function listQuestionsByTypeId(typeId) {
    return new Promise(async (resolve, reject) => {
        try {
            let allQuestions = await listQuestions();

            let typeQuestions = allQuestions.filter(question => question.typeId == typeId);

            resolve(beforeReturnLstQuestions(typeQuestions));
        } catch (error) {
            reject(error);
        }
    });
}

function listQuestionsByDifficulty(difficulty) {
    return new Promise(async (resolve, reject) => {
        try {
            let allQuestions = await listQuestions();

            let diffQuestions = allQuestions.filter(question => question.difficulty == difficulty);

            resolve(beforeReturnLstQuestions(diffQuestions));
        } catch (error) {
            reject(error);
        }
    });
}

function listQuestionsByDifficultyAndTypeId(typeId, difficulty) {
    return new Promise(async (resolve, reject) => {
        try {
            let allQuestions = await listQuestions();

            let filteredQuestions = allQuestions.filter(question => question.typeId == typeId && question.difficulty == difficulty);

            resolve(beforeReturnLstQuestions(filteredQuestions));
        } catch (error) {
            reject(error);
        }
    });
}

function deleteQuestion(question) {
    return new Promise(async (resolve, reject) => {
        try {
            var result = await deleteQuestionById(question.id);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

function deleteQuestionById(questionId) {
    return new Promise(async (resolve, reject) => {
        try {
            var result = await questionDao.deleteQuestionById(questionId);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

var questionService = {
    getQuestionById: getQuestionById,

    getQuestionByMongoId: getQuestionByMongoId,

    getRandomQuestion: getRandomQuestion,

    getRandomQuestionMaxDiff: getRandomQuestionMaxDiff,

    getRandomQuestionMaxDiffByTypeId: getRandomQuestionMaxDiffByTypeId,

    getRandomQuestionMaxDiffByTypeIdAndMaxPlayers: getRandomQuestionMaxDiffByTypeIdAndMaxPlayers,

    getRandomQuestionByTypeId: getRandomQuestionByTypeId,

    getRandomQuestionByDifficulty: getRandomQuestionByDifficulty,

    getRandomQuestionByDifficultyAndTypeId: getRandomQuestionByDifficultyAndTypeId,

    upsertQuestion: upsertQuestion,

    listQuestions: listQuestions,

    listQuestionsByTypeId: listQuestionsByTypeId,

    listQuestionsMaxDiff: listQuestionsMaxDiff,

    listQuestionsMaxDiffByTypeId: listQuestionsMaxDiffByTypeId,

    listQuestionsMaxDiffByTypeIdAndMaxPlayers: listQuestionsMaxDiffByTypeIdAndMaxPlayers,

    listQuestionsByDifficulty: listQuestionsByDifficulty,

    listQuestionsByDifficultyAndTypeId: listQuestionsByDifficultyAndTypeId,

    deleteQuestion: deleteQuestion,

    deleteQuestionById: deleteQuestionById,
}

module.exports = questionService;