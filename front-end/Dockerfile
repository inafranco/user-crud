FROM node:17-alpine

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm install -g npm@8.3.1
RUN npm install

COPY src/ ./src
COPY public ./public
CMD ["npm", "start"]