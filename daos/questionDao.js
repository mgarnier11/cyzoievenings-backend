var questionDao = {
    findQuestionById: (questionId) => {
        return new Promise((resolve, reject) => {
            db.collection('questions').findOne({ id: questionId }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    findQuestionByMongoId: (questionMongoId) => {
        return new Promise((resolve, reject) => {
            db.collection('questions').findOne({ _id: questionMongoId }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    upsertQuestion: (newQuestion) => {
        return new Promise((resolve, reject) => {
            db.collection('questions').updateOne({ id: newQuestion.id }, { $set: newQuestion }, { upsert: true }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    listQuestions: () => {
        return new Promise((resolve, reject) => {
            db.collection('questions').find({}).toArray((err, result) => {
                if (err) reject(err);
                else resolve(result.reverse());
            });
        });
    },

    deleteQuestionById: (questionId) => {
        return new Promise((resolve, reject) => {
            db.collection('questions').deleteOne({ id: questionId }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}

module.exports = questionDao;