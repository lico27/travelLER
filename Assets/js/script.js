// Fetch currency data from API
function fetchCurrency () {
    let queryURLCurrency = "https://api.freecurrencyapi.com/v1/currencies?apikey=fca_live_NOCDhLaiS0pA01mLhYHikP55sb2tvwMFcFZ4m0nc&currencies=EUR%2CUSD%2CCAD&base_currency=GBP";
    fetch(queryURLCurrency)
        .then(function(responseCurrency){
        return responseCurrency.json();
    }).then(function(dataCurrency){
        console.log(dataCurrency);
});

};

fetchCurrency();