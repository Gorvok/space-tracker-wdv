const { Planet, Star } = require('../models');

// Show all planets
exports.index = async (req, res) => {
  try {
    const planets = await Planet.findAll({
      include: [{ model: Star, as: 'stars' }]
    });
    res.status(200).json(planets);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Show a single planet by ID
exports.show = async (req, res) => {
  try {
    const planet = await Planet.findByPk(req.params.id, {
      include: [{ model: Star, as: 'stars' }]
    });
    if (planet) {
      res.status(200).json(planet);
    } else {
      res.status(404).send('Planet not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Create a new planet
exports.create = async (req, res) => {
  try {
    const planet = await Planet.create(req.body);
    res.status(201).json(planet);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.addStarToPlanet = async (req, res) => {
  const { planetId } = req.params;
  const { starId } = req.body;

  try {
    const planet = await Planet.findByPk(planetId);
    if (!planet) {
      return res.status(404).send('Planet not found');
    }

    const star = await Star.findByPk(starId);
    if (!star) {
      return res.status(404).send('Star not found');
    }

    await planet.addStar(star);
    res.status(200).send('Star added to planet successfully');
  } catch (error) {
    console.error('Error adding star to planet:', error);
    res.status(500).send(error.message);
  }
};

// Update an existing planet
exports.update = async (req, res) => {
  try {
    const planet = await Planet.findByPk(req.params.id);
    if (planet) {
      await planet.update(req.body);
      res.status(200).json(planet);
    } else {
      res.status(404).send('Planet not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Delete a planet
exports.remove = async (req, res) => {
  try {
    const planet = await Planet.findByPk(req.params.id);
    if (planet) {
      await planet.destroy();
      res.status(204).end();
    } else {
      res.status(404).send('Planet not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};
