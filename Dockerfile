FROM library/ubuntu:14.04

MAINTAINER Temetz


RUN apt-get update && apt-get install -y software-properties-common
RUN apt-get update && apt-get install -y iptables
RUN apt-get update && apt-get install -y nodejs npm
RUN apt-get update && apt-get install -y haproxy

RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN cp /haproxy/haproxy.conf /etc/haproxy/haproxy.conf
RUN service haproxy restart

RUN cd /api/src; npm install

EXPOSE 80
EXPOSE 443
EXPOSE 8080
EXPOSE 5300

CMD ["node", "api/src/index.js"]
