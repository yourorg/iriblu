#!/usr/bin/env bash
#
# export SUDO_ASKPASS=${HOME}/.ssh/.supwd.sh;

echo -e "##################################";
source ../env_vars.sh;

echo "VIRTUAL_HOST_DOMAIN_NAME -- ${VIRTUAL_HOST_DOMAIN_NAME}";
VHOST_SECRETS_DIR="${HOME}/.ssh/deploy_vault/${VIRTUAL_HOST_DOMAIN_NAME}";

source ${VHOST_SECRETS_DIR}/secrets.sh;

echo "DEPLOY_USER -- ${DEPLOY_USER}";
echo "DEPLOY_USER_SSH_PASS_PHRASE -- ${DEPLOY_USER_SSH_PASS_PHRASE}";

source ../utils/ssh_utils.sh;
AddSSHkeyToAgent ${VHOST_SECRETS_DIR}/deploy_user/id_rsa ${DEPLOY_USER_SSH_PASS_PHRASE};

# export DEPLOY_USER="you";
export TARGET_SRVR="yourhost.yourpublic.work";
echo "TARGET_SRVR -- ${TARGET_SRVR}";

export SHELL_TESTS="../utils/shell";

echo -e "  Copying ...";
scp -r ${SHELL_TESTS}/* ${DEPLOY_USER}@${TARGET_SRVR}:/home/${DEPLOY_USER}/shellTests;

echo -e "  Running ...";
# ssh ${DEPLOY_USER}@${TARGET_SRVR} ". ~/.bash_login; cd shellTests; node --version;";
# exit
ssh ${DEPLOY_USER}@${TARGET_SRVR} ". ~/.bash_login; cd shellTests; node example.js;";

echo -e "  Testing ...";
ssh ${DEPLOY_USER}@${TARGET_SRVR} "cd shellTests; diff tbPartners.js tbPartners.txt;";


exit;



pushd ../utils/target >/dev/null;

  echo -e "  Copying ...";
  scp ./knex ${DEPLOY_USER}@${TARGET_SRVR}:/home/${DEPLOY_USER}/DeploymentPkgInstallerScripts;

  echo -e "  Testing ...";
  ssh ${DEPLOY_USER}@${TARGET_SRVR} ". ~/.bash_login && ./DeploymentPkgInstallerScripts/knex/qtst.sh;";

  # echo -e "  Copying ...";
  # scp ./DeploymentPackageRunner.sh ${DEPLOY_USER}@${TARGET_SRVR}:/home/${DEPLOY_USER}/DeploymentPkgInstallerScripts;

  # echo -e "  Testing ...";
  # ssh ${DEPLOY_USER}@${TARGET_SRVR} ". ~/.bash_login && ./DeploymentPkgInstallerScripts/DeploymentPackageRunner.sh;";

popd >/dev/null;


echo -e "###############################";
exit;



ssh ${DEPLOY_USER}@${TARGET_SRVR} "mkdir -p ./work;";

# scp ./cleanUp.sh ${DEPLOY_USER}@${TARGET_SRVR}:/home/${DEPLOY_USER}/work;
# ssh ${DEPLOY_USER}@${TARGET_SRVR} ". ~/.bash_login && ./work/cleanUp.sh;";

echo -e "  Copying ...";
scp ./seedMariaDB.sh ${DEPLOY_USER}@${TARGET_SRVR}:/home/${DEPLOY_USER}/work;
scp ${HOME}/iridiumblue.sql ${DEPLOY_USER}@${TARGET_SRVR}:/home/${DEPLOY_USER}/work;

echo -e "  Testing ...";
ssh ${DEPLOY_USER}@${TARGET_SRVR} ". ~/.bash_login && ./work/seedMariaDB.sh;";
#
echo -e "###############################";
exit;
