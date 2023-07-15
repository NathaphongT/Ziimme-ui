# ------------------------------ Node ---------------------------------
FROM node:18.15-alpine3.16 AS build
WORKDIR /app
COPY . .
RUN npm ci --legacy-peer-deps
RUN npm run build 

# ------------------------------ Nginx --------------------------------
FROM nginx:1.23-alpine
# set timezone
ARG TZ='Asia/Bangkok'
ENV TZ ${TZ}
RUN apk update
RUN apk upgrade
RUN apk add ca-certificates && update-ca-certificates
# change timezone
RUN apk add --update tzdata
# Clean APK cache
RUN rm -rf /var/cache/apk/*
COPY --from=build /app/dist /usr/share/nginx/wiimme
CMD ["nginx", "-g", "daemon off;"]