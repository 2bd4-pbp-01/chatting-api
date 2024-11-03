FROM node:20-alpine

# default app port
ARG APP_PORT=3000

RUN mkdir /app && chown -R node:node /app

WORKDIR /app

USER node

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

EXPOSE ${APP_PORT}

CMD ["node", "group.js"]
