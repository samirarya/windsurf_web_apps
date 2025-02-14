// Major cities with their time zones
const defaultCities = [
    { name: 'New York', timezone: 'America/New_York', icon: '🗽' },
    { name: 'London', timezone: 'Europe/London', icon: '🇬🇧' },
    { name: 'Paris', timezone: 'Europe/Paris', icon: '🇫🇷' },
    { name: 'Tokyo', timezone: 'Asia/Tokyo', icon: '🗼' },
    { name: 'Sydney', timezone: 'Australia/Sydney', icon: '🦘' },
    { name: 'Dubai', timezone: 'Asia/Dubai', icon: '🌇' },
    { name: 'Singapore', timezone: 'Asia/Singapore', icon: '🦁' },
    { name: 'Hong Kong', timezone: 'Asia/Hong_Kong', icon: '🏮' }
];

// Additional cities for search
const additionalCities = [
    { name: 'Los Angeles', timezone: 'America/Los_Angeles', icon: '🎬' },
    { name: 'Chicago', timezone: 'America/Chicago', icon: '🌆' },
    { name: 'Toronto', timezone: 'America/Toronto', icon: '🍁' },
    { name: 'Berlin', timezone: 'Europe/Berlin', icon: '🇩🇪' },
    { name: 'Rome', timezone: 'Europe/Rome', icon: '🏛️' },
    { name: 'Moscow', timezone: 'Europe/Moscow', icon: '🇷🇺' },
    { name: 'Mumbai', timezone: 'Asia/Kolkata', icon: '🇮🇳' },
    { name: 'Beijing', timezone: 'Asia/Shanghai', icon: '🇨🇳' },
    { name: 'Seoul', timezone: 'Asia/Seoul', icon: '🇰🇷' },
    { name: 'Bangkok', timezone: 'Asia/Bangkok', icon: '🇹🇭' },
    { name: 'Cairo', timezone: 'Africa/Cairo', icon: '🔆' },
    { name: 'Rio de Janeiro', timezone: 'America/Sao_Paulo', icon: '🇧🇷' }
];

// DOM Elements
const clockGrid = document.getElementById('clock-grid');
const citySearch = document.getElementById('city-search');
const addCityBtn = document.getElementById('add-city');

// State
let displayedCities = JSON.parse(localStorage.getItem('displayedCities')) || defaultCities;

// Functions
function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
}

function getDateForTimezone(timezone) {
    const options = {
        timeZone: timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return new Date().toLocaleDateString('en-US', options);
}

function createClockCard(city) {
    const card = document.createElement('div');
    card.className = 'clock-card';
    card.innerHTML = `
        <div class="clock-header">
            <span class="city-icon">${city.icon}</span>
            <span class="city-name">${city.name}</span>
            <button class="remove-city" data-city="${city.name}">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="clock-time" data-timezone="${city.timezone}"></div>
        <div class="clock-date" data-timezone="${city.timezone}"></div>
        <div class="timezone-name">${city.timezone.replace('_', ' ')}</div>
    `;

    const removeBtn = card.querySelector('.remove-city');
    removeBtn.addEventListener('click', () => removeCity(city.name));

    return card;
}

function updateClocks() {
    const timeElements = document.querySelectorAll('.clock-time');
    const dateElements = document.querySelectorAll('.clock-date');

    timeElements.forEach(element => {
        const timezone = element.dataset.timezone;
        const time = new Date().toLocaleString('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        element.textContent = time;
    });

    dateElements.forEach(element => {
        const timezone = element.dataset.timezone;
        element.textContent = getDateForTimezone(timezone);
    });
}

function renderClocks() {
    clockGrid.innerHTML = '';
    displayedCities.forEach(city => {
        clockGrid.appendChild(createClockCard(city));
    });
    updateClocks();
    saveCities();
}

function saveCities() {
    localStorage.setItem('displayedCities', JSON.stringify(displayedCities));
}

function removeCity(cityName) {
    displayedCities = displayedCities.filter(city => city.name !== cityName);
    renderClocks();
}

function addCity(cityName) {
    const allCities = [...defaultCities, ...additionalCities];
    const city = allCities.find(c => c.name.toLowerCase() === cityName.toLowerCase());
    
    if (city && !displayedCities.some(c => c.name === city.name)) {
        displayedCities.push(city);
        renderClocks();
        citySearch.value = '';
    }
}

// Event Listeners
citySearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const allCities = [...defaultCities, ...additionalCities];
    
    // Add autocomplete suggestions
    const suggestions = allCities
        .filter(city => city.name.toLowerCase().includes(searchTerm))
        .filter(city => !displayedCities.some(c => c.name === city.name));
        
    // TODO: Add suggestions dropdown
});

addCityBtn.addEventListener('click', () => {
    if (citySearch.value.trim()) {
        addCity(citySearch.value.trim());
    }
});

citySearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && citySearch.value.trim()) {
        addCity(citySearch.value.trim());
    }
});

// Update clocks every second
setInterval(updateClocks, 1000);

// Initial render
renderClocks();
