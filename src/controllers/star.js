const { Star, Planet, Galaxy } = require('../models');

// Show all stars
exports.index = async (req, res) => {
  try {
    const stars = await Star.findAll({
      include: [
        { model: Planet, as: 'planets' },
        { model: Galaxy, as: 'galaxy' }
      ]
    });
    res.status(200).json(stars);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Show a single star by ID
exports.show = async (req, res) => {
  try {
    const star = await Star.findByPk(req.params.id, {
      include: [
        { model: Planet, as: 'planets' },
        { model: Galaxy, as: 'galaxy' }
      ]
    });
    if (star) {
      res.status(200).json(star);
    } else {
      res.status(404).send('Star not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Create a new star
exports.create = async (req, res) => {
  try {
    const star = await Star.create(req.body);
    res.status(201).json(star);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Update an existing star
exports.update = async (req, res) => {
  try {
    const star = await Star.findByPk(req.params.id);
    if (star) {
      await star.update(req.body);
      res.status(200).json(star);
    } else {
      res.status(404).send('Star not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Delete a star
exports.remove = async (req, res) => {
  try {
    const star = await Star.findByPk(req.params.id);
    if (star) {
      await star.destroy();
      res.status(204).end();
    } else {
      res.status(404).send('Star not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};
