#!/usr/bin/env bash
#
function initialSecurityTasks() {
#
  echo -e "APT install ufw and fail2ban";
  sudo -A apt-get install -y ufw fail2ban;
  #
  echo -e "ufw settings";
  sudo -A ufw default deny incoming;
  sudo -A ufw default deny outgoing;
  sudo -A ufw allow ssh;
  sudo -A ufw allow git;
  sudo -A ufw allow out http;
  sudo -A ufw allow in http;
  sudo -A ufw allow out https;
  sudo -A ufw allow in https;
  sudo -A ufw allow out 53;

  echo -e "ufw for Postgres on VPN";
  sudo -A ufw allow from 192.168.122.0/24 to any port 5432;

  echo -e "ufw for MongoDB on VPN";
  sudo -A ufw allow from 192.168.122.0/24 to any port 27017;

  echo -e "ufw for NodeJS on VPN";
  sudo -A ufw allow from 192.168.122.0/24 to any port 3000;

  echo -e "cycle firewall";
  sudo -A ufw disable;
  sudo -A ufw --force  enable;
  #
  echo -e "cycle fail2ban";
  sudo -A service fail2ban stop;
  sudo -A service fail2ban start;
  #
  echo -e "Complete : OK";

}

function usage() {
  echo -e "USAGE : ./PrepareMeteorAppTargetServer.sh";
}

PASSWORD_MINIMUM_LENGTH=4;
function errorUnsuitablePassword() {
  echo -e "\n\n    *** '${1}' is not a viable password***
                   -- Minimum size is ${PASSWORD_MINIMUM_LENGTH} chars --"  | tee -a ${LOG};
  usage;
}

set -e;

PRTY=" TGTSRV  --> ";

SCRIPT=$(readlink -f "$0");
SCRIPTPATH=$(dirname "$SCRIPT");
export LOG=/tmp/HabitatPreparation.log;
if [[ -f ${LOG} ]]; then
  sudo -A chmod ugo+rw ${LOG};
else
  touch ${LOG};
fi;

export ENVIRONMENT="environment.sh";

echo -e "Meteor App Deployment Preparation Log :: $(date)
=======================================================" > ${LOG};

echo -e "\n${PRTY} Preparing server security."  | tee -a ${LOG};
initialSecurityTasks;

echo -e "\n${PRTY} Fixing unresolved bug in '/usr/sbin/pam_getenv'."  | tee -a ${LOG};
sudo -A sed -i "sQ.*\$val =~ s/(?.*Q  \$val =~ s/(?<\!\\\\\\\\)\\\\\$\\\\{([\^}]\+)\\\\}/\$ENV{\$1}||\"\"/eg;Q" /usr/sbin/pam_getenv;

echo -e "\n${PRTY} Changing working location to ${SCRIPTPATH}."  | tee -a ${LOG};
pushd ${SCRIPTPATH};

  source ${ENVIRONMENT};

  export DEPLOY_USER="${DEPLOY_USER:-iriman}";
  # DEPLOY_USER_PWD=$(cat ./HabUserPwd.txt);

  DEPLOY_DIR=/home/${DEPLOY_USER};
  DEPLOY_SSH_DIR=${DEPLOY_DIR}/.ssh;
  DEPLOY_SSH_AXS=${DEPLOY_SSH_DIR}/authorized_keys;

  INSTALL_SECRETS="./secrets/secrets.sh";
  VHOST_SECRETS="${SECRETS}/secrets.sh";

  DEPLOY_USER_SECRETS_DIR="./secrets/deploy_user";
  DEPLOY_USER_SSH_KEY_PUBL="${DEPLOY_USER_SECRETS_DIR}/id_rsa.pub";

  echo -e "${PRTY} SECRETS=${SECRETS}";
  echo -e "${PRTY} INSTALL_SECRETS=${INSTALL_SECRETS}";
  echo -e "${PRTY} VHOST_SECRETS=${VHOST_SECRETS}";
  source ${INSTALL_SECRETS};

  echo -e "${PRTY} NOSQLDB_PWD=${NOSQLDB_PWD}";
  echo -e "${PRTY} RDBMS_PWD=${RDBMS_PWD}";
  echo -e "${PRTY} SETUP_USER_PWD=${SETUP_USER_PWD}";
  echo -e "${PRTY} DEPLOY_USER_PWD=${DEPLOY_USER_PWD}";
  # echo -e "${PRTY} DEPLOY_USER_SSH_KEY_FILE=${DEPLOY_USER_SSH_KEY_FILE}";

  BUNDLE_DIRECTORY_NAME="DeploymentPkgInstallerScripts";
  BUNDLE_NAME="${BUNDLE_DIRECTORY_NAME}.tar.gz";

  # GOOD_PWD=$(echo -e "${DEPLOY_USER_PWD}" | grep -cE "^.{8,}$"  2>/dev/null);
  # if [ "${GOOD_PWD}" -lt "1" ]; then
  #   echo -e "ERROR : Password must be 8 chars minimum."  | tee -a ${LOG};
  #   usage;
  #   exit 1;
  # fi;
  # ----------------

  echo -e "${PRTY} Validating user's sudo password... ";
  [[ 0 -lt $(echo ${DEPLOY_USER_PWD} | grep -cE "^.{${PASSWORD_MINIMUM_LENGTH},}$") ]] ||  errorUnsuitablePassword ${DEPLOY_USER_PWD};


  # cp -p ${DEPLOY_USER_SSH_KEY_PUBL} ./${DEPLOY_USER_SSH_KEY_FILE_NAME};
  # cat ./${DEPLOY_USER_SSH_KEY_FILE_NAME};

  # DEPLOY_USER_SSH_KEY_NAME="authorized_key";
  # if [ ! -f "${DEPLOY_USER_SSH_KEY_NAME}" ]; then
  #   echo -e "ERROR : A ssh certificate is required.  Found no file : '$(pwd)/${DEPLOY_USER_SSH_KEY_NAME}'"  | tee -a ${LOG};
  #   usage;
  #   exit 1;
  # fi;


  export SUDO_ASKPASS=${HOME}/.ssh/.supwd.sh;

  echo -e "${PRTY} Testing SUDO_ASKPASS and sudo password for '$(whoami)'.  "  | tee -a ${LOG};
  if [[ $(sudo -A touch "/root/$(date)"  &>/dev/null; echo $?;) -gt 0 ]]; then
    echo -e "ERROR : SUDO_ASKPASS doesn't work.  Is the password correct for : '$(whoami)'"  | tee -a ${LOG};
    exit 1;
  fi;


  declare APT_SRC_LST="/etc/apt/sources.list.d";

  echo -e "${PRTY} Prepare for CERTBOT.  "  | tee -a ${LOG};
  sudo -A add-apt-repository ppa:certbot/certbot -y;

  echo -e "${PRTY} Ensuring mongo-shell can be installed.  "  | tee -a ${LOG};
  declare MONGO_LST="mongodb-org-3.2.list";
  declare MONGO_APT=${APT_SRC_LST}/${MONGO_LST};
  declare UNIQ=$(lsb_release -sc)"/mongodb-org";
  declare MONGO_SRC="deb http://repo.mongodb.org/apt/ubuntu ${UNIQ}/3.2 multiverse";

  declare MONGO_APT_KEY_HASH="EA312927";
  apt-key list | grep ${MONGO_APT_KEY_HASH} &>/dev/null \
     && echo " Have mongo shell apt key." \
     || sudo -A apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv ${MONGO_APT_KEY_HASH} >/dev/null;

  cat ${MONGO_APT} 2>/dev/null \
     |  grep ${UNIQ} >/dev/null \
     || echo ${MONGO_SRC} \
     |  sudo -A tee ${MONGO_APT};


  echo -e "${PRTY} Ensuring postgresql client can be installed.  "  | tee -a ${LOG};
  declare PGRES_LST="pgdg.list";
  declare PGRES_APT=${APT_SRC_LST}/${PGRES_LST};
  declare UNIQ=$(lsb_release -sc)"-pgdg";
  declare PGRES_SRC="deb http://apt.postgresql.org/pub/repos/apt/ ${UNIQ} main";

  declare PGRES_APT_KEY_HASH="ACCC4CF8";
  apt-key list | grep ${PGRES_APT_KEY_HASH} &>/dev/null \
      && echo " Have postgresql client apt key." \
      || wget --quiet -O - https://www.postgresql.org/media/keys/${PGRES_APT_KEY_HASH}.asc \
      | sudo -A apt-key add - >/dev/null;

  cat ${PGRES_APT} 2>/dev/null \
      |  grep ${UNIQ} >/dev/null \
      || echo ${PGRES_SRC} \
      |  sudo -A tee ${PGRES_APT};

  sudo -A DEBIAN_FRONTEND=noninteractive apt-get update >>  ${LOG};
  echo -e "${PRTY} Installing MongoDb Shell.  "  | tee -a ${LOG};
  sudo -A DEBIAN_FRONTEND=noninteractive apt-get install -y mongodb-org-shell >>  ${LOG};
  echo -e "${PRTY} Installing PostgreSql Client.  "  | tee -a ${LOG};
  sudo -A DEBIAN_FRONTEND=noninteractive apt-get install -y postgresql-client-9.6 >>  ${LOG};


  echo -e "${PRTY} Ensuring command 'mkpassword' exists . . .  " | tee -a ${LOG};
  sudo -A DEBIAN_FRONTEND=noninteractive apt-get install -y whois  >>  ${LOG};

  echo -e "${PRTY} Ensuring able to parse JSON files.  "  | tee -a ${LOG};
  sudo -A DEBIAN_FRONTEND=noninteractive apt-get install -y jq;

  echo -e "${PRTY} Ensuring able to run incron.d scripts.  "  | tee -a ${LOG};
  sudo -A DEBIAN_FRONTEND=noninteractive apt-get install -y incron;

  echo -e "${PRTY} Ensuring able to download files.  "  | tee -a ${LOG};
  sudo -A DEBIAN_FRONTEND=noninteractive apt-get install -y curl;
  sudo -A DEBIAN_FRONTEND=noninteractive apt-get install -y tree;
  sudo -A DEBIAN_FRONTEND=noninteractive apt-get install -y unzip;

  echo -e "${PRTY} Ensuring able to install SSL certs.  "  | tee -a ${LOG};
  sudo -A DEBIAN_FRONTEND=noninteractive apt-get install -y certbot;

  echo -e "${PRTY} Ensuring able to build native NPM packages.  "  | tee -a ${LOG};
  sudo -A DEBIAN_FRONTEND=noninteractive apt-get install -y build-essential;

  echo -e "${PRTY} Ensuring able to react to changes in directories and files.  "  | tee -a ${LOG};
  sudo -A DEBIAN_FRONTEND=noninteractive apt-get install -y inotify-tools;

  echo -e "${PRTY} Installing front-end HTTP service.  "  | tee -a ${LOG};
  sudo -A DEBIAN_FRONTEND=noninteractive apt-get install -y nginx;

  echo -e "${PRTY} Installing SQL database service.  "  | tee -a ${LOG};
  sudo -A DEBIAN_FRONTEND=noninteractive apt-get install -y postgresql postgresql-contrib;
  sudo -A DEBIAN_FRONTEND=noninteractive apt-get install -y python-psycopg2;
  sudo -A DEBIAN_FRONTEND=noninteractive apt-get install -y libpq-dev;

  echo -e "${PRTY} Installing NoSQL database service.  "  | tee -a ${LOG};
  sudo -A DEBIAN_FRONTEND=noninteractive apt-get install -y mongodb-org;

  sudo -A cp ${HOME}/DeploymentPkgInstallerScripts/mongod.conf /etc;

  export UNIT_FILE="mongodb.service";
  echo -e "${PRTY} Creating systemd unit file '${UNIT_FILE}' for MongoDB" | tee -a ${LOG};
  ${SCRIPTPATH}/${UNIT_FILE}.template.sh | sudo -A tee ${SCRIPTPATH}/${UNIT_FILE};
  echo -e "${PRTY} Copying unit file to Systemd directory" | tee -a ${LOG};
  sudo -A cp ${SCRIPTPATH}/${UNIT_FILE} /etc/systemd/system/ >> ${LOG};
  echo -e "${PRTY} Enabling '${UNIT_FILE}'." | tee -a ${LOG};
  sudo -A systemctl enable ${UNIT_FILE} >> ${LOG};
  echo -e "${PRTY} Starting '${UNIT_FILE}'." | tee -a ${LOG};
  sudo -A systemctl start ${UNIT_FILE} >> ${LOG};

  echo -e "${PRTY} Looking for '${DEPLOY_USER}' user." | tee -a ${LOG};
  if ! id -u ${DEPLOY_USER} &>/dev/null; then

    echo -e "${PRTY} Creating user '${DEPLOY_USER}' . . .  " | tee -a ${LOG};
    sudo -A adduser --disabled-password --gecos "" ${DEPLOY_USER} >>  ${LOG};

    echo -e "${PRTY} Adding user '${DEPLOY_USER}' to sudoers . . .  " | tee -a ${LOG};
    sudo -A usermod -aG sudo ${DEPLOY_USER};

  fi;

  echo -e "${PRTY} Setting password '${DEPLOY_USER_PWD}' for user '${DEPLOY_USER}' . . .  " | tee -a ${LOG};
  touch /dev/shm/tmppwd;
  chmod go-rwx /dev/shm/tmppwd;
cat << EOF > /dev/shm/tmppwd
${DEPLOY_USER}:${DEPLOY_USER_PWD}
EOF
  # ls -l /dev/shm/tmppwd;
  # cat /dev/shm/tmppwd;
  cat /dev/shm/tmppwd | sudo -A chpasswd;
  rm -fr /dev/shm/tmppwd;


  sudo -A chown -R ${DEPLOY_USER}:${DEPLOY_USER} ${DEPLOY_DIR};

  echo -e "${PRTY} Adding caller's credentials to authorized SSH keys of '${DEPLOY_USER}' . . .  " | tee -a ${LOG};
  echo -e "${PRTY} -------------------------------------";
  echo -e "${PRTY} DEPLOY_DIR=${DEPLOY_DIR}";
  echo -e "${PRTY} DEPLOY_SSH_DIR=${DEPLOY_SSH_DIR}";
  echo -e "${PRTY} DEPLOY_USER_SSH_KEY_PUBL=${DEPLOY_USER_SSH_KEY_PUBL}";
  echo -e "${PRTY} DEPLOY_SSH_AXS=${DEPLOY_SSH_AXS}";
  echo -e "${PRTY} DEPLOY_USER=${DEPLOY_USER}";

  sudo -A mkdir -p ${DEPLOY_SSH_DIR};
  sudo -A cp ${DEPLOY_USER_SSH_KEY_PUBL} ${DEPLOY_SSH_AXS};
  sudo -A chown -R ${DEPLOY_USER}:${DEPLOY_USER} ${DEPLOY_SSH_DIR};


  echo -e "${PRTY} Making SUDO_ASK_PASS for '${DEPLOY_USER}' user  ... (  in $(pwd)  )";
  sudo -A -sHu ${DEPLOY_USER} bash -c "source askPassMaker.sh; makeAskPassService ${DEPLOY_USER} '${DEPLOY_USER_PWD}';";


  declare PGPASSFILE=${DEPLOY_DIR}/.pgpass;
  echo -e "${PRTY} Making '${PGPASSFILE}' for '${DEPLOY_USER}' user  ...";
  sudo -A touch ${PGPASSFILE};
  sudo -A chmod 666 ${PGPASSFILE};
  echo "*:*:*:${DEPLOY_USER}:${DEPLOY_USER_SSH_PASS_PHRASE}" > ${PGPASSFILE};
  sudo -A chmod 0600 ${PGPASSFILE};
  sudo -A chown ${DEPLOY_USER}:${DEPLOY_USER} ${PGPASSFILE};

  PG_USER="postgres";
  sudo -A cp -r postgresql /etc;
  sudo -A chmod -R o-rwx /etc/postgresql;
  sudo -A chown -R ${PG_USER}:${PG_USER} /etc/postgresql;

  sudo -A systemctl restart postgresql.service;
  declare DEFAULTDB='template1';
  echo -e "

      declare NO_SUCH_USER=\$(sudo -Au postgres psql -tc \"SELECT 1 FROM pg_user WHERE usename = '${DEPLOY_USER}'\");
      if [[ -z \${NO_SUCH_USER} ]]; then
        echo -e \"Creating role '${RDBMS_ROLE}'.\" ;
        sudo -Au postgres psql -d template1 \
            -tc \"CREATE ROLE ${RDBMS_ROLE} CREATEDB CREATEROLE;\";
        echo -e \"Creating user '${DEPLOY_USER}'.\" ;
        sudo -Au postgres psql -d template1 \
            -tc \"CREATE USER ${DEPLOY_USER} WITH PASSWORD '${DEPLOY_USER_SSH_PASS_PHRASE}' CREATEDB CREATEROLE;\";
      else
        echo -e \"User '${DEPLOY_USER}' already exists.\" ;
      fi;
      sudo -Au postgres psql -d template1 -tc \"GRANT ALL PRIVILEGES ON DATABASE ${DEFAULTDB} to ${DEPLOY_USER};\";
      sudo -Au postgres psql -d template1 -tc \"GRANT ${RDBMS_ROLE} to ${DEPLOY_USER};\";

  wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
  ";

  declare NO_SUCH_USER=$(sudo -Au postgres psql -tc "SELECT 1 FROM pg_user WHERE usename = '${DEPLOY_USER}'");
  if [[ -z ${NO_SUCH_USER} ]]; then
    echo -e "Creating role '${RDBMS_ROLE}'." ;
    sudo -Au postgres psql -d template1 \
        -tc "CREATE ROLE ${RDBMS_ROLE} CREATEDB CREATEROLE;";
    echo -e "Creating user '${DEPLOY_USER}'." ;
    sudo -Au postgres psql -d template1 \
        -tc "CREATE USER ${DEPLOY_USER} WITH PASSWORD '${DEPLOY_USER_SSH_PASS_PHRASE}' CREATEDB CREATEROLE;";
  else
    echo -e "User '${DEPLOY_USER}' already exists." ;
  fi;

  sudo -Au postgres psql -d template1 -tc "GRANT ALL PRIVILEGES ON DATABASE ${DEFAULTDB} to ${DEPLOY_USER};";

  sudo -Au postgres psql -d template1 -tc "GRANT ${RDBMS_ROLE} to ${DEPLOY_USER};";

  # declare NO_SUCH_USER=$(sudo -Au postgres psql -tc "SELECT 1 FROM pg_user WHERE usename = '${DEPLOY_USER}'");
  # if [[ -z NO_SUCH_USER ]]; then
  #   echo -e "Creating role '${DBNAME}'." ;
  #   sudo -Au postgres psql -d template1 \
  #       -tc "CREATE ROLE ${DBNAME} CREATEDB CREATEROLE;";
  #   echo -e "Creating user '${DEPLOY_USER}'." ;
  #   sudo -Au postgres psql -d template1 \
  #       -tc "CREATE USER ${DEPLOY_USER} WITH PASSWORD '${DEPLOY_USER_SSH_PASS_PHRASE}';";
  # else
  #   echo -e "User '${DEPLOY_USER}' already exists." ;
  # fi;
  # sudo -Au postgres psql -d template1 -tc "GRANT ALL PRIVILEGES ON DATABASE ${DEFAULTDB} to ${DEPLOY_USER};";
  # sudo -Au postgres psql -d template1 -tc "GRANT ROLE ${DBNAME} to ${DEPLOY_USER};";

popd;

echo -e "${PRTY} Moving bundle directory, '${BUNDLE_DIRECTORY_NAME}' to '/home/${DEPLOY_USER}'";
sudo -A rm -fr ${BUNDLE_NAME};
sudo -A rm -fr ${DEPLOY_DIR}/${BUNDLE_DIRECTORY_NAME};
sudo -A mv ${BUNDLE_DIRECTORY_NAME} ${DEPLOY_DIR};
sudo -A chown -R ${DEPLOY_USER}:${DEPLOY_USER} ${DEPLOY_DIR}/${BUNDLE_DIRECTORY_NAME};
sudo -A chmod go-rwx ${DEPLOY_DIR}/${BUNDLE_DIRECTORY_NAME};

echo -e "${PRTY} Complete
                   Quitting target RPC... :: $(date)";
exit;
