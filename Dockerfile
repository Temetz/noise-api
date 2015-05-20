FROM library/ubuntu:14.04

MAINTAINER Temetz

RUN apt-get update && apt-get install -y software-properties-common
RUN apt-get update && apt-get install -y nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/node

COPY . /src
RUN cd /src
RUN npm install
EXPOSE 8081
CMD ["node", "/src/index.js"]
