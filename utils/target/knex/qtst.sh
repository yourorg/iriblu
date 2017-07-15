#!/usr/bin/env bash

declare PRTY="\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nKnex -- Seeding :: ";

echo -e "${PRTY} Start";

declare TMPLST="/dev/shm/tmplst";
function npmInstallIfMissing () {
  [ -f  ${TMPLST} ] || npm list > ${TMPLST};
  PKG=${1}; cat ${TMPLST} | grep ${PKG} >/dev/null && echo " - ${PKG} is installed." || npm install ${PKG};
};

pushd DeploymentPkgInstallerScripts >/dev/null;

  source secrets/secrets.sh;

  pushd knex >/dev/null;

    echo -e "${PRTY} Check dependencies:";
    npmInstallIfMissing "knex";
    npmInstallIfMissing "sqlite3";
    npmInstallIfMissing "pg";
    npmInstallIfMissing "mysql";
    rm -fr ${TMPLST};

    # export T=continuousIntegration;
    export T=production;

    echo -e "${PRTY} Run migrations and seedings:";
    knex migrate:rollback --env ${T} && knex migrate:latest --env ${T};
    knex migrate:latest --env ${T} && knex seed:run --env ${T};

  popd >/dev/null;
popd >/dev/null;




# npm install knex;

