window.onload = function() {
    const devicesData = {
        kettle: {
            displayName: 'Immersion Heater',
            baseKwh: 0.15,
            costPerKwh: 0.20,
            specs: {
                modelName: 'Smart Kettle V2.0',
                efficiencyRating: 'A+',
                installationDate: 'July 15, 2025'
            },
            realtimeStatus: {
                status: 'Off',
                power: '0 W',
                lastActive: '12:30 PM'
            }
        },
        toaster: {
            displayName: 'Toaster',
            baseKwh: 0.05,
            costPerKwh: 0.20,
            specs: {
                modelName: 'Smart Toaster X-10',
                efficiencyRating: 'B',
                installationDate: 'August 1, 2025'
            },
            realtimeStatus: {
                status: 'On',
                power: '900 W',
                lastActive: 'Just Now'
            }
        },
        microwave: {
            displayName: 'Microwave',
            baseKwh: 0.1,
            costPerKwh: 0.20,
            specs: {
                modelName: 'Microwave 3000',
                efficiencyRating: 'B+',
                installationDate: 'June 20, 2025'
            },
            realtimeStatus: {
                status: 'Standby',
                power: '5 W',
                lastActive: '5 mins ago'
            }
        }
    };

    let currentUnit = 'kwh';
    let currentTimeframe = 'daily';
    let currentDate = new Date('2025-08-16T12:00:00');
    let currentDeviceId = 'kettle';

    const deviceSelector = document.getElementById('device-selector');
    const deviceTitle = document.getElementById('device-title');
    const toggleSwitch = document.getElementById('toggle-switch');
    const averageValueElement = document.getElementById('average-value');
    const timeframeUnitLabel = document.getElementById('timeframe-unit-label');
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

    const unitInfo = {
        cost: { symbol: '€', label: 'Cost' },
        kwh: { symbol: 'kWh', label: 'kWh' }
    };

    function generateData(deviceId, date, timeframe) {
        const device = devicesData[deviceId];
        const dailyFactor = 1 + (Math.random() - 0.5) * 0.4;
        const weeklyFactor = 1 + (Math.random() - 0.5) * 0.3;
        const monthlyFactor = 1 + (Math.random() - 0.5) * 0.2;

        let currentKwh, prevKwh;

        switch (timeframe) {
            case 'daily':
                currentKwh = device.baseKwh * dailyFactor * 10;
                prevKwh = device.baseKwh * (1 + (Math.random() - 0.5) * 0.4) * 10;
                break;
            case 'weekly':
                currentKwh = device.baseKwh * 7 * weeklyFactor * 10;
                prevKwh = device.baseKwh * 7 * (1 + (Math.random() - 0.5) * 0.3) * 10;
                break;
            case 'monthly':
                currentKwh = device.baseKwh * 30 * monthlyFactor * 10;
                prevKwh = device.baseKwh * 30 * (1 + (Math.random() - 0.5) * 0.2) * 10;
                break;
        }
        const currentCost = currentKwh * device.costPerKwh;
        const prevCost = prevKwh * device.costPerKwh;

        return {
            current: { cost: currentCost, kwh: currentKwh },
            previous: { cost: prevCost, kwh: prevKwh }
        };
    }

    function generateChartData(deviceId, timeframe) {
        const device = devicesData[deviceId];
        const data = {
            labels: [],
            data: []
        };

        const baseValue = device.baseKwh * 10;

        switch (timeframe) {
            case 'daily':
                data.labels = ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
                data.data = data.labels.map(() => {
                    const val = baseValue * (0.5 + Math.random() * 0.5);
                    return parseFloat(val.toFixed(2));
                });
                break;
            case 'weekly':
                data.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                data.data = data.labels.map(() => {
                    const val = baseValue * 7 * (0.8 + Math.random() * 0.4);
                    return parseFloat(val.toFixed(2));
                });
                break;
            case 'monthly':
                data.labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                data.data = data.labels.map(() => {
                    const val = baseValue * 30 * (0.9 + Math.random() * 0.2);
                    return parseFloat(val.toFixed(2));
                });
                break;
        }
        return data;
    }

    function getBarColors(data) {
        const sum = data.reduce((a, b) => a + b, 0);
        const average = sum / data.length;
        const colors = [];
        const green = '#5CBE67';
        const yellow = '#FFC107';
        const red = '#D34E4E';

        data.forEach(value => {
            if (value < average * 0.8) {
                colors.push(green);
            } else if (value > average * 1.2) {
                colors.push(red);
            } else {
                colors.push(yellow);
            }
        });
        return colors;
    }

    function updateChart() {
        const chartData = generateChartData(currentDeviceId, currentTimeframe);
        const consumptionData = chartData.data.map(val => currentUnit === 'cost' ? val * devicesData[currentDeviceId].costPerKwh : val);
        const barColors = getBarColors(consumptionData);
        
        if (usageChart) {
            usageChart.data.labels = chartData.labels;
            usageChart.data.datasets[0].data = consumptionData;
            usageChart.data.datasets[0].label = `Consumption (${unitInfo[currentUnit].symbol})`;
            usageChart.data.datasets[0].backgroundColor = barColors;
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
                        data: consumptionData,
                        backgroundColor: barColors,
                        borderColor: barColors.map(color => color.replace('rgba(', 'rgb(').replace(', 0.8)', ')')),
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
        const device = devicesData[currentDeviceId];
        if (!device) return;

        const data = generateData(currentDeviceId, currentDate, currentTimeframe);
        
        deviceTitle.textContent = device.displayName;

        const avgValue = currentUnit === 'kwh' ? data.current.kwh : data.current.cost;
        averageValueElement.textContent = `${unitInfo[currentUnit].symbol}${avgValue.toFixed(2)}`;
        
        const unitText = currentTimeframe === 'daily' ? 'Day' : currentTimeframe === 'weekly' ? 'Week' : 'Month';
        timeframeUnitLabel.textContent = `${unitText} ${unitInfo[currentUnit].label}`;

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
            currentBar.className = 'h-full transition-all duration-500 bg-accent-yellow';
            currentPeriodValue.className = 'text-accent-yellow font-bold text-sm';
            prevBar.className = 'h-full transition-all duration-500 bg-primary-green';
            prevPeriodValue.className = 'text-primary-green font-bold text-sm';
        } else if (currentVal < prevVal) {
            currentBar.className = 'h-full transition-all duration-500 bg-primary-green';
            currentPeriodValue.className = 'text-primary-green font-bold text-sm';
            prevBar.className = 'h-full transition-all duration-500 bg-accent-yellow';
            prevPeriodValue.className = 'text-accent-yellow font-bold text-sm';
        } else {
            currentBar.className = 'h-full transition-all duration-500 bg-primary-green';
            currentPeriodValue.className = 'text-primary-green font-bold text-sm';
            prevBar.className = 'h-full transition-all duration-500 bg-primary-green';
            prevPeriodValue.className = 'text-primary-green font-bold text-sm';
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

        const totalCost = data.current.kwh * device.costPerKwh;
        totalCostEl.textContent = `${unitInfo.cost.symbol}${totalCost.toFixed(2)}`;

        const costPerKwh = device.costPerKwh;
        costPerKwhEl.textContent = `${unitInfo.cost.symbol}${costPerKwh.toFixed(2)}`;

        const projectedMonthlyKwh = data.current.kwh * (30 / (currentTimeframe === 'daily' ? 1 : currentTimeframe === 'weekly' ? 7 : 30));
        const projectedMonthlyCost = projectedMonthlyKwh * device.costPerKwh;
        projectedCostEl.textContent = `${unitInfo.cost.symbol}${projectedMonthlyCost.toFixed(2)}`;

        updateChart();
    }

    // Event Listeners
    deviceSelector.addEventListener('change', (e) => {
        currentDeviceId = e.target.value;
        updateUI();
    });

    toggleSwitch.addEventListener('change', () => {
        currentUnit = toggleSwitch.checked ? 'kwh' : 'cost';
        kwhLabel.className = `font-bold ${currentUnit === 'kwh' ? 'text-neutral-white' : 'text-secondary-gray'}`;
        costLabel.className = `font-bold ${currentUnit === 'cost' ? 'text-neutral-white' : 'text-secondary-gray'}`;
        updateUI();
    });

    timeToggleGroup.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            timeToggleGroup.querySelectorAll('button').forEach(btn => btn.classList.remove('bg-primary-green', 'shadow-md', 'text-neutral-white'));
            timeToggleGroup.querySelectorAll('button').forEach(btn => btn.classList.add('text-secondary-gray'));
            button.classList.add('bg-primary-green', 'shadow-md', 'text-neutral-white');
            button.classList.remove('text-secondary-gray');
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
    
    // Initial UI update
    updateUI();
    
};
