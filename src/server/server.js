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

const parseGeonamesData = (data) => {

    const longitude = data.geonames[0].lng;
    const latitude = data.geonames[0].lat;
    const country = data.geonames[0].countryName;
    const geonamesInfo = {
        longitude: longitude,
        latitude: latitude,
        country: country
    }

    console.log(geonamesInfo);
    return geonamesInfo;
}

const getDarkSkyData = (data, tripInSeconds) => {
    const longitude = data.longitude;
    const latitude = data.latitude;
    const url = `${darkSkyURL}${darkSkyKey}${latitude},${longitude},${tripInSeconds.toString()}${darkSkyExclude}`;

    console.log(url);
    return fetch(url)
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            const summary = data.daily.data[0].summary;
            const icon = data.daily.data[0].icon;
            const highTemp = data.daily.data[0].temperatureHigh;
            const lowTemp = data.daily.data[0].temperatureLow;
            const darkskyInfo = {
                summary: summary,
                icon: icon,
                highTemp: highTemp,
                lowTemp: lowTemp
            }
            return darkskyInfo;
        })
}

const getPixabayData = (data, location) => {
    const clientObject = {
        summary: data.summary,
        icon: data.icon,
        highTemp: data.highTemp,
        lowTemp: data.lowTemp
    }

    return fetch(`${pixabayURL}${pixabayKey}${location}${pixabayParameters}`)
        .then((res) => {
            return res.json()
        })
        .then((newData) => {
            let photoUrl = '';
            const results = newData.hits;

            results.length > 0 ? photoUrl += results[0].webformatURL : photoUrl += '';

            clientObject['photoUrl'] = photoUrl;

            return clientObject;
        })
}

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance

app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));


// Setup Server
const port = 8081;
app.listen(port, () => { console.log(`Server running on port: ${port}`) });

app.get('/', (req, res) => {
    res.sendFile('dist/index.html');
});

app.post('/destination', (req, res) => {
    const data = req.body;

    //parse destination from req object
    let location = data.destination;
    location = location.replace(/\s+/g, '');

    let date = data.departure;
    date = new Date(date)

    const tripInSeconds = date.getTime() / 1000;
    console.log(location, tripInSeconds);

    fetch(`${geonamesURL}${location}${geonamesParameters}${geonamesUsername}`)
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            console.log(data);
            return parseGeonamesData(data);
        })
        .then((geoNamesData) => {
            return getDarkSkyData(geoNamesData, tripInSeconds);
        })
        .then((darkSkyData) => {
            return getPixabayData(darkSkyData, location);
        })
        .then((data) => {
            res.send(data);
        })
        .catch(e => console.log(e));
});