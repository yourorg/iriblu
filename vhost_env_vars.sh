## Nginx certificate dependencies
export DEPLOY_VAULT="/home/iriman/.ssh/deploy_vault";

export SECRETS="${DEPLOY_VAULT}/${VIRTUAL_HOST_DOMAIN_NAME}";
export CERT_EMAIL="yourself@yourpublic.work";
# export DIFFIE_HELLMAN_DIR="/etc/ssl/private";

export ENABLE_GLOBAL_CERT_PASSWORD_FILE="global_ssl_password_file = \"\"";
