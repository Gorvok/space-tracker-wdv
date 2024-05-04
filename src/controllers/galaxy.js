const { Galaxy, Star } = require('../models');
const path = require('path');
const fs = require('fs');

// Show all galaxies
exports.index = async (req, res) => {
  try {
    const galaxies = await Galaxy.findAll({
      include: [{ model: Star, as: 'stars' }]
    });
    // Check if the client accepts HTML
    if (req.accepts('html')) {
      res.render('galaxies/index', { galaxies });
    } else {
      res.json(galaxies);
    }
  } catch (error) {
    console.error('Failed to retrieve galaxies:', error);
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
      if (req.accepts('html')) {
        res.render('galaxies/show', { galaxy });
      } else {
        res.json(galaxy);
      }
    } else {
      res.status(404).send('Galaxy not found');
    }
  } catch (error) {
    console.error('Error retrieving galaxy:', error);
    res.status(500).send(error.message);
  }
};

// Create a new galaxy
exports.create = async (req, res) => {
  console.log("Received data", req.body);
  try {
    const galaxyData = {
      name: req.body.name,
      size: req.body.size,
      description: req.body.description,
      imageUrl: '',
    };

    if (req.files && req.files.image) {
      const image = req.files.image;
      const imageName = new Date().getTime() + path.extname(image.name);
      const uploadPath = path.join(__dirname, '../public/uploads/galaxies', imageName);
      await image.mv(uploadPath);
      galaxyData.imageUrl = `/uploads/galaxies/${imageName}`;
    }

    const galaxy = await Galaxy.create(galaxyData);
    if (req.accepts('html')) {
      res.redirect(`/galaxies/${galaxy.id}`);
    } else {
      res.status(201).json(galaxy);
    }
  } catch (error) {
    console.error("Error creating galaxy:", error);
    res.status(400).send(error.message);
  }
};


const uploadDirGalaxies = path.join(__dirname, '../../public/uploads/galaxies');
if (!fs.existsSync(uploadDirGalaxies)) {
  fs.mkdirSync(uploadDirGalaxies, { recursive: true });
}

// Update an existing galaxy
exports.update = async (req, res) => {
  try {
    const galaxy = await Galaxy.findByPk(req.params.id);
    if (!galaxy) {
      return res.status(404).send('Galaxy not found');
    }

    if (req.files && req.files.image) {
      const image = req.files.image;
      const imageName = new Date().getTime() + path.extname(image.name);
      const uploadPath = path.join(uploadDirGalaxies, imageName);

      await image.mv(uploadPath);

      galaxy.imageUrl = `/uploads/galaxies/${imageName}`;
      await galaxy.save();
    }

    await galaxy.update(req.body);

    if (req.accepts('html')) {
      res.redirect(`/galaxies/${galaxy.id}`);
    } else {
      res.status(200).json(galaxy);
    }
  } catch (error) {
    console.error('Error updating galaxy:', error);
    res.status(500).send(error.message);
  }
};

exports.updateForm = async (req, res) => {
  try {
    const galaxy = await Galaxy.findByPk(req.params.id, {
      include: [{ model: Star, as: 'stars' }]
    });
    if (galaxy) {
      res.render('galaxies/update', { galaxy });
    } else {
      res.status(404).send('Galaxy not found');
    }
  } catch (error) {
    console.error('Error retrieving galaxy for update:', error);
    res.status(500).send(error.message);
  }
};

// Delete a galaxy
exports.remove = async (req, res) => {
  try {
    const galaxy = await Galaxy.findByPk(req.params.id);
    if (galaxy) {
      await galaxy.destroy();
      if (req.accepts('html')) {
        res.redirect('/galaxies');
      } else {
        res.status(204).end();
      }
    } else {
      res.status(404).send('Galaxy not found');
    }
  } catch (error) {
    console.error('Error deleting galaxy:', error);
    res.status(500).send(error.message);
  }
};
