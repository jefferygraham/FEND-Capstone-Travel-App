const dotenv = require('dotenv');
dotenv.config();

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const cors = require('cors');
const app = express();

/* Middleware*/
const bodyParser = require('body-parser');

//For fetch requests
const fetch = require("node-fetch");

//Geonames API URL & parameters
const geonamesURL = 'http://api.geonames.org/searchJSON?q=';
const geonamesParameters = '&maxRows=10&fuzzy=0.8&';
const geonamesUsername = `username=${process.env.GEONAMES_USERNAME}`;

//Dark Sky API Data
const darkSkyURL = 'https://api.darksky.net/forecast/';
const darkSkyKey = `${process.env.DARKSKY_KEY}/`;
const darkSkyExclude = '?exclude=currently,minutely,hourly,alerts,flags';

//Pixabay URL
const pixabayURL = 'https://pixabay.com/api/?key=';
const pixabayKey = `${process.env.PIXABAY_KEY}&q=`;
const pixabayParameters = '&image_type=photo';

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance

app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));


// Setup Server
const port = 8080;
app.listen(port, () => { console.log(`Server running on port: ${port}`) });

app.get('/', (req, res) => {
    res.sendFile('dist/index.html');
});

app.post('/destination', (req, res) => {
    let data = req.body;
    console.log(data);
    //parse destination from req object
    let location = data.destination;
    location = location.replace(/\s+/g, '');

    let date = data.departure;
    date = new Date(date)
    let tripInSeconds = date.getTime() / 1000;
    console.log(location, tripInSeconds);

    fetch(`${geonamesURL}${location}${geonamesParameters}${geonamesUsername}`)
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            let longitude = data.geonames[0].lng;
            let latitude = data.geonames[0].lat;
            let country = data.geonames[0].countryName;

            let geonamesInfo = {
                longitude: longitude,
                latitude: latitude,
                country: country
            }
            return geonamesInfo;
        })
        .then((geoNamesData) => {
            const longitude = geoNamesData.longitude;
            const latitude = geoNamesData.latitude;

            let now = new Date();
            let nowInSeconds = now.getTime() / 1000;

            let url = `${darkSkyURL}${darkSkyKey}${latitude},${longitude}${darkSkyExclude}`;
            const secondsInAWeek = 604800;

            (tripInSeconds - nowInSeconds) < secondsInAWeek ? url += `${darkSkyURL}${darkSkyKey}${latitude},${longitude}${darkSkyExclude}` : url += `${darkSkyURL}${darkSkyKey}${latitude},${longitude}${darkSkyExclude},${tripInSeconds.toString()}`;

            return fetch(url)
                .then((res) => {
                    return res.json()
                })
                .then((data) => {
                    const summary = data.daily.summary;
                    const icon = data.daily.icon;
                    let darkskyInfo = {
                        summary: summary,
                        icon: icon
                    }
                    return darkskyInfo;
                })
        })
        .then((darkSkyData) => {
            fetch(`${pixabayURL}${pixabayKey}${location}${pixabayParameters}`)
                .then((res) => {
                    return res.json()
                })
                .then((data) => {
                    console.log(data.hits[0].webformatURL);
                })
        })

});