document.addEventListener('DOMContentLoaded', () => {
    const individualTab = document.getElementById('individual-tab');
    const neighborhoodTab = document.getElementById('neighborhood-tab');
    const friendsTab = document.getElementById('friends-tab');

    function setActiveSubTab(activeTab) {
        individualTab.classList.remove('active');
        neighborhoodTab.classList.remove('active');
        friendsTab.classList.remove('active');

        activeTab.classList.add('active');
    }

    individualTab.addEventListener('click', () => {
        setActiveSubTab(individualTab);
    });

    neighborhoodTab.addEventListener('click', () => {
        setActiveSubTab(neighborhoodTab);
    });

    friendsTab.addEventListener('click', () => {
        setActiveSubTab(friendsTab);
    });
});
