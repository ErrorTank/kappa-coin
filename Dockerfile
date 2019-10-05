FROM node:8.11.1

WORKDIR "/react-new"

COPY package.json .
RUN npm install
COPY . .

