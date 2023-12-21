FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run seed

EXPOSE 4000 4001

CMD [ "/bin/sh", "entrypoint.sh" ]