FROM node:lts-alpine

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./

COPY prisma ./prisma

RUN npm install

RUN npm install prisma --save-dev


EXPOSE 3000


CMD ["npm", "run", "start:dev"]