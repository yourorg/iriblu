#!/usr/bin/env bash
#
PRTY="\n  ==> Qik Tst::";
export SETUP_USER_UID="you";
export DEPLOY_USER="iriman";
export TARGET_SRVR="irid.blue";

echo -e "${PRTY} Set up SSH...";
source utils/ssh_utils.sh;
startSSHAgent;
AddSSHkeyToAgent ${HOME}/.ssh/deploy_vault/reciprocal.trade/deploy_user/id_rsa memorablegobbledygook

echo -e "${PRTY} Copy working files...";
scp  utils/target/*.* ${DEPLOY_USER}@${TARGET_SRVR}:/home/${DEPLOY_USER}/DeploymentPkgInstallerScripts;
# echo "ssh ${SETUP_USER_UID}@${TARGET_SRVR} \". .bash_login && ./DeploymentPkgInstallerScripts/PrepareChefHabitatTarget.sh\" || errorUnexpectedRPCResult;";
#          ssh you@irid.blue ". .bash_login && ./DeploymentPkgInstallerScripts/PrepareChefHabitatTarget.sh" || errorUnexpectedRPCResult;

echo -e "${PRTY} Going to work with...";
echo -e "

ssh ${DEPLOY_USER}@${TARGET_SRVR} \". ~/.bash_login && ~/DeploymentPkgInstallerScripts/DeploymentPackageRunner.sh\";"
echo -e "...............................";
ssh ${DEPLOY_USER}@${TARGET_SRVR} ". ~/.bash_login && ~/DeploymentPkgInstallerScripts/DeploymentPackageRunner.sh";
