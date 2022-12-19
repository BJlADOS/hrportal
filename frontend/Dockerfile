FROM node:latest as builder

COPY . app

WORKDIR app

RUN npm install -g @angular/cli
RUN npm install

RUN ng build --output-path=dist/out --configuration=development

FROM nginx:latest

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist/out /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf



