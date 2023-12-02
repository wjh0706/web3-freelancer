# syntax=docker/dockerfile:1
FROM node:21

# Install Python
RUN apt-get update && apt-get install -y python3

WORKDIR /app

#RUN apt-get update && apt-get install -y git

ENV JWT_KEY=freelancerweb3

ENV BACKEND=http://localhost:3001

COPY package.json .

RUN npm install 

EXPOSE 3001

COPY . . 

# RUN cd src/contract

#RUN npm install -g truffle

# RUN truffle migrate --network development

# RUN cd ../..

#CMD ["npm", "start"]
RUN python3

RUN chmod +x wait-for-ganache.sh

CMD ["./wait-for-ganache.sh", "http://ganache-cli:8545", "--", "npm", "start"]