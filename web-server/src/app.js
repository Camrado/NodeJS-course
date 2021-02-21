const path = require('path'); // built-in
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode.js');
const forecast = require('./utils/forecast.js');

const app = express();
const port = process.env.PORT || 3000;
const year = '2021';

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views/partials location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

// req - request; res - response
app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    year
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About page',
    year
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help page',
    message: 'Some helpful message.',
    year
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({ error: 'You must provide an address!' });
  }

  geocode(req.query.address, (error, geocodeData) => {
    if (error) {
      return res.send({ error });
    }

    forecast(geocodeData, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }

      res.send({
        forecast: forecastData,
        location: geocodeData.location
      });
    });
  });
});

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    message: 'Help Article Not Found',
    year
  });
});

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    message: 'Page Not Found',
    year
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
