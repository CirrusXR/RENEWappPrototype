window.onload = function() {
    // State variables
    let currentUnit = 'kwh';
    let currentTimeframe = 'daily';
    // Use a fixed date for reliable mock data presentation
    let currentDate = new Date('2025-09-02T12:00:00'); 
    
    // Get the HTML elements
    const toggleSwitch = document.getElementById('toggle-switch');
    const totalValueElement = document.getElementById('total-value');
    const totalLabelElement = document.getElementById('total-label');
    const costLabel = document.getElementById('cost-label');
    const kwhLabel = document.getElementById('kwh-label');
    const dateLabel = document.getElementById('date-label');
    const prevPeriodLabel = document.getElementById('prev-period-label');
    const prevPeriodValue = document.getElementById('prev-period-value');
    const prevBar = document.getElementById('prev-bar');
    const currentPeriodLabel = document.getElementById('current-period-label');
    const currentPeriodValue = document.getElementById('current-period-value');
    const currentBar = document.getElementById('current-bar');
    const comparisonText = document.getElementById('comparison-text');
    const timeToggleGroup = document.getElementById('time-toggle-group');
    const prevDateBtn = document.getElementById('prev-date-btn');
    const nextDateBtn = document.getElementById('next-date-btn');
    const totalCostEl = document.getElementById('total-cost');
    const costPerKwhEl = document.getElementById('cost-per-kwh');
    const projectedCostEl = document.getElementById('projected-cost');
    const chartCanvas = document.getElementById('usage-chart');
    const ctx = chartCanvas.getContext('2d');
    
    let usageChart = null; 

    // Unit info for display
    const unitInfo = {
        cost: { symbol: '€', label: 'Cost' },
        kwh: { symbol: 'kWh', label: 'kWh' }
    };

    // Data for categories and top users
    const categoryData = {
        heating: [
            { name: 'Immersion Heater', kwh: 3.5, icon: 'flame', colorClass: 'text-accent-red' },
            { name: 'Radiator', kwh: 2.1, icon: 'flame', colorClass: 'text-accent-red' },
            { name: 'Electric Blanket', kwh: 0.5, icon: 'bed', colorClass: 'text-accent-yellow' },
        ],
        cooling: [
            { name: 'Air Conditioner', kwh: 4.2, icon: 'snowflake', colorClass: 'text-rebot-blue' },
            { name: 'Portable Fan', kwh: 0.1, icon: 'zap', colorClass: 'text-rebot-blue' },
            { name: 'Dehumidifier', kwh: 0.8, icon: 'droplets', colorClass: 'text-secondary-gray' },
        ],
        lighting: [
            { name: 'Living Room Lights', kwh: 0.3, icon: 'zap', colorClass: 'text-accent-yellow' },
            { name: 'Kitchen Lights', kwh: 0.2, icon: 'zap', colorClass: 'text-accent-yellow' },
            { name: 'Outdoor Lights', kwh: 0.5, icon: 'zap', colorClass: 'text-accent-yellow' },
        ],
        entertainment: [
            { name: 'Television', kwh: 0.6, icon: 'tv-2', colorClass: 'text-primary-green' },
            { name: 'Gaming Console', kwh: 1.2, icon: 'gamepad-2', colorClass: 'text-rebot-blue' },
            { name: 'Stereo System', kwh: 0.4, icon: 'speaker', colorClass: 'text-primary-green' },
        ],
        appliances: [
            { name: 'Refrigerator', kwh: 1.5, icon: 'microwave', colorClass: 'text-secondary-gray' },
            { name: 'Washing Machine', kwh: 2.0, icon: 'microwave', colorClass: 'text-rebot-blue' },
            { name: 'Dishwasher', kwh: 1.8, icon: 'microwave', colorClass: 'text-rebot-blue' },
        ],
    };

    const topUsersList = document.getElementById('top-users-list');
    const categoryButtons = document.querySelectorAll('.category-button');

    /**
     * Renders the list of top energy users for a given category.
     * @param {string} category The category key (e.g., 'heating').
     */
    function renderTopUsers(category) {
        topUsersList.innerHTML = ''; 
        const users = categoryData[category] || [];
        users.forEach(user => {
            const userItem = document.createElement('div');
            userItem.className = 'flex justify-between items-center bg-card-bg p-3 rounded-xl';
            
            userItem.innerHTML = `
                <div class="flex items-center space-x-3">
                    <i data-lucide="${user.icon}" class="h-6 w-6 ${user.colorClass}"></i>
                    <span class="text-neutral-white font-medium">${user.name}</span>
                </div>
                <span class="${user.colorClass} font-bold">${user.kwh.toFixed(1)} kWh</span>
            `;
            topUsersList.appendChild(userItem);
        });
        // After adding all items, find all lucide icons and create them
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({
                context: topUsersList
            });
        }
    }

    // Add event listeners to category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'active' class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add 'active' class to the clicked button
            button.classList.add('active');
            // Render top users for the selected category
            const category = button.getAttribute('data-category');
            renderTopUsers(category);
        });
    });


    /**
     * Generates mock data for total consumption based on a timeframe.
     * Values will fluctuate to provide a dynamic feel.
     * @param {string} timeframe The timeframe ('daily', 'weekly', 'monthly').
     * @returns {{current: {cost: number, kwh: number}, previous: {cost: number, kwh: number}}}
     */
    function generateData(timeframe) {
        const baseDailyKwh = 10.5; // Base average daily household consumption
        const costPerKwh = 0.28; // Using the actual cost per kWh in the UI mock up

        let currentKwh, prevKwh;

        switch (timeframe) {
            case 'daily':
                // Daily data with 25% fluctuation
                currentKwh = baseDailyKwh * (1 + (Math.random() - 0.5) * 0.5); 
                prevKwh = baseDailyKwh * (1 + (Math.random() - 0.5) * 0.5);
                break;
            case 'weekly':
                // Weekly data with 15% fluctuation
                currentKwh = baseDailyKwh * 7 * (1 + (Math.random() - 0.5) * 0.3);
                prevKwh = baseDailyKwh * 7 * (1 + (Math.random() - 0.5) * 0.3);
                break;
            case 'monthly':
                // Monthly data with 10% fluctuation
                currentKwh = baseDailyKwh * 30 * (1 + (Math.random() - 0.5) * 0.2);
                prevKwh = baseDailyKwh * 30 * (1 + (Math.random() - 0.5) * 0.2);
                break;
        }
        const currentCost = currentKwh * costPerKwh;
        const prevCost = prevKwh * costPerKwh;

        return {
            current: { cost: currentCost, kwh: currentKwh },
            previous: { cost: prevCost, kwh: prevKwh }
        };
    }

    /**
     * Generates dynamic mock data for the chart based on the timeframe and date.
     * @param {string} timeframe The timeframe.
     * @returns {{labels: string[], data: number[]}}
     */
    function generateChartData(timeframe) {
        let labels;
        let numPoints;
        let baseValue;

        switch (timeframe) {
            case 'daily':
                labels = ['12 AM', '3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];
                numPoints = 8;
                baseValue = 1.8;
                break;
            case 'weekly':
                labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                numPoints = 7;
                baseValue = 15;
                break;
            case 'monthly':
                labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                numPoints = 4;
                baseValue = 85;
                break;
        }

        let data = [];
        for (let i = 0; i < numPoints; i++) {
            const fluctuation = (Math.random() - 0.5) * baseValue * 0.5; // +/- 25%
            data.push(Math.max(0, baseValue + fluctuation));
        }

        return { labels, data };
    }
    
    /**
     * Determines the chart color based on a given data value.
     * Note: This function is currently unused as we are using a single line color.
     */
    function getBarColor(value) {
        // Uses opaque colors for chart aesthetics
        const RENEW_GREEN = 'rgba(52, 211, 153, 0.8)';
        const RENEW_YELLOW = 'rgba(251, 191, 36, 0.8)';
        const RENEW_RED = 'rgba(248, 113, 113, 0.8)';
        
        let thresholds;
        if (currentTimeframe === 'daily') {
            thresholds = { low: 2, high: 3.5 };
        } else if (currentTimeframe === 'weekly') {
            thresholds = { low: 15, high: 20 };
        } else { // monthly
            thresholds = { low: 80, high: 90 };
        }

        const costPerKwh = 0.28;
        const costThresholds = {
            low: thresholds.low * costPerKwh,
            high: thresholds.high * costPerKwh,
        };
        
        const selectedThresholds = currentUnit === 'kwh' ? thresholds : costThresholds;
        
        if (value < selectedThresholds.low) {
            return RENEW_GREEN; 
        } else if (value < selectedThresholds.high) {
            return RENEW_YELLOW;
        } else {
            return RENEW_RED;
        }
    }

    /**
     * Updates the Chart.js instance with new data and redraws it.
     */
    function updateChart() {
        const chartData = generateChartData(currentTimeframe);
        const costPerKwh = 0.28;
        // Convert kWh data to cost if cost view is selected
        const dataToDisplay = chartData.data.map(val => currentUnit === 'cost' ? val * costPerKwh : val);
        
        const CHART_COLOR = '#34D399'; // primary-green
        const BACKGROUND_COLOR = 'rgba(52, 211, 153, 0.2)'; // primary-green with opacity

        if (usageChart) {
            // Update existing chart
            usageChart.data.labels = chartData.labels;
            usageChart.data.datasets[0].data = dataToDisplay;
            usageChart.data.datasets[0].label = `Consumption (${unitInfo[currentUnit].symbol})`;
            // Update Y-axis tick formatting immediately
            usageChart.options.scales.y.ticks.callback = function(value) {
                return `${unitInfo[currentUnit].symbol}${value.toFixed(1)}`;
            };
            usageChart.update();
        } else {
            // Create new chart instance (Line Chart for smooth trend visualization)
            usageChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: `Consumption (${unitInfo[currentUnit].symbol})`,
                        data: dataToDisplay,
                        borderColor: CHART_COLOR,
                        backgroundColor: BACKGROUND_COLOR,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: CHART_COLOR
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                             mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function(context) {
                                    const value = context.parsed.y;
                                    return `${unitInfo[currentUnit].symbol}${value.toFixed(2)}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' },
                            ticks: { color: '#94A3B8' }
                        },
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' },
                            ticks: { 
                                color: '#94A3B8',
                                callback: function(value) {
                                    return `${unitInfo[currentUnit].symbol}${value.toFixed(1)}`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    /**
     * Formats the date string based on the current timeframe.
     */
    function formatDate(date, timeframe) {
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        
        switch(timeframe) {
            case 'daily':
                return date.toLocaleDateString('en-US', options);
            case 'weekly':
                const startOfWeek = new Date(date);
                // Adjust date to the start of the week (Sunday = 0, Monday = 1, etc. in JS)
                startOfWeek.setDate(date.getDate() - date.getDay()); 
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
            case 'monthly':
                return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            default:
                return '';
        }
    }

    /**
     * Main function to update all UI elements.
     */
    function updateUI() {
        const data = generateData(currentTimeframe);
        const costPerKwh = 0.28;

        const totalValue = currentUnit === 'kwh' ? data.current.kwh : data.current.cost;
        totalValueElement.textContent = `${unitInfo[currentUnit].symbol}${totalValue.toFixed(2)}`;
        
        const unitText = currentTimeframe === 'daily' ? 'Day' : currentTimeframe === 'weekly' ? 'Week' : 'Month';
        totalLabelElement.textContent = `Total ${unitText} Consumption`;

        // --- Date Update ---
        dateLabel.textContent = formatDate(currentDate, currentTimeframe);

        // --- Comparison Bar Update ---
        const currentVal = currentUnit === 'kwh' ? data.current.kwh : data.current.cost;
        const prevVal = currentUnit === 'kwh' ? data.previous.kwh : data.previous.cost;
        const maxVal = Math.max(currentVal, prevVal) * 1.1; // Add buffer for visuals
        
        prevPeriodLabel.textContent = `Previous ${unitText}`;
        prevPeriodValue.textContent = `${unitInfo[currentUnit].symbol}${prevVal.toFixed(2)}`;
        prevBar.style.width = `${(prevVal / maxVal) * 100}%`;
        
        currentPeriodLabel.textContent = `Current ${unitText}`;
        currentPeriodValue.textContent = `${unitInfo[currentUnit].symbol}${currentVal.toFixed(2)}`;
        currentBar.style.width = `${(currentVal / maxVal) * 100}%`;
        
        // Dynamic comparison bar colors based on comparison (relying on Tailwind colors)
        const isBetter = currentVal < prevVal;
        
        // Reset classes
        currentBar.classList.remove('bg-accent-yellow', 'bg-accent-red', 'bg-primary-green');
        currentPeriodValue.classList.remove('text-accent-yellow', 'text-accent-red', 'text-primary-green');
        prevBar.classList.remove('bg-accent-yellow', 'bg-accent-red', 'bg-primary-green');
        prevPeriodValue.classList.remove('text-accent-yellow', 'text-accent-red', 'text-primary-green');

        if (isBetter) {
             // Current period is GREEN (Good), Previous is YELLOW (Reference)
            currentBar.classList.add('bg-primary-green');
            currentPeriodValue.classList.add('text-primary-green');
            prevBar.classList.add('bg-accent-yellow');
            prevPeriodValue.classList.add('text-accent-yellow');
        } else if (currentVal > prevVal) {
            // Current period is RED (Worse), Previous is GREEN (Better)
            currentBar.classList.add('bg-accent-red');
            currentPeriodValue.classList.add('text-accent-red');
            prevBar.classList.add('bg-primary-green');
            prevPeriodValue.classList.add('text-primary-green');
        } else {
            // Equal
            currentBar.classList.add('bg-primary-green');
            currentPeriodValue.classList.add('text-primary-green');
            prevBar.classList.add('bg-primary-green');
            prevPeriodValue.classList.add('text-primary-green');
        }
        
        const change = currentVal - prevVal;
        const percentageChange = prevVal > 0 ? Math.abs(change / prevVal) * 100 : 0;
        let comparisonMessage;
        if (change > 0) {
            comparisonMessage = `Your usage is up by ${percentageChange.toFixed(1)}% compared to the previous ${unitText.toLowerCase()}.`;
        } else if (change < 0) {
            comparisonMessage = `Great job! Your usage is down by ${percentageChange.toFixed(1)}% compared to the previous ${unitText.toLowerCase()}.`;
        } else {
            comparisonMessage = `Your usage is the same as the previous ${unitText.toLowerCase()}.`;
        }
        comparisonText.textContent = comparisonMessage;

        // --- Cost Breakdown Update ---
        const totalCost = data.current.kwh * costPerKwh;
        totalCostEl.textContent = `${unitInfo.cost.symbol}${totalCost.toFixed(2)}`;

        costPerKwhEl.textContent = `${unitInfo.cost.symbol}${costPerKwh.toFixed(2)}`;

        // Simple linear projection (for mock data)
        const daysInCurrentPeriod = currentTimeframe === 'daily' ? 1 : currentTimeframe === 'weekly' ? 7 : 30;
        const projectedMonthlyKwh = data.current.kwh * (30 / daysInCurrentPeriod);
        const projectedMonthlyCost = projectedMonthlyKwh * costPerKwh;
        projectedCostEl.textContent = `${unitInfo.cost.symbol}${projectedMonthlyCost.toFixed(2)}`;

        updateChart();
    }

    // --- Event Listeners ---
    toggleSwitch.addEventListener('change', () => {
        // Toggle the internal unit state based on the switch
        currentUnit = toggleSwitch.checked ? 'kwh' : 'cost';
        
        // Update labels based on the state
        kwhLabel.classList.toggle('text-neutral-white', currentUnit === 'kwh');
        kwhLabel.classList.toggle('text-secondary-gray', currentUnit === 'cost');
        costLabel.classList.toggle('text-neutral-white', currentUnit === 'cost');
        costLabel.classList.toggle('text-secondary-gray', currentUnit === 'kwh');

        updateUI();
    });

    timeToggleGroup.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            // 1. Remove 'active' class from ALL buttons and set inactive text color
            timeToggleGroup.querySelectorAll('button').forEach(btn => {
                btn.classList.remove('active');
                // The text-neutral-white class should be added back for inactive state
                btn.classList.add('text-neutral-white'); 
            });
            
            // 2. Add 'active' state to the clicked button and remove inactive text color
            button.classList.add('active');
            button.classList.remove('text-neutral-white'); 

            // 3. Update the timeframe state and refresh UI
            currentTimeframe = button.dataset.timeframe;
            currentDate = new Date('2025-09-02T12:00:00'); // Reset date for new timeframe view
            updateUI();
        });
    });

    prevDateBtn.addEventListener('click', () => {
        const unit = currentTimeframe === 'daily' ? 1 : currentTimeframe === 'weekly' ? 7 : 30;
        currentDate.setDate(currentDate.getDate() - unit);
        updateUI();
    });

    nextDateBtn.addEventListener('click', () => {
        const unit = currentTimeframe === 'daily' ? 1 : currentTimeframe === 'weekly' ? 7 : 30;
        currentDate.setDate(currentDate.getDate() + unit);
        updateUI();
    });
    
    // Initial UI updates (ensures 'Day' is active and data is loaded)
    // Find and explicitly set the initial active state for the 'Day' button
    const initialActiveButton = timeToggleGroup.querySelector('[data-timeframe="daily"]');
    if (initialActiveButton) {
        initialActiveButton.classList.add('active');
        initialActiveButton.classList.remove('text-neutral-white');
    }
    
    // Render default users and run UI update
    renderTopUsers('heating');
    updateUI();
};
