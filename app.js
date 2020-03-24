// Setup empty JS object to act as endpoint for all routes
const projectData = {};
const allEntries = [];
// Require Express to run server and routes
const express = require('express');
// Start up an instance of app
const cors = require('cors');
const app = express();
/* Middleware*/
const bodyParser = require('body-parser');


//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance

app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));


// Setup Server
const port = 3000;
app.listen(port, () => { console.log(`Server running on port: ${port}`) });

//Routes
app.get('/all', (req, res) => {
    res.send(allEntries);
});

app.post('/addEntry', (req, res) => {
    let data = req.body;
    let newEntry = {
        temp: data.temp,
        content: data.content,
        date: data.date,
    }
    allEntries.unshift(newEntry);
})