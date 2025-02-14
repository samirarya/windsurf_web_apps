// Alpha Vantage API Key - Replace with your API key
const API_KEY = 'YOUR_API_KEY';

// DOM Elements
const stockGrid = document.getElementById('stock-grid');
const stockSearch = document.getElementById('stock-search');
const addStockBtn = document.getElementById('add-stock');
const stockDetail = document.getElementById('stock-detail');
const closeDetailBtn = document.getElementById('close-detail');
const priceChart = document.getElementById('price-chart');

// State
let trackedStocks = JSON.parse(localStorage.getItem('trackedStocks')) || [];
let chart = null;

// Functions
async function fetchStockData(symbol) {
    try {
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
        const data = await response.json();
        return data['Global Quote'];
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return null;
    }
}

async function fetchStockNews(symbol) {
    try {
        const response = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${API_KEY}`);
        const data = await response.json();
        return data.feed || [];
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}

async function fetchIntradayData(symbol) {
    try {
        const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`);
        const data = await response.json();
        return data['Time Series (5min)'];
    } catch (error) {
        console.error('Error fetching intraday data:', error);
        return null;
    }
}

function createStockCard(stockData) {
    const price = parseFloat(stockData['05. price']);
    const change = parseFloat(stockData['09. change']);
    const changePercent = parseFloat(stockData['10. change percent']);
    const isPositive = change >= 0;

    const card = document.createElement('div');
    card.className = 'stock-card';
    card.innerHTML = `
        <div class="stock-header">
            <span class="stock-symbol">${stockData['01. symbol']}</span>
            <button class="remove-stock" data-symbol="${stockData['01. symbol']}">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="stock-price">$${price.toFixed(2)}</div>
        <div class="stock-change ${isPositive ? 'positive' : 'negative'}">
            ${isPositive ? '▲' : '▼'} ${Math.abs(change).toFixed(2)} (${Math.abs(changePercent).toFixed(2)}%)
        </div>
        <button class="view-details" data-symbol="${stockData['01. symbol']}">View Details</button>
    `;

    const removeBtn = card.querySelector('.remove-stock');
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeStock(stockData['01. symbol']);
    });

    const viewDetailsBtn = card.querySelector('.view-details');
    viewDetailsBtn.addEventListener('click', () => showStockDetails(stockData['01. symbol']));

    return card;
}

function createNewsItem(news) {
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item';
    newsItem.innerHTML = `
        <h4>${news.title}</h4>
        <p>${news.summary.substring(0, 150)}...</p>
        <div class="news-meta">
            <span>${new Date(news.time_published).toLocaleDateString()}</span>
            <a href="${news.url}" target="_blank">Read More</a>
        </div>
    `;
    return newsItem;
}

async function updateStockCard(symbol) {
    const stockData = await fetchStockData(symbol);
    if (!stockData) return;

    const existingCard = document.querySelector(`[data-symbol="${symbol}"]`).closest('.stock-card');
    if (existingCard) {
        const newCard = createStockCard(stockData);
        existingCard.replaceWith(newCard);
    }
}

async function addStock(symbol) {
    if (trackedStocks.includes(symbol)) return;
    
    const stockData = await fetchStockData(symbol);
    if (!stockData) {
        alert('Invalid stock symbol or API error');
        return;
    }

    trackedStocks.push(symbol);
    localStorage.setItem('trackedStocks', JSON.stringify(trackedStocks));
    renderStockCard(stockData);
}

function removeStock(symbol) {
    trackedStocks = trackedStocks.filter(s => s !== symbol);
    localStorage.setItem('trackedStocks', JSON.stringify(trackedStocks));
    const card = document.querySelector(`[data-symbol="${symbol}"]`).closest('.stock-card');
    card.remove();
}

async function showStockDetails(symbol) {
    const [stockData, newsData, intradayData] = await Promise.all([
        fetchStockData(symbol),
        fetchStockNews(symbol),
        fetchIntradayData(symbol)
    ]);

    if (!stockData || !intradayData) return;

    document.getElementById('detail-symbol').textContent = symbol;
    document.getElementById('detail-open').textContent = `$${parseFloat(stockData['02. open']).toFixed(2)}`;
    document.getElementById('detail-high').textContent = `$${parseFloat(stockData['03. high']).toFixed(2)}`;
    document.getElementById('detail-low').textContent = `$${parseFloat(stockData['04. low']).toFixed(2)}`;
    document.getElementById('detail-volume').textContent = parseInt(stockData['06. volume']).toLocaleString();

    // Update news
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = '';
    newsData.slice(0, 5).forEach(news => {
        newsList.appendChild(createNewsItem(news));
    });

    // Update chart
    updateChart(intradayData);

    stockDetail.classList.add('active');
}

function updateChart(intradayData) {
    const times = Object.keys(intradayData).slice(0, 50).reverse();
    const prices = times.map(time => parseFloat(intradayData[time]['4. close']));

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(priceChart, {
        type: 'line',
        data: {
            labels: times.map(time => time.split(' ')[1]),
            datasets: [{
                label: 'Stock Price',
                data: prices,
                borderColor: '#007bff',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

async function renderStockCard(stockData) {
    const card = createStockCard(stockData);
    stockGrid.appendChild(card);
}

async function initializeStocks() {
    for (const symbol of trackedStocks) {
        const stockData = await fetchStockData(symbol);
        if (stockData) {
            renderStockCard(stockData);
        }
    }
}

// Event Listeners
addStockBtn.addEventListener('click', () => {
    const symbol = stockSearch.value.trim().toUpperCase();
    if (symbol) {
        addStock(symbol);
        stockSearch.value = '';
    }
});

stockSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const symbol = stockSearch.value.trim().toUpperCase();
        if (symbol) {
            addStock(symbol);
            stockSearch.value = '';
        }
    }
});

closeDetailBtn.addEventListener('click', () => {
    stockDetail.classList.remove('active');
});

// Update stocks every minute
setInterval(() => {
    trackedStocks.forEach(symbol => updateStockCard(symbol));
}, 60000);

// Initialize
initializeStocks();
