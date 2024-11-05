FROM node:23-alpine3.19

WORKDIR /app

COPY package* .
RUN npm i
COPY . .

EXPOSE 3000:3000

CMD [ "npm", "run", "dev" ]