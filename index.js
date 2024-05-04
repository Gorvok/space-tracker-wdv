// Load in our Express framework
const express       = require(`express`)

const fileUpload = require('express-fileupload')

const methodOverride = require('method-override');

// Create a new Express instance called "app"
const app           = express()

const db = require('./src/models')

// Load in our RESTful routers
const routers = require('./routers/index.js')
const galaxyRouter = require('./routers/galaxy');
app.use('/galaxies', galaxyRouter);
const planetRouter = require('./routers/planet');
app.use('/galaxies', planetRouter);
const starRouter = require('./routers/star');
app.use('/galaxies', starRouter);


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  createParentPath: true
}));
app.use(methodOverride('_method'));

app.set('views', __dirname + '/src/views')
app.set('view engine', 'twig')

// Home page welcome middleware
app.get('/', (req, res) => {
  res.render('home')
})

// Register our RESTful routers with our "app"
app.use(`/planets`,  routers.planet)
app.use(`/stars`,    routers.star)
app.use(`/galaxies`, routers.galaxy)

db.sequelize.sync({ force: false }).then(() => {
  console.log('Database tables synchronized successfully');

// Set our app to listen on port 3000
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(error => {
  console.error('Failed to synchronize database tables:', error);
});
