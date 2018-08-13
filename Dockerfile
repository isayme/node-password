FROM node:8.11.3-alpine AS builder

RUN apk update && apk add python make g++

WORKDIR /app
COPY package*.json ./
RUN npm i --production

FROM node:8.11.3-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY . /app

CMD npm start
