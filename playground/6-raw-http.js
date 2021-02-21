const http = require('http');
const url = 'http://api.weatherstack.com/current?access_key=bafff67632eee684e0d86416410d8a00&query=45,-75';

const request = http.request(url, (response) => {
  let data = '';

  response.on('data', (chunk) => {
    data += chunk.toString();
  });

  response.on('end', () => {
    const body = JSON.parse(data);
    console.log(body);
  });
});

request.on('error', (error) => {
  console.log('Error: ', error);
});

request.end();
