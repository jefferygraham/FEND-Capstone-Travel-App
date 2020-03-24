const userName = 'grahamj78';

function handleSubmit(evt) {
    fetch(`http://api.geonames.org/citiesJSON?north=44.1&south=-9.9&east=-22.4&west=55.2&lang=de&username=${userName}`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            const countryCode = data.geonames[0].countrycode;
            document.getElementById('country-code').innerHTML = countryCode;
        })
}

export { handleSubmit }