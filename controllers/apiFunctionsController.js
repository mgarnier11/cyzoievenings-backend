const router = require('express').Router();
const questionService = require('../services/questionService');
const typeService = require('../services/typeService');


router.get('/questions/:fnName', async (req, res) => {
    try {
        let fn = req.params.fnName;
        let params = req.query.params;

        if (params) {
            params = params.split(',');
        }

        res.send(await questionService[fn].apply(fn, params));
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.get('/types/:fnName', async (req, res) => {
    try {
        let fn = req.params.fnName;
        let params = req.query.params;

        if (params) {
            params = params.split(',');
        }

        res.send(await typeService[fn].apply(fn, params));
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

module.exports = router;