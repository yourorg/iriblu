#!/usr/bin/env bash
#
declare PRTY="~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nIRIBLU Production :: ";

SCRIPT=$(readlink -f "$0");
SCRIPTPATH=$(dirname "$SCRIPT");
declare TARGET_SCRIPTS="/utils/target";

declare RAM_DISK=/dev/shm;
declare BUILD_TARGET_DIR=${RAM_DISK}/target;

source ./utils/ssh_utils.sh;

source ${RAM_DISK}/environment.sh;
source standard_env_vars.sh;
source ${VHOST_SECRETS_FILE};
source ./specs.sh;

AddSSHkeyToAgent ${DEPLOY_USER_SSH_KEY_FILE} ${DEPLOY_USER_SSH_PASS_PHRASE};

sudo ls >/dev/null;

pushd ../${pkg_name} &>/dev/null;

  echo -e "${PRTY} ${PRTY} install '${pkg_name}' project ..."
  .scripts/preFlightCheck.sh;
  . ${HOME}/.userVars.sh;

  rm -fr ./node_modules;
  rm -fr ./.meteor/local;
  mkdir -p ./node_modules;

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

  meteor build ${BUILD_TARGET_DIR} --server-only;

popd &>/dev/null;

declare APP_INSTALLER="InstallMeteorApp";
scp ${BUILD_TARGET_DIR}/${pkg_name}.tar.gz ${DEPLOY_USER}@${TARGET_SRVR}:/home/${DEPLOY_USER}/MeteorApp;

echo -e "${PRTY}  ......  ${pkg_name} :: ${pkg_version}  .......";
export PKG=${pkg_name};
export PKG_VERSION=${pkg_version};

pushd .${TARGET_SCRIPTS} >/dev/null;
  sh ${APP_INSTALLER}.template.sh > ${APP_INSTALLER}.sh;
  scp ${APP_INSTALLER}.sh ${DEPLOY_USER}@${TARGET_SRVR}:/home/${DEPLOY_USER}/${BUNDLE_DIRECTORY_NAME};
  rm -fr ${APP_INSTALLER}.sh;
  # scp ./postgresql/LoadPostgresBackup.sh ${DEPLOY_USER}@${TARGET_SRVR}:/home/${DEPLOY_USER}/${BUNDLE_DIRECTORY_NAME}/postgresql;
  # scp settings.json.template.sh ${DEPLOY_USER}@${TARGET_SRVR}:/home/${DEPLOY_USER}/${BUNDLE_DIRECTORY_NAME};
  # scp meteor_node_override.conf.template.sh ${DEPLOY_USER}@${TARGET_SRVR}:/home/${DEPLOY_USER}/${BUNDLE_DIRECTORY_NAME};
popd >/dev/null;

echo -e "${PRTY} ${PRTY} ssh ${DEPLOY_USER}@${TARGET_SRVR} \". .bash_login && ./${BUNDLE_DIRECTORY_NAME}/${APP_INSTALLER}.sh\";";
ssh ${DEPLOY_USER}@${TARGET_SRVR} ". .bash_login && ./${BUNDLE_DIRECTORY_NAME}/${APP_INSTALLER}.sh";


echo -e "${PRTY}   All done.
..................................................................
";



pushd .${TARGET_SCRIPTS} >/dev/null;
  echo -e "Copying 'LoadPostgresBackup.sh' to server ...";
  scp ./postgresql/LoadPostgresBackup.sh ${DEPLOY_USER}@${TARGET_SRVR}:/home/${DEPLOY_USER}/${BUNDLE_DIRECTORY_NAME}/postgresql;
  echo -e "done ...";
popd >/dev/null;
exit;
