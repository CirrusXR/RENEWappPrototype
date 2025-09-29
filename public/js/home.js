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
    displayGreeting(); // Call displayGreeting after user name is set
}

// Function to display personalized greeting based on time of day
function displayGreeting() {
    const greetingMessageElement = document.getElementById('greetingMessage');
    if (!greetingMessageElement) return;

    const hour = new Date().getHours();
    let greeting = "Hello";

    if (hour < 12) {
        greeting = "Good morning";
    } else if (hour < 18) {
        greeting = "Good afternoon";
    } else {
        greeting = "Good evening";
    }

    greetingMessageElement.textContent = greeting;
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
        // User is out
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
    const liveEnergyTitle = document.getElementById('live-energy-title'); // Get the title element

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
        if (liveEnergyTitle) liveEnergyTitle.textContent = 'Low energy cost now.';
    } else if (status === 'medium') {
        liveEnergyCard.classList.add('pulse-yellow');
        if (homeIcon) homeIcon.classList.add('pulse-yellow');
        if (liveEnergyTitle) liveEnergyTitle.textContent = 'Moderate energy cost.';
    } else if (status === 'high') {
        liveEnergyCard.classList.add('pulse-red');
        if (homeIcon) homeIcon.classList.add('pulse-red');
        if (liveEnergyTitle) liveEnergyTitle.textContent = 'High energy cost.';
    }
}

// Simulate real-time energy updates (replace with actual data fetching)
const costPerKwh = 0.30; // Example: 0.30 Euros per kWh

setInterval(() => {
    const randomKwh = (Math.random() * 2 + 0.5); // Between 0.5 and 2.5
    const cost = (randomKwh * costPerKwh).toFixed(2); // Calculate cost and format to 2 decimal places
    let message = '';
    let status = '';

    if (cost < (1.0 * costPerKwh)) { // Adjusted threshold for low cost
        status = 'low';
        message = 'Best time to use your devices.';
    } else if (cost < (2.0 * costPerKwh)) { // Adjusted threshold for medium cost
        status = 'medium';
        message = 'Consider shifting heavy usage.';
    } else {
        status = 'high';
        message = 'Avoid using non-essential devices.';
    }
    updateLiveEnergy(cost, message, status);
}, 8000); // Update every 8 seconds

// Current Bill Cycle Usage Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const usageToggle = document.getElementById('usageToggle');
    const billCycleValue = document.getElementById('billCycleValue');
    const billCycleUnit = document.getElementById('billCycleUnit');
    const billCycleProgressBar = document.getElementById('billCycleProgressBar');

    // Static values for demonstration
    const currentKwhUsage = 250;
    const currentCostUsage = 75.00; // Example: 250 kWh * $0.30/kWh

    // Max values for progress bar calculation
    const maxKwhUsage = 500; // Example max kWh for the billing period
    const maxCostUsage = 150.00; // Example max cost for the billing period (500 kWh * 0.30 €/kWh)

    function updateBillCycleDisplay() {
        let percentage = 0;
        let currentUsage = 0;
        let maxUsage = 0;

        if (usageToggle.checked) { // If checked, show cost
            currentUsage = currentCostUsage;
            maxUsage = maxCostUsage;
            billCycleValue.textContent = `€${currentUsage.toFixed(2)}`;
            billCycleUnit.textContent = 'Cost';
        } else { // Show kWh
            currentUsage = currentKwhUsage;
            maxUsage = maxKwhUsage;
            billCycleValue.textContent = currentUsage;
            billCycleUnit.textContent = 'kWh';
        }

        percentage = (currentUsage / maxUsage) * 100;
        percentage = Math.min(Math.max(percentage, 0), 100); // Clamp between 0 and 100

        if (billCycleProgressBar) {
            billCycleProgressBar.style.width = `${percentage}%`;
        }
    }

    // Add event listener for the toggle switch
    if (usageToggle) {
        usageToggle.addEventListener('change', updateBillCycleDisplay);
    }

    // Set initial display
    updateBillCycleDisplay();
});
