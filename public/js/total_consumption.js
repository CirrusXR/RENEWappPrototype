window.onload = function() {
    // State variables
    let currentUnit = 'kwh';
    let currentTimeframe = 'daily';
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
            { name: 'Radiator', kwh: 3.5, icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-renew-green" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2V4h2v2zm-2 2h2v14h-2V8zm-2-2h-2V4h2v2zM14 8h2v14h-2V8zM12 6h-2V4h2v2zM8 8h2v14H8V8zM6 6H4V4h2v2zM4 8h2v14H4V8z"/></svg>` },
            { name: 'Water Heater', kwh: 2.1, icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-renew-green" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a9 9 0 0 0-9 9c0 4.1 3.5 7.6 9 13.5a1 1 0 0 0 2 0c5.5-5.9 9-9.4 9-13.5a9 9 0 0 0-9-9zm0 16a6 6 0 0 1-6-6c0-3.3 3.6-6 6-6s6 2.7 6 6-3.7 6-6 6z"/><path d="M12 12a1 1 0 0 1-1-1v-2a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1z"/></svg>` },
            { name: 'Electric Blanket', kwh: 0.5, icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-renew-green" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12A10 10 0 0 0 12 2v10a10 10 0 0 0 10 10zM12 2v10a10 10 0 0 1 10 10A10 10 0 0 1 12 2z"/><path d="M12 2v10a10 10 0 0 1 10 10A10 10 0 0 1 12 2z"/><path d="M12 2v10a10 10 0 0 1 10 10A10 10 0 0 1 12 2z"/></svg>` },
        ],
        cooling: [
            { name: 'Air Conditioner', kwh: 4.2, icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-renew-green" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10V12a10 10 0 0 0 10-10A10 10 0 0 0 12 2zM12 14v8a10 10 0 0 0 10-10H12v-2z"/><path d="M12 14v8a10 10 0 0 0 10-10H12v-2z"/><path d="M12 14v8a10 10 0 0 0 10-10H12v-2z"/></svg>` },
            { name: 'Portable Fan', kwh: 0.1, icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-renew-green" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-9 5.5l.2.4L5.6 12a.5.5 0 0 0 .8.1l4.4-4.5V17a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V7.6l4.4 4.4a.5.5 0 0 0 .8-.1l2.4-4.1A10 10 0 0 0 12 2zM12 2v15a1 1 0 0 1-1-1h-2a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-2v1z"/></svg>` },
            { name: 'Dehumidifier', kwh: 0.8, icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-renew-green" viewBox="0 0 24 24" fill="currentColor"><path d="M16 14h-2v-2h2v2zM16 10h-2V8h2v2zM16 6h-2V4h2v2zM12 14h-2v-2h2v2zM12 10h-2V8h2v2zM12 6h-2V4h2v2zM8 14H6v-2h2v2zM8 10H6V8h2v2zM8 6H6V4h2v2z"/></svg>` },
        ],
        lighting: [
            { name: 'Living Room Lights', kwh: 0.3, icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-renew-green" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a9 9 0 0 0-9 9c0 3.3 1.3 6.3 3.5 8.5L12 22l5.5-2.5A9 9 0 0 0 12 2zm0 16a7 7 0 0 1-7-7c0-2.6 1-5 2.8-6.8L12 4.4l4.2 4.2C18 11 19 13.4 19 16a7 7 0 0 1-7 2z"/></svg>` },
            { name: 'Kitchen Lights', kwh: 0.2, icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-renew-green" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a9 9 0 0 0-9 9c0 3.3 1.3 6.3 3.5 8.5L12 22l5.5-2.5A9 9 0 0 0 12 2zm0 16a7 7 0 0 1-7-7c0-2.6 1-5 2.8-6.8L12 4.4l4.2 4.2C18 11 19 13.4 19 16a7 7 0 0 1-7 2z"/></svg>` },
            { name: 'Outdoor Lights', kwh: 0.5, icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-renew-green" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a9 9 0 0 0-9 9c0 3.3 1.3 6.3 3.5 8.5L12 22l5.5-2.5A9 9 0 0 0 12 2zm0 16a7 7 0 0 1-7-7c0-2.6 1-5 2.8-6.8L12 4.4l4.2 4.2C18 11 19 13.4 19 16a7 7 0 0 1-7 2z"/></svg>` },
        ],
        entertainment: [
            { name: 'Television', kwh: 0.6, icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-renew-green" viewBox="0 0 24 24" fill="currentColor"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5v12h16V6z"/><path d="M12 11l8-5v12H4V6l8 5z"/></svg>` },
            { name: 'Gaming Console', kwh: 1.2, icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-renew-green" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-2 18H8a.9.9 0 0 1-.9-.9V17a.9.9 0 0 1 .9-.9h8.2a.9.9 0 0 1 .9.9v2.1a.9.9 0 0 1-.9.9z"/></svg>` },
            { name: 'Stereo System', kwh: 0.4, icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-renew-green" viewBox="0 0 24 24" fill="currentColor"><path d="M22 10.5V12a10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2c2.14 0 4.09.73 5.66 1.94L16 4.6l-1 1c-1.25-.67-2.67-1.1-4.14-1.1a8 8 0 0 0-8 8 8 8 0 0 0 8 8 8 8 0 0 0 8-8c0-1.47-.43-2.89-1.1-4.14l-1 1-1.66-1.66zM15 8l-3 3 3 3 3-3-3-3z"/></svg>` },
        ],
        appliances: [
            { name: 'Refrigerator', kwh: 1.5, icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-renew-green" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-3.31 0-6 2.69-6 6v14h12V8c0-3.31-2.69-6-6-6zm0 18H8v-4h4v4zm4 0h-2v-4h2v4zm2-6h-2V8h2v6zM6 8h-2v6h2V8z"/></svg>` },
            { name: 'Washing Machine', kwh: 2.0, icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-renew-green" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-6 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/></svg>` },
            { name: 'Dishwasher', kwh: 1.8, icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-renew-green" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-1.1 0-2 .9-2 2v2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3V4c0-1.1-.9-2-2-2zM7 18V8h10l-1 10H7z"/><path d="M12 4h-2v2h2V4z"/></svg>` },
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
            userItem.className = 'flex items-center justify-between p-3 rounded-lg bg-white/10';
            userItem.innerHTML = `
                <div class="flex items-center space-x-4">
                    ${user.icon}
                    <span class="text-sm font-medium">${user.name}</span>
                </div>
                <span class="text-sm font-semibold text-renew-yellow">${user.kwh.toFixed(1)} kWh</span>
            `;
            topUsersList.appendChild(userItem);
        });
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
        const costPerKwh = 0.20;

        let currentKwh, prevKwh;

        switch (timeframe) {
            case 'daily':
                currentKwh = baseDailyKwh * (1 + (Math.random() - 0.5) * 0.4);
                prevKwh = baseDailyKwh * (1 + (Math.random() - 0.5) * 0.4);
                break;
            case 'weekly':
                currentKwh = baseDailyKwh * 7 * (1 + (Math.random() - 0.5) * 0.3);
                prevKwh = baseDailyKwh * 7 * (1 + (Math.random() - 0.5) * 0.3);
                break;
            case 'monthly':
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
        let data = [];
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

        for (let i = 0; i < numPoints; i++) {
            const fluctuation = (Math.random() - 0.5) * baseValue * 0.5; // +/- 25%
            data.push(Math.max(0, baseValue + fluctuation));
        }

        return { labels, data };
    }
    
    /**
     * Determines the color based on a given data value.
     * You can adjust the thresholds to fit your needs.
     * @param {number} value The data value (kWh or Cost).
     * @returns {string} The color string (e.g., 'rgba(92, 142, 103, 0.8)').
     */
    function getBarColor(value) {
        let thresholds;
        if (currentTimeframe === 'daily') {
            thresholds = { low: 2, high: 3.5 };
        } else if (currentTimeframe === 'weekly') {
            thresholds = { low: 15, high: 20 };
        } else { // monthly
            thresholds = { low: 80, high: 90 };
        }

        const costThresholds = {
            low: thresholds.low * 0.20,
            high: thresholds.high * 0.20,
        };
        
        const selectedThresholds = currentUnit === 'kwh' ? thresholds : costThresholds;
        
        if (value < selectedThresholds.low) {
            return 'rgba(92, 142, 103, 0.8)'; // RENEW Green for low usage
        } else if (value < selectedThresholds.high) {
            return 'rgba(255, 193, 7, 0.8)'; // RENEW Yellow for medium usage
        } else {
            return 'rgba(211, 70, 78, 0.8)'; // RENEW Red for high usage
        }
    }

    function updateChart() {
        const chartData = generateChartData(currentTimeframe);
        const dataToDisplay = chartData.data.map(val => currentUnit === 'cost' ? val * 0.20 : val);
        const colors = dataToDisplay.map(getBarColor);
        
        if (usageChart) {
            usageChart.data.labels = chartData.labels;
            usageChart.data.datasets[0].data = dataToDisplay;
            usageChart.data.datasets[0].backgroundColor = colors;
            usageChart.data.datasets[0].label = `Consumption (${unitInfo[currentUnit].symbol})`;
            usageChart.options.scales.y.ticks.callback = function(value) {
                return `${unitInfo[currentUnit].symbol}${value.toFixed(1)}`;
            };
            usageChart.update();
        } else {
            usageChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: `Consumption (${unitInfo[currentUnit].symbol})`,
                        data: dataToDisplay,
                        backgroundColor: colors,
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        borderRadius: 5,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
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
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                                borderColor: 'rgba(255, 255, 255, 0.2)'
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.8)'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                                borderColor: 'rgba(255, 255, 255, 0.2)'
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.8)',
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

    function formatDate(date, timeframe) {
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        let dateString;
        switch(timeframe) {
            case 'daily':
                dateString = date.toLocaleDateString('en-US', options);
                break;
            case 'weekly':
                const startOfWeek = new Date(date);
                startOfWeek.setDate(date.getDate() - date.getDay());
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                dateString = `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                break;
            case 'monthly':
                dateString = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                break;
        }
        return dateString;
    }

    function updateUI() {
        const data = generateData(currentTimeframe);
        
        const totalValue = currentUnit === 'kwh' ? data.current.kwh : data.current.cost;
        totalValueElement.textContent = `${unitInfo[currentUnit].symbol}${totalValue.toFixed(2)}`;
        
        const unitText = currentTimeframe === 'daily' ? 'Daily' : currentTimeframe === 'weekly' ? 'Weekly' : 'Monthly';
        totalLabelElement.textContent = `Total ${unitText} Consumption`;

        dateLabel.textContent = formatDate(currentDate, currentTimeframe);

        const currentVal = currentUnit === 'kwh' ? data.current.kwh : data.current.cost;
        const prevVal = currentUnit === 'kwh' ? data.previous.kwh : data.previous.cost;
        const maxVal = Math.max(currentVal, prevVal);
        
        prevPeriodLabel.textContent = `Previous ${unitText}`;
        prevPeriodValue.textContent = `${unitInfo[currentUnit].symbol}${prevVal.toFixed(2)}`;
        prevBar.style.width = `${(prevVal / maxVal) * 100}%`;
        
        currentPeriodLabel.textContent = `Current ${unitText}`;
        currentPeriodValue.textContent = `${unitInfo[currentUnit].symbol}${currentVal.toFixed(2)}`;
        currentBar.style.width = `${(currentVal / maxVal) * 100}%`;
        
        if (currentVal > prevVal) {
            currentBar.classList.remove('bg-renew-green');
            currentBar.classList.add('bg-renew-yellow');
            currentPeriodValue.classList.remove('text-renew-green');
            currentPeriodValue.classList.add('text-renew-yellow');
            prevBar.classList.remove('bg-renew-yellow');
            prevBar.classList.add('bg-renew-green');
            prevPeriodValue.classList.remove('text-renew-yellow');
            prevPeriodValue.classList.add('text-renew-green');
        } else if (currentVal < prevVal) {
            currentBar.classList.remove('bg-renew-yellow');
            currentBar.classList.add('bg-renew-green');
            currentPeriodValue.classList.remove('text-renew-yellow');
            currentPeriodValue.classList.add('text-renew-green');
            prevBar.classList.remove('bg-renew-green');
            prevBar.classList.add('bg-renew-yellow');
            prevPeriodValue.classList.remove('text-renew-green');
            prevPeriodValue.classList.add('text-renew-yellow');
        } else {
            currentBar.classList.remove('bg-renew-yellow');
            currentBar.classList.add('bg-renew-green');
            currentPeriodValue.classList.remove('text-renew-yellow');
            currentPeriodValue.classList.add('text-renew-green');
            prevBar.classList.remove('bg-renew-yellow');
            prevBar.classList.add('bg-renew-green');
            prevPeriodValue.classList.remove('text-renew-yellow');
            prevPeriodValue.classList.add('text-renew-green');
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

        const totalCost = data.current.kwh * 0.20;
        totalCostEl.textContent = `${unitInfo.cost.symbol}${totalCost.toFixed(2)}`;

        const costPerKwh = 0.20;
        costPerKwhEl.textContent = `${unitInfo.cost.symbol}${costPerKwh.toFixed(2)}`;

        const projectedMonthlyKwh = data.current.kwh * (30 / (currentTimeframe === 'daily' ? 1 : currentTimeframe === 'weekly' ? 7 : 30));
        const projectedMonthlyCost = projectedMonthlyKwh * 0.20;
        projectedCostEl.textContent = `${unitInfo.cost.symbol}${projectedMonthlyCost.toFixed(2)}`;

        updateChart();
    }

    // Event Listeners
    toggleSwitch.addEventListener('change', () => {
        currentUnit = toggleSwitch.checked ? 'kwh' : 'cost';
        kwhLabel.className = `font-bold ${currentUnit === 'kwh' ? 'text-neutral-white' : 'text-renew-gray'}`;
        costLabel.className = `font-bold ${currentUnit === 'cost' ? 'text-neutral-white' : 'text-renew-gray'}`;
        updateUI();
    });

    timeToggleGroup.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            timeToggleGroup.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentTimeframe = button.dataset.timeframe;
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
    
    // Initial UI updates
    updateUI();
    renderTopUsers('heating');
};