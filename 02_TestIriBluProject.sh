#!/usr/bin/env bash
#
declare PRETTY="~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nIRIBLU Test :: ";

export CI=${CI:false};
export CI_BK=${CI_BK:CI};
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


  echo -e "${PRETTY} Get NVM settings ...";
  source utils/target/initNvmMaker.sh;
  initNvmMaker ${USER};
  source ${HOME}/.bash_login;

  echo -e "${PRETTY} purge test data base ...";
  mkdir -p /tmp/db;
  rm -fr /tmp/db/mmks.sqlite;

  echo -e "${PRETTY} step into '${PROJECT_ROOT}' subdirectory  ..."
  pushd ${PROJECT_ROOT} &>/dev/null;

    echo -e "${PRETTY} run in dev mode ...";
    pwd;
    npm knex --version;

    echo -e "${PRETTY} Starting app in background ...";
    meteor reset;
    nohup .scripts/startInDevMode.sh &

    echo -e "${PRETTY} linting and unit tests ...";
    CI=true;
    meteor npm test;
    CI=${CI_BK};

    if [[ -z ${DISPLAY} ]]; then
      echo -e "${PRETTY} No GUI found for browser display.
      Cannot start functional tests.
      Giving up.";
    else
      echo -e "\n\nNOTE:To monitor app output during test, use :

      tail -fn 200 ${PROJECT_ROOT}/nohup.out;
      ";
      echo -e "${PRETTY} starting functional tests ...";
      .scripts/startAcceptanceTest.sh;
    fi;


  popd &>/dev/null;

  killMeteorProcess;

}

export EXCLUSIONS="packages/package_exclusions.json";
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  TestRun ./mmks/meteor-mantra-kickstarter;
fi;

