FROM library/ubuntu:14.04

MAINTAINER Temetz

RUN apt-get update && apt-get install -y software-properties-common
RUN apt-get update && apt-get install -y nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/node

COPY . /src
RUN cd /src; npm install
EXPOSE 8082
CMD ["node", "/src/index.js"]
