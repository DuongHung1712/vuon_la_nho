# Use Node.js with Python support
FROM node:18

# Install Git LFS, Python and dependencies
RUN apt-get update && apt-get install -y \
    git-lfs \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    libhdf5-dev \
    libatlas-base-dev \
    gfortran \
    && rm -rf /var/lib/apt/lists/* \
    && git lfs install

# Create symbolic link for python command
RUN ln -s /usr/bin/python3 /usr/bin/python

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy Python requirements and install ML dependencies
COPY ml/requirements.txt ./ml/
RUN pip3 install --break-system-packages --upgrade pip setuptools wheel && \
    pip3 install --break-system-packages --no-cache-dir -r ml/requirements.txt

# Copy the rest of the application
COPY . .

# Verify model file exists and is not a Git LFS pointer
RUN MODEL_SIZE=$(stat -c%s /app/ml/xception_cbam_best.keras 2>/dev/null || echo "0") && \
    if [ "$MODEL_SIZE" -lt 1048576 ]; then \
    echo "ERROR: Model file is too small ($MODEL_SIZE bytes). Likely a Git LFS pointer!" && \
    echo "Please run 'git lfs pull' before building the Docker image." && \
    exit 1; \
    else \
    SIZE_MB=$((MODEL_SIZE / 1024 / 1024)) && \
    echo "Model file verified: ${SIZE_MB}MB"; \
    fi

EXPOSE 4000

CMD ["node", "server.js"]

