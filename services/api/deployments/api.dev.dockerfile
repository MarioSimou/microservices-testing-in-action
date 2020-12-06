FROM golang:1.15-alpine

RUN apk add --update git bash \
    && go get github.com/cespare/reflex

WORKDIR /go/src/app

EXPOSE 3000
CMD reflex -r '\.go$' -s -- go run ./cmd/api/main.go