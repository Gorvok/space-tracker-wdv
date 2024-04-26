const express = require('express');
const router = express.Router();
const { Quiz } = require('../models');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false}));

router.get('/', async (req, res) => {
  const quizzes = await Quiz.findAll();
  res.json(quizzes);
});

router.post('/', async (req, res) => {
    const { name } = req.body;
    const quiz = await Quiz.create({ name });
    res.json(quizzes);
});

router.get ('/:id', async (req, res) => {
    const quiz = await Quiz.findByPk(req.params.id);
    res.json(quiz);
});

router.post ('/:id', async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    const quiz = await Quiz.update({ name }, {
        where: { id }
    });
    res.json(quiz);
});

router.delete ('/:id', async (req, res) => {
    const { id } = req.params;
    const deleted = await Quiz.destroy({
        where: { id }
    });
    res.redirect('/quizzes');
});

module.exports = router;

