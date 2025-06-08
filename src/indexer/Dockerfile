# Use a Node.js base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Install dependencies (for Graph CLI and other tools)
RUN apk add --no-cache npm

# Install Graph CLI
RUN npm install -g @graphprotocol/graph-cli

# Install Web3 CLI (example - adapt to your specific needs)
RUN npm install -g web3