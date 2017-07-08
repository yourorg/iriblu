#!/usr/bin/env bash
#
declare PRETTY="~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nIRIBLU Deploy :: ";

sudo ls >/dev/null;


pushd ../IriBluBuilt &>/dev/null;

  echo -e "${PRETTY} install 'IriBluBuilt' project ..."
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

  meteor build /dev/shm/target --server-only;
  ls -l /dev/shm/target;
  echo -e "  All done.  ";

popd &>/dev/null;

