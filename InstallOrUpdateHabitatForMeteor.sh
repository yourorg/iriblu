#!/usr/bin/env bash
#
declare PRETTY="~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nIRIBLU Habitat :: ";

sudo ls >/dev/null;

export WKRDIR=$(pwd);
echo -e "${PRETTY} obtaining HabitatForMeteor ...";
mkdir -p ${HOME}/tools;
if [[ ! -d ${HOME}/tools/HabitatForMeteor ]]; then
  echo "../HabitatForMeteor not found. Cloning into parent directory.";
  pushd ${HOME}/tools &>/dev/null;
    git clone git@github.com:your0rg/HabitatForMeteor.git;
  popd &>/dev/null;
else
  echo "Found existing '../HabitatForMeteor'. Updating.";
  pushd ${HOME}/tools/HabitatForMeteor &>/dev/null;
    git pull;
  popd &>/dev/null;
fi;

echo -e "${PRETTY} adding/updating HabitatForMeteor in IriBluBuilt ...";
pushd ${HOME}/tools/HabitatForMeteor &>/dev/null;
  ./Update_or_Install_H4M_into_Meteor_App.sh ${WKRDIR}/../IriBluBuilt;
popd &>/dev/null;
cp .habitat/plan.sh ../IriBluBuilt/.habitat;

echo -e "${PRETTY} update/install HabitatForMeteor in IriBluBuilt ...";
pushd ../IriBluBuilt &>/dev/null;
  ./.habitat/scripts/Update_or_Install_Dependencies.sh;
popd &>/dev/null;
