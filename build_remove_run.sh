sudo docker build -t temetz/noise-api .
sudo docker stop noise-api
sudo docker rm -v noise-api
sudo docker run -i -t -d -p 80:80 -p 443:443 -p 5300:5300 --privileged --name noise-api temetz/noise-api
