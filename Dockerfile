FROM node:latest AS base

WORKDIR /api

COPY . .

FROM base AS dev
RUN echo "==> Iniciando dev..."
RUN npm i
CMD ["npm", "run", "dev"]

FROM base AS prod
RUN echo "==> Iniciando prod..."
RUN npm install
RUN npm run build
CMD ["npm", "run", "start"]

EXPOSE 8000
