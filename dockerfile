FROM node:14

RUN mkdir -p /usr/src/app 

WORKDIR /usr/src/app 

COPY package*.json ./

RUN npm install

COPY src ./

EXPOSE 3005

CMD ["npm", "run", "dev"]

