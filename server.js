const express = require('express');
const mysql = require('mysql');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3001;

// Konfigurasi koneksi MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Ganti dengan username MySQL Anda
    password: '', // Kosongkan jika tidak ada password
    database: 'data_sensor' // Ganti dengan nama database Anda
});

// Middleware untuk parse application/json
app.use(bodyParser.json());

// Koneksi ke MySQL
connection.connect(error => {
    if (error) {
        console.error('Error connecting to the database:', error);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Fungsi untuk mengambil data dari Blynk dan menyimpan ke MySQL
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

// Fetch data from Blynk every minute
setInterval(fetchDataFromBlynk, 2000);

// Endpoint to get history data from MySQL
// Endpoint to get history data from MySQL
app.get('/api/history', (req, res) => {
    connection.query('SELECT * FROM sensor_data ORDER BY time DESC', (error, results) => {
        if (error) {
            console.error('Error fetching data from the database:', error);
            res.status(500).json({ error: 'Error fetching data from the database.' });
            return;
        }
        res.json(results);
    });
});


// Serve static files (history.html and style.css)
app.use(express.static('public'));

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
