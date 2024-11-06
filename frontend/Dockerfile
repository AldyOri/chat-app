FROM node:23-alpine3.19

WORKDIR /app

ENV VITE_API_URL=http://host.docker.internal:8000
ENV VITE_WS_URL=ws://host.docker.internal:8000

COPY package*.json .
RUN npm install
COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]