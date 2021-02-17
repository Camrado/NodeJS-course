const geocode = require('./utils/geocode.js');
const forecast = require('./utils/forecast.js');

// geocode('Baku', (error, data) => {
//   console.log('Error: ', error);
//   console.log('Data: ', data);
// });

forecast(49.714, 40.006, (error, data) => {
  console.log('Error', error);
  console.log('Data', data);
});
