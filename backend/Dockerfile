# Use the official lightweight Python image.
# https://hub.docker.com/_/python
FROM python:3.12-slim as builder

# Set the working directory in the container.
WORKDIR /app

# Install build dependencies.
RUN apt-get update && apt-get install -y --no-install-recommends gcc

# Copy the requirements file into the container.
COPY requirements.txt .

# Install the Python dependencies.
RUN pip wheel --no-cache-dir --wheel-dir /app/wheels -r requirements.txt


FROM python:3.12-slim

# Set the working directory in the container.
WORKDIR /app

# Copy the pre-built wheels from the builder stage.
COPY --from=builder /app/wheels /app/wheels

# Install the Python dependencies from the wheels.
RUN pip install --no-index --find-links=/app/wheels /app/wheels/*

# Copy the rest of the application's code into the container.
COPY . .

# Expose the port that the application will run on.
EXPOSE 8000

# Set the command to run the application.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
