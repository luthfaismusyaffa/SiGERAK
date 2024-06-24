// Fungsi untuk mengambil data dari file JSON lokal
async function fetchData() {
  try {
      const response = await fetch('data.json');
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      updateTable(data);
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

// Fungsi untuk memperbarui tabel dengan data yang diambil
function updateTable(data) {
  const historyDataTbody = document.getElementById('historyData');
  historyDataTbody.innerHTML = ''; // Kosongkan tabel terlebih dahulu

  data.forEach(row => {
      const rowElement = document.createElement('tr');
      row.forEach(cell => {
          const cellElement = document.createElement('td');
          cellElement.textContent = cell;
          rowElement.appendChild(cellElement);
      });
      historyDataTbody.appendChild(rowElement);
  });
}

// Fungsi untuk menyimpan data ke file JSON lokal
async function saveData(sensorData) {
  try {
      const response = await fetch('save-data.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(sensorData)
      });
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
  } catch (error) {
      console.error('Error sending data:', error);
  }
}

// Fungsi untuk menghapus semua data di file JSON lokal
async function deleteAllData() {
  try {
      const response = await fetch('delete-data.php', {
          method: 'POST'
      });
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchData(); // Refresh tabel setelah menghapus data
  } catch (error) {
      console.error('Error deleting data:', error);
  }
}

// Fungsi untuk mengambil data sensor dari Blynk
async function fetchBlynkData() {
  const apiEndpoints = [
      'https://sgp1.blynk.cloud/external/api/get?token=-oEfXklH3Nh4UxcmWgBbq_kkIAzTFvF9&v1',
      'https://sgp1.blynk.cloud/external/api/get?token=-oEfXklH3Nh4UxcmWgBbq_kkIAzTFvF9&v2',
      'https://sgp1.blynk.cloud/external/api/get?token=-oEfXklH3Nh4UxcmWgBbq_kkIAzTFvF9&v3',
      'https://sgp1.blynk.cloud/external/api/get?token=-oEfXklH3Nh4UxcmWgBbq_kkIAzTFvF9&v4',
      'https://sgp1.blynk.cloud/external/api/get?token=-oEfXklH3Nh4UxcmWgBbq_kkIAzTFvF9&v5'
  ];

  try {
      const sensorData = await Promise.all(apiEndpoints.map(async endpoint => {
          const response = await fetch(endpoint);
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          return data;
      }));

      const dataToSend = {
          waktu: new Date().toLocaleString(),
          jari1: sensorData[0],
          jari2: sensorData[1],
          jari3: sensorData[2],
          jari4: sensorData[3],
          jari5: sensorData[4]
      };

      await saveData(dataToSend);
      fetchData(); // Refresh tabel setelah menyimpan data
  } catch (error) {
      console.error('Error fetching Blynk data:', error);
  }
}

// Panggil fungsi untuk mengambil data dan menampilkan riwayat saat halaman dimuat
document.addEventListener('DOMContentLoaded', fetchData);

// Panggil fungsi untuk mengambil data sensor dari Blynk dan menyimpannya ke Google Sheets secara berkala (misalnya setiap 2 detik)
setInterval(fetchBlynkData, 2000);

// Event listener untuk tombol delete
document.getElementById('deleteButton').addEventListener('click', deleteAllData);
