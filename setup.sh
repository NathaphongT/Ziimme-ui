#!/bin/bash

# -------------------------------- Angular ----------------------------------
IMAGE_NAME="wiimme/app"
TAG="1.0"
CONTAINER_NAME="wiimme"
NETWORK="bridge-net"
PUB_PORT=80
PUB_SSL=443
DIR_LOG="/server/Ziimme-ui/log"
DIR_CON_NGINX="/server/Ziimme-ui/nginx.conf"
DIR_CON_DEFAULT="/server/Ziimme-ui/default.conf"
DIR_SSL="/server/Ziimme-ui/letsencrypt"

# ---------------------------------------------------------------------------
sudo docker stop $CONTAINER_NAME
sudo docker rm   $CONTAINER_NAME
sudo docker rmi  $IMAGE_NAME:$TAG
sudo rm -rf $DIR_LOG

# ---------------------------------------------------------------------------
sudo docker build -t $IMAGE_NAME:$TAG /server/Ziimme-ui
sudo docker run --name $CONTAINER_NAME \
                --network $NETWORK \
                -p $PUB_PORT:80 \
                -p $PUB_SSL:443 \
                --restart=always \
                -v $DIR_LOG:/var/log/nginx \
                -v $DIR_CON_NGINX:/etc/nginx/nginx.conf \
                -v $DIR_CON_DEFAULT:/etc/nginx/conf.d/default.conf \
               -v $DIR_SSL:/letsencrypt \
                -d $IMAGE_NAME:$TAG