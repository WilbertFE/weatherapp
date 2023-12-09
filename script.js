
// get data when button clicked
const btn = document.querySelector('.input-container button');

btn.addEventListener('click', async function (){
    // taking data
    const input = document.querySelector('.input-container input');
    try {
    const data = await getData(input.value);
    input.value = '';
    updateUI(data);
    } catch(err){
        input.value = '';
        alert(err); 
    }
});

// daily & weekly forecast section (event binding)
document.addEventListener('click', async function(e){
    if (e.target.classList.contains('forecast')){
        try {
        const data = await getDataForecast(e.target.dataset.city);
        updateUIForecast(data);
        updateUIForecastWeekly(data);
        } catch (err) {
            alert(err);
        }
    }
});

function getData (cityName) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=id&units=metric&mode=json&appid=736d300233c8e86a886feabe3ef4b69a`)
        .then(response => {
            if (!response.ok){
                if (response.statusText === 'Bad Request'){
                    throw new Error('Tolong Isi Nama Kota Dengan Benar!');
                } else if (response.statusText === 'Not Found'){
                    throw new Error('Kota Tidak Ditemukan');
                } else {
                    throw new Error(response.statusText + ' (ada kesalahan pada sistem)');
                }
            }
            return response.json();
        })
        .then(response => response);
}

function getDataForecast(cityName){
    return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&lang=id&units=metric&mode=json&appid=736d300233c8e86a886feabe3ef4b69a&cnt=40`)
        .then(response => {
            if (!response.ok){
                throw new Error(response.statusText + ' (ada kesalahan pada sistem)');
            }
            return response.json();
        })
        .then(response => response);
}

function updateUI (data) {
    // update UI
    let gridContainerFragment= '';
    let forecastContainerFragment = '';
    gridContainerFragment = `
    <div class="icon-container">
                <h1>${data.name}</h1>
                <div class="image-container"></div>
                <h2>${data.weather[0].main}</h2>
                <p>${data.weather[0].description}</p>
            </div>
            <div class="information-container">
                <div class="information">
                    <h2>Suhu</h2>
                    <h1>${Math.round(data.main.temp)}°C</h1>
                    <p>terasa seperti ${Math.round(data.main.feels_like)}°C</p>
                </div>
                <div class="information">
                    <h2>Kelembapan Air</h2>
                    <h1>${data.main.humidity}</h1>
                    <p>persen(%)</p>
                </div>
                <div class="information">
                    <h2>Jarak Pandang</h2>
                    <h1>${Math.round(data.visibility/1000)}</h1>
                    <p>km</p>
                </div>
                <div class="information">
                    <h2>Tekanan Udara</h2>
                    <h1>${data.main.pressure}</h1>
                    <p>hPa</p>
                </div>
                <div class="information">
                    <h2>Kecepatan Angin</h2>
                    <h1>${Math.round(data.wind.speed)}</h1>
                    <p>km/j</p>
                </div>
                <div class="information">
                    <h2>Awan</h2>
                    <h1>${data.clouds.all}%</h1>
                    <p>menutupi langit</p>
                </div>
            </div>`; 
        forecastContainerFragment += `<h2 class="forecast" data-city="${data.name}">lihat ramalan cuaca?</h2>
        <p class="forecast" data-city="${data.name}">ramalan harian dan mingguan tersedia</p>`;
        // append fragment to gridContainer and change the display into grid, change the icon
        const gridContainer = document.querySelector('.grid-container');
        gridContainer.classList.add('gContainer');
        gridContainer.innerHTML = gridContainerFragment;
        const icon = document.querySelector('.image-container');
        icon.style.backgroundImage = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;
        // append fragment to forecast container
        const forecastContainer = document.querySelector('.forecast-container');
        forecastContainer.innerHTML = forecastContainerFragment;
        forecastContainer.classList.remove('fContainer');
        forecastContainer.style.display = 'block';
}

function updateUIForecast(data){
    let dailyForecastFragments = '';
    let dailyForecastFragment = '';
    for (let i=0; i<9; i++){
        dailyForecastFragment += `
        <div class="hourly-forecast">
            <h4>${data.list[i].dt_txt}</h4>
            <h4>${data.city.name}</h4>
            <img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" alt="weather.png">
            <h3>${Math.round(data.list[i].main.feels_like)}°C</h3>
            <p>${data.list[i].weather[0].description}</p>
        </div>
        `;
    }
    dailyForecastFragments = `<h2 class="daily-forecast-text">ramalan harian (24 jam)</h2> <div class="daily-forecast">${dailyForecastFragment}</div> <h2 class="weekly-forecast-text">ramalan mingguan (setiap jam 12)</h2> <div class="weekly-forecast"></div>`;
    // append element
    const forecastContainer = document.querySelector('.forecast-container');
    forecastContainer.classList.add('fContainer');
    forecastContainer.innerHTML = dailyForecastFragments;
}

function updateUIForecastWeekly(data){
    let fragment = '';
    for (let i=0; i<data.list.length; i++){
        if (data.list[i].dt_txt.includes('12:00')){
            fragment += `
            <div class="twelve-forecast">
                <h4>${data.list[i].dt_txt}</h4>
                <h4>${data.city.name}</h4>
                <img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" alt="weather.png">
                <h3>${Math.round(data.list[i].main.feels_like)}°C</h3>
                <p>${data.list[i].weather[0].description}</p>
            </div>
            `;
        }
    }
    // append element
    const container = document.querySelector('.weekly-forecast');
    container.innerHTML = fragment;
}
