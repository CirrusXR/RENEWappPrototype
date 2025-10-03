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

    // Highlight active navigation item based on current page
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && currentPath.includes(href)) {
            item.classList.add('active');
            item.classList.remove('text-secondary-gray');
            item.classList.add('text-neutral-white');
            item.classList.remove('hover:text-primary-green'); // Remove hover effect for active item
        } else {
            item.classList.remove('active');
            item.classList.remove('text-neutral-white');
            item.classList.add('text-secondary-gray');
            item.classList.add('hover:text-primary-green'); // Add hover effect for inactive items
        }
    });
});