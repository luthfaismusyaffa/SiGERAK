const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;
const dataFilePath = path.join(__dirname, 'data.json');

app.use(express.static('public'));

// Fungsi untuk mengambil data dari Blynk
const getBlynkData = async () => {
    const blynkToken = '-oEfXklH3Nh4UxcmWgBbq_kkIAzTFvF9'; // Token Blynk Anda
    const urls = [
        `https://sgp1.blynk.cloud/external/api/get?token=${blynkToken}&v1`,
        `https://sgp1.blynk.cloud/external/api/get?token=${blynkToken}&v2`,
        `https://sgp1.blynk.cloud/external/api/get?token=${blynkToken}&v3`,
        `https://sgp1.blynk.cloud/external/api/get?token=${blynkToken}&v4`,
        `https://sgp1.blynk.cloud/external/api/get?token=${blynkToken}&v5`
    ];

    try {
        const responses = await Promise.all(urls.map(url => axios.get(url)));
        const data = responses.map(response => response.data);
        const timestamp = new Date().toISOString(); // Tambahkan timestamp
        console.log('Fetched Blynk data:', { timestamp, data }); // Tambahkan log ini

        // Simpan data ke file setiap kali mendapatkan data baru
        saveDataToFile({ timestamp, data });

        return { timestamp, data };
    } catch (error) {
        console.error('Error fetching data from Blynk', error);
        return null;
    }
};

// Fungsi untuk menyimpan data ke file JSON
const saveDataToFile = (data) => {
    fs.readFile(dataFilePath, 'utf8', (err, fileData) => {
        let jsonData = [];
        if (!err && fileData) {
            try {
                jsonData = JSON.parse(fileData);
                if (!Array.isArray(jsonData)) {
                    jsonData = [];
                }
            } catch (error) {
                console.error('Error parsing JSON data from file', error);
            }
        }
        jsonData.push(data);
        console.log('Saving data to file:', jsonData); // Tambahkan log ini
        fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Error writing data to file', err);
            }
        });
    });
};

// Ambil data dari Blynk setiap detik dan simpan ke file
setInterval(async () => {
    const blynkData = await getBlynkData();
    if (blynkData) {
        // saveDataToFile(blynkData);  // Data sudah disimpan di dalam getBlynkData
    }
}, 1000); // Ambil data setiap detik (1000 milidetik)

app.get('/history', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, fileData) => {
        if (err) {
            console.error('Error reading data from file', err);
            res.status(500).json({ error: 'Error reading data from file' });
        } else {
            try {
                const jsonData = JSON.parse(fileData);
                console.log('Data from file:', jsonData); // Tambahkan log ini
                if (!Array.isArray(jsonData)) {
                    res.status(500).json({ error: 'Data format is not correct' });
                } else {
                    res.json(jsonData);
                }
            } catch (error) {
                console.error('Error parsing JSON data from file', error);
                res.status(500).json({ error: 'Error parsing JSON data from file' });
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
