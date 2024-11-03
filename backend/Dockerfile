FROM golang:1.23.2-alpine

WORKDIR /app

COPY go* .
RUN go mod tidy
COPY . .

EXPOSE 8000

CMD [ "go", "run", "main.go" ]