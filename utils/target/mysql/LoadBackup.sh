#!/usr/bin/env bash

declare PRTY="\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nMariaDB -- Seeding :: ";

source ./secrets/secrets.sh;

if [[ -z ${RDBMS_BKP} ]]; then
  echo -e "${PRTY} No MariaDB seed URL was specified. Skipping ..."  | tee -a ${LOG};
else

  declare SEED_FILE="pgres_seed.sql";
  echo -e "${PRTY} Downloading and restoring PostgreSQL seed from URL ...
                     ${RDBMS_BKP}
       ... to have internal standard name '${SEED_FILE}'"  | tee -a ${LOG};

  curl -sz ${SEED_FILE} -L -o ${SEED_FILE} ${RDBMS_BKP};

  echo -e "${PRTY} Have seed file, '$(stat -c "%n %s bytes" ${SEED_FILE})'."  | tee -a ${LOG};

  echo -e "${PRTY} Preparing database '${RDBMS_DB}' for user '${RDBMS_UID}' ..............";

  declare CALL_MYSQL="mysql -u root -p${RDBMS_ADMIN_PWD} -e";
  # ${CALL_MYSQL} "SELECT User, Host from user;" mysql;
  ${CALL_MYSQL} "CREATE DATABASE IF NOT EXISTS ${RDBMS_DB};" mysql;
  ${CALL_MYSQL} "GRANT ALL PRIVILEGES ON ${RDBMS_DB}.* TO '${RDBMS_UID}'@'localhost' IDENTIFIED BY '${RDBMS_PWD}';" mysql;

  echo -e "${PRTY} Importing seeding script ..............";
  if [[ ! -f ${SEED_FILE} ]]; then
    echo -e "
    ##################################################
    #####                                        #####
    #####    Can not find '${SEED_FILE}'  #####
    #####                                        #####
    ##################################################
    ";
  fi;

  mysql -u ${RDBMS_UID} -p${RDBMS_PWD} -D ${RDBMS_DB} < ${SEED_FILE};
  echo -e "${PRTY}  .............. imported seeding script.";

  echo -e "${PRTY} Done reseeding ...............";

fi;
