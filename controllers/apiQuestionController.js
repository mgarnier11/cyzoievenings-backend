var router = require('express').Router();
var questionService = require('../services/questionService');

router.get('/id/:questionId', async (req, res) => {
    var questionId = req.params.questionId;
    try {
        res.send(await questionService.findQuestionById(questionId));
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