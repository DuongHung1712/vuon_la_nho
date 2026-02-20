# Use Node.js with Python support
FROM node:18

# Install Python and pip
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Create symbolic link for python command
RUN ln -s /usr/bin/python3 /usr/bin/python

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy Python requirements and install ML dependencies
COPY ml/requirements.txt ./ml/
RUN pip3 install --no-cache-dir -r ml/requirements.txt

# Copy the rest of the application
COPY . .

EXPOSE 4000

CMD ["node", "server.js"]

