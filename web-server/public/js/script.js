const weatherForm = document.querySelector('#weatherForm');
const search = document.querySelector('#locationInput');
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');

weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();

  messageOne.textContent = 'Loading...';
  messageTwo.textContent = '';

  const location = search.value;

  fetchWeather(location);
});

const fetchWeather = (address) => {
  fetch(`/weather?address=${address}`)
    .then((response) => response.json())
    .then(({ error, location, forecast }) => {
      if (error) {
        return (messageOne.textContent = error);
      }

      messageOne.textContent = location;
      messageTwo.textContent = forecast;
    })
    .catch((error) => {
      messageOne.textContent = error;
    });
};
