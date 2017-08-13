#!/usr/bin/env bash
#
PRTY="\n  ==> Qik Tst::";
echo -e "${PRTY} Curl calls to graphiql ...";

curl -sH "Content-Type: application/json" -X POST \
  -d '{ "query": "query { getDeliveryItem(itemId: 44) { itemId, fkDelivery, code, createdAt } }" }' \
  http://localhost:3000/graphql \
  | jq .data ;


#  -d '{ "query": "query {   book(_id: 60) { _id, title                          } }" }' \
#  -d '{ "query": "query { getDeliveryItem(itemId: 44) { itemId, fkDelivery, code, createdAt } }" }' \



exit;

export SETUP_USER_UID="you";
export DEPLOY_USER="meta";
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
echo -e "...............................";

# echo -e "

# ssh ${DEPLOY_USER}@${TARGET_SRVR} \". ~/.bash_login && ~/DeploymentPkgInstallerScripts/PrepareMeteorAppTargetServer.sh\";"
# ssh ${DEPLOY_USER}@${TARGET_SRVR} ". ~/.bash_login && ~/DeploymentPkgInstallerScripts/PrepareMeteorAppTargetServer.sh";

echo -e "

ssh ${DEPLOY_USER}@${TARGET_SRVR} \". ~/.bash_login && ~/DeploymentPkgInstallerScripts/DeploymentPackageRunner.sh\";"
ssh ${DEPLOY_USER}@${TARGET_SRVR} ". ~/.bash_login && ~/DeploymentPkgInstallerScripts/DeploymentPackageRunner.sh";

