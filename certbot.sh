#!/bin/bash

# ---------------------------------------- Certbot -----------------------------------------
IMAGE_NAME=certbot/dns-cloudflare
CONTAINER_NAME="certbot"
DIR_ETC="/server/Zimme-ui/letsencrypt"
DIR_LIB="/server/Zimme-ui/lib/letsencrypt"
DIR_CLOUD="/server/Ziimme-ui/cloudflare"

# ------------------------------------------------------------------------------------------
sudo rm -rf $DIR_ETC
sudo rm -rf $DIR_LIB

# ------------------------------------------------------------------------------------------
sudo docker run -it --rm --name $CONTAINER_NAME \
                -v $DIR_ETC:/etc/letsencrypt \
                -v $DIR_LIB:/var/lib/letsencrypt \
                -v $DIR_CLOUD:/cloudflare \
                $IMAGE_NAME certonly \
                --register-unsafely-without-email \
                --dns-cloudflare \
                --dns-cloudflare-credentials /cloudflare/cloudflare.ini \
                -d ziimmegroup.com \
                -d *.ziimmegroup.com \
                --server https://acme-v02.api.letsencrypt.org/directory