var express = require('express');
var router = express.Router();
var questionService = require('../services/questionService');


/* GET create new question. */
router.get('/', async function (req, res, next) {
    res.redirect('/questions/list');
});

/* GET create new question. */
router.get('/create',async function (req, res, next) {
    res.render('questions/create', { types: await questionService.getTypes() });
});

/* POST create new question. */
router.post('/create', async function (req, res, next) {
    await questionService.createQuestion({
        text: req.body.questionText,
        type: parseInt(req.body.questionType),
        difficulty: parseInt(req.body.questionDifficulty)
    });
    res.redirect('/questions/list');
});

/* GET list questions. */
router.get('/list', async function (req, res, next) {
    res.render('questions/list', { types: await questionService.getTypes(), questions: await questionService.findAllQuestions() });
});

/* GET update question. */
router.get('/update/:id', async function (req, res, next) {
    var questionId = req.params.id;
    res.render('questions/update', { types: await questionService.getTypes(), question: await questionService.findQuestionById(questionId) });
});

/* POST update question. */
router.post('/update/:id', async function (req, res, next) {
    var questionId = req.params.id;
    await questionService.upsertQuestion({
        uuid: questionId,
        text: req.body.questionText,
        type: req.body.questionType,
        difficulty: req.body.questionDifficulty
    });
    res.redirect('/questions/list');
});

/* GET delete question. */
router.get('/delete/:id', async function (req, res, next) {
    var questionId = req.params.id;
    res.render('questions/delete', {types: await questionService.getTypes(),question: await questionService.findQuestionById(questionId)});
});

router.get('/delete/:id/yes', async function(req, res, next) {
    var questionId = req.params.id;
    
    await questionService.deleteQuestion(await questionService.findQuestionById(questionId));

    res.redirect('/questions/list');
});

router.get('/switch/:questionId', async (req, res) => {
    var questionId = req.params.questionId;
    try {
        var question = await questionService.findQuestionById(questionId);

        question.hidden = !question.hidden;

        await questionService.upsertQuestion(question);

        res.redirect('/questions/list');
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

module.exports = router;