#!/usr/bin/env bash

declare PRTY="\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nMariaDB -- Seeding :: ";


export TMP="/dev/shm/tmp.tmp";
export SCTS="../iriman/DeploymentPkgInstallerScripts/secrets/secrets.sh";
source ${SCTS};

echo -e "${PRTY} Preparing database '${RDBMS_DB}' for user '${RDBMS_UID}' ..............";

declare CALL_MYSQL="mysql -u root -p${RDBMS_ADMIN_PWD} -e";
# ${CALL_MYSQL} "SELECT User, Host from user;" mysql;
${CALL_MYSQL} "CREATE DATABASE IF NOT EXISTS ${RDBMS_DB};" mysql;
${CALL_MYSQL} "GRANT ALL PRIVILEGES ON ${RDBMS_DB}.* TO '${RDBMS_UID}'@'localhost' IDENTIFIED BY '${RDBMS_PWD}';" mysql;

echo -e "${PRTY} Importing seeding script ..............";
mysql -u ${RDBMS_UID} -p${RDBMS_PWD} -D ${RDBMS_DB} < ./work/iridiumblue.sql;
echo -e "${PRTY}  .............. imported seeding script.";

echo -e "${PRTY} Done reseeding ...............";

exit 0;
