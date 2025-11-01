FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install
RUN npm install @mui/material @emotion/react @emotion/styled

COPY . .

EXPOSE 3000

CMD ["npm", "start"]