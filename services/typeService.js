const questionDao = require('../daos/questionDao');

const types = [
    { id: 1, value: "Vérité" },
    { id: 2, value: "Theme" },
    { id: 3, value: "Action de groupe" },
    { id: 4, value: "As-tu déja" },
    { id: 5, value: "Minijeu" },
    { id: 6, value: "Action" },
    { id: 7, value: "Vérité de groupe" },
    { id: 8, value: "Tu préfères" },
]

function getTypeById(typeId) {
    return new Promise(async (resolve, reject) => {
        try {
            let type = types.find(t => { return t.id == typeId });

            resolve(type);
        } catch (error) {
            reject(error);
        }
    });
}

function getRandomType() {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(types[Math.floor(Math.random() * types.length)]);
        } catch (error) {
            reject(error);
        }
    });
}

function listTypes() {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(types);
        } catch (error) {
            reject(error);
        }
    });
}

function listTypesQ() {
    return new Promise(async (resolve, reject) => {
        try {
            let allQuestions = await questionDao.listQuestions();

            let nTypesId = [];

            allQuestions.forEach(question => {
                if (!nTypesId.includes(question.typeId)) nTypesId.push(question.typeId);
            });



            resolve(types.filter(type => nTypesId.includes(type.id)));
        } catch (error) {
            reject(error);
        }
    });
}

var typeService = {
    getTypeById: getTypeById,

    getRandomType: getRandomType,

    listTypes: listTypes,

    listTypesQ: listTypesQ
}

module.exports = typeService;