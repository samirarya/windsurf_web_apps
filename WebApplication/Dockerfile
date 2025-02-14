# Use a lightweight Node.js image as base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install Python3 and pip for the HTTP server
RUN apk add --no-cache python3 py3-pip

# Copy application files
COPY . .

# Expose port 8000
EXPOSE 8000

# Start Python HTTP server
CMD ["python3", "-m", "http.server", "8000"]
