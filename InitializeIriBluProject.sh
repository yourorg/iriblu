#!/usr/bin/env bash
#
declare PRETTY="~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nIRIBLU Initialize :: ";

sudo ls >/dev/null;

echo -e "${PRETTY} purge 'mmks' ...";
rm -fr mmks;
if [[ ! -d ../mmks ]]; then
  echo "../mmks not found. Cloning into parent directory.";
  pushd .. &>/dev/null;
    git clone git@github.com:yourse1f-yourorg/mmks.git;
    pushd mmks &>/dev/null;
      git submodule update --init --recursive;
    popd &>/dev/null;
  popd &>/dev/null;
else
  echo "Found existing '../mmks'. Updating.";
  pushd ../mmks &>/dev/null;
    git pull;
    git submodule update --recursive;
  popd &>/dev/null;
fi;

echo -e "${PRETTY} copy in 'mmks' ..."
cp -r ../mmks .;

echo -e "${PRETTY} purge 'mmks' demo packages..."
rm -fr mmks/.pkgs/mmks_*;
rm -fr mmks/.pkgs/*.json;

echo -e "${PRETTY} copy in our definitive packages ..."
cp -r packages/* mmks/.pkgs;


echo -e "${PRETTY} step into 'mmks' subdirectory  ..."
pushd mmks &>/dev/null;

  echo -e "${PRETTY} source our user variables ..."
  if [[  -f ~/.userVars.sh  ]]; then
    . ~/.userVars.sh;
  else
    echo -e "${PRETTY} preparing user variables ..."
    .scripts/preFlightCheck.sh;
  fi;
  echo -e "${PRETTY} install 'IriBlu' ...";
  ./install_all.sh;

popd &>/dev/null;
