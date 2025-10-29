# Use a base Python image
FROM python:3.11-slim

# Set environment variables for the application
ENV PYTHONUNBUFFERED 1
ENV STREAMLIT_SERVER_PORT=3000

# Create and set the working directory
WORKDIR /frontend

# Copy requirement files and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Streamlit application files
COPY . .

# Expose the Streamlit port
EXPOSE 3000

# Run the Streamlit application
CMD ["streamlit", "run", "app.py"]