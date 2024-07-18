import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, remove, set, push } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Firebase configuration for history and rekam medis
const firebaseConfig = {
  apiKey: "AIzaSyDTgz5-fD_cyvb6_OT_Ead6B_0-5Qw9I5c",
  authDomain: "sensor-3aae6.firebaseapp.com",
  databaseURL: "https://sensor-3aae6-default-rtdb.firebaseio.com",
  projectId: "sensor-3aae6",
  storageBucket: "sensor-3aae6.appspot.com",
  messagingSenderId: "258882881201",
  appId: "1:258882881201:web:6622b8b289f0112da94490"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to fetch data from Firebase
async function fetchData() {
  try {
    const dbRef = ref(db, 'data');
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      updateTable(data);
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Function to update table with fetched data
function updateTable(data) {
  const historyDataTbody = document.getElementById('historyData');
  historyDataTbody.innerHTML = '';

  Object.keys(data.jari1).forEach(key => {
    const rowElement = document.createElement('tr');

    const timestamp = data.jari1[key].timestamp;

    const waktuElement = document.createElement('td');
    waktuElement.textContent = formatTime(parseInt(timestamp, 10));
    rowElement.appendChild(waktuElement);

    const jari1Element = document.createElement('td');
    jari1Element.textContent = data.jari1[key].value;
    rowElement.appendChild(jari1Element);

    const jari2Element = document.createElement('td');
    jari2Element.textContent = data.jari2[key].value;
    rowElement.appendChild(jari2Element);

    const jari3Element = document.createElement('td');
    jari3Element.textContent = data.jari3[key].value;
    rowElement.appendChild(jari3Element);

    const jari4Element = document.createElement('td');
    jari4Element.textContent = data.jari4[key].value;
    rowElement.appendChild(jari4Element);

    const jari5Element = document.createElement('td');
    jari5Element.textContent = data.jari5[key].value;
    rowElement.appendChild(jari5Element);

    historyDataTbody.appendChild(rowElement);
  });
}

// Function to convert timestamp to desired time format
function formatTime(seconds) {
  const date = new Date(seconds * 1000);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const secondsFormatted = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${secondsFormatted}`;
}

// Function to delete all data in Firebase
async function deleteAllData() {
  try {
    const dbRef = ref(db, 'data');
    await remove(dbRef);
    fetchData();
  } catch (error) {
    console.error('Error deleting data:', error);
  }
}

// Function to save new data to Firebase
async function saveData(nama, umur, alamat) {
  try {
    const dbRef = ref(db, 'data');
    const snapshot = await get(dbRef);
    
    if (snapshot.exists()) {
      const sensorData = snapshot.val(); // Fetch 'data' from Firebase
      
      // Check if sensorData is defined and has the necessary structure
      if (sensorData && sensorData.jari1 && sensorData.jari2 && sensorData.jari3 && sensorData.jari4 && sensorData.jari5) {
        const rekamMedisRef = ref(db, 'rekam_medis/' + Date.now());
        
        // Save data under rekam_medis
        await set(rekamMedisRef, {
          nama,
          umur,
          alamat,
          sensorData: {  // Store specific sensor data
            jari1: sensorData.jari1,
            jari2: sensorData.jari2,
            jari3: sensorData.jari3,
            jari4: sensorData.jari4,
            jari5: sensorData.jari5
          }
        });
        
        alert('Data berhasil disimpan!');
        redirectToRekamMedis();
      } else {
        alert('Sensor data tidak tersedia untuk disimpan');
      }
    } else {
      alert('Tidak ada data tersedia untuk disimpan');
    }
  } catch (error) {
    console.error('Error saving data:', error);
    alert('Terjadi kesalahan saat menyimpan data.');
  }
}

// Event listener for save button
document.getElementById('saveButton').addEventListener('click', () => {
  document.getElementById('inputForm').style.display = 'block';
});

// Event listener for form submission
document.getElementById('dataForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const nama = document.getElementById('nama').value;
  const umur = document.getElementById('umur').value;
  const alamat = document.getElementById('alamat').value;

  saveData(nama, umur, alamat);
  document.getElementById('inputForm').style.display = 'none';
});

// Call function to fetch data and display history when page loads
document.addEventListener('DOMContentLoaded', fetchData);

// Event listener for delete button
document.getElementById('deleteButton').addEventListener('click', deleteAllData);
