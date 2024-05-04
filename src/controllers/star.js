const { Star, Planet, Galaxy } = require('../models');
const path = require('path');
const fs = require('fs');

// Show all stars
exports.index = async (req, res) => {
  try {
    const stars = await Star.findAll({
      include: [
        { model: Planet, as: 'planets' },
        { model: Galaxy, as: 'galaxy' }
      ]
    });
    if (req.accepts('html')) {
      res.render('stars/index', { stars });
    } else {
      res.status(200).json(stars);
    }
  } catch (error) {
    console.error('Failed to retrieve stars:', error);
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
      if (req.accepts('html')) {
        res.render('stars/show', { star });
      } else {
        res.status(200).json(star);
      }
    } else {
      res.status(404).send('Star not found');
    }
  } catch (error) {
    console.error('Error retrieving star:', error);
    res.status(500).send(error.message);
  }
};

// Create a new star
exports.create = async (req, res) => {
  try {
    const starData = {
      name: req.body.name,
      size: req.body.size,
      description: req.body.description
    };

    const star = await Star.create(starData);

    if (req.files && req.files.image) {
      const image = req.files.image;
      const imageName = new Date().getTime() + path.extname(image.name);
      const uploadPath = path.join(__dirname, '../public/uploads/stars', imageName);

      await image.mv(uploadPath);
      star.imageUrl = '/uploads/stars/' + imageName;
      await star.save();
    }

    if (req.accepts('html')) {
      res.redirect(`/stars/${star.id}`);
    } else {
      res.status(201).json(star);
    }
  } catch (error) {
    console.error("Error creating star:", error);
    if (error.code === "ENOENT") {
      res.status(500).send("Error in saving the image file.");
    } else {
      res.status(400).send(error.message);
    }
  }
};

const uploadDirStars = path.join(__dirname, '../../public/uploads/stars');
if (!fs.existsSync(uploadDirStars)) {
  fs.mkdirSync(uploadDirStars, { recursive: true });
}

// Update an existing star
exports.update = async (req, res) => {
  try {
    const star = await Star.findByPk(req.params.id);
    if (!star) {
      return res.status(404).send('Star not found');
    }

    if (req.files && req.files.image) {
      const image = req.files.image;
      const imageName = new Date().getTime() + path.extname(image.name);
      const uploadPath = path.join(uploadDirStars, imageName);

      await image.mv(uploadPath);

      star.imageUrl = `/uploads/stars/${imageName}`;
      await star.save();
    }

    await star.update(req.body);

    if (req.accepts('html')) {
      res.redirect(`/stars/${star.id}`);
    } else {
      res.status(200).json(star);
    }
  } catch (error) {
    console.error('Error updating star:', error);
    res.status(500).send(error.message);
  }
};

exports.updateForm = async (req, res) => {
  try {
    const star = await Star.findByPk(req.params.id);
    if (star) {
      res.render('stars/update', { star });
    } else {
      res.status(404).send('Star not found');
    }
  } catch (error) {
    console.error('Error retrieving star for update:', error);
    res.status(500).send(error.message);
  }
};

// Delete a star
exports.remove = async (req, res) => {
  try {
    const star = await Star.findByPk(req.params.id);
    if (star) {
      await star.destroy();
      if (req.accepts('html')) {
        res.redirect('/stars');
      } else {
        res.status(204).end();
      }
    } else {
      res.status(404).send('Star not found');
    }
  } catch (error) {
    console.error('Error deleting star:', error);
    res.status(500).send(error.message);
  }
};
