let currencies = $("#currencies");
let currencyList = [
    "EUR",
    "USD",
    "JPY",
    "BGN",
    "CZK",
    "DKK",
    "GBP",
    "HUF",
    "PLN",
    "RON",
    "SEK",
    "CHF",
    "ISK",
    "NOK",
    "HRK",
    "RUB",
    "TRY",
    "AUD",
    "BRL",
    "CAD",
    "CNY",
    "HKD",
    "IDR",
    "ILS",
    "INR",
    "KRW",
    "MXN",
    "MYR",
    "NZD",
    "PHP",
    "SGD",
    "THB",
    "ZAR",
    ];

// Make currency dropdown
for (let i = 0; i < currencyList.length; i++) {
    let eachCurrency = currencyList[i];
    currencies.append("<option>" + eachCurrency + "</option").attr("value", eachCurrency);
}

// Fetch currency data from API
function fetchCurrency (country) {
    let queryURLCurrency = "https://api.freecurrencyapi.com/v1/currencies?apikey=fca_live_NOCDhLaiS0pA01mLhYHikP55sb2tvwMFcFZ4m0nc&currencies=EUR%2CUSD%2CCAD&base_currency=GBP";
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
    let country = $("#currencies").val();
    console.log(country);
    // fetchCurrency(country);
});

// Make card with API info


