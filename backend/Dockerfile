FROM golang:1.23.2-alpine

WORKDIR /app

# ENV DB_HOST=postgres
# ENV DB_USER=postgres
# ENV DB_PASSWORD=postgres
# ENV DB_NAME=chat-app
# ENV DB_PORT=5432

# ENV JWT_SECRET=24931305ff447a0e631b03a11cf73e8c8a4d8cf4d52de50b3e66f391d5e7ee5e1cfa4fae1d05b6df0cbc395c366b45d2b42ef8bd74e0c9b975792b6bf7a78d9f

COPY go* .
RUN go mod tidy
COPY . .

EXPOSE 8000

CMD [ "go", "run", "main.go" ]