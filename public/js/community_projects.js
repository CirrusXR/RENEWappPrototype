// Data for community projects with icons
const projectsData = [
    {
        id: 'maynooth-primary-solar',
        name: 'Maynooth Primary School',
        description: 'Solar Panel Project',
        location: { lat: 53.3792, lng: -6.5912 },
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-16 h-16 text-primary-green"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
    },
    {
        id: 'celbridge-community-wind',
        name: 'Celbridge Community',
        description: 'Community Wind Turbine',
        location: { lat: 53.3340, lng: -6.5410 },
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-16 h-16 text-primary-green"><path d="M12 2v10m-3-3l3-3m3 3l-3-3m0 0l-3 3m3 3l-3 3m0 0l3 3m3-3l-3 3"/><path d="M12 12L7 20"/></svg>`
    },
    {
        id: 'leixlip-library-insulation',
        name: 'Leixlip Library',
        description: 'Building Insulation Upgrade',
        location: { lat: 53.3762, lng: -6.4851 },
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-16 h-16 text-primary-green"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>`
    },
    {
        id: 'clane-sports-lighting',
        name: 'Clane Sports Centre',
        description: 'LED Lighting Installation',
        location: { lat: 53.2848, lng: -6.6853 },
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-16 h-16 text-primary-green"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>`
    },
    {
        id: 'kilcock-local-garden',
        name: 'Kilcock Local Allotment',
        description: 'Smart Irrigation System',
        location: { lat: 53.4078, lng: -6.6711 },
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-16 h-16 text-primary-green"><path d="M12 2.69l5.65 5.65A7.5 7.5 0 0 1 12 22 7.5 7.5 0 0 1 6.35 8.35L12 2.69z"/></svg>`
    }
];

// Collective impact data
const collectiveImpact = {
    co2Reduced: 1543.78, // in tonnes
    treesPlanted: 200
};

let map;
let markers = [];
let activeCardId = null;

// --- DOM Elements ---
const projectsContainer = document.getElementById('projects-container');
const co2ImpactEl = document.getElementById('co2-impact');
const treesImpactEl = document.getElementById('trees-impact');

// --- Map Functions ---
function initializeMap() {
    // Check if Google Maps is loaded before trying to initialize
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        console.error("Google Maps API is not loaded yet.");
        return;
    }
    
    // Check if map is already initialized
    if (map) {
        return;
    }

    // Initialize the Google map
    const mapOptions = {
        center: { lat: 53.3792, lng: -6.5912 },
        zoom: 12,
        mapId: 'DEMO_MAP_ID',
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    
    renderMarkers(projectsData);
}

function renderMarkers(projects) {
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    projects.forEach(project => {
        const marker = new google.maps.Marker({
            position: project.location,
            map: map,
            title: project.name,
        });
        
        const infowindow = new google.maps.InfoWindow({
            content: `<b>${project.name}</b><br>${project.description}`,
        });

        marker.addListener("click", () => {
            infowindow.open({
                anchor: marker,
                map,
            });
            highlightCard(project.id);
        });
        markers.push(marker);
    });
}

// --- Project Cards Functions ---
function renderProjectCards(projects) {
    projectsContainer.innerHTML = '';
    if (projects.length === 0) {
        projectsContainer.innerHTML = `
            <p class="text-center text-secondary-gray p-8">No projects found in this area.</p>
        `;
        return;
    }

    projects.forEach(project => {
        const card = document.createElement('div');
        card.id = `card-${project.id}`;
        card.className = `project-card flex-none w-[300px] glass-panel p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300`;
        card.innerHTML = `
            <div class="p-4 rounded-full bg-neutral-white/20 mb-4">
                ${project.icon}
            </div>
            <div class="text-center">
                <h3 class="text-xl font-bold text-neutral-white mb-1">${project.name}</h3>
                <p class="text-sm text-secondary-gray">${project.description}</p>
            </div>
        `;
        card.addEventListener('click', () => {
            map.setCenter(project.location);
            map.setZoom(15);
            const marker = markers.find(m => m.title === project.name);
            if (marker) {
                new google.maps.InfoWindow({
                    content: `<b>${project.name}</b><br>${project.description}`,
                }).open({
                    anchor: marker,
                    map,
                });
            }
            highlightCard(project.id);
        });
        projectsContainer.appendChild(card);
    });

    if (activeCardId) {
        highlightCard(activeCardId);
    }
}

function highlightCard(id) {
    document.querySelectorAll('.project-card').forEach(card => card.classList.remove('active'));
    const newActiveCard = document.getElementById(`card-${id}`);
    if (newActiveCard) {
        newActiveCard.classList.add('active');
        activeCardId = id;
    }
}

// --- Collective Impact Functions ---
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.textContent = (progress * (end - start) + start).toFixed(obj.id === 'co2-impact' ? 2 : 0);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function updateCollectiveImpact() {
    animateValue(co2ImpactEl, 0, collectiveImpact.co2Reduced, 1500);
    animateValue(treesImpactEl, 0, collectiveImpact.treesPlanted, 1500);
}

// Initial setup on page load
window.onload = () => {
    updateCollectiveImpact();
    renderProjectCards(projectsData);
};
