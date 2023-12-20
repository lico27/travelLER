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
function fetchCurrency (currencyCode) {
    let queryURLCurrency = "https://api.freecurrencyapi.com/v1/currencies?apikey=fca_live_NOCDhLaiS0pA01mLhYHikP55sb2tvwMFcFZ4m0nc&currencies=" + currencyCode + "&base_currency=" + currencyCode;
    fetch(queryURLCurrency)
        .then(function(responseCurrency){
        return responseCurrency.json();
    }).then(function(dataCurrency){
        console.log(dataCurrency);
});
};

// Run functions when form button is clicked
$("#curSubmit").on("click", function(event) {
    event.preventDefault();
    let chosenCurrency = $("#currencies").val();
    currencyCode = chosenCurrency.substring(0,3);
    console.log(currencyCode);
    fetchCurrency(currencyCode);
    makeCard(chosenCurrency);
});

// Make card with API info
function makeCard (chosenCurrency, currencySymbol) {
    let main = $("#main");
    let card = $("<div>");
    card.attr("class", "card col-md-2");
    card.append("<h4>" + chosenCurrency + "</h4>");
    card.append("<p>" + currencySymbol + "1 = £??" + "</p>");
    main.append(card);
};
