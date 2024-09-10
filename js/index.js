const API_KEY = "f9dd32e2110c4c129e3165857240909";

//forcast url = "https://api.weatherapi.com/v1/forecast.json?key=f9dd32e2110c4c129e3165857240909&q=london&days=3&aqi=no&alerts=no";

//search url = "https://api.weatherapi.com/v1/search.json?key=f9dd32e2110c4c129e3165857240909&q=london";





//get weather in current location
navigator.geolocation.getCurrentPosition(async (position) => {
    const currentUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${position.coords.latitude},${position.coords.longitude}&days=3&aqi=no&alerts=no`;

    const localData = await getWeatherData(currentUrl);
    displayWeather(localData);

});


// selectFromSearchedTarget("london");


// fetch weather data for London

async function getWeatherData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;

    } catch (error) {
        console.warn("Error fetching weather data:", error);
        return null;
    }
}

// fetch weather data for a given city
const searchField = document.querySelector("#searchIP");
const options = document.querySelector("#options");
searchField.blur(() => {
    const city = searchField.value.trim().toLowerCase();
    selectFromSearchedTarget(city);
})

searchField.addEventListener("keypress", event => {
    if (event.key == 'Enter') {
        const city = searchField.value;
        selectFromSearchedTarget(city);
    }
});

searchField.addEventListener("input", () => {
    if(!options.classList.contains("d-none")) {
        searchField.placeholder = "Search by city/country/state name . . .";
        options.classList.add("d-none");
        //remove first child in options
        const firstOption = options.firstElementChild;
        options.removeChild(firstOption);
    }
});

async function searchCity(city) {
    const searchUrl = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${city}`;
    const response = await fetch(searchUrl);
    const searchData = await response.json();

    if (searchData.length > 0) {
        return searchData;
    } else {
        return null;
    }
}

async function selectFromSearchedTarget(city) {
    const targets = await searchCity(city);
    if (targets && targets.length === 1) {
        const lat = targets[0].lat;
        const lon = targets[0].lon;
        const targetCord = `${lat},${lon}`;
        const currentUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${targetCord}&days=3&aqi=no&alerts=no`;
        const targetData = await getWeatherData(currentUrl);
        displayWeather(targetData);
    } else if (targets && targets.length >= 1) {
        displaySearchoptions(targets, city);
    } else {
        alert("No cities found.");
    }
}

function displaySearchoptions(targets, city) {
    const wrapper = document.createElement("div");

    
    
    for (let index = 0; index < targets.length; index++) {
        const target = targets[index];

        const ip = document.createElement("input");
        ip.type = "radio";
        ip.name = target.region;
        ip.id = target.id
        ip.value = target.lat + "," + target.lon;
        ip.classList.add("d-none")
        wrapper.appendChild(ip);

        const label = document.createElement("label");
        label.innerText = target.region;
        label.for = target.id;
        label.classList.add("option", "border-0", "form-control");
        wrapper.appendChild(label);
        label.addEventListener("click", async (event) => {
            searchField.value = ip.name;
            const targetUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${ip.value}&days=3&aqi=no&alerts=no`;
            const data = await getWeatherData(targetUrl);
            displayWeather(data);
            options.classList.add("d-none");
            options.removeChild(wrapper);
            wrapper.innerHTML = '';
            searchField.placeholder = "Search by city/country/state name . . .";
        });
        
    searchField.value = "";
    searchField.placeholder = `Too much results for ${city}! Please, choose one`;
    }

    // targets.foreach(target => {
    //     const wrapper = document.createElement("div");

    //     const ip = document.createElement("input");
    //     ip.type = "radio";
    //     ip.name = target.region;
    //     ip.id = target.id
    //     ip.value = target.lat + "," + target.lon;
    //     ip.classList.add("d-none")
    //     wrapper.appendChild(ip);
    //     ip.addEventListener("click", async (event) => {
    //         searchField.value = ip.name;
    //         const targetUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${ip.value}&days=3&aqi=no&alerts=no`;
    //         const data = await getWeatherData(targetUrl);
    //         displayWeather(data);
    //         options.classList.add("d-none");
    //     });

    //     const label = document.createElement("label");
    //     label.innerText = target.region;
    //     label.for = target.id;
    //     label.classList.add("option", "border-0", "form-control");
    //     wrapper.appendChild(label);
    // });
    options.appendChild(wrapper);
    options.classList.remove("d-none");
}




function displayWeather(data) {
    dipslayDay1(data);
    displayOtherdayes(2, data.forecast.forecastday);
    displayOtherdayes(3, data.forecast.forecastday);
}
function dipslayDay1(data) {
    const todaysDate = new Date(data.current.last_updated);
    const tempEveryHour = data.forecast.forecastday[0].hour;
    let weatherData = `<div class=" fs-4 w-100 d-flex justify-content-around">
                        <p><b>${todaysDate.toDateString()}</b></p>
                        </div>
                    <div class="fs-1 mt-2 text-center">
                        <h1>${data.location.country}</h1>
                        <img class = "w-100" src="${data.current.condition.icon}" alt="">
                        <p>${data.current.condition.text}</p>
                        <p><b>${data.current.temp_c}°C</b></p>
                        <p>Humidity: ${data.current.humidity}%</p>
                        <p>Wind: ${data.current.wind_kph} km/h</p>
                    </div>`;


    const day1 = document.querySelector("#day1");
    day1.innerHTML = weatherData;

    const tempsInTheDay = document.createElement('div');
    tempsInTheDay.classList.add("d-flex", "justify-content-center", "my-3", "w-100", "flex-wrap");
    for (let index = 0; index < tempEveryHour.length; index++) {
        if ((index) % 3 === 0) {
            const hour = new Date(tempEveryHour[index].time);

            tempsInTheDay.innerHTML += `<div class="text-center mx-5 my-3 fs-5">
            <p>${hour.getHours().toString().padStart(2, "0")} : ${hour.getMinutes().toString().padStart(2, "0")}</p>
            <p><b>${tempEveryHour[index].temp_c}°C</b></p>
            </div>`;
        }

    }
    day1.appendChild(tempsInTheDay);
}
function displayOtherdayes(day, data) {

    const targetData = data[day - 1];


    const target_date = new Date(targetData.date);

    const weatherData = `<div class=" fs-4 w-100 d-flex justify-content-around">
                        <p><b>${target_date.toDateString()}</b></p>
                    </div>
                    <div class="fs-4 text-center d-flex justify-content-around align-items-center w-75">
                        <img src="${targetData.day.condition.icon}" alt="">
                        <h4>${targetData.day.condition.text}</h4>
                    </div>
                    <div class = "fs-4 d-flex justify-content-around w-75">
                        <p>Max : ${targetData.day.maxtemp_c}° C</p>
                        <p>Min : ${targetData.day.mintemp_c}° C</p>
                    </div>
                    <div class="fs-4 text-center">
                        <p>Avg : ${targetData.day.avgtemp_c}° C</p>
                    </div>`;

    const targetDay = document.querySelector(`#day${day}`);

    targetDay.innerHTML = weatherData;
}