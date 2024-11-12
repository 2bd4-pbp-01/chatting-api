FROM node:20-alpine
LABEL authors="BANGKONG"

# Default app port
ARG CHAT_APP_PORT=3001

# Install procps for a full version of `top`
RUN apk add --no-cache procps

# Create and set permissions for the app directory
RUN mkdir /app && chown -R node:node /app

WORKDIR /app

USER node

# Copy package files and install dependencies
COPY --chown=node:node package*.json ./
RUN npm ci

# Copy the rest of the application files
COPY --chown=node:node . .

# Expose the app port
EXPOSE ${CHAT_APP_PORT}

# Start the application
CMD ["node", "index.js"]
