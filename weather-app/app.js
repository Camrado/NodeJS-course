const geocode = require('./utils/geocode.js');
const forecast = require('./utils/forecast.js');

const address = process.argv[2]; // argument which we pass in console

if (!address) {
  return console.log('Provide city name!');
}

geocode(address, (error, geocodeData) => {
  if (error) {
    return console.log('Error: ', error);
  }

  forecast(geocodeData, (error, forecastData) => {
    if (error) {
      return console.log('Error: ', error);
    }

    console.log(geocodeData.location);
    console.log(forecastData);
  });
});
