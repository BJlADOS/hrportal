FROM node:latest as builder
WORKDIR app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .
RUN npm run build

FROM nginx:latest

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf



