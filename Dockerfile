FROM node:current-alpine

ENV NODE_ENV=local

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
