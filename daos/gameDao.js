var gameDao = {
    findGameById: (gameId) => {
        return new Promise((resolve, reject) => {
            db.collection('games').findOne({ id: gameId }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    findGameByMongoId: (gameMongoId) => {
        return new Promise((resolve, reject) => {
            db.collection('games').findOne({ _id: gameMongoId }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    upsertGame: (newGame) => {
        return new Promise((resolve, reject) => {
            db.collection('games').updateOne({ id: newGame.id }, { $set: newGame }, { upsert: true }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    listGames: () => {
        return new Promise((resolve, reject) => {
            db.collection('games').find({}).toArray((err, result) => {
                if (err) reject(err);
                else resolve(result.reverse());
            });
        });
    },

    deleteGameById: (gameId) => {
        return new Promise((resolve, reject) => {
            db.collection('games').deleteOne({ id: gameId }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}

module.exports = gameDao;