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

var typeService = {
    getTypeById: getTypeById,

    getRandomType: getRandomType,

    listTypes: listTypes
}

module.exports = typeService;