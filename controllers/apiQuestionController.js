const router = require('express').Router();
const questionService = require('../services/questionService');
const typeService = require('../services/typeService');

router.get('/id/:questionId', async (req, res) => {
    var questionId = req.params.questionId;
    try {
        var question = await questionService.getQuestionById(questionId);

        question.nbPicked += 1;

        res.send(question);

        questionService.upsertQuestion(question);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.get('/done/:questionId', async (req, res) => {
    var questionId = req.params.questionId;
    try {
        var question = await questionService.getQuestionById(questionId);

        question.nbDone += 1;

        questionService.upsertQuestion(question);

        res.send('ok');
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.get('/types', async (req, res) => {
    try {
        res.send(await typeService.listTypes());
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.get('/randomQuestion', async (req, res) => {
    try {
        var question = await questionService.getRandomQuestion();

        question.nbPicked += 1;

        res.send(question);

        questionService.upsertQuestion(question);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.get('/randomQuestion/:typeId', async (req, res) => {
    var typeId = parseInt(req.params.typeId);
    try {
        var question = await questionService.getRandomQuestionByTypeId(typeId);

        question.nbPicked += 1;

        res.send(question);

        questionService.upsertQuestion(question);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.get('/randomType', async (req, res) => {
    try {
        res.send(await typeService.getRandomType());
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