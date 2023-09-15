
#!/bin/bash

# ------------------------------------ Certbot Renew -----------------------------------------
IMAGE_NAME=certbot/dns-cloudflare
CONTAINER_NAME="certbot"
DIR_ETC="/server/Ziimme-ui/letsencrypt"
DIR_LIB="/server/Ziimme-ui/lib/letsencrypt"
DIR_LOG="/server/Ziimme-ui/logs"
DIR_CLOUD="/server/Ziimme-ui/cloudflare"

# ---------------------------------------------------------------------------------------------
sudo docker stop wiimme
sudo docker run -it --rm --name $CONTAINER_NAME \
                -v $DIR_ETC:/etc/letsencrypt \
                -v $DIR_LIB:/var/lib/letsencrypt \
                -v $DIR_LOG:/var/log/letsencrypt \
                -v $DIR_CLOUD:/cloudflare \
                $IMAGE_NAME renew
sudo docker start wiimme
