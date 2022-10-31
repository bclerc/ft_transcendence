FROM node:lts-alpine

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./

RUN npm install

RUN npm install prisma --save-dev

COPY prisma ./prisma

EXPOSE 3000

CMD ["npm", "run", "start:dev"]