FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 3000

CMD ["nodemon", "-L", "node_modules/.bin/next", "dev"]