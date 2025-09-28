document.addEventListener('DOMContentLoaded', () => {
    const chartData = [
        { day: 'Mon', usage: 70 },
        { day: 'Tue', usage: 65 },
        { day: 'Wed', usage: 85 },
        { day: 'Thu', usage: 75 },
        { day: 'Fri', usage: 90 },
        { day: 'Sat', usage: 80 },
        { day: 'Sun', usage: 95 }
    ];

    const chartContainer = document.getElementById('bar-chart-container');
    const maxUsage = Math.max(...chartData.map(d => d.usage));

    chartData.forEach((data, index) => {
        const barWrapper = document.createElement('div');
        barWrapper.className = 'flex flex-col items-center justify-end h-full';
        barWrapper.style.width = '14.28%'; // Distribute bars evenly

        const bar = document.createElement('div');
        const barHeight = (data.usage / maxUsage) * 100;
        bar.className = 'chart-bar';
        bar.style.height = `${barHeight}%`;

        if (data.day === 'Sat') { // Assuming today is Saturday for the design
            bar.classList.add('current-day');
        }

        barWrapper.appendChild(bar);
        chartContainer.appendChild(barWrapper);
    });
});
