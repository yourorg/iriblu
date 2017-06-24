#!/usr/bin/env bash
#
declare PRETTY="~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nIRIBLU Deploy :: ";

sudo ls >/dev/null;

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
  echo -e "${PRETTY} copy 'iriblu' project to 'IriBlu'   ..."
  ./clean_all.sh;
  cp -r meteor-mantra-kickstarter/. ../../IriBluBuilt;
popd &>/dev/null;


echo -e "${PRETTY} restore 'IriBluBuilt' control directories   ..."
pushd .. &>/dev/null;

  rm -fr IriBluBuilt/.git;
  mv IB_TEMP/.git IriBluBuilt;
  rm -fr IriBluBuilt/.habitat;
  mv IB_TEMP/.habitat IriBluBuilt;
  rm -fr IB_TEMP;

popd &>/dev/null;

pushd ../IriBluBuilt &>/dev/null;

  echo -e "${PRETTY} install 'IriBluBuilt' project ..."
  ./install_all.sh;

popd &>/dev/null;

source TestIriBluProject.sh;
echo -e "${PRETTY} test 'IriBluBuilt' project   ..."
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
