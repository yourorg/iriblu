#!/usr/bin/env bash
#
declare PRETTY="~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nIRIBLU Test :: ";

function killMeteorProcess()
{
  echo -e "${PRETTY} kill meteor processes, if any ...";
  EXISTING_METEOR_PIDS=$(ps aux | grep meteor  | grep -v grep | grep ~/.meteor/packages | awk '{print $2}');
#  echo ">${IFS}<  ${EXISTING_METEOR_PIDS} ";
  for pid in ${EXISTING_METEOR_PIDS}; do
    echo "Kill Meteor process : >> ${pid} <<";
    kill -9 ${pid};
  done;
}

function TestRun() {

  PROJECT_ROOT=${1}
  killMeteorProcess;

  echo -e "${PRETTY} purge test data base ...";
  mkdir -p /tmp/db;
  rm -fr /tmp/db/mmks.sqlite;

  echo -e "${PRETTY} step into '${PROJECT_ROOT}' subdirectory  ..."
  pushd ${PROJECT_ROOT} &>/dev/null;

    echo -e "${PRETTY} run in dev mode ...";
    nohup .scripts/startInDevMode.sh &

    meteor npm test;
    .scripts/startAcceptanceTest.sh;

  popd &>/dev/null;

  killMeteorProcess;

}

export GOT_IT="@@@@@@@";
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  TestRun .mmks/meteor-mantra-kickstarter;
fi;

