# syntax=docker/dockerfile:1
FROM node:21

WORKDIR /app

RUN apt-get update && apt-get install -y python3

ENV JWT_KEY=freelancerweb3

ENV BACKEND=http://localhost:3001

COPY package.json .

RUN npm install 

EXPOSE 3001

COPY . .

CMD ["sh", "-c", "sleep 15 && npm start"]