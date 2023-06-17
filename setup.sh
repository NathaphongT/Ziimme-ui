#!/bin/bash
# -------------------------------- Angular ----------------------------------
IMAGE_NAME="wiimme/app"
TAG="1.0"
CONTAINER_NAME="wiimme"
NETWORK="bridge-net"
PUB_PORT=80
DIR_LOG="/server/ziimme-ui/log"
DIR_CON_NGINX="/server/ziimme-ui/nginx.conf"
DIR_CON_DEFAULT="/server/ziimme-ui/default.conf"
# ---------------------------------------------------------------------------
sudo docker stop $CONTAINER_NAME
sudo docker rm   $CONTAINER_NAME
sudo docker rmi  $IMAGE_NAME:$TAG
sudo rm -rf $DIR_LOG
# ---------------------------------------------------------------------------
sudo docker build -t $IMAGE_NAME:$TAG /server/ziimme-ui
sudo docker run --name $CONTAINER_NAME \
                --network $NETWORK \
                -p $PUB_PORT:80 \
                --restart=always \
                -v $DIR_LOG:/var/log/nginx \
                -v $DIR_CON_NGINX:/etc/nginx/nginx.conf \
                -v $DIR_CON_DEFAULT:/etc/nginx/conf.d/default.conf \
                -d $IMAGE_NAME:$TAG