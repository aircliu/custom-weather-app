const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const unitToggle = document.querySelector('.unit-toggle');
let isCelsius = false;

unitToggle.textContent = '°C';
unitToggle.addEventListener('click', toggleTemperatureUnit);

function toggleTemperatureUnit() {
    isCelsius = !isCelsius;
    unitToggle.textContent = isCelsius ? '°F' : '°C';
    const temperature = document.querySelector('.weather-box .temperature');
    updateTemperature(temperature);
}

function updateTemperature(temperature, temp) {
    if (temp === undefined) {
        temp = parseFloat(temperature.dataset.celsiusTemp);
    } else {
        // Store the original temperature in Celsius
        temperature.dataset.celsiusTemp = temp;
    }

    let newTemp;
    const unit = isCelsius ? '°C' : '°F';

    if (isCelsius) {
        newTemp = temp;
    } else {
        newTemp = (temp * 9 / 5) + 32;
    }

    temperature.innerHTML = `${parseInt(newTemp)}<span>${unit}</span>`;
}


search.addEventListener('click', () => {
    const APIKey = 'ca0edc173be4d64128a4572bf0c01fae';
    const city = document.querySelector('.search-box input').value;

    if (city == '') return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');
            

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clear.png';
                    break;
                case 'Rain':
                    image.src = 'images/rain.png';
                    break;
                case 'Lightning Storm':
                    image.src = 'images/snow.png';
                    break;
                case 'Clouds':
                    image.src = 'images/cloud.png';
                    break;
                case 'Haze':
                    image.src = 'images/mist.png';
                    break;
                default:
                    image.src = '';
            }

            updateTemperature(temperature, json.main.temp);
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';
            
        });
});
