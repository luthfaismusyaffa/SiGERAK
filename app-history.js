// Fungsi untuk memperbarui nilai sensor di halaman history
async function fetchAndUpdateHistory() {
    const apiEndpoints = [
        'https://sgp1.blynk.cloud/external/api/get?token=-oEfXklH3Nh4UxcmWgBbq_kkIAzTFvF9&v1',
        'https://sgp1.blynk.cloud/external/api/get?token=-oEfXklH3Nh4UxcmWgBbq_kkIAzTFvF9&v2',
        'https://sgp1.blynk.cloud/external/api/get?token=-oEfXklH3Nh4UxcmWgBbq_kkIAzTFvF9&v3',
        'https://sgp1.blynk.cloud/external/api/get?token=-oEfXklH3Nh4UxcmWgBbq_kkIAzTFvF9&v4',
        'https://sgp1.blynk.cloud/external/api/get?token=-oEfXklH3Nh4UxcmWgBbq_kkIAzTFvF9&v5'
    ];

    const historyDataTbody = document.getElementById('historyData');
    const waktuLokal = new Date().toLocaleString();

    try {
        // Ambil data dari setiap endpoint
        const sensorData = await Promise.all(apiEndpoints.map(async (endpoint, index) => {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        }));

        // Buat baris baru untuk setiap waktu
        const row = document.createElement('tr');
        const waktuCell = document.createElement('td');
        waktuCell.textContent = waktuLokal;
        row.appendChild(waktuCell);

        // Loop untuk menambahkan nilai sensor ke dalam baris yang sama
        sensorData.forEach((data, index) => {
            const dataCell = document.createElement('td');
            dataCell.textContent = data;
            row.appendChild(dataCell);
        });

        // Tambahkan baris ke dalam tabel
        historyDataTbody.appendChild(row);

    } catch (error) {
        console.error('Error fetching and updating history:', error);
    }
}

// Panggil fungsi untuk pertama kali
fetchAndUpdateHistory();

// Atur interval untuk memperbarui nilai sensor setiap 2 detik (2000 ms)
setInterval(fetchAndUpdateHistory, 2000);
