const questionDao = require('../daos/questionDao');
const typeService = require('./typeService');
const uuidv1 = require('uuid/v1');
const weightedRandom = require('weighted-random');

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

function getRandomQuestionByMaxDiff(maxDiff) {
    return new Promise(async (resolve, reject) => {
        try {
            let questions = await listQuestionsByMaxDiff(maxDiff);

            let question = questions[Math.floor(Math.random() * questions.length)];

            questionPicked(question);

            resolve(beforeReturnQuestion(question));
        } catch (error) {
            reject(error);
        }
    });
}

function getRandomQuestionByTypeIdMaxDiff(typeId, maxDiff) {
    return new Promise(async (resolve, reject) => {
        try {
            let questions = await listQuestionsByTypeIdMaxDiff(typeId, maxDiff);

            let question = questions[Math.floor(Math.random() * questions.length)];

            questionPicked(question);

            resolve(beforeReturnQuestion(question));
        } catch (error) {
            reject(error);
        }
    });
}

function getRandomQuestionByTypeIdMaxDiffMaxPlayers(typeId, maxDiff, maxPlayers) {
    return new Promise(async (resolve, reject) => {
        try {
            let questions = await listQuestionsByTypeIdMaxDiffMaxPlayers(typeId, maxDiff, maxPlayers);

            let question = questions[Math.floor(Math.random() * questions.length)];

            questionPicked(question);

            resolve(beforeReturnQuestion(question));
        } catch (error) {
            reject(error);
        }
    });
}

function getRandomQuestionByTypeId(typeId) {
    return new Promise(async (resolve, reject) => {
        try {
            let typeQuestions = await listQuestionsByTypeId(typeId);

            let question = typeQuestions[Math.floor(Math.random() * typeQuestions.length)];

            questionPicked(question);

            resolve(beforeReturnQuestion(question));
        } catch (error) {
            reject(error);
        }
    });
}

function getRandomQuestionByDifficulty(difficulty) {
    return new Promise(async (resolve, reject) => {
        try {
            let diffQuestions = await listQuestionsByDifficulty(difficulty)

            let question = diffQuestions[Math.floor(Math.random() * diffQuestions.length)];

            questionPicked(question);

            resolve(beforeReturnQuestion(question));
        } catch (error) {
            reject(error);
        }
    });
}

function getRandomQuestionByTypeIdDifficulty(typeId, difficulty) {
    return new Promise(async (resolve, reject) => {
        try {
            let filteredQuestions = await listQuestionsByTypeIdDifficulty(typeId, difficulty);

            let question = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];

            questionPicked(question);

            resolve(beforeReturnQuestion(question));
        } catch (error) {
            reject(error);
        }
    });
}

function getWeightedRandomQuestionFromList(lstQuestions) {
    return new Promise(async (resolve, reject) => {
        try {
            let weights = lstQuestions.map(function(question) {
                return question.nbPicked;
            });

            let highest = Math.max.apply(null, weights) + 6;

            weights = lstQuestions.map(function(question) {
                return highest - question.nbPicked;
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
                    if (param.equal < 0 && question[param.obj] <= param.value) res.push(true);
                    else if (param.equal > 0 && question[param.obj] >= param.value) res.push(true);
                    else if (param.equal == 0 && question[param.obj] == param.value) res.push(true);
                    else res.push(false);
                });

                return res.every(val => val == true);
            });

            resolve(beforeReturnLstQuestions(allQuestions));
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

function listQuestionsByMaxDiff(maxDiff) {
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

function listQuestionsByTypeIdMaxDiff(typeId, maxDiff) {
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

function listQuestionsByTypeIdMaxDiffMaxPlayers(typeId, maxDiff, maxPlayers) {
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

function listQuestionsByTypeIdMaxDiffMaxPlayersGender(typeId, maxDiff, maxPlayers, gender) {
    return new Promise(async (resolve, reject) => {
        try {
            let questions = await listQuestionsByTypeIdMaxDiffMaxPlayers(typeId, maxDiff, maxPlayers);

            questions = questions.filter(question => question.gender == gender || question.gender == -1);

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

function listQuestionsByTypeIdDifficulty(typeId, difficulty) {
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

    random: getRandomQuestion,

    Wrandom: async () => { return getWeightedRandomQuestionFromList(await listQuestions()); },

    WrandomT: async (typeId) => {
        return getWeightedRandomQuestionFromList(await listQuestionsByParams([
            { obj: 'typeId', value: typeId, equal: 0 },
        ]));
    },

    WrandomD: async (difficulty) => {
        return getWeightedRandomQuestionFromList(await listQuestionsByParams([
            { obj: 'difficulty', value: maxDiff, equal: 0 }
        ]));
    },

    WrandomTD: async (typeId, difficulty) => {
        return getWeightedRandomQuestionFromList(await listQuestionsByParams([
            { obj: 'typeId', value: typeId, equal: 0 },
            { obj: 'difficulty', value: maxDiff, equal: 0 }
        ]));
    },

    WrandomMD: async (maxDiff) => { return getWeightedRandomQuestionFromList(await listQuestionsByMaxDiff(maxDiff)); },

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
            { obj: 'nbPlayers', value: maxPlayers, equal: -1 }
        ]));
    },

    upsertQuestion: upsertQuestion,

    list: listQuestions,

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

    deleteQuestionById: deleteQuestionById,
}

module.exports = questionService;