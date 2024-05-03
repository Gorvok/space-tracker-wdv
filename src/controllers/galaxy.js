const { Galaxy, Star } = require('../models');

// Show all galaxies
exports.index = async (req, res) => {
  try {
    const galaxies = await Galaxy.findAll({
      include: [{ model: Star, as: 'stars' }]
    });
    // Check if the client accepts HTML
    if (req.accepts('html')) {
      res.render('galaxies/index', { galaxies }); // Render a Twig template
    } else {
      res.json(galaxies); // Respond with JSON
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
        res.render('galaxies/show', { galaxy }); // Render a Twig template
      } else {
        res.json(galaxy); // Respond with JSON
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
    const galaxy = await Galaxy.create(req.body);
    console.log("Created Galaxy:", galaxy);
    if (req.accepts('html')) {
      res.redirect(`/galaxies/${galaxy.id}`); // Redirect to the galaxy page
    } else {
      res.status(201).json(galaxy); // Respond with JSON
    }
  } catch (error) {
    console.error("Error creating galaxy:", error);
    res.status(400).send(error.message);
  }
};

// Update an existing galaxy
exports.update = async (req, res) => {
  try {
    const galaxy = await Galaxy.findByPk(req.params.id);
    if (!galaxy) {
      return res.status(404).send('Galaxy not found');
    }
    console.log(req.files);

    // Handle the uploaded file
    if (req.files && req.files.image) {
      const image = req.files.image;
      console.log(image);
      const uploadPath = path.join(__dirname, '../public/uploads/galaxies', image.name);

      // Use the mv() method to place the file on the server
      image.mv(uploadPath, function(err) {
        if (err) {
          console.error('File Move Error:', err);
          return res.status(500).send(err);
        }
        console.log('File uploaded to:', uploadPath);
      });

      // Update galaxy with the path of the new image
      galaxy.image = '/uploads/galaxies' + image.name;
    }

    // Update other fields
    await galaxy.update(req.body);

    if (req.accepts('html')) {
      res.redirect(`/galaxies/${galaxy.id}`);
    } else {
      res.json(galaxy);
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
      res.render('galaxies/update', { galaxy });  // Assumes you have a 'galaxies/update.twig'
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
        res.redirect('/galaxies'); // Redirect to the list
      } else {
        res.status(204).end(); // Send a no-content response
      }
    } else {
      res.status(404).send('Galaxy not found');
    }
  } catch (error) {
    console.error('Error deleting galaxy:', error);
    res.status(500).send(error.message);
  }
};
