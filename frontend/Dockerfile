FROM node:latest as builder
WORKDIR app

COPY package.json .
COPY package-lock.json .
RUN npm install

ARG DEBUG
ENV BUILD_COMMAND=${DEBUG:+build-dev}
ENV BUILD_COMMAND=${BUILD_COMMAND:-build}

COPY . .
RUN npm run $BUILD_COMMAND

FROM nginx:latest

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf



