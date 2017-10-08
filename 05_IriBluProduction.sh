#!/usr/bin/env bash
#
declare START_TIME=$(date +%s);
declare PRTY="~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nIRIBLU Production :: ";

function CURTAIL() {  return 0; }

SCRIPT=$(readlink -f "$0");
SCRIPTPATH=$(dirname "$SCRIPT");


echo -e "${PRTY} Preparing environment...";
export ENV_VARS="${SCRIPTPATH}/env_vars.sh";
export STANDARD_ENV_VARS="${SCRIPTPATH}/standard_env_vars.sh";
export VHOST_ENV_VARS="${SCRIPTPATH}/vhost_env_vars.sh";

source ${ENV_VARS};
source ${STANDARD_ENV_VARS};


echo -e "${PRETTY} Get NVM settings ...";
source utils/target/initNvmMaker.sh;
initNvmMaker ${USER};
source ${HOME}/.bash_login;


declare TARGET_SCRIPTS="/utils/target";

declare RAM_DISK=/dev/shm;
mkdir -p ${RAM_DISK}/target;
declare BUILD_TARGET_DIR=${RAM_DISK}/target;

source ./utils/ssh_utils.sh;

export ENVIRONMENT="${RAM_DISK}/environment.sh";
touch ${ENVIRONMENT};
cat ${ENV_VARS} ${VHOST_ENV_VARS} > ${ENVIRONMENT};

echo -e "${PRTY}  ......  .......";

source ${HOME}/.userVars.sh;
echo -e "${PRETTY} TARGET_SRVR=${TARGET_SRVR}";
echo -e "${PRETTY} SETUP_USER_UID=${SETUP_USER_UID}";
echo -e "${PRETTY} VHOST_SECRETS_PATH=${VHOST_SECRETS_PATH}";
echo -e "${PRETTY} VHOST_SECRETS_FILE=${VHOST_SECRETS_FILE}";
echo -e "${PRETTY} VHOST_ENV_VARS=${VHOST_ENV_VARS}";
echo -e "${PRETTY} ENV_VARS=${ENV_VARS}";
echo -e "${PRTY}  ......   .......";

source ${VHOST_SECRETS_FILE};
source ./specs.sh;

echo -e "${PRTY}  ......  ${pkg_name} :: ${pkg_version}  .......";
export PKG=${pkg_name};
export PKG_VERSION=${pkg_version};
export COMPLETED_BUNDLE="${PKG}_${PKG_VERSION}.tar.gz";

AddSSHkeyToAgent ${DEPLOY_USER_SSH_KEY_FILE} ${DEPLOY_USER_SSH_PASS_PHRASE};

sudo ls >/dev/null;

pushd ../${pkg_name} &>/dev/null;

  echo -e "${PRTY} install '${pkg_name}' project ..."
  .scripts/preFlightCheck.sh;
  . ${HOME}/.userVars.sh;

  if [[ -f ${BUILD_TARGET_DIR}/${COMPLETED_BUNDLE} ]]; then
    echo -e "${PRTY}

    Ram disk already holds a file '${BUILD_TARGET_DIR}/${COMPLETED_BUNDLE}'.
    Will not rebuild it.
    ";
  else
    source .scripts/android/installAndBuildTools.sh;
    echo -e "${PRTY} Preparing To Build AndroidAPK";
    PrepareToBuildAndroidAPK;
    echo -e "${PRTY} Prepared for building AndroidAPK";

    rm -fr ./node_modules;
    rm -fr ./.meteor/local;
    mkdir -p ./node_modules;

    echo -e "${PRTY} * * * FIXME * * *

    These steps should be generic !";
    pushd ./.pkgs &>/dev/null;
      pushd ./gitignored_mmks_book &>/dev/null;
        rm -fr dist;
        rm -fr node_modules;
        meteor npm install
       popd &>/dev/null;

      pushd ./gitignored_mmks_layout/ &>/dev/null;
        rm -fr dist;
        rm -fr node_modules;
        meteor npm install
      popd &>/dev/null;

      pushd ./mmks_widget/ &>/dev/null;
        rm -fr dist;
        rm -fr node_modules;
        meteor npm install
      popd &>/dev/null;

      cp -r ./gitignored_mmks_book ../node_modules/mmks_book;
      cp -r ./gitignored_mmks_layout/ ../node_modules/mmks_layout;
      cp -r ./mmks_widget/ ../node_modules/mmks_widget;

    popd &>/dev/null;

    meteor npm install;

    echo -e "${PRTY} Building AndroidAPK as ${APP_NAME}";
    BuildAndroidAPK;

    echo -e "${PRTY} Renaming APK.";
    pushd public/mobile/android >/dev/null;
      rm -f mmks.apk.txt;
      mv IriBluBuilt.apk mmks.apk;
      mv IriBluBuilt.apk.txt mmks.apk.txt;
    popd >/dev/null;

    echo -e "${PRTY} Building '${APP_NAME}' server bundle with embedded 'apk' in ${BUILD_TARGET_DIR}.";
    meteor build ${BUILD_TARGET_DIR} --server-only --directory;
  fi;

  echo -e "${PRTY} Secure CoPying '${APP_NAME}' server bundle as '${COMPLETED_BUNDLE}'.";
  pushd ${BUILD_TARGET_DIR} >/dev/null;

    tar zcvf ${COMPLETED_BUNDLE} bundle >/dev/null;
    scp ${COMPLETED_BUNDLE} ${DEPLOY_USER}@${TARGET_SRVR}:/home/${DEPLOY_USER}/MeteorApp;
    echo -e "${PRTY} Secure CoPyed '${APP_NAME}' server bundle as '${COMPLETED_BUNDLE}'.";

  popd >/dev/null;

popd &>/dev/null;

declare APP_INSTALLER="InstallMeteorApp";

pushd .${TARGET_SCRIPTS} >/dev/null;

  echo -e "${PRTY} Secure CoPying '${APP_INSTALLER}.sh' to server.";
  sh ${APP_INSTALLER}.template.sh > ${APP_INSTALLER}.sh;
  chmod a+x ${APP_INSTALLER}.sh;
  scp ${APP_INSTALLER}.sh ${DEPLOY_USER}@${TARGET_SRVR}:/home/${DEPLOY_USER}/${BUNDLE_DIRECTORY_NAME};
  rm -fr ${APP_INSTALLER}.sh;

popd >/dev/null;

echo -e "${PRTY} Calling :: ssh ${DEPLOY_USER}@${TARGET_SRVR} \". .bash_login && ./${BUNDLE_DIRECTORY_NAME}/${APP_INSTALLER}.sh\";";
ssh ${DEPLOY_USER}@${TARGET_SRVR} ". .bash_login; nvm use --delete-prefix v4.8.3 --silent";
ssh ${DEPLOY_USER}@${TARGET_SRVR} ". .bash_login && ./${BUNDLE_DIRECTORY_NAME}/${APP_INSTALLER}.sh";

echo -e "
Execution time :";
date -d@$(expr $(date +%s) - $START_TIME) -u +%H:%M:%S;

echo -e "${PRTY}   All done.
...................................................................
";
exit;



# pushd .${TARGET_SCRIPTS} >/dev/null;
#   echo -e "Copying './postgresql/LoadBackup.sh' to server ...";
#   scp ./postgresql/LoadBackup.sh ${DEPLOY_USER}@${TARGET_SRVR}:/home/${DEPLOY_USER}/${BUNDLE_DIRECTORY_NAME}/postgresql;
#   echo -e "done ...";
# popd >/dev/null;


#   CURTAIL && (
#     echo -e "             * * *  CURTAILED * * * ";
#   ) && exit || (
#     echo -e "             * * *  NOT curtailed - Start * * * ";
#   )
