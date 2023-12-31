var startLocation;
var destination;
var startDate;
var endDate;
var searchCriteria = $("#text-criteria");
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

    event.preventDefault();

    startLocation = $("#start-location").val();
    destination = $("#destination").val();
    startDate = $("#start-date").val();
    endDate = $("#end-date").val();


    if ((destination == 'select') || (startDate == '') || (endDate == '')) {
        $("#select-info").modal('show');
        return;
    } else if (startDate > endDate) {
        $("#select-correct-dates").modal('show');
        return;
    } else {
        searchCriteria.text("Your holiday to " + destination + " on " + startDate);
        showInfo();
    };

    // Call functions
    getWeatherForecast(destination);
    getNewsInfo(destination);
    renderItinerary(startDate);
    buildHistory(destination);
})

// function to remove 'display:hidden' on info divs
function showInfo() {
    $('#weather-currency-div').removeClass("hideSection").addClass("showSection");
    $('#news-div').removeClass("hideSection").addClass("showSection");
    $('#itinerary-div').removeClass("hideSection").addClass("showSection");
}

// Function to save search to local storage and display in search history
function buildHistory(destination) {

    if (arrCities.includes(destination) || destination == 'select') { // to prevent duplication of search history button or creating a button if the user doesn't select a destination
        return;
    } else {
        arrCities.push(destination);
        let stringCities = JSON.stringify(arrCities);
        localStorage.setItem("cities", stringCities);
        let storedCity = $("<button>" + destination + "</button>").attr({ "class": "btn btnHistory", "data-destination": `${destination}` });
        historySection.prepend(storedCity);
    }
};

// event listener to retrieve search from localstorage and display in search history
if (localStorage.getItem("cities")) {
    arrCities = JSON.parse(localStorage.getItem("cities"));

    for (let i = 0; i < arrCities.length; i++) {
        let searchCity = arrCities[i];
        let storedCity = $("<button>" + searchCity + "</button>").attr({ "class": "btn btnHistory", "data-destination": `${searchCity}` });
        historySection.prepend(storedCity);
    };
};

// bring up the city info when a search history button is clicked
historySection.on('click', '.btnHistory', function (event) {
    let target = event.target.dataset.destination;
    showInfo();
    recallSearches(target);
});

// Function to recall previous searches
function recallSearches(destination) {
    getWeatherForecast(destination);
    getNewsInfo(destination);
    retrieveItinerary(destination)
};

/**************************** Date Picker ******************************************/

$(function () {
    function highlightRange(date) {
        var startDate = $("#start-date").datepicker("getDate");
        var endDate = $("#end-date").datepicker("getDate");

        if (startDate != null && endDate != null && date >= startDate && date <= endDate) {
            return [true, "highlight", "Vacation"];
        }

        return [true, "", ""];
    }

    $("#start-date").datepicker({
        minDate: -1,
        dateFormat: "yy-mm-dd",
        firstDay: 1 // start the week on Mon
    });

    $("#end-date").datepicker({

        maxDate: "+12M",
        dateFormat: "yy-mm-dd",
        firstDay: 1 // start the week on Mon
    });

    // highlight the selected date period
    $("#start-date, #end-date").datepicker("option", "beforeShowDay", highlightRange);

})

/**************************** End of Date Picker ******************************************/


/**************************** Itinerary Functions ******************************************/


// array for daily activity objects
var dayActivityArray = [];

// function to render search into itinerary
function renderItinerary(startDate) {
        if (destination == 'select') { // if user doesn't select a city, change card title to 'My Itinerary'
        $("#itinerary-title").text("My itinerary");
    } else {
        $("#itinerary-title").text("My " + destination + " itinerary")
    };

    // empty the card's previous content
    $("#itinerary-card-text").empty();

    // dayjs object for date of holiday
    var holidayDate = dayjs(startDate);
    var holidayEndDate = dayjs($("#end-date").val());

    // dayjs object for today
    var today = dayjs().format("YYYY-MM-DD");

    // calculate days until holiday (number of days between holiday and today)
    var days = holidayDate.diff(today, "days");

    // append the days and destination into a sentence
    var holidayCountdown = $("<p>");
    holidayCountdown.text(`${days} day(s) until your trip to ${destination}!`);

    $("#itinerary-card-text").append(holidayCountdown);

    // calculate length of holiday
    var holidayLength = holidayEndDate.diff(holidayDate, "days");

    renderInputs(holidayLength)

    // **************************** save itinerary function ****************************************
    $(".saveItinerary").on("click", saveItinerary)

}


function renderInputs(number) {

    // loop through each day of holiday and create an activity div for each,
    // containing a span, input and save button

    for (var i = 0; i < number; i++) {

        var dayActivityDiv = $("<div>").addClass("itineraryDay py-3 input-group d-flex me-2")
        var dayActivitySpan = $("<span>")
        var dayActivityInput = $("<input>")
        var saveItineraryBtn = $("<button>").addClass("saveItinerary input-group-text rounded-end fit-content")

        // input for user's plans
        dayActivityInput.attr("placeholder", "Plan your activities here and save")
        dayActivityInput.attr("type", "text")
        dayActivityInput.addClass("day-activity w-auto border-light p-1 px-3 flex-grow-1")
        dayActivityInput.attr("id", "Day" + (i + 1))
        dayActivityInput.addClass("Day" + (i + 1))

        // add a save icon to each save button 
        var saveIcon = $("<i>").addClass("far fa-save");
        saveItineraryBtn.append(saveIcon);

        // section attached to each input box with the day
        dayActivitySpan.text("Day " + (i + 1));
        dayActivitySpan.addClass("input-group-text");

        // ID to be used for local storage
        dayActivityDiv.attr("id", "Day" + (i + 1));

        // append the span, input box and save button to each day's activity div
        dayActivityDiv.append(dayActivitySpan, dayActivityInput, saveItineraryBtn);

        // dayBox.append(dayActivityDiv)
        $("#itinerary-card-text").append(dayActivityDiv);
    }

}

// parent object equal to what's in local storage, else create a new object
var itineraryObject;

// save the inputs for retrieval
function saveItinerary() {

    // get the input block content
    var text = $(this).siblings(".day-activity").val();

    // get the ID of the parent block
    var key = $(this).parent().attr("id");

    // parent object equal to what's in local storage, else create a new object
    itineraryObject = JSON.parse(localStorage.getItem(destination)) || {}

    // child object
    var dayActivityObject = {};

    // save to object as a key-value pair
    dayActivityObject[key] = text;

    // add the object to the array
    dayActivityArray.push(dayActivityObject)

    // create a parent object containing the city name and the itinerary array
    itineraryObject.array = dayActivityArray

    localStorage.setItem(destination, JSON.stringify(itineraryObject))

}

// make an array of all the activity inputs
var activityInputsEl = $(".day-activity");


function retrieveItinerary(destination) {

    // empty the card's previous content
    $("#itinerary-card-text").empty()
    $("#itinerary-title").text("My " + destination + " itinerary")

    var itinerary = JSON.parse(localStorage.getItem(destination))

    renderInputs(itinerary.array.length)

    for (i = 0; i < itinerary.array.length; i++) {

        var dayID = Object.keys(itinerary.array[i])[0]

        var inputEl = document.querySelector("." + dayID)

        var day = itinerary.array[i]
        inputEl.value = day[dayID]
    }

    $(".saveItinerary").on("click", saveItinerary)
}

$("#clear-itinerary").on("click", clearItinerary);

function clearItinerary(event) {
    event.preventDefault();
    localStorage.removeItem(destination)
    $("#itinerary-card-text").empty()
    itineraryObject = {}
}

/**************************** End of Itinerary Functions ***********************************************/

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
            let conversionRate1 = dataConversion1.data.GBP.toFixed(2);

            fetch(queryURLConversion2)
                .then(function (responseConversion2) {
                    return responseConversion2.json();
                }).then(function (dataConversion2) {
                    let conversionRate2 = dataConversion2.data[currencyCode].toFixed(4);

                    let queryURLCurrency = "https://api.freecurrencyapi.com/v1/currencies?apikey=fca_live_NOCDhLaiS0pA01mLhYHikP55sb2tvwMFcFZ4m0nc&currencies=" + currencyCode + "&base_currency=" + currencyCode;
                    fetch(queryURLCurrency)
                        .then(function (responseCurrency) {
                            return responseCurrency.json();
                        }).then(function (dataCurrency) {
                            let currencySymbol = dataCurrency.data[currencyCode].symbol_native;
                            let currencyName = dataCurrency.data[currencyCode].name_plural;
                            makeCard(currencyCode, currencySymbol, currencyName, conversionRate1, conversionRate2);
                        }).catch(function (error) {
                            $("#api-error").modal('show');
                        });
                });
        }).catch(function (error) {
            $("#api-error").modal('show');
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
    card.attr({ "id": "currencyCard" });
    card.append("<h5>" + "Currency conversion: " + currencyCode + " to GBP" + "</h5>");
    card.append("<p>" + currencySymbol + " 1 is worth £" + conversionRate1 + " today." + "</p>");
    card.append("<p>" + " £ 1 is worth " + conversionRate2 + " " + currencyName + "." + "</p>");
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
            $("#api-error").modal('show');
        });

};

function renderWeather(i, properDate, weatherIcon, temp, wind, humidity) {

    const newContainerDiv = $('<div>');
    newContainerDiv.attr({ 'id': `weather-${i}`, 'class': 'my-2 p-2' });
    newContainerDiv.css({ 'background-color': '#7fc9cb', 'color': '#212241', 'border-radius': '5px' });
    const newH6 = $('<h6>').text(properDate).attr('class', ' mb-0  p-1');

    const newImg = $('<img>');
    newImg.attr('src', weatherIcon);
    newImg.css('height', '25px');
    newH6.append(newImg);

    const newDiv = $('<div>');
    newDiv.attr('class', 'row mx-auto');

    const newTemp = $('<p>');
    newTemp.attr('class', 'col-4 mb-0 p-1');
    newTemp.css('font-size', '12px');
    newTemp.text(`Temp: ${temp}°c`);

    const newWind = $('<p>');
    newWind.attr('class', 'col-4 mb-0 p-1');
    newWind.css('font-size', '12px');
    newWind.text(`Wind: ${wind} MPH`);

    const newHumidity = $('<p>');
    newHumidity.attr('class', 'col-4 mb-0 p-1');
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

    // change format passed to query URL for destination names that have dashes in them
    let apiDestination
    if (destination.includes('-')) {
        apiDestination = `%22${destination}%22`;
    } else {
        apiDestination = destination;

    }

    let queryURLNews = "https://gnews.io/api/v4/search?q=" + apiDestination + "&country=uk&lang=en&max=5&token=70cdb701813ebdb29d8d18237c3a045e"// - this is my key 

    fetch(queryURLNews)
        .then(function (response) {
            return response.json();
        }).then(function (newsData) {

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

        }).catch(function (error) {
            $("#api-error").modal('show');
        });
};

function renderNewsArticles(i, articleTitle, articleDate, articleSource, articleDescription, articleLink) {

    const newContainerDiv = $('<div>');
    newContainerDiv.attr({ 'id': `news-${i}`, 'class': 'my-2 p-3' });
    newContainerDiv.css({ 'background-color': '#7fc9cb', 'color': '#212241', 'border-radius': '5px' });
    const newH6 = $('<h6>').text(articleTitle).attr('class', ' mb-0');
    const newPDateSource = $('<p>').text(`${articleDate} - ${articleSource}`).attr('class', ' mb-2 small text-secondary py-1').css({ 'font-size': '12px' });
    const newP = $('<p>').text(articleDescription).attr('class', ' mb-0').css('font-size', '12px');
    const newAnchor = $('<a>').text('Click here for full story').attr({ 'href': `${articleLink}`, 'target': '_blank' }).css({ 'color': 'white', 'font-size': '12px' });

    newContainerDiv.append(newH6, newPDateSource, newP, newAnchor);
    newsDiv.append(newContainerDiv);
};

/************************ End of News API Functions (Fetch & Render) ******************************************/
