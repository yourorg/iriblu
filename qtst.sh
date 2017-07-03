#!/usr/bin/env bash
#
export SETUP_USER_UID="you";
export DEPLOY_USER="iriman";
export TARGET_SRVR="irid.blue";

source utils/ssh_utils.sh;
startSSHAgent;
AddSSHkeyToAgent ${HOME}/.ssh/deploy_vault/reciprocal.trade/deploy_user/id_rsa memorablegobbledygook

scp  utils/target/*.* ${DEPLOY_USER}@${TARGET_SRVR}:/home/${DEPLOY_USER}/DeploymentPkgInstallerScripts;
# echo "ssh ${SETUP_USER_UID}@${TARGET_SRVR} \". .bash_login && ./DeploymentPkgInstallerScripts/PrepareChefHabitatTarget.sh\" || errorUnexpectedRPCResult;";
#          ssh you@irid.blue ". .bash_login && ./DeploymentPkgInstallerScripts/PrepareChefHabitatTarget.sh" || errorUnexpectedRPCResult;
echo -e "

ssh ${DEPLOY_USER}@${TARGET_SRVR} \". ~/.bash_login && ~/DeploymentPkgInstallerScripts/DeploymentPackageRunner.sh\";"
ssh ${DEPLOY_USER}@${TARGET_SRVR} ". ~/.bash_login && ~/DeploymentPkgInstallerScripts/DeploymentPackageRunner.sh";
