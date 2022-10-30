FROM node:latest as node

WORKDIR /app

ARG HOST=localhost

COPY . .

RUN npm install

RUN sed -i -e 's/REPLACE_ME/localhost/g' /app/src/environments/environment.prod.ts 

RUN npm run build --prod


# stage 2
FROM nginx:alpine
COPY --from=node /app/dist/transcendance-v1 /usr/share/nginx/html