// Fungsi untuk mengambil data sensor dari API
async function fetchSensorData(apiURL) {
    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const sensorData = await response.json();
        return sensorData;
    } catch (error) {
        console.error('Error fetching sensor data:', error);
        return null;
    }
}

// Fungsi untuk memperbarui nilai sensor di halaman web
async function updateSensorValue() {
    const apiEndpoints = [
        'https://sgp1.blynk.cloud/external/api/get?token=-oEfXklH3Nh4UxcmWgBbq_kkIAzTFvF9&v1',
        'https://sgp1.blynk.cloud/external/api/get?token=-oEfXklH3Nh4UxcmWgBbq_kkIAzTFvF9&v2',
        'https://sgp1.blynk.cloud/external/api/get?token=-oEfXklH3Nh4UxcmWgBbq_kkIAzTFvF9&v3',
        'https://sgp1.blynk.cloud/external/api/get?token=-oEfXklH3Nh4UxcmWgBbq_kkIAzTFvF9&v4',
        'https://sgp1.blynk.cloud/external/api/get?token=-oEfXklH3Nh4UxcmWgBbq_kkIAzTFvF9&v5'
    ];

    const sensorDataDiv = document.getElementById('sensorData');
    sensorDataDiv.innerHTML = '';  // Bersihkan elemen sebelumnya

    for (let i = 0; i < apiEndpoints.length; i++) {
        const endpoint = apiEndpoints[i];
        try {
            const sensorData = await fetchSensorData(endpoint);
            if (sensorData !== null) {
                const sensorCard = document.createElement('div');
                sensorCard.className = 'sensor-card';
                sensorCard.innerHTML = `
                    <h2>Jari ${i + 1}</h2>
                    <p>${sensorData}</p>
                `;
                sensorDataDiv.appendChild(sensorCard);
            }
        } catch (error) {
            console.error('Error fetching sensor data:', error);
        }
    }
}

// Panggil fungsi untuk pertama kali
updateSensorValue();

// Atur interval untuk memperbarui nilai sensor setiap 2 detik
setInterval(updateSensorValue, 2000);
