// Use a function to simulate data fetching
function fetchData() {
    // Simulate random data for demonstration
    const currentUsage = Math.floor(Math.random() * 100) + 1;
    const userUsage = Math.floor(Math.random() * 250) + 50;
    const averageUsage = 150; // A fixed average for comparison

    // Update the display with the new data
    updateDashboard(currentUsage, userUsage, averageUsage);
}

function updateDashboard(currentUsage, userUsage, averageUsage) {
    // Get the HTML elements
    const currentUsageValue = document.getElementById('currentUsageValue');
    const currentUsageBar = document.getElementById('currentUsageBar');
    const myUsageBar = document.getElementById('myUsageBar');
    const averageUsageBar = document.getElementById('averageUsageBar');
    const myUsageLabel = document.getElementById('myUsageLabel');
    const averageUsageLabel = document.getElementById('averageUsageLabel');
    const tipBox = document.getElementById('tipBox');
    const tipText = document.getElementById('tipText');

    // Set the usage values
    currentUsageValue.textContent = currentUsage;
    myUsageLabel.textContent = `${userUsage} kWh`;
    averageUsageLabel.textContent = `${averageUsage} kWh`;

    // Calculate the bar widths
    // For the current usage bar, a max value of 100 is assumed
    let currentUsageWidth = (currentUsage / 100) * 100;
    if (currentUsageWidth > 100) currentUsageWidth = 100;

    // For comparison bars, find the max of the two values to set the scale
    const maxUsage = Math.max(userUsage, averageUsage) * 1.2; // Add a buffer for better visualization
    const myUsageWidth = (userUsage / maxUsage) * 100;
    const averageUsageWidth = (averageUsage / maxUsage) * 100;

    // Update the widths of the bars
    currentUsageBar.style.width = `${currentUsageWidth}%`;
    averageUsageBar.style.width = `${averageUsageWidth}%`;

    // --- Dynamic Color Logic for the Usage Bars ---
    // Remove any previous color classes
    myUsageBar.classList.remove('bg-amber-500', 'bg-green-500');

    // Apply a new color based on the comparison
    if (userUsage > averageUsage) {
        myUsageBar.classList.add('bg-amber-500'); // Change color to a warning color
    } else {
        myUsageBar.classList.add('bg-green-500'); // Use a positive color
    }

    // --- Dynamic Tips ---
    const tips = [
        "Switch to energy-saving light bulbs to reduce electricity consumption.",
        "Unplug electronics when not in use to prevent phantom energy drain.",
        "Take shorter showers to save water and energy.",
        "Use a programmable thermostat to optimize heating and cooling.",
        "Walk or bike instead of driving for short distances."
    ];

    // Randomly select a tip
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    tipText.textContent = randomTip;

    // Make the tip box visible with a fade-in effect
    setTimeout(() => {
        tipBox.classList.remove('opacity-0');
        tipBox.classList.add('opacity-100');
    }, 500);
}

// Fetch data initially and then every 5 seconds
fetchData();
setInterval(fetchData, 5000);
