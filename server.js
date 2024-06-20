const express = require('express');
const mysql = require('mysql');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3001;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // ganti dengan username MySQL Anda
    password: '', // kosongkan jika tidak ada password
    database: 'data_sensor' // ganti dengan nama database Anda
});

connection.connect(error => {
    if (error) {
        console.error('Error connecting to the database:', error);
        return;
    }
    console.log('Connected to the MySQL database.');
});

async function fetchDataFromBlynk() {
    try {
        const responses = await Promise.all([
            axios.get('https://sgp1.blynk.cloud/external/api/get?token=-oEfXklH3Nh4UxcmWgBbq_kkIAzTFvF9&v1'),
            axios.get('https://sgp1.blynk.cloud/external/api/get?token=-oEfXklH3Nh4UxcmWgBbq_kkIAzTFvF9&v2'),
            axios.get('https://sgp1.blynk.cloud/external/api/get?token=-oEfXklH3Nh4UxcmWgBbq_kkIAzTFvF9&v3'),
            axios.get('https://sgp1.blynk.cloud/external/api/get?token=-oEfXklH3Nh4UxcmWgBbq_kkIAzTFvF9&v4'),
            axios.get('https://sgp1.blynk.cloud/external/api/get?token=-oEfXklH3Nh4UxcmWgBbq_kkIAzTFvF9&v5')
        ]);

        const data = responses.map(response => response.data);

        const query = 'INSERT INTO sensor_data (time, jari1, jari2, jari3, jari4, jari5) VALUES (NOW(), ?, ?, ?, ?, ?)';
        connection.query(query, data, (error, results) => {
            if (error) {
                console.error('Error inserting data into the database:', error);
                return;
            }
            console.log('Data inserted into the database:', results);
        });
    } catch (error) {
        console.error('Error fetching data from Blynk:', error);
    }
}

// Fetch data every minute
setInterval(fetchDataFromBlynk, 60000);

app.get('/api/history', (req, res) => {
    connection.query('SELECT * FROM sensor_data ORDER BY time DESC', (error, results) => {
        if (error) {
            console.error('Error fetching data from the database:', error);
            res.status(500).send('Error fetching data from the database.');
            return;
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
