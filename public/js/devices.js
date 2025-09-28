document.addEventListener('DOMContentLoaded', () => {
    const filterAllButton = document.getElementById('filter-all');
    const filterLowButton = document.getElementById('filter-low');
    const filterHighButton = document.getElementById('filter-high');

    const lowUsageSection = document.getElementById('low-usage-section');
    const highUsageSection = document.getElementById('high-usage-section');

    function setActiveButton(activeButton) {
        [filterAllButton, filterLowButton, filterHighButton].forEach(button => {
            button.classList.remove('bg-primary-green');
            button.classList.add('bg-white/10');
        });
        activeButton.classList.remove('bg-white/10');
        activeButton.classList.add('bg-primary-green');
    }

    filterAllButton.addEventListener('click', () => {
        setActiveButton(filterAllButton);
        lowUsageSection.classList.remove('hidden');
        highUsageSection.classList.remove('hidden');
    });

    filterLowButton.addEventListener('click', () => {
        setActiveButton(filterLowButton);
        lowUsageSection.classList.remove('hidden');
        highUsageSection.classList.add('hidden');
    });

    filterHighButton.addEventListener('click', () => {
        setActiveButton(filterHighButton);
        lowUsageSection.classList.add('hidden');
        highUsageSection.classList.remove('hidden');
    });
});