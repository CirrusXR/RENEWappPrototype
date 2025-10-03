console.log("home.js script started.");
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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

// Get references to the HTML elements
const logoutBtn = document.getElementById('logout-btn');
const dynamicHomeGreeting = document.getElementById('dynamicHomeGreeting');
const homeUserNameDisplay = document.getElementById('homeUserNameDisplay');

// Function to display personalized greeting based on time of day for the home page
function displayHomeGreeting(firstName) {
    if (!dynamicHomeGreeting) {
        return;
    }

    const hour = new Date().getHours();
    let greeting = "Hello";

    if (hour < 12) {
        greeting = "Good morning";
    } else if (hour < 18) {
        greeting = "Good afternoon";
    } else if (hour < 22) {
        greeting = "Good evening";
    } else {
        greeting = "Good night";
    }

    dynamicHomeGreeting.textContent = greeting;
    if (homeUserNameDisplay) {
        homeUserNameDisplay.textContent = firstName || 'User';
    }
}

// Listen for authentication state changes
onAuthStateChanged(auth, async (user) => {
    console.log("onAuthStateChanged fired. User:", user);
    if (user) {
        console.log("User is signed in. User UID:", user.uid);
        console.log("User displayName:", user.displayName);
        let firstName = 'User'; // Default name

        if (user.displayName) {
            firstName = user.displayName.split(' ')[0];
            console.log("User displayName found from auth:", firstName);
        }

        // Re-enable Firestore fetch for more complete profile data
        try {
            console.log("navigator.onLine:", navigator.onLine);
            if (!navigator.onLine) {
                console.log("Client is offline. Skipping Firestore fetch.");
            } else {
                console.log("Attempting Firestore fetch for user document.");
                const userDocRef = doc(db, "users", user.uid);
                console.log("Firestore document path:", userDocRef.path);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    if (userData.firstName) {
                        firstName = userData.firstName;
                        console.log("User firstName from Firestore:", firstName);
                    } else {
                        console.log("Firestore document exists, but no firstName field.");
                    }
                } else {
                    console.log("User document does not exist in Firestore for UID:", user.uid);
                }
            }
        } catch (error) {
            console.error("Error fetching user document from Firestore:", error.code, error.message);
        }
        displayHomeGreeting(firstName);

    }
    else {
        console.log("User is signed out. Redirecting to index.html");
        window.location.href = "index.html";
    }
});

// Logout functionality
logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log("User signed out successfully.");
        window.location.href = "index.html";
    }).catch((error) => {
        // An error happened.
        console.error("Error signing out: ", error);
        alert("Error signing out. Please try again.");
    });
});

// Dummy data and functions for the home page elements
// These would ideally be fetched from Firestore or other services

document.addEventListener('DOMContentLoaded', () => {
    // Bill Cycle Usage Toggle
    const usageToggle = document.getElementById('usageToggle');
    const billCycleValue = document.getElementById('billCycleValue');
    const billCycleUnit = document.getElementById('billCycleUnit');

    usageToggle.addEventListener('change', () => {
        if (usageToggle.checked) {
            billCycleValue.textContent = "€50.00"; // Example cost
            billCycleUnit.textContent = "€";
            billCycleValue.classList.remove('text-primary-green');
            billCycleValue.classList.add('text-accent-yellow');
        }
        else {
            billCycleValue.textContent = "250"; // Example kWh
            billCycleUnit.textContent = "kWh";
            billCycleValue.classList.remove('text-accent-yellow');
            billCycleValue.classList.add('text-primary-green');
        }
    });

    // Live Energy Usage Card Pulsating Effect
    const liveEnergyCard = document.getElementById('live-energy-card');
    const energyKwh = document.getElementById('energy-kwh');
    const energyMessage = document.getElementById('energy-message');
    const homeIcon = document.getElementById('homeIcon');
    const liveEnergyTitle = document.getElementById('live-energy-title');

    // Simulate live data updates
    setInterval(() => {
        const currentUsage = (Math.random() * 2 + 0.5).toFixed(1); // Between 0.5 and 2.5
        energyKwh.textContent = currentUsage;

        // Update card style based on usage
        liveEnergyCard.classList.remove('pulse-green', 'pulse-yellow', 'pulse-red');
        homeIcon.classList.remove('text-primary-green', 'text-accent-yellow', 'text-accent-red');
        energyKwh.classList.remove('text-primary-green', 'text-accent-yellow', 'text-accent-red');
        liveEnergyTitle.classList.remove('text-primary-green', 'text-accent-yellow', 'text-accent-red');

        if (currentUsage < 1.0) {
            liveEnergyCard.classList.add('pulse-green');
            homeIcon.classList.add('text-primary-green');
            energyKwh.classList.add('text-primary-green');
            liveEnergyTitle.classList.add('text-primary-green');
            liveEnergyTitle.textContent = "Energy cost is low";
            energyMessage.innerHTML = "Best time to use your devices.";
        } else if (currentUsage < 2.0) {
            liveEnergyCard.classList.add('pulse-yellow');
            homeIcon.classList.add('text-accent-yellow');
            energyKwh.classList.add('text-accent-yellow');
            liveEnergyTitle.classList.add('text-accent-yellow');
            liveEnergyTitle.textContent = "Energy cost is moderate";
            energyMessage.innerHTML = "Consider using high-energy devices later.";
        } else {
            liveEnergyCard.classList.add('pulse-red');
            homeIcon.classList.add('text-accent-red');
            energyKwh.classList.add('text-accent-red');
            liveEnergyTitle.classList.add('text-accent-red');
            liveEnergyTitle.textContent = "Energy cost is high";
            energyMessage.innerHTML = "Avoid using high-energy devices now.";
        }
    }, 5000); // Update every 5 seconds
});
