FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache bash curl

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
