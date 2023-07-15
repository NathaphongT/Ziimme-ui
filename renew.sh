
#!/bin/bash

# ------------------------------------ Certbot Renew -----------------------------------------
IMAGE_NAME=certbot/certbot
CONTAINER_NAME="certbot"
DIR_ETC="/server/Ziimme-ui/letsencrypt"
DIR_LIB="/server/Ziimme-ui/lib/letsencrypt"
DIR_LOG="/server/Ziimme-ui/logs"

# ---------------------------------------------------------------------------------------------
sudo docker stop wiimme
sudo docker run -it --rm --name $CONTAINER_NAME \
                -v $DIR_ETC:/etc/letsencrypt \
                -v $DIR_LIB:/var/lib/letsencrypt \
                -v $DIR_LOG:/var/log/letsencrypt \
                $IMAGE_NAME renew
sudo docker start wiimme