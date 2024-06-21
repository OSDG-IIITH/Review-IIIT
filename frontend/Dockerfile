# cache dependencies
FROM node:20-slim AS node_cache
WORKDIR /cache/
COPY package*.json .
RUN npm install --prefer-offline --no-audit --progress=true --loglevel verbose --omit=dev

FROM node:20-slim as builder
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
WORKDIR /app
COPY --from=node_cache /cache/ .
COPY . .

FROM builder as dev
CMD ["npm", "run", "dev"]

FROM builder as prod
RUN npm run build
