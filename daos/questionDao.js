var questionDao = {
    createQuestion: (question) => {
        return new Promise((resolve, reject) => {
            db.collection('questions').insertOne(question, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    deleteQuestion: (question) => {
        return new Promise((resolve, reject) => {
            db.collection('questions').deleteOne(question, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    findAllQuestions: () => {
        return new Promise((resolve, reject) => {
            db.collection('questions').find({}).toArray((err, result) => {
                if (err) reject(err);
                else resolve(result.reverse());
            });
        });
    },

    findQuestionById: (questionId) => {
        return new Promise((resolve, reject) => {
            db.collection('questions').findOne({ uuid: questionId }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    upsertQuestion: (question) => {
        return new Promise((resolve, reject) => {
            db.collection('questions').updateOne({ uuid: question.uuid }, { $set: question }, { upsert: true }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}

module.exports = questionDao