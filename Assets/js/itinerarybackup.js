/**************************** Itinerary Functions ******************************************/


// array for daily activity objects
var dayActivityArray = []


// function to render search into itinerary
function renderItinerary(startDate) {
    var saveItineraryBtn = $("<button>" + Save + "</button>").attr("class", "btn saveItinerary");

    $("#itinerary-card-text").empty()

    var holidayCountdown = $("<p>")

    // dayjs object for date of holiday
    var holidayDate = dayjs(startDate)
    var holidayEndDate = dayjs($("#end-date").val())

    // dayjs object for today
    var today = dayjs().format("YYYY-MM-DD");

    // calculate days until holiday
    // number of days between holiday and today
    var days = holidayDate.diff(today, "days");

    // append the days and destination into a sentence
    holidayCountdown.text(days + " day(s) until your trip to " + $("#destination").val() + "!")
    $("#itinerary-card-text").append(holidayCountdown)

    // calculate length of holiday
    var holidayLength = holidayEndDate.diff(holidayDate, "days")
    console.log(holidayLength)

    // loop through each day of holiday and create an activity box for each
    for (var i = 0; i < holidayLength; i++) {

        var dayBox = $("<div>")

        var dayActivityDiv = $("<div>")
        var dayActivitySpan = $("<span>")
        var dayActivityInput = $("<input>")

        // input for user's plans
        dayActivityInput.attr("placeholder", "Plan your activities here and then hit save")
        dayActivityInput.attr("type", "text")
        dayActivityInput.addClass("day-activity")
        dayActivityInput.attr("id", "Day" + (i + 1))
        // dayActivityInput.addClass("flex-row input-group")

        // section attached to each input box with the day
        dayActivitySpan.text("Day " + (i + 1))
        dayActivitySpan.addClass("input-group-text")

        // add padding between day divs
        dayActivityDiv.addClass("py-3 input-group")

        // append the span and input box to each day's activity div
        dayActivityDiv.append(dayActivitySpan)
        dayActivityDiv.append(dayActivityInput)
        dayActivityDiv.append(saveItineraryBtn)

        // dayBox.append(dayActivityDiv)
        $("#itinerary-card-text").append(dayActivityDiv)

        $("#save-itinerary").on("click", function () {
            // save to local storage

            // get the content for the block
            var text = $(".day-activity").val()
            console.log(text)
            var key = $(".day-activity").attr("id")
            console.log(key)

        })

    }

}



// make an array of all the activity inputs
var activityInputsEl = $(".day-activity")

// event listener to save itinerary to local storage - ROSIE
// $("#save-itinerary").on("click", saveItinerary())



// save the inputs for retrieval
function saveItinerary() { }

// // 'this' refers to the element that called the function (i.e. save button)
// // and is applied to all the save buttons
// // but the console.log will refer to the specific button I clicked
// console.log($(this).siblings(".day-activity").val())

//  // get the content for the block
//  var text = $(this).siblings(".day-activity").val()

//  // ID of the parent block, access via jquery attribute method
//  var key = $(this).parent().attr("id")

//  // then save both to local storage using .setItem
// localStorage.setItem(key, text)
// console.log(localStorage)



function init() {

    // check if there is anything already in local storage
    var storedActivities = JSON.parse(localStorage.getItem("activities"))

    // if activities were retrieved from local storage update the array with them
    if (storedActivities !== null) {
        dayActivityArray = storedActivities
    }

    // render the activities to the itinerary card
    renderItinerary(startDate);

}
