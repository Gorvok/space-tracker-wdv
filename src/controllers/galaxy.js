const { Galaxy, Star } = require('../models');

// Show all galaxies
exports.index = async (req, res) => {
  try {
    const galaxies = await Galaxy.findAll({
      include: [{ model: Star, as: 'stars' }]
    });
    res.status(200).json(galaxies);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Show a single galaxy by ID
exports.show = async (req, res) => {
  try {
    const galaxy = await Galaxy.findByPk(req.params.id, {
      include: [{ model: Star, as: 'stars' }]
    });
    if (galaxy) {
      res.status(200).json(galaxy);
    } else {
      res.status(404).send('Galaxy not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Create a new galaxy
exports.create = async (req, res) => {
  try {
    const galaxy = await Galaxy.create(req.body);
    res.status(201).json(galaxy);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Update an existing galaxy
exports.update = async (req, res) => {
  try {
    const galaxy = await Galaxy.findByPk(req.params.id);
    if (galaxy) {
      await galaxy.update(req.body);
      res.status(200).json(galaxy);
    } else {
      res.status(404).send('Galaxy not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Delete a galaxy
exports.remove = async (req, res) => {
  try {
    const galaxy = await Galaxy.findByPk(req.params.id);
    if (galaxy) {
      await galaxy.destroy();
      res.status(204).end();
    } else {
      res.status(404).send('Galaxy not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};
