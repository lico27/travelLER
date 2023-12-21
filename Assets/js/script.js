// Make currency dropdown
var startLocation;
var destination;
var startDate;
var endDate;
var searchCriteria = $("#text-criteria")
var dateInputEl = $('#datepicker');

// submit event listener (save search)
// retrieve search info
$("#search-submit").on("click", function (event) {
    event.preventDefault()

    startLocation = $("#start-location").val()
    destination = $("#destination").val()
    startDate = $("#start-date").val()
    endDate = $("#end-date").val()

    console.log(destination)
    console.log(startDate)

    if (startLocation && destination && startDate && endDate) {
        searchCriteria.text("Your holiday to " + destination + " on " + startDate)
    } else {
        searchCriteria.text("Please complete all fields")
    }

    getWeatherForecast(destination);
    getNewsInfo(destination);

    // save search to local storage
})

// event listener to retrieve search
// repopulate the other three cards based on previous search criteria

// event listener to save itinerary to local storage - ROSIE

// event listener to retrieve itinerary from local storage - ROSIE



// Make currency dropdown
let currencies = $("#currencies");
let currencyList = [
    "EUR - Euro",
    "USD - US Dollar",
    "JPY - Japanese Yen",
    "BGN - Bulgarian Lev",
    "CZK - Czech Republic Koruna",
    "DKK - Danish Krone",
    "GBP - British Pound Sterling",
    "HUF - Hungarian Forint",
    "PLN - Polish Zloty",
    "RON - Romanian Leu",
    "SEK - Swedish Krona",
    "CHF - Swiss Franc",
    "ISK - Icelandic Króna",
    "NOK - Norwegian Krone",
    "HRK - Croatian Kuna",
    "RUB - Russian Ruble",
    "TRY - Turkish Lira",
    "AUD - Australian Dollar",
    "BRL - Brazilian Real",
    "CAD - Canadian Dollar",
    "CNY - Chinese Yuan",
    "HKD - Hong Kong Dollar",
    "IDR - Indonesian Rupiah",
    "ILS - Israeli New Sheqel",
    "INR - Indian Rupee",
    "KRW - South Korean Won",
    "MXN - Mexican Peso",
    "MYR - Malaysian Ringgit",
    "NZD - New Zealand Dollar",
    "PHP - Philippine Peso",
    "SGD - Singapore Dollar",
    "THB - Thai Baht",
    "ZAR - South African Rand"
];

for (let i = 0; i < currencyList.length; i++) {
    let eachCurrency = currencyList[i];
    currencies.append("<option>" + eachCurrency + "</option").attr("value", eachCurrency);
}

// Fetch currency data from API
function fetchCurrency(currencyCode) {
    let queryURLCurrency = "https://api.freecurrencyapi.com/v1/currencies?apikey=fca_live_NOCDhLaiS0pA01mLhYHikP55sb2tvwMFcFZ4m0nc&currencies=" + currencyCode + "&base_currency=" + currencyCode;
    fetch(queryURLCurrency)
        .then(function (responseCurrency) {
            return responseCurrency.json();
        }).then(function (dataCurrency) {
            console.log(dataCurrency);
        });
};

// Run functions when form button is clicked
$("#curSubmit").on("click", function (event) {
    event.preventDefault();
    let chosenCurrency = $("#currencies").val();
    currencyCode = chosenCurrency.substring(0, 3);
    console.log(currencyCode);
    fetchCurrency(currencyCode);
    makeCard(chosenCurrency);
});

// Make card with API info
function makeCard(chosenCurrency) {
    let main = $("#main");
    let card = $("<div>");
    card.attr("class", "card col-md-2");
    card.append("<h3>" + chosenCurrency + "</h3>");
    main.append(card);
};



/**************************** Weather API Functions (Fetch & Render) ******************************************/

//I want to get the destination the user provided (#destination) to find the weather for that location
let isToday = true;
const weatherDiv = $('#weather-append');

function getWeatherForecast(destination) {

    weatherDiv.empty();

    let queryURLWeather = "https://api.openweathermap.org/data/2.5/forecast?q=" + destination + "&units=metric&appid=6b4a10c6ed815160709463b2908e2d4d";

    fetch(queryURLWeather)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            console.log(data);

            let apiCity = data.city.name;
            $('#weather-title').text(`Weather for ${apiCity}`);

            let timeTest = data.list[1].dt_txt.substr(11, 2);
            console.log(timeTest);

            for (let i = 0; i < data.list.length; i++) {

                let apiDate = data.list[i].dt_txt.substr(0, 10); //.substr(0, 10) keeps the first 10 characters of the string so from this: 2023-12-18 12:00:00 to this: 2023-12-18
                let properDate = dayjs(`${apiDate}`, `YYYY-MM-DD`).format(`DD/MM/YYYY`); // converts the API date to a different format
                let weatherIcon = `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`;
                let wind = (data.list[i].wind.speed * 2.237).toFixed(2); //the API wind speed is in meters per sec (MPS) so to get MPH = MPS * 2.237
                let temp = data.list[i].main.temp;
                let humidity = data.list[i].main.humidity;
                let time = data.list[i].dt_txt.substr(11, 2); //to obtain the hour from the date text of the API - to use to show only midday forecasts

                if (isToday) { // render the forecast for todays most current time  
                    renderWeather(i, properDate, weatherIcon, temp, wind, humidity);
                    isToday = false;
                } else if (!isToday && (time == 12)) { //then only render 12pm forecasts for dates that aren't today
                    renderWeather(i, properDate, weatherIcon, temp, wind, humidity);
                };
            };
            isToday = true; //after for loop runs, change isToday back to true so when fetchCityForecast() runs again, the today section is rendered

        }).catch(function (error) {
            console.log('incorrect city added');
            //create an alert on html or a modal pop up to alet user to try again
        });

};

function renderWeather(i, properDate, weatherIcon, temp, wind, humidity) {

    const newContainerDiv = $('<div>');
    newContainerDiv.attr({ 'id': `weather-${i}`, 'class': 'my-2 p-2' });
    newContainerDiv.css({ 'background-color': '#304356', 'color': 'white', 'border-radius': '5px' });
    const newH5 = $('<h6>').text(properDate).attr('class', ' mb-0');

    const newImg = $('<img>');
    newImg.attr('src', weatherIcon);
    newImg.css('height', '25px');
    newH5.append(newImg);

    const newDiv = $('<div>');
    newDiv.attr('class', 'row mx-auto');

    const newTemp = $('<p>');
    newTemp.attr('class', 'col-4 mb-0');
    newTemp.css('font-size', '12px');
    newTemp.text(`Temp: ${temp}°c`);

    const newWind = $('<p>');
    newWind.attr('class', 'col-4 mb-0');
    newWind.css('font-size', '12px');
    newWind.text(`Wind: ${wind} MPH`);

    const newHumidity = $('<p>');
    newHumidity.attr('class', 'col-4 mb-0');
    newHumidity.css('font-size', '12px');
    newHumidity.text(`Humidity: ${humidity}%`);

    newDiv.append(newTemp, newWind, newHumidity)

    newContainerDiv.append(newH5, newDiv);
    $('#weather-append').append(newContainerDiv);
};

/************************ End of Weather API Functions (Fetch & Render) ******************************************/


/**************************** News API Functions ******************************************/
let newsDiv = $('#flights-append');

function getNewsInfo(destination) {

    // newsDiv.empty();

    let queryURLNews = "https://gnews.io/api/v4/search?q=" + destination + "&max=10&token=70cdb701813ebdb29d8d18237c3a045e"


    fetch(queryURLNews)
        .then(function (response) {
            return response.json();
        }).then(function (newsData) {
            console.log('News data object:');
            console.log(newsData);
    });
};

/************************ End of News API Functions ******************************************/

// date picker
$(function () {
    $(".datepicker").datepicker({ dateFormat: "dd-mm-yy" });
});




