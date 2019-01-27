const router = require('express').Router();
const questionService = require('../services/questionService');
const typeService = require('../services/typeService');

router.get('/id/:questionId', async (req, res) => {
    try {
        let questionId = req.params.questionId;

        let question = await questionService.getQuestionById(questionId);

        question.nbPicked += 1;

        res.send(question);

        questionService.upsertQuestion(question);
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

        res.send('ok');
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.get('/random', async (req, res) => {
    try {
        let question = await questionService.getRandomQuestion();

        question.nbPicked += 1;

        res.send(question);

        questionService.upsertQuestion(question);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.get('/random/type/:typeId', async (req, res) => {
    try {
        let typeId = parseInt(req.params.typeId);

        let question = await questionService.getRandomQuestionByTypeId(typeId);

        question.nbPicked += 1;

        res.send(question);

        questionService.upsertQuestion(question);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});


router.get('/random/diff/:difficulty', async (req, res) => {
    try {
        let difficulty = parseInt(req.params.difficulty);

        let question = await questionService.getRandomQuestionByDifficulty(difficulty);

        question.nbPicked += 1;

        res.send(question);

        questionService.upsertQuestion(question);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});


router.get('/random/typeDiff/:typeId/:difficulty', async (req, res) => {
    try {
        let difficulty = parseInt(req.params.difficulty);
        let typeId = parseInt(req.params.typeId);

        let question = await questionService.getRandomQuestionByDifficultyAndTypeId(typeId, difficulty);

        question.nbPicked += 1;

        res.send(question);

        questionService.upsertQuestion(question);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.get('/list', async (req, res) => {
    try {
        res.send(await questionService.listQuestions());
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});
module.exports = router;