#!/usr/bin/env bash
#

export SUDO_ASKPASS=${HOME}/.ssh/.supwd.sh;

export DEPLOY_USER="you";
export TARGET_SRVR="srvRAMDs";
ssh ${DEPLOY_USER}@${TARGET_SRVR} "mkdir -p ./work;";
scp ./cleanUp.sh ${DEPLOY_USER}@${TARGET_SRVR}:/home/${DEPLOY_USER}/work;
scp ./prepMySql.sh ${DEPLOY_USER}@${TARGET_SRVR}:/home/${DEPLOY_USER}/work;
# ssh ${DEPLOY_USER}@${TARGET_SRVR} ". ~/.bash_login && ./work/cleanUp.sh;";
ssh ${DEPLOY_USER}@${TARGET_SRVR} ". ~/.bash_login && ./work/prepMySql.sh;";
#
echo -e "#############################

";
exit;
