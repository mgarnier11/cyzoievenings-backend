const router = require('express').Router();
const questionService = require('../services/questionService');
const automaticControllerBuilder = require('./automaticControllerBuilder');

automaticControllerBuilder(router, questionService);

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

module.exports = router;