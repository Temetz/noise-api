sudo docker stop noise-api
sudo docker rm noise-api
sudo docker build -t temetz/noise-api .
sudo docker run -i -t -d -p $1:80 -p $2:5300 -e "APIKEY=$3" --privileged --name noise-api temetz/noise-api
