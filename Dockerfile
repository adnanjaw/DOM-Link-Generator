FROM node:17

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

COPY src /app/src
COPY webpack /app/webpack
COPY public  /app/public

RUN npm install

CMD [ "node", 'npm run build']