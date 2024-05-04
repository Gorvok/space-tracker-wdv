const { Planet, Star } = require('../models');
const path = require('path');
const fs = require('fs');

// Show all planets
exports.index = async (req, res) => {
  try {
    const planets = await Planet.findAll({
      include: [{ model: Star, as: 'stars' }]
    });
    if (req.accepts('html')) {
      res.render('planets/index', { planets });
    } else {
      res.status(200).json(planets);
    }
  } catch (error) {
    console.error('Failed to retrieve planets:', error);
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
      if (req.accepts('html')) {
        res.render('planets/show', { planet });
      } else {
        res.status(200).json(planet);
      }
    } else {
      res.status(404).send('Planet not found');
    }
  } catch (error) {
    console.error('Error retrieving planet:', error);
    res.status(500).send(error.message);
  }
};

// Update form for a planet
exports.updateForm = async (req, res) => {
  try {
    const planet = await Planet.findByPk(req.params.id);
    if (planet) {
      res.render('planets/update', { planet });
    } else {
      res.status(404).send('Planet not found');
    }
  } catch (error) {
    console.error('Error loading the update form:', error);
    res.status(500).send(error.message);
  }
};

// Add a star to a planet
exports.addStarToPlanet = async (req, res) => {
  const { planetId } = req.params;
  const { starId } = req.body;

  try {
    const planet = await Planet.findByPk(planetId);
    const star = await Star.findByPk(starId);

    if (!planet || !star) {
      return res.status(404).send('Planet or Star not found');
    }

    await planet.addStar(star);
    res.status(200).send('Star added to planet successfully');
  } catch (error) {
    console.error('Error adding star to planet:', error);
    res.status(500).send(error.message);
  }
};

// Create a new planet
exports.create = async (req, res) => {
  console.log("Received data", req.body);
  try {
    const planetData = {
      name: req.body.name,
      size: req.body.size,
      description: req.body.description,
      imageUrl: '',
    };

    if (req.files && req.files.image) {
      const image = req.files.image;
      const imageName = new Date().getTime() + path.extname(image.name);
      const uploadPath = path.join(__dirname, '../public/uploads/planets', imageName);
      await image.mv(uploadPath);
      planetData.imageUrl = `/uploads/planets/${imageName}`;
    }

    const planet = await Planet.create(planetData);
    if (req.accepts('html')) {
      res.redirect(`/planets/${planet.id}`);
    } else {
      res.status(201).json(planet);
    }
  } catch (error) {
    console.error("Error creating planet:", error);
    res.status(400).send(error.message);
  }
};


const uploadDir = path.join(__dirname, '../../public/uploads/planets');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Update an existing planet
exports.update = async (req, res) => {
  try {
    const planet = await Planet.findByPk(req.params.id);
    if (!planet) {
      return res.status(404).send('Planet not found');
    }

    if (req.files && req.files.image) {
      const image = req.files.image;
      const imageName = new Date().getTime() + path.extname(image.name);
      const uploadPath = path.join(uploadDir, imageName);


      await image.mv(uploadPath);


      planet.imageUrl = `/uploads/planets/${imageName}`;
      await planet.save();
    }

    // Continue with updating other fields
    await planet.update(req.body);

    if (req.accepts('html')) {
      res.redirect(`/planets/${planet.id}`);
    } else {
      res.status(200).json(planet);
    }
  } catch (error) {
    console.error('Error updating planet:', error);
    res.status(500).send(error.message);
  }
};

// Delete a planet
exports.remove = async (req, res) => {
  try {
    const planet = await Planet.findByPk(req.params.id);
    if (planet) {
      await planet.destroy();
      if (req.accepts('html')) {
        res.redirect('/planets');
      } else {
        res.status(204).end();
      }
    } else {
      res.status(404).send('Planet not found');
    }
  } catch (error) {
    console.error('Error deleting planet:', error);
    res.status(500).send(error.message);
  }
};
