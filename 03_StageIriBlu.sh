#!/usr/bin/env bash
#
declare PRETTY="~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nIRIBLU Deploy :: ";

export CI=${CI:false};
export CI_BK=${CI_BK:CI};

sudo ls >/dev/null;

if [ ! -d ./mmks ]; then
  echo -e "

  * * * * Found no directory './mmks'. * * *
  You must first execute './01_InitializeIriBluProject.sh'
  Quitting ...";
  exit;
fi;

echo -e "${PRETTY} step out to parent directory  ..."
pushd .. &>/dev/null;

  if [[ ! -d IriBluBuilt ]]; then
    echo "'../IriBluBuilt' not found. Cloning into parent directory.";
    git clone git@github.com:yourorg/IriBluBuilt.git;
  else
    echo "Found existing '../IriBluBuilt'. Updating.";
    pushd IriBluBuilt &>/dev/null;
      git pull;
    popd &>/dev/null;
  fi;

popd &>/dev/null;

echo -e "${PRETTY} protect 'IriBluBuilt' control directories   ..."
pushd .. &>/dev/null;

  mkdir -p IB_TEMP;
  mkdir -p IriBluBuilt/.habitat;
  mv IriBluBuilt/.git IB_TEMP;
  mv IriBluBuilt/.habitat IB_TEMP;

popd &>/dev/null;

pushd mmks &>/dev/null;
  echo -e "${PRETTY} copy 'iriblu' project to 'IriBluBuilt'   ...";
  ./clean_all.sh shallow;
  cp -r meteor-mantra-kickstarter/. ../../IriBluBuilt;
  echo -e "${PRETTY}

  Now copy 'exclusion' list 'IriBluBuilt' !!!!!!!!!!!  ...


  ";
popd &>/dev/null;


echo -e "${PRETTY} restore 'IriBluBuilt' control directories   ..."
pushd .. &>/dev/null;

  rm -fr IriBluBuilt/.git;
  mv IB_TEMP/.git IriBluBuilt;
  rm -fr IriBluBuilt/.habitat;
  mv IB_TEMP/.habitat IriBluBuilt;
  rm -fr IB_TEMP;

popd &>/dev/null;

CI=false;
pushd ../IriBluBuilt &>/dev/null;

  echo -e "${PRETTY} install 'IriBluBuilt' project ..."
  .scripts/preFlightCheck.sh || exit 1;
  . ${HOME}/.userVars.sh;
  ./install_all.sh;

popd &>/dev/null;

# read -n 1 -s -p "Press any key to continue";
CI=${CI_BK};

source 02_TestIriBluProject.sh;
echo -e "${PRETTY} test 'IriBluBuilt' project   ...";
export PACKAGE_EXCLUSIONS="$(pwd)/packages/package_exclusions.json";
TestRun ../IriBluBuilt;

echo -e "|||||||||||||||||||||||||||||||||||||||||";
exit;

# echo -e "${PRETTY} step into 'mmks' subdirectory  ..."
# pushd mmks &>/dev/null;

#   echo -e "${PRETTY} step into 'meteor-mantra-kickstarter' subdirectory  ..."
#   pushd meteor-mantra-kickstarter &>/dev/null;
#     echo -e "${PRETTY} hello from 'meteor-mantra-kickstarter' subdirectory  ..."
#     pwd;
#   popd &>/dev/null;

# popd &>/dev/null;
