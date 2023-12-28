// Make currency dropdown
var startLocation;
var destination;
var startDate;
var endDate;
var searchCriteria = $("#text-criteria")
var dateInputEl = $('#datepicker');
var currencyMain = $("#currencyMain");
var arrCities = [];
let historySection = $("#history-container");
const weatherDiv = $('#weather-append');
let weatherTitle = $('#weather-title');
let newsTitle = $('#news-title');

// Clear saved and visible search history
$("#btnClearHistory").on("click", function (event) {
    event.preventDefault();
    historySection.empty();
    localStorage.removeItem("cities");
    arrCities = [];
});

// retrieve search info
$("#search-submit").on("click", function (event) {

    event.preventDefault()

    startLocation = $("#start-location").val()
    destination = $("#destination").val()
    startDate = $("#start-date").val()
    endDate = $("#end-date").val()

    console.log(destination)
    console.log(startDate)

    if (destination && startDate && endDate) {
        searchCriteria.text("Your holiday to " + destination + " on " + startDate)
    } else {
        searchCriteria.text("Please complete all fields")
    }

    // Call functions
    getWeatherForecast(destination);
    // getNewsInfo(destination);
    renderItinerary(startDate);
    buildHistory();
})

// Function to save search to local storage and display in search history
function buildHistory() {
    arrCities.push(destination);
    let stringCities = JSON.stringify(arrCities);
    localStorage.setItem("cities", stringCities);
    let storedCity = $("<button>" + destination + "</button>").attr("class", "btn btnHistory").attr("id", destination);
    historySection.prepend(storedCity);

    for (let i = 0; i < arrCities.length; i++) {
        $("#" + destination).on("click", function (event) {
            weatherDiv.empty();
            recallSearches(destination);
        });
    };
};

// event listener to retrieve search from localstorage and display in search history
if (localStorage.getItem("cities")) {
    arrCities = JSON.parse(localStorage.getItem("cities"));

    for (let i = 0; i < arrCities.length; i++) {
        let searchCity = arrCities[i];
        let storedCity = $("<button>" + searchCity + "</button>").attr("class", "btn btnHistory").attr("id", searchCity);
        historySection.prepend(storedCity);

        $("#" + searchCity).on("click", function (event) {
            weatherDiv.empty();
            destination = searchCity;
            recallSearches(destination);
        });
    };
};

// Function to recall previous searches
function recallSearches(destination) {
    getWeatherForecast(destination);
    // getNewsInfo(destination);
    // function to get saved itinerary goes here
};



/**************************** Itinerary Functions ******************************************/


// array for daily activity objects
var dayActivityArray = []


// function to render search into itinerary
function renderItinerary(startDate) {

    // empty the card's previous content
    $("#itinerary-card-text").empty()


    // dayjs object for date of holiday
    var holidayDate = dayjs(startDate)
    var holidayEndDate = dayjs($("#end-date").val())

    // dayjs object for today
    var today = dayjs().format("YYYY-MM-DD");

    // calculate days until holiday (number of days between holiday and today)
    var days = holidayDate.diff(today, "days");

    // append the days and destination into a sentence
    var holidayCountdown = $("<p>")
    holidayCountdown.text(days + " day(s) until your trip to " + $("#destination").val() + "!")
    $("#itinerary-card-text").append(holidayCountdown)


    // calculate length of holiday
    var holidayLength = holidayEndDate.diff(holidayDate, "days")
    // var holidayLength = 5


    // loop through each day of holiday and create an activity div for each,
    // containing a span, input and save button

    for (var i = 0; i < holidayLength; i++) {

        var dayActivityDiv = $("<div>")
        var dayActivitySpan = $("<span>")
        var dayActivityInput = $("<input>")
        var saveItineraryBtn = $("<button>").addClass("saveItinerary")

        // input for user's plans
        dayActivityInput.attr("placeholder", "Plan your activities here and then hit save")
        dayActivityInput.attr("type", "text")
        dayActivityInput.addClass("day-activity")
        dayActivityInput.attr("id", "Day" + (i + 1))

        // add a save icon to each save button 
        // var saveIcon = $("<i>").addClass("far fa-save")
        saveItineraryBtn.text("save")

        // section attached to each input box with the day
        dayActivitySpan.text("Day " + (i + 1))
        dayActivitySpan.addClass("input-group-text")

        // add padding between day divs
        dayActivityDiv.addClass("py-3 input-group d-flex")

        // append the span and input box to each day's activity div
        dayActivityDiv.append(dayActivitySpan)
        dayActivityDiv.append(dayActivityInput)
        dayActivityDiv.append(saveItineraryBtn)

        dayActivityDiv.attr("id", "Day" + (i + 1))

        // dayBox.append(dayActivityDiv)
        $("#itinerary-card-text").append(dayActivityDiv)

    }

    // **************************** save itinerary function ****************************************
    $(".saveItinerary").on("click", saveItinerary)

}

// save the inputs for retrieval
function saveItinerary() {
    // console.log($(this).siblings(".day-activity").val())

    // get the input block content
    var text = $(this).siblings(".day-activity").val()

    // get the ID of the parent block
    var key = $(this).parent().attr("id")

    var itineraryArray = []
    var itineraryObject = {}
    itineraryArray.unshift(itineraryObject)

    // save to object as a key-value pair
    itineraryObject[key] = text

    console.log(itineraryArray)
    // save object to local storage

    localStorage.setItem("itinerary", itineraryArray)
}

// make an array of all the activity inputs
var activityInputsEl = $(".day-activity")

// loop through all the days and get the content from the inputs
function retrieveItinerary() {
    for (i = 0; i < activityInputsEl.length; i++) {

        // // make an array of all the activity inputs
        // var activityInputsEl = $(".day-activity")

        console.log(activityInputsEl[i])

        // the key we want is the ID of the parent (ie the block number)
        // make a variable for key for each
        var keyEl = $(activityInputsEl[i]).parent().attr("id")
        console.log(keyEl)

        // call the content by its key
        localStorage.getItem(keyEl)

        // set the contents of textArea to the content from local storage
        activityInputsEl[i].textContent = localStorage.getItem(keyEl)
    }
}

retrieveItinerary()

$("#clear-itinerary").on("click", clearItinerary)

function clearItinerary(event) {
    console.log("modal works")
    event.preventDefault();
    localStorage.removeItem("itinerary")
    // $("#itinerary-card-text").empty()
    // // localStorage.clear()
    // // localStorage.removeItem(key)

}

/**************************** End of Itinerary Functions ******************************************/

/**************************** Currencies API Functions (Fetch & Render) ******************************************/

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
    let queryURLConversion1 = "https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_NOCDhLaiS0pA01mLhYHikP55sb2tvwMFcFZ4m0nc&currencies=GBP&base_currency=" + currencyCode;
    let queryURLConversion2 = "https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_NOCDhLaiS0pA01mLhYHikP55sb2tvwMFcFZ4m0nc&currencies=" + currencyCode + "&base_currency=GBP";
    fetch(queryURLConversion1)
        .then(function (responseConversion1) {
            return responseConversion1.json();
        }).then(function (dataConversion1) {
            let conversionRate1 = dataConversion1.data.GBP.toFixed(4);

            fetch(queryURLConversion2)
                .then(function (responseConversion2) {
                    return responseConversion2.json();
                }).then(function (dataConversion2) {
                    let conversionRate2 = dataConversion2.data[currencyCode].toFixed(2);

                    let queryURLCurrency = "https://api.freecurrencyapi.com/v1/currencies?apikey=fca_live_NOCDhLaiS0pA01mLhYHikP55sb2tvwMFcFZ4m0nc&currencies=" + currencyCode + "&base_currency=" + currencyCode;
                    fetch(queryURLCurrency)
                        .then(function (responseCurrency) {
                            return responseCurrency.json();
                        }).then(function (dataCurrency) {
                            let currencySymbol = dataCurrency.data[currencyCode].symbol_native;
                            let currencyName = dataCurrency.data[currencyCode].name_plural;
                            makeCard(currencyCode, currencySymbol, currencyName, conversionRate1, conversionRate2);
                        });
                });
        });
};

// Run functions when currencies search button is clicked
$("#curSubmit").on("click", function (event) {
    event.preventDefault();
    currencyMain.empty();
    let chosenCurrency = $("#currencies").val();
    currencyCode = chosenCurrency.substring(0, 3);
    fetchCurrency(currencyCode);
});

// Make currency card with API info
function makeCard(currencyCode, currencySymbol, currencyName, conversionRate1, conversionRate2) {
    let card = $("<div>");
    card.attr("class", "card col-md-2");
    card.attr("id", "currencyCard");
    card.append("<h5>" + "Currency conversion: " + currencyCode + " to GBP" + "</h5>");
    card.append("<p>" + currencySymbol + " 1 is worth £" + conversionRate2 + " today." + "</p>");
    card.append("<p>" + " £ 1 is worth " + conversionRate1 + " " + currencyName + "." + "</p>");
    currencyMain.append(card);
};

/**************************** End of Currencies API Functions (Fetch & Render) ******************************************/

/**************************** Weather API Functions (Fetch & Render) ******************************************/

let firstWeatherDate;
let isToday = true;

//I want to get the destination the user provided (#destination) to find the weather for that location
function getWeatherForecast(destination) {

    weatherDiv.empty();

    let queryURLWeather = "https://api.openweathermap.org/data/2.5/forecast?q=" + destination + "&units=metric&appid=6b4a10c6ed815160709463b2908e2d4d";

    fetch(queryURLWeather)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            console.log(data);

            let apiCity = data.city.name;
            if (destination == 'select') { // if user doesn't select a city, change weather title to 'Weather'
                weatherTitle.text(`Weather`);
            } else {
                weatherTitle.text(`Weather for ${apiCity}`);
            };

            let forecastLength = 0;
            firstWeatherDate = data.list[0].dt_txt.substr(0, 10);

            for (let i = 0; i < data.list.length; i++) {

                let apiDate = data.list[i].dt_txt.substr(0, 10); //.substr(0, 10) keeps the first 10 characters of the string so from this: 2023-12-18 12:00:00 to this: 2023-12-18
                let properDate = dayjs(`${apiDate}`, `YYYY-MM-DD`).format(`DD/MM/YYYY`); // converts the API date to a different format
                let weatherIcon = `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`;
                let wind = (data.list[i].wind.speed * 2.237).toFixed(2); //the API wind speed is in meters per sec (MPS) so to get MPH = MPS * 2.237
                let temp = data.list[i].main.temp;
                let humidity = data.list[i].main.humidity;
                let time = data.list[i].dt_txt.substr(11, 2); //to obtain the hour from the date text of the API - to use to show only midday forecasts

                if (destination == 'select') { // if user doesn't select a city, display an alert
                    const newContainerDiv = $('<div>');
                    newContainerDiv.css({ 'background-color': '#dc3545', 'color': 'white', 'border-radius': '5px', 'padding': '5px', 'text-align': 'center' });
                    const newH6 = $('<h6>').text('Please select a destination to see the forecast').attr('class', ' mb-0');
                    newContainerDiv.append(newH6);
                    $('#weather-append').append(newContainerDiv);
                    i = 40;
                } else if (isToday) { // render the forecast for todays most current time  
                    renderWeather(i, properDate, weatherIcon, temp, wind, humidity);
                    isToday = false;
                    forecastLength++;
                } else if (!isToday && !(apiDate == firstWeatherDate) && (time == 12) && (forecastLength < 5)) { //then only render 12pm forecasts for dates that aren't today and only renders a 5 day forecast
                    renderWeather(i, properDate, weatherIcon, temp, wind, humidity);
                    forecastLength++;
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
    const newH6 = $('<h6>').text(properDate).attr('class', ' mb-0');

    const newImg = $('<img>');
    newImg.attr('src', weatherIcon);
    newImg.css('height', '25px');
    newH6.append(newImg);

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

    newContainerDiv.append(newH6, newDiv);
    $('#weather-append').append(newContainerDiv);
};

/************************ End of Weather API Functions (Fetch & Render) ******************************************/


/**************************** News API Functions (Fetch & Render) ******************************************/
let newsDiv = $('#news-append');

function getNewsInfo(destination) {

    newsDiv.empty();

    let queryURLNews = "https://gnews.io/api/v4/search?q=" + destination + "&country=uk&max=5&token=70cdb701813ebdb29d8d18237c3a045e"// - this is my key
    console.log('queryURLNews:');
    console.log(queryURLNews);

    fetch(queryURLNews)
        .then(function (response) {
            return response.json();
        }).then(function (newsData) {
            console.log('News data object:');
            console.log(newsData);

            if (destination == 'select') { // if user doesn't select a city, change weather title to 'News'
                newsTitle.text(`News`);
            } else {
                newsTitle.text(`News for ${destination}`);
            };

            for (let i = 0; i < newsData.articles.length; i++) {

                let articleTitle = newsData.articles[i].title;
                let apiArticleDate = newsData.articles[i].publishedAt.substr(0, 10); //.substr(0, 10) keeps the first 10 characters of the string so from this: 2023-12-18 12:00:00 to this: 2023-12-18; // i.e. publishedAt: "2023-11-22T05:00:00Z"
                let articleDate = dayjs(`${apiArticleDate}`, `YYYY-MM-DD`).format(`DD/MM/YYYY`); // converts the API date to a different format
                let articleSource = newsData.articles[i].source.name;
                let articleDescription = newsData.articles[i].description;
                let articleLink = newsData.articles[i].url;

                if (destination == 'select') { // if user doesn't select a city, display an alert
                    const newContainerDiv = $('<div>');
                    newContainerDiv.css({ 'background-color': '#dc3545', 'color': 'white', 'border-radius': '5px', 'padding': '5px', 'text-align': 'center' });
                    const newH6 = $('<h6>').text('Please select a destination to see the News').attr('class', ' mb-0');
                    newContainerDiv.append(newH6);
                    $('#news-append').append(newContainerDiv);
                    i = 6;
                } else {
                    renderNewsArticles(i, articleTitle, articleDate, articleSource, articleDescription, articleLink);
                };
            };

        });
};

function renderNewsArticles(i, articleTitle, articleDate, articleSource, articleDescription, articleLink) {

    const newContainerDiv = $('<div>');
    newContainerDiv.attr({ 'id': `news-${i}`, 'class': 'my-2 p-2' });
    newContainerDiv.css({ 'background-color': '#304356', 'color': 'white', 'border-radius': '5px' });
    const newH6 = $('<h6>').text(articleTitle).attr('class', ' mb-0');
    const newPDateSource = $('<p>').text(`${articleDate} - ${articleSource}`).attr('class', ' mb-0 small text-muted');
    const newP = $('<p>').text(articleDescription);
    const newAnchor = $('<a>').text('Click here for full story').attr({'href': `${articleLink}`, 'target':'_blank'});

    newContainerDiv.append(newH6, newPDateSource, newP, newAnchor);
    newsDiv.append(newContainerDiv);
};

/************************ End of News API Functions (Fetch & Render) ******************************************/

// date picker
$(function () {
    $(".datepicker").datepicker({ dateFormat: "yy-mm-dd" });
});



