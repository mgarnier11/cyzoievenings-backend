const utils = require('../utils');

const questionDao = require('../daos/questionDao');
const typeService = require('./typeService');
const uuidv1 = require('uuid/v1');
const weightedRandom = require('weighted-random');

function beforeInsertQuestion(question) {
    let playerPos = utils.indexes(question.text, '{Player}');
    let playerMPos = utils.indexes(question.text, '{PlayerF}');
    let playerFPos = utils.indexes(question.text, '{PlayerM}');

    let newQuestion = {};

    let gender = question.text.substring(0, 3);
    if (gender == '{M}')
        newQuestion.gender = 0;
    else if (gender == '{F}')
        newQuestion.gender = 1;
    else
        newQuestion.gender = -1;

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

function questionPicked(question) {
    question.nbPicked += 1;

    upsertQuestion(question);
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

            questionPicked(question);

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

            questionPicked(question);

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
            let question = allQuestions[Math.floor(Math.random() * allQuestions.length)];

            questionPicked(question);

            resolve(beforeReturnQuestion(question));
        } catch (error) {
            reject(error);
        }
    });
}

function getRandomQuestionFromList(lstQuestions) {
    return new Promise(async (resolve, reject) => {
        try {
            let question = lstQuestions[Math.floor(Math.random() * lstQuestions.length)];

            questionPicked(question);

            resolve(beforeReturnQuestion(question));
        } catch (error) {
            reject(error);
        }
    });
}

function getWeightedRandomQuestionFromList(lstQuestions) {
    const diff = 3;
    return new Promise(async (resolve, reject) => {
        try {
            let weights = lstQuestions.map(function (question) {
                return question.nbPicked;
            });

            let lowest = Math.min.apply(null, weights);

            weights = lstQuestions.map(function (question) {
                if (question.nbPicked - diff >= lowest) return 0;
                else return lowest + diff - question.nbPicked;
            });

            let question = lstQuestions[weightedRandom(weights)];

            if (!question) question = lstQuestions[Math.floor(Math.random() * lstQuestions.length)];

            questionPicked(question);

            resolve(beforeReturnQuestion(question));
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

function listQuestionsByParams(params) {
    return new Promise(async (resolve, reject) => {
        try {
            let allQuestions = await listQuestions();

            let questions = allQuestions.filter(question => {
                let res = [];

                params.forEach(param => {
                    if (param.value.constructor === Array) {
                        let tmpRes = [];

                        param.value.forEach(value => {
                            if (param.equal < 0 && question[param.obj] <= value) tmpRes.push(true);
                            else if (param.equal > 0 && question[param.obj] >= value) tmpRes.push(true);
                            else if (param.equal == 0 && question[param.obj] == value) tmpRes.push(true);
                            else tmpRes.push(false);
                        });

                        res.push(tmpRes.some(val => val == true));
                    } else {

                        if (param.equal < 0 && question[param.obj] <= param.value) res.push(true);
                        else if (param.equal > 0 && question[param.obj] >= param.value) res.push(true);
                        else if (param.equal == 0 && question[param.obj] == param.value) res.push(true);
                        else res.push(false);

                    }
                });

                return res.every(val => val == true);
            });

            resolve(beforeReturnLstQuestions(questions));
        } catch (error) {
            reject(error);
        }
    });
}

function listQuestions() {
    return new Promise(async (resolve, reject) => {
        try {
            let questions = await questionDao.listQuestions();

            questions = questions.filter(q => { return q.hidden == false });

            resolve(beforeReturnLstQuestions(questions));
        } catch (error) {
            reject(error);
        }
    });
}


function listAllQuestions() {
    return new Promise(async (resolve, reject) => {
        try {
            let allQuestions = await questionDao.listQuestions();

            resolve(beforeReturnLstQuestions(allQuestions));
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

function clearStats() {
    return new Promise(async (resolve, reject) => {
        try {
            var questions = await questionDao.listQuestions();

            for (question of questions) {
                question.nbPicked = 0;
                question.nbDone = 0;

                await questionDao.upsertQuestion(question);
            }

            resolve('ok');
        } catch (error) {
            reject(error);
        }
    });
}

var questionService = {
    getQuestionById: getQuestionById,

    getQuestionByMongoId: getQuestionByMongoId,

    random: getRandomQuestion,

    random: async () => { return getWeightedRandomQuestionFromList(await listQuestions()); },

    randomT: async (typeId) => {
        return getRandomQuestionFromList(await listQuestionsByParams([
            { obj: 'typeId', value: typeId, equal: 0 },
        ]));
    },

    randomD: async (difficulty) => {
        return getRandomQuestionFromList(await listQuestionsByParams([
            { obj: 'difficulty', value: difficulty, equal: 0 }
        ]));
    },

    randomTD: async (typeId, difficulty) => {
        return getRandomQuestionFromList(await listQuestionsByParams([
            { obj: 'typeId', value: typeId, equal: 0 },
            { obj: 'difficulty', value: difficulty, equal: 0 }
        ]));
    },

    randomMD: async (maxDiff) => {
        return getRandomQuestionFromList(await listQuestionsByParams([
            { obj: 'difficulty', value: maxDiff, equal: -1 }
        ]));
    },

    randomTMD: async (typeId, maxDiff) => {
        return getRandomQuestionFromList(await listQuestionsByParams([
            { obj: 'typeId', value: typeId, equal: 0 },
            { obj: 'difficulty', value: maxDiff, equal: -1 }
        ]));
    },

    randomTMDP: async (typeId, maxDiff, maxPlayers) => {
        return getRandomQuestionFromList(await listQuestionsByParams([
            { obj: 'typeId', value: typeId, equal: 0 },
            { obj: 'difficulty', value: maxDiff, equal: -1 },
            { obj: 'nbPlayers', value: maxPlayers, equal: -1 }
        ]));
    },

    randomTMDPG: async (typeId, maxDiff, maxPlayers, gender) => {
        gender = (gender || -1);
        return getRandomQuestionFromList(await listQuestionsByParams([
            { obj: 'typeId', value: typeId, equal: 0 },
            { obj: 'difficulty', value: maxDiff, equal: -1 },
            { obj: 'nbPlayers', value: maxPlayers, equal: -1 },
            { obj: 'gender', value: [-1, gender], equal: 0 }
        ]));
    },

    Wrandom: async () => { return getWeightedRandomQuestionFromList(await listQuestions()); },

    WrandomT: async (typeId) => {
        return getWeightedRandomQuestionFromList(await listQuestionsByParams([
            { obj: 'typeId', value: typeId, equal: 0 },
        ]));
    },

    WrandomD: async (difficulty) => {
        return getWeightedRandomQuestionFromList(await listQuestionsByParams([
            { obj: 'difficulty', value: difficulty, equal: 0 }
        ]));
    },

    WrandomTD: async (typeId, difficulty) => {
        return getWeightedRandomQuestionFromList(await listQuestionsByParams([
            { obj: 'typeId', value: typeId, equal: 0 },
            { obj: 'difficulty', value: difficulty, equal: 0 }
        ]));
    },

    WrandomMD: async (maxDiff) => {
        return getWeightedRandomQuestionFromList(await listQuestionsByParams([
            { obj: 'difficulty', value: maxDiff, equal: -1 }
        ]));
    },

    WrandomTMD: async (typeId, maxDiff) => {
        return getWeightedRandomQuestionFromList(await listQuestionsByParams([
            { obj: 'typeId', value: typeId, equal: 0 },
            { obj: 'difficulty', value: maxDiff, equal: -1 }
        ]));
    },

    WrandomTMDP: async (typeId, maxDiff, maxPlayers) => {
        return getWeightedRandomQuestionFromList(await listQuestionsByParams([
            { obj: 'typeId', value: typeId, equal: 0 },
            { obj: 'difficulty', value: maxDiff, equal: -1 },
            { obj: 'nbPlayers', value: maxPlayers, equal: -1 }
        ]));
    },

    WrandomTMDPG: async (typeId, maxDiff, maxPlayers, gender) => {
        return getWeightedRandomQuestionFromList(await listQuestionsByParams([
            { obj: 'typeId', value: typeId, equal: 0 },
            { obj: 'difficulty', value: maxDiff, equal: -1 },
            { obj: 'nbPlayers', value: maxPlayers, equal: -1 },
            { obj: 'gender', value: [-1, gender], equal: 0 }
        ]));
    },

    upsertQuestion: upsertQuestion,

    list: listQuestions,

    listAll: listAllQuestions,

    listT: async (typeId) => {
        return await listQuestionsByParams([
            { obj: 'typeId', value: typeId, equal: 0 },
        ]);
    },

    listMD: async (maxDiff) => {
        return await listQuestionsByParams([
            { obj: 'difficulty', value: maxDiff, equal: -1 }
        ]);
    },

    listTMD: async (typeId, maxDiff) => {
        return await listQuestionsByParams([
            { obj: 'typeId', value: typeId, equal: 0 },
            { obj: 'difficulty', value: maxDiff, equal: -1 }
        ]);
    },

    listTMDP: async (typeId, maxDiff, maxPlayers) => {
        return await listQuestionsByParams([
            { obj: 'typeId', value: typeId, equal: 0 },
            { obj: 'difficulty', value: maxDiff, equal: -1 },
            { obj: 'nbPlayers', value: maxPlayers, equal: -1 }
        ]);
    },

    listD: async (difficulty) => {
        return await listQuestionsByParams([
            { obj: 'difficulty', value: difficulty, equal: 0 }
        ]);
    },

    listTD: async (typeId, difficulty) => {
        return await listQuestionsByParams([
            { obj: 'typeId', value: typeId, equal: 0 },
            { obj: 'difficulty', value: difficulty, equal: 0 }
        ]);
    },

    deleteQuestion: deleteQuestion,

    //deleteQuestionById: deleteQuestionById,

    clearStats: clearStats
}

module.exports = questionService;