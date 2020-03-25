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
const geonamesUsername = `username=${process.env.USER_NAME}`

//Dark Sky API Data
const darkSkyURL = 'https://api.darksky.net/forecast/';
const darkSkyKey = `${process.env.DARKSKY_KEY}/`;

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
    let seconds = date.getTime() / 1000;
    console.log(location, seconds);

    fetch(`${geonamesURL}${location}${geonamesParameters}${geonamesUsername}`)
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            let longitude = data.geonames[0].lng;
            let latitude = data.geonames[0].lat;
            let country = data.geonames[0].countryName;

            let darkSkyInfo = {
                longitude: longitude,
                latitude: latitude,
                country: country
            }
            return darkSkyInfo;
        })
        .then((darkSkyData) => {
            const longitude = darkSkyData.longitude;
            const latitude = darkSkyData.latitude;
            return fetch(`${darkSkyURL}${darkSkyKey}${latitude},${longitude}`)
                .then((res) => {
                    return res.json()
                })
                .then((data) => {
                    console.log(data);
                })
        })
});