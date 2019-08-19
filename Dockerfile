FROM golang:1.12.6-stretch as builder
WORKDIR /opt
COPY main.go go.mod /opt/
RUN go get -d -v .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
#FROM ubuntu:latest
WORKDIR /opt/
COPY --from=builder /opt/main .
COPY config/ /opt/config/
COPY keystore/ /opt/keystore/
COPY site/ /opt/site/
EXPOSE 3000
CMD ["/opt/main"]
