// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Firebase configuration for rekam medis
const firebaseConfigRekamMedis = {
  apiKey: "AIzaSyDTgz5-fD_cyvb6_OT_Ead6B_0-5Qw9I5c",
  authDomain: "sensor-3aae6.firebaseapp.com",
  databaseURL: "https://sensor-3aae6-default-rtdb.firebaseio.com",
  projectId: "sensor-3aae6",
  storageBucket: "sensor-3aae6.appspot.com",
  messagingSenderId: "258882881201",
  appId: "1:258882881201:web:6622b8b289f0112da94490"
};

// Initialize Firebase
const appRekamMedis = initializeApp(firebaseConfigRekamMedis, 'rekamMedis');
const dbRekamMedis = getDatabase(appRekamMedis);

// Function to fetch rekam medis data from Firebase
async function fetchRekamMedisData() {
  try {
    const dbRef = ref(dbRekamMedis, 'rekam_medis');
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      updateRekamMedisTable(data);
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error('Error fetching rekam medis data:', error);
  }
}

// Function to update rekam medis section with fetched data
function updateRekamMedisTable(data) {
    const rekamMedisContainer = document.getElementById('rekamMedisData');
    rekamMedisContainer.innerHTML = ''; // Clear existing content

    Object.keys(data).forEach(key => {
        const record = data[key];
        const sensorData = record.sensorData;

        // Create a new table for each record
        const tableElement = document.createElement('table');
        const theadElement = document.createElement('thead');
        const tbodyElement = document.createElement('tbody');

        // Create table header (only add once per group of records)
        const headerRow = document.createElement('tr');
        if (theadElement.childElementCount === 0) { // Ensure header is added only once
            headerRow.innerHTML = `
                <th>Nama</th>
                <th>Umur</th>
                <th>Alamat</th>
                <th>Waktu</th>
                <th>Jari 1</th>
                <th>Jari 2</th>
                <th>Jari 3</th>
                <th>Jari 4</th>
                <th>Jari 5</th>
                <th>Keterangan</th>
                <th>Delete</th>
            `;
            theadElement.appendChild(headerRow);
            tableElement.appendChild(theadElement);
        }

        // Create table rows with data
        Object.keys(sensorData.jari1).forEach((sensorKey, index) => {
            const rowElement = document.createElement('tr');

            // Populate row with record data (add nama, umur, alamat only in the first row)
            if (index === 0) {
                rowElement.innerHTML = `
                    <td rowspan="${Object.keys(sensorData.jari1).length}">${record.nama}</td>
                    <td rowspan="${Object.keys(sensorData.jari1).length}">${record.umur}</td>
                    <td rowspan="${Object.keys(sensorData.jari1).length}">${record.alamat}</td>
                    <td>${formatTime(parseInt(sensorData.jari1[sensorKey].timestamp, 10))}</td>
                    <td>${sensorData.jari1[sensorKey].value}</td>
                    <td>${sensorData.jari2[sensorKey].value}</td>
                    <td>${sensorData.jari3[sensorKey].value}</td>
                    <td>${sensorData.jari4[sensorKey].value}</td>
                    <td>${sensorData.jari5[sensorKey].value}</td>
                    <td>${calculateStatus(
                        sensorData.jari1[sensorKey].value,
                        sensorData.jari2[sensorKey].value,
                        sensorData.jari3[sensorKey].value,
                        sensorData.jari4[sensorKey].value,
                        sensorData.jari5[sensorKey].value
                    )}</td>
                    <td rowspan="${Object.keys(sensorData.jari1).length}"><button onclick="deleteRecord('${key}')">Delete</button></td>
                `;
            } else {
                // For other rows, only display sensor data
                rowElement.innerHTML = `
                    <td>${formatTime(parseInt(sensorData.jari1[sensorKey].timestamp, 10))}</td>
                    <td>${sensorData.jari1[sensorKey].value}</td>
                    <td>${sensorData.jari2[sensorKey].value}</td>
                    <td>${sensorData.jari3[sensorKey].value}</td>
                    <td>${sensorData.jari4[sensorKey].value}</td>
                    <td>${sensorData.jari5[sensorKey].value}</td>
                    <td>${calculateStatus(
                        sensorData.jari1[sensorKey].value,
                        sensorData.jari2[sensorKey].value,
                        sensorData.jari3[sensorKey].value,
                        sensorData.jari4[sensorKey].value,
                        sensorData.jari5[sensorKey].value
                    )}</td>
                `;
            }

            tbodyElement.appendChild(rowElement);
        });

        // Append table to container
        tableElement.appendChild(tbodyElement);
        rekamMedisContainer.appendChild(tableElement);
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
  
  // Function to calculate status based on finger values
  function calculateStatus(jari1, jari2, jari3, jari4, jari5) {
    const average = (jari1 + jari2 + jari3 + jari4 + jari5) / 5;
    if (average < 15) {
      return "Masih dalam kategori stroke";
    } else {
      return "Menuju kondisi normal";
    }
  }
  
  // Function to delete a record
  async function deleteRecord(recordKey) {
    try {
      const dbRef = ref(dbRekamMedis, `rekam_medis/${recordKey}`);
      await remove(dbRef);
      console.log("Record deleted successfully");
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  }
  
  // Call function to fetch and display rekam medis data when page loads
  document.addEventListener('DOMContentLoaded', fetchRekamMedisData);
  