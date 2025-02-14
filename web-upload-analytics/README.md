# File Analytics Web Application

This is a web application that allows users to upload multiple CSV files, combines them into a single dataset, and performs basic analytics.

## Features

- Multiple file upload support
- Automatic file processing and combination
- Basic analytics including row count, column count, and summary statistics
- Modern, responsive UI using Tailwind CSS
- Real-time feedback and error handling

## Setup

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
python app.py
```

3. Open your browser and navigate to `http://localhost:5000`

## Usage

1. Click the file selection button or drag and drop your CSV files
2. Click "Upload and Analyze" to process the files
3. View the analytics results displayed on the page

## Notes

- The application currently supports CSV files
- Maximum file size is limited to 16MB per file
- Files are processed in memory and not stored on the server
