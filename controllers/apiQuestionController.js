var router = require('express').Router();
var questionService = require('../services/questionService');

router.get('/id/:questionId', async (req, res) => {
    var questionId = req.params.questionId;
    try {
        var question = await questionService.findQuestionById(questionId);

        question.nbPicked += 1;

        res.send(question);

        questionService.upsertQuestion(question);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.post('/done/:questionId', async (req, res) => {
    var questionId = req.params.questionId;
    try {
        var question = await questionService.findQuestionById(questionId);

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
        res.send(await questionService.getTypes());
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});


router.get('/randomQuestion', async (req, res) => {
    try {
        var questions = await questionService.findAllQuestions();

        var question = questions[Math.floor(Math.random() * questions.length)]

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
        var questions = await questionService.findQuestionsByTypeId(typeId);

        var question = questions[Math.floor(Math.random() * questions.length)]

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
        var types = await questionService.getTypes();

        var type = types[Math.floor(Math.random() * types.length)]

        res.send(type);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.get('/list', async (req, res) => {
    try {
        res.send(await questionService.findAllQuestions());
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});
module.exports = router;