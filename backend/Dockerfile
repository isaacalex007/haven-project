# Use the official lightweight Python image.
FROM python:3.12-slim as builder

# Set the working directory in the container.
WORKDIR /app

# We don't need gcc for these packages, so we can remove that step for a faster build.

# Copy the requirements file into the container.
COPY requirements.txt .

# Install the Python dependencies as wheels.
RUN pip wheel --no-cache-dir --wheel-dir /app/wheels -r requirements.txt


# --- Final production stage ---
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
# Google Cloud Run expects port 8080 by default.
EXPOSE 8080

# Set the command to run the application.
# --host 0.0.0.0 is REQUIRED to accept connections from outside the container.
# --port 8080 matches the EXPOSE instruction and Cloud Run's expectation.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]