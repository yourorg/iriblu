#!/usr/bin/env bash
#

SCRIPT=$(readlink -f "$0");
SCRIPTPATH=$(dirname "$SCRIPT");  # Where this script resides
SCRIPTNAME=$(basename "$SCRIPT"); # This script's name

export VHOST_ENV_VARS="${SCRIPTPATH}/vhost_env_vars.sh";
export ENV_VARS="${SCRIPTPATH}/env_vars.sh";

declare PRETTY="~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nIRIBLU Build and upload :: ";

export NEW_VERSION=${1:-0.0.0};
export QUICK=${2};

source ./env_vars.sh
source ./standard_env_vars.sh
source ./specs.sh;
source ./utils/semver_shell/semver.sh;
source ./utils/ssh_utils.sh;
source ${VHOST_SECRETS_FILE};

function setupTargetServer() {

  startSSHAgent;

  makeTargetAuthorizedHostSshKeyIfNotExist \
       "${DEPLOY_USER_SSH_KEY_COMMENT}" \
       "${DEPLOY_USER_SSH_PASS_PHRASE}" \
       "${DEPLOY_USER_SSH_KEY_PATH}" \
       "${DEPLOY_USER_SSH_KEY_FILE}";

  AddSSHkeyToAgent "${DEPLOY_USER_SSH_KEY_FILE}" "${DEPLOY_USER_SSH_PASS_PHRASE}";

  # [ -z ${QUICK} ] && chkHostConn;

  # ....
  makeSSH_Config_File;
  addSSH_Config_Identity "${SETUP_USER_UID}" "${TARGET_SRVR}" "${YOUR_TARGET_SRVR_SSH_KEY_FILE}";
  addSSH_Config_Identity "${DEPLOY_USER}" "${TARGET_SRVR}" "${DEPLOY_USER_SSH_KEY_FILE}";
  echo -e "${PRETTY}SSH config file prepared.";

  [ -z ${QUICK} ] && (
      echo -e "${PRETTY}Testing SSH to target : '${SETUP_USER_UID}@${TARGET_SRVR}'."
      ssh -t -oStrictHostKeyChecking=no -oBatchMode=yes -l "${SETUP_USER_UID}" "${TARGET_SRVR}" whoami || exit 1;
      echo -e "${PRETTY}Success: SSH to host '${SETUP_USER_UID}' '${TARGET_SRVR}'.";
  );

  export ENVIRONMENT="/dev/shm/environment.sh";

  echo -e "${PRETTY} TARGET_SRVR=${TARGET_SRVR}";
  echo -e "${PRETTY} SETUP_USER_UID=${SETUP_USER_UID}";
  echo -e "${PRETTY} VHOST_SECRETS_PATH=${VHOST_SECRETS_PATH}";
  echo -e "${PRETTY} VHOST_SECRETS_FILE=${VHOST_SECRETS_FILE}";
  echo -e "${PRETTY} VHOST_ENV_VARS=${VHOST_ENV_VARS}";
  echo -e "${PRETTY} ENV_VARS=${ENV_VARS}";
  cat ${ENV_VARS} ${VHOST_ENV_VARS} > ${ENVIRONMENT};

.deploy/PushInstallerScriptsToTarget.sh \
    "${TARGET_SRVR}" \
    "${SETUP_USER_UID}" \
    "${VHOST_SECRETS_PATH}" \
    "${ENVIRONMENT}";

ssh -t -oStrictHostKeyChecking=no -oBatchMode=yes -l "${DEPLOY_USER}" "${TARGET_SRVR}" whoami;
echo -e "${PRETTY}Tested '${DEPLOY_USER}' user SSH to host '${TARGET_SRVR}'.";

ssh ${DEPLOY_USER}@${TARGET_SRVR} ". ~/.bash_login && sudo -A touch /opt/delete_me" || exit 1;
echo -e "${PRETTY}Tested sudo ASK_PASS for '${DEPLOY_USER}'@'${TARGET_SRVR}'.";

echo -e "${PRETTY}Pushed installer scripts to host :: '${TARGET_SRVR}'.";

ssh ${DEPLOY_USER}@${TARGET_SRVR} ". ~/.bash_login && ~/DeploymentPkgInstallerScripts/DeploymentPackageRunner.sh";

echo -e "||||||||||||||||||||||||||||||||||||||||||||||";
exit;
echo -e "      ** Done **

ssh ${DEPLOY_USER}@${TARGET_SRVR} \". .bash_login && sudo -A journalctl -n 1000 -fb -u ${YOUR_ORG}_${YOUR_PKG}.service\";
ssh ${DEPLOY_USER}@${TARGET_SRVR} \". .bash_login && sudo -A systemctl stop ${YOUR_ORG}_${YOUR_PKG}.service\";

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~";
echo -e "${PRETTY} SOURCE_CERTS_DIR : ${SOURCE_CERTS_DIR}.";
echo -e "${PRETTY} VHOST_SUBJECT : ${VHOST_SUBJECT}.";
echo -e "${PRETTY} VHOST_CERT_PASSPHRASE : ${VHOST_CERT_PASSPHRASE}.";
echo -e "${PRETTY}  : ${PRETTY}.";
# echo -e "${PRETTY} METEOR_SETTINGS_FILE : ${METEOR_SETTINGS_FILE}.";
echo -e "${PRETTY} VHOST_ENV_VARS : ${VHOST_ENV_VARS}.";
echo -e "${PRETTY} TARGET_SRVR : ${TARGET_SRVR}.";
echo -e "${PRETTY} VIRTUAL_HOST_DOMAIN_NAME : ${VIRTUAL_HOST_DOMAIN_NAME}.";
echo -e "${PRETTY} DEPLOY_USER_SSH_KEY_PATH : ${DEPLOY_USER_SSH_KEY_PATH}.";
echo -e "${PRETTY} DEPLOY_USER_SSH_KEY_COMMENT : ${DEPLOY_USER_SSH_KEY_COMMENT}.";
echo -e "${PRETTY} DEPLOY_USER_SSH_PASS_PHRASE : ${DEPLOY_USER_SSH_PASS_PHRASE}.";
echo -e "${PRETTY} DEPLOY_USER_SSH_KEY_FILE : ${DEPLOY_USER_SSH_KEY_FILE}.";
echo -e "${PRETTY} DEPLOY_USER : ${DEPLOY_USER}.";
echo -e "${PRETTY} VHOST_SECRETS_FILE : ${VHOST_SECRETS_FILE}.";
echo -e "${PRETTY} YOUR_TARGET_SRVR_SSH_KEY_FILE : ${YOUR_TARGET_SRVR_SSH_KEY_FILE}.";
echo -e "${PRETTY} SETUP_USER_UID : ${SETUP_USER_UID}.";
echo -e "\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~";


};

pushd ../IriBluBuilt &>/dev/null;

  echo -e "${PRETTY} validate version bump number ...";

  semverValidate ${NEW_VERSION} || { echo "Bad version number '${NEW_VERSION}'"; exit 1; }

  semverGE ${NEW_VERSION} ${pkg_version} || { echo "The old version number '${pkg_version}' is greater than '${NEW_VERSION}'!"; exit 1; }

  echo -e "${PRETTY} patch package.json ...";
  sed -i "s|.*\"name\".*|  \"name\": \"${pkg_name}\",|" package.json
  sed -i "s|.*\"repository\".*|  \"repository\": \"${pkg_upstream_url}\",|" package.json
  sed -i "s|.*\"version\".*|  \"version\": \"${NEW_VERSION}\",|" package.json

popd &>/dev/null;

echo -e "${PRETTY} patch ./specs.sh ...";
sed -i "s|^pkg_version.*|pkg_version=${NEW_VERSION}|" ./specs.sh;

mkdir -p ../IriBluBuilt/.deploy;
cp ./specs.sh ../IriBluBuilt/.deploy;
cp -pr ./utils/. ../IriBluBuilt/.deploy;

echo -e "${PRETTY} Ensuring we can 'expect' log in sequences ...";
sudo apt install -y expect;

pushd ../IriBluBuilt &>/dev/null;

  echo -e "${PRETTY} building ...";

  ./.scripts/preFlightCheck.sh;
  . ~/.userVars.sh;
  # ./build_all.sh;

  setupTargetServer;

popd &>/dev/null;

echo -e "${PRETTY}
 ... done!";

# echo -e "||||||||||||| C U R T A I L E D |||||||||||||||||||||";
exit;
