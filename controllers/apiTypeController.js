const router = require('express').Router();
const typeService = require('../services/typeService');

router.get('/id/:typeId', async (req, res) => {
    try {
        let typeId = parseInt(req.params.typeId);

        let type = await typeService.getTypeById(typeId);

        res.send(type);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.get('/random', async (req, res) => {
    try {
        let type = await typeService.getRandomType();

        res.send(type);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.get('/randomQ', async (req, res) => {
    try {
        let type = await typeService.getRandomTypeQ();

        res.send(type);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.get('/list', async (req, res) => {
    try {
        let types = await typeService.listTypes();

        res.send(types);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

router.get('/listQ', async (req, res) => {
    try {
        let types = await typeService.listTypesQ();

        res.send(types);
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});
module.exports = router;