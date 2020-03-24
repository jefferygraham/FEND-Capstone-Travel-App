/* Global Variables */
const apiKey = '&units=imperial&appid=a5a4bf35aa8908ea93d343892af46b30';
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?zip=';

// Create a new date instance dynamically with JS
const getDate = () => {
    let d = new Date();
    let month = d.toLocaleString('default', { month: 'long' });
    let day = d.getDate();
    let year = d.getFullYear();
    let newDate = `${month} ${day}, ${year}`;
    return newDate;
}

const getWeatherData = async (baseUrl, zip, apiKey) => {
    const res = await fetch(baseUrl + zip + apiKey);
    try {
        const data = await res.json();
        return data;
    }
    catch (error) {
        console.log("error", error);
    }
}

const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        // Body data type must match "Content-Type" header        
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log("error", error);
    }
}

const updateUI = async () => {
    try {
        const req = await fetch('/all');
        const allData = await req.json();
        document.getElementById('date').innerHTML = `On ${allData[0].date}:`;
        document.getElementById('temp').innerHTML = 'It was ' + allData[0].temp + '\u00B0' + 'F.';
        document.getElementById('content').innerHTML = `You felt: ${allData[0].content}`;
    }
    catch (error) {
        console.log(error)
    }
}

document.getElementById('generate').addEventListener('click', performAction);

function performAction(e) {
    const content = document.getElementById('feelings').value;
    const zip = document.getElementById('zip').value;
    getWeatherData(baseUrl, zip, apiKey)
        .then((data) => {
            let temp = data.main.temp;
            let entry = { temp: temp, content: content, date: getDate() };
            postData('/addEntry', entry);
        })
        .then(() => {
            updateUI();
        })
}






