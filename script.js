
// get data when button clicked
const input = document.querySelector('.input-container input');
const btn = document.querySelector('.input-container button');

btn.addEventListener('click', async function (){
    // make variabel cityName
    const cityName = input.value;
    input.value = '';

    // taking data
    const data = await getData(cityName);
    updateUI(data);
});

// forecast section (event binding)
document.addEventListener('click', async function(e){
    if (e.target.classList.contains('forecast')){
        const data = await getDataForecast();
        console.log(data);
    }
});




function getDataForecast(){
    return fetch('https://api.openweathermap.org/data/2.5/forecast?q=medan&lang=id&units=metric&mode=json&appid=736d300233c8e86a886feabe3ef4b69a&cnt=5')
        .then(response => response.json())
        .then(response => response);
}

function updateUI (data) {
    // taking information that is needed
    const cityName = data.name;
    const iconCode = data.weather[0].icon;
    const main = data.weather[0].main;
    const description = data.weather[0].description;
    const temp = data.main.temp;
    const feelsLike = data.main.feels_like;
    const humidity = data.main.humidity;
    const visibility = data.visibility;
    const pressure = data.main.pressure;
    const windSpeed = data.wind.speed;
    const clouds = data.clouds.all;

    // update UI
    let gridContainerFragment= '';
    let forecastContainerFragment = '';
    gridContainerFragment = `
    <div class="icon-container">
                <h1 data-city="${cityName}" class="cityName">${cityName}</h1>
                <div class="image-container"></div>
                <h2>${main}</h2>
                <p>${description}</p>
            </div>
            <div class="information-container">
                <div class="information">
                    <h2>Suhu</h2>
                    <h1>${Math.round(temp)}°C</h1>
                    <p>terasa seperti ${Math.round(feelsLike)}°C</p>
                </div>
                <div class="information">
                    <h2>Kelembapan Air</h2>
                    <h1>${humidity}</h1>
                    <p>persen(%)</p>
                </div>
                <div class="information">
                    <h2>Jarak Pandang</h2>
                    <h1>${Math.round(visibility/1000)}</h1>
                    <p>km</p>
                </div>
                <div class="information">
                    <h2>Tekanan Udara</h2>
                    <h1>${pressure}</h1>
                    <p>hPa</p>
                </div>
                <div class="information">
                    <h2>Kecepatan Angin</h2>
                    <h1>${Math.round(windSpeed)}</h1>
                    <p>km/j</p>
                </div>
                <div class="information">
                    <h2>Awan</h2>
                    <h1>${clouds}%</h1>
                    <p>menutupi langit</p>
                </div>
            </div>`; 
        forecastContainerFragment += `<h2 class="forecast">lihat ramalan cuaca?</h2>
        <p class="forecast">ramalan harian dan mingguan tersedia</p>`;
        // append fragment to gridContainer and change the display into grid, change the icon
        const gridContainer = document.querySelector('.grid-container');
        gridContainer.style.display = 'grid';
        gridContainer.innerHTML = gridContainerFragment;
        const icon = document.querySelector('.image-container');
        icon.style.backgroundImage = `url(https://openweathermap.org/img/wn/${iconCode}@2x.png)`;
        // append fragment to forecast container
        const forecastContainer = document.querySelector('.forecast-container');
        forecastContainer.innerHTML = forecastContainerFragment;
        forecastContainer.style.display = 'block';
}

function getData (cityName) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=id&units=metric&mode=json&appid=736d300233c8e86a886feabe3ef4b69a`)
        .then(response => response.json())
        .then(response => response);
}