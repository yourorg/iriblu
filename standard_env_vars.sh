#!/usr/bin/env bash
#

export SSH_PATH="${HOME}/.ssh";
export SECRETS_PATH="${SSH_PATH}/deploy_vault";
export DEPLOY_USER_SECRETS_DIR="deploy_user";
export YOUR_TARGET_SRVR_SSH_KEY_FILE="${SSH_PATH}/id_rsa";

export SSH_CONF_FILE="${SSH_PATH}/config";

export BUNDLE_DIRECTORY_NAME="DeploymentPkgInstallerScripts";
export APP_DIRECTORY_NAME="MeteorApp";

# export HABITAT4METEOR="/home/yourself/tools/HabitatForMeteor";
# export HABITAT4METEOR_SCRIPTS="${HABITAT4METEOR}/habitat/scripts";

export VHOST_SECRETS_PATH="${SECRETS_PATH}/${VIRTUAL_HOST_DOMAIN_NAME}";
export VHOST_SECRETS_FILE="${VHOST_SECRETS_PATH}/secrets.sh";

export DEPLOY_USER_SECRETS_PATH="${VHOST_SECRETS_PATH}/${DEPLOY_USER_SECRETS_DIR}";
export DEPLOY_USER_SSH_KEY_PATH="${DEPLOY_USER_SECRETS_PATH}";
export DEPLOY_USER_SSH_KEY_FILE="${DEPLOY_USER_SSH_KEY_PATH}/id_rsa";
export DEPLOY_USER_SSH_KEY_PUBL="${DEPLOY_USER_SSH_KEY_PATH}/id_rsa.pub";


# export SOURCE_CERTS_DIR="${VHOST_SECRETS_PATH}/tls";
