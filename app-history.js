// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, remove, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Your web app's Firebase configuration
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
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, 'data'));
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

// Function to convert timestamp to desired time format in Jakarta timezone
function formatTime(seconds) {
  const date = new Date(seconds * 1000); // Convert seconds to milliseconds
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    second: 'numeric', 
    timeZone: 'Asia/Jakarta' 
  };
  return date.toLocaleString('id-ID', options); // Format for Indonesian locale and Jakarta timezone
}

// Function to update table with fetched data
function updateTable(data) {
  const historyDataTbody = document.getElementById('historyData');
  historyDataTbody.innerHTML = ''; // Clear the table first

  Object.keys(data.jari1).forEach(key => {
    const rowElement = document.createElement('tr');
    
    const waktuElement = document.createElement('td');
    waktuElement.textContent = formatTime(parseInt(key, 10)); // Format the timestamp
    rowElement.appendChild(waktuElement);

    const jari1Element = document.createElement('td');
    jari1Element.textContent = data.jari1[key];
    rowElement.appendChild(jari1Element);

    const jari2Element = document.createElement('td');
    jari2Element.textContent = data.jari2[key];
    rowElement.appendChild(jari2Element);

    const jari3Element = document.createElement('td');
    jari3Element.textContent = data.jari3[key];
    rowElement.appendChild(jari3Element);

    const jari4Element = document.createElement('td');
    jari4Element.textContent = data.jari4[key];
    rowElement.appendChild(jari4Element);

    const jari5Element = document.createElement('td');
    jari5Element.textContent = data.jari5[key];
    rowElement.appendChild(jari5Element);

    historyDataTbody.appendChild(rowElement);
  });
}

// Function to delete all data in Firebase
async function deleteAllData() {
  try {
    const dbRef = ref(db, 'data');
    await remove(dbRef);
    fetchData(); // Refresh the table after deleting data
  } catch (error) {
    console.error('Error deleting data:', error);
  }
}

// Call function to fetch data and display history when page loads
document.addEventListener('DOMContentLoaded', fetchData);

// Event listener for delete button
document.getElementById('deleteButton').addEventListener('click', deleteAllData);
