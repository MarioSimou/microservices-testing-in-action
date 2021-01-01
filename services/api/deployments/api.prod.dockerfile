FROM golang:1.15-alpine

WORKDIR /go/src/app
COPY . .
RUN GOOS=linux go build -o /go/bin/api ./cmd/api/main.go

EXPOSE 3000
CMD [ "/go/bin/api" ]