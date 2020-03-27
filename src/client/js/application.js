const postFormData = async (url = '', data = {}) => {
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
        console.log(newData);
        return newData;
    } catch (error) {
        console.log("error", error);
    }
}

const updateUI = (data, departure) => {
    document.getElementById('trip-date').innerHTML = `Date: ${departure}`;
    document.getElementById('summary').innerHTML = `Summary: ${data.summary}`;
    document.getElementById('high-temp').innerHTML = `High Temperature: ${data.highTemp}` + '\u00B0' + 'F.';
    document.getElementById('low-temp').innerHTML = `Low Temperature: ${data.lowTemp}` + '\u00B0' + 'F.';
}

function handleSubmit(evt) {
    evt.preventDefault();

    //retrieve values from form
    let destination = document.getElementById('destination').value;
    let departure = document.getElementById('departure').value;

    postFormData('http://localhost:8081/destination', { destination: destination, departure: departure })
        .then((data) => {
            updateUI(data, departure);
        })
}

export { handleSubmit }