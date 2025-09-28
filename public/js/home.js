import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvuIx_o7Ud5estJ9dtzb3d3B4fCWRFm1g",
  authDomain: "renewapp-new.firebaseapp.com",
  projectId: "renewapp-new",
  storageBucket: "renewapp-new.firebasestorage.app",
  messagingSenderId: "1067131425741",
  appId: "1:1067131425741:web:714763cc8965013431ea84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to display user's name
async function displayUserName(firstName) {
    const userNameDisplay = document.getElementById('userNameDisplay');
    if (userNameDisplay) {
        userNameDisplay.textContent = firstName || 'User';
    }
}

// Listen for authentication state changes
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in
        let firstName = 'User'; // Default name

        if (user.displayName) {
            // If displayName exists, use the first part as first name
            firstName = user.displayName.split(' ')[0];
        } else {
            // Try to fetch from Firestore if displayName is not set
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                if (userData.firstName) {
                    firstName = userData.firstName;
                }
            }
        }
        displayUserName(firstName);
    } else {
        // User is signed out
        displayUserName('User');
        // Optionally redirect to login page if not already there
        // window.location.href = 'index.html';
    }
});

// Live Energy Usage functions
function updateLiveEnergy(kwh, message, status) {
    const energyKwhElement = document.getElementById('energy-kwh');
    const energyMessageElement = document.getElementById('energy-message');
    const liveEnergyCard = document.getElementById('live-energy-card');
    const homeIcon = document.getElementById('homeIcon'); // Get the home icon element

    if (energyKwhElement) energyKwhElement.textContent = kwh;
    if (energyMessageElement) energyMessageElement.textContent = message;

    // Remove existing pulse classes from both the card and the icon
    liveEnergyCard.classList.remove('pulse-green', 'pulse-yellow', 'pulse-red');
    if (homeIcon) {
        homeIcon.classList.remove('pulse-green', 'pulse-yellow', 'pulse-red');
    }

    // Add new pulse class based on status to both the card and the icon
    if (status === 'low') {
        liveEnergyCard.classList.add('pulse-green');
        if (homeIcon) homeIcon.classList.add('pulse-green');
    } else if (status === 'medium') {
        liveEnergyCard.classList.add('pulse-yellow');
        if (homeIcon) homeIcon.classList.add('pulse-yellow');
    } else if (status === 'high') {
        liveEnergyCard.classList.add('pulse-red');
        if (homeIcon) homeIcon.classList.add('pulse-red');
    }
}

// Simulate real-time energy updates (replace with actual data fetching)
setInterval(() => {
    const randomKwh = (Math.random() * 2 + 0.5).toFixed(1); // Between 0.5 and 2.5
    let message = '';
    let status = '';

    if (randomKwh < 1.0) {
        status = 'low';
        message = 'Low energy cost now. Best time to use your devices.';
    } else if (randomKwh < 2.0) {
        status = 'medium';
        message = 'Moderate energy cost. Consider shifting heavy usage.';
    } else {
        status = 'high';
        message = 'High energy cost. Avoid using non-essential devices.';
    }
    updateLiveEnergy(randomKwh, message, status);
}, 5000); // Update every 5 seconds

// Current Bill Cycle Usage Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const usageToggle = document.getElementById('usageToggle');
    const billCycleValue = document.getElementById('billCycleValue');
    const billCycleUnit = document.getElementById('billCycleUnit');

    // Static values for demonstration
    const currentKwhUsage = 250;
    const currentCostUsage = 75.00; // Example: 250 kWh * $0.30/kWh

    function updateBillCycleDisplay() {
        if (usageToggle.checked) { // If checked, show cost
            billCycleValue.textContent = `$${currentCostUsage.toFixed(2)}`;
            billCycleUnit.textContent = 'Cost';
        } else { // Show kWh
            billCycleValue.textContent = currentKwhUsage;
            billCycleUnit.textContent = 'kWh';
        }
    }

    // Add event listener for the toggle switch
    if (usageToggle) {
        usageToggle.addEventListener('change', updateBillCycleDisplay);
    }

    // Set initial display
    updateBillCycleDisplay();
});
