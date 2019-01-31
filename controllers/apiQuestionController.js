const router = require('express').Router();
const questionService = require('../services/questionService');

router.get('/id/:questionId', async (req, res) => {
    try {
        let questionId = req.params.questionId;

        let question = await questionService.getQuestionById(questionId);

        res.send(question);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.get('/done/:questionId', async (req, res) => {
    try {
        let questionId = req.params.questionId;

        let question = await questionService.getQuestionById(questionId);

        question.nbDone += 1;

        questionService.upsertQuestion(question);

        res.send({ 'done': 'ok' });
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.get('/random', async (req, res) => {
    try {
        let question = await questionService.random();

        res.send(question);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.get('/random/md/:maxDiff', async (req, res) => {
    try {
        let maxDiff = parseInt(req.params.maxDiff);

        let question = await questionService.randomMD(maxDiff);

        res.send(question);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.get('/random/t/:typeId', async (req, res) => {
    try {
        let typeId = parseInt(req.params.typeId);

        let question = await questionService.randomT(typeId);

        res.send(question);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});


router.get('/random/d/:difficulty', async (req, res) => {
    try {
        let difficulty = parseInt(req.params.difficulty);

        let question = await questionService.randomD(difficulty);

        res.send(question);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});


router.get('/random/td/:typeId/:difficulty', async (req, res) => {
    try {
        let difficulty = parseInt(req.params.difficulty);
        let typeId = parseInt(req.params.typeId);

        let question = await questionService.randomTD(typeId, difficulty);

        res.send(question);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.get('/random/tmd/:typeId/:maxDifficulty', async (req, res) => {
    try {
        let maxDifficulty = parseInt(req.params.maxDifficulty);
        let typeId = parseInt(req.params.typeId);

        let question = await questionService.randomTMD(maxDifficulty, typeId);

        res.send(question);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.get('/random/tmdp/:typeId/:maxDifficulty/:maxPlayers', async (req, res) => {
    try {
        let typeId = parseInt(req.params.typeId);
        let maxDifficulty = parseInt(req.params.maxDifficulty);
        let maxPlayers = parseInt(req.params.maxPlayers);

        let question = await questionService.randomTMDP(typeId, maxDifficulty, maxPlayers);

        res.send(question);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.get('/wrandom/tmdp/:typeId/:maxDifficulty/:maxPlayers', async (req, res) => {
    try {
        let typeId = parseInt(req.params.typeId);
        let maxDifficulty = parseInt(req.params.maxDifficulty);
        let maxPlayers = parseInt(req.params.maxPlayers);

        let question = await questionService.WrandomTMDP(typeId, maxDifficulty, maxPlayers);

        res.send(question);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.get('/wrandom/tmdpg/:typeId/:maxDifficulty/:maxPlayers/:gender', async (req, res) => {
    try {
        let typeId = parseInt(req.params.typeId);
        let maxDifficulty = parseInt(req.params.maxDifficulty);
        let maxPlayers = parseInt(req.params.maxPlayers);
        let gender = parseInt(req.params.gender);

        let question = await questionService.WrandomTMDPG(typeId, maxDifficulty, maxPlayers, gender);

        res.send(question);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.get('/list', async (req, res) => {
    try {
        res.send(await questionService.list());
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});
module.exports = router;