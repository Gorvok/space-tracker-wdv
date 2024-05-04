// Load in Express framework
const express = require(`express`)

// Load in our controller/action instances
const planetCtlr = require(`../src/controllers/planet.js`)

// Create a new Router instance and call it "router"
const router = new express.Router()

router.get('/new', (req, res) => {
    res.render('planets/create');
});

// RESTful resource mappings
router.get(`/`, planetCtlr.index)
router.post(`/`, planetCtlr.create)
router.post('/:planetId/stars', planetCtlr.addStarToPlanet)
router.get(`/:id`, planetCtlr.show)
router.get('/:id/update', planetCtlr.updateForm);
router.put(`/:id`, planetCtlr.update) 
router.delete(`/:id`, planetCtlr.remove) 

// export "router"
module.exports = router
