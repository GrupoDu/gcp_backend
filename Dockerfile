FROM node:latest

WORKDIR /api

COPY . .

RUN rm -rf node_modules
RUN rm pnpm-lock.yaml
# RUN rm package-lock.json
RUN npm i

CMD ["npm", "run", "build:start"]

EXPOSE 8000