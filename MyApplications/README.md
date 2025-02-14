# Portfolio Web Applications

A collection of web applications including:
- Typing Speed
- To-Do List
- World Clock
- Stock Market Tracker

## Prerequisites

- Docker
- Docker Compose

## Running with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-directory>
```

2. Before running the application:
   - Get an API key from Alpha Vantage (https://www.alphavantage.co/support/#api-key)
   - Replace `YOUR_API_KEY` in `stock-tracker.js` with your actual API key

3. Build and start the containers:
```bash
docker-compose up --build
```

4. Access the application:
   - Open your browser and navigate to `http://localhost:8000`
   - The applications will be available in the navigation menu

5. To stop the application:
```bash
docker-compose down
```

## Development

If you want to make changes to the application:

1. The application files are mounted as a volume, so any changes you make to the source files will be reflected immediately

2. The container will automatically restart if there are any crashes

3. To rebuild the container after making changes to the Dockerfile:
```bash
docker-compose up --build
```

## Features

### Stock Market Tracker
- Real-time stock price updates
- Interactive price charts
- Latest news for each stock
- Persistent storage of tracked stocks

### World Clock
- Display time in multiple cities
- Real-time updates
- Add/remove cities
- Timezone information

### To-Do List
- Add, complete, and delete tasks
- Filter tasks by status
- Local storage persistence
- Task counter

### Typing Speed
- Real-time WPM calculation
- Accuracy tracking
- Color-coded feedback
- Modern UI

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Docker
- Python (for development server)
- Chart.js (for stock charts)
- Alpha Vantage API (for stock data)
- Font Awesome (for icons)
