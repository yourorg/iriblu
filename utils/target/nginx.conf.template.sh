#!/bin/bash

cat <<EODNC
worker_processes  4;
# daemon off;

events {
    worker_connections  1024;
}

http {
    include        mime.types;
    default_type   application/octet-stream;

    sendfile       on;
    tcp_nopush     on;
    tcp_nodelay    on;

    server_names_hash_bucket_size 96;
    keepalive_timeout 60;

    gzip  on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml;
    gzip_disable "MSIE [1-6]\.";

    # ssl_password_file /home/hab/.ssh/deploy_vault/global.pass;

    server {
        listen       80;
        server_name  ${VIRTUAL_HOST_DOMAIN_NAME};

        location / {
            root   /etc/nginx/www-data/;
            index  index.html index.htm;
        }
    }

    include /etc/nginx/sites-enabled/*;

}

EODNC
