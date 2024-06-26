// Load in Express framework
const express = require(`express`)

// Load in our controller/action instances
const galaxyCtlr = require(`../src/controllers/galaxy.js`)

// Create a new Router instance and call it "router"
const router = new express.Router()

router.get('/new', (req, res) => {
    res.render('galaxies/create')
});

// RESTful resource mappings
router.get(`/`, galaxyCtlr.index)
router.post(`/`, galaxyCtlr.create)
router.get(`/:id`, galaxyCtlr.show)
router.get('/:id/update', galaxyCtlr.updateForm);
router.put(`/:id`, galaxyCtlr.update)
router.delete(`/:id`, galaxyCtlr.remove) 

// export "router"
module.exports = router
