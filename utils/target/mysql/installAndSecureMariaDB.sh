#!/usr/bin/env bash

declare PRTY="\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nMariaDB -- Installation :: ";

export MARIADB_VERSION="10.2";
export DEBIAN_FRONTEND="noninteractive";


export TMP="/dev/shm/tmp.tmp";
# export SCTS="../meta/DeploymentPkgInstallerScripts/secrets/secrets.sh";
export SCTS="./secrets/secrets.sh";
touch ${TMP}; chmod go-rxw ${TMP}; sudo -A cat ${SCTS} > ${TMP}; source ${TMP}; rm -fr ${TMP};
# echo "RDBMS_ADMIN_PWD = ${RDBMS_ADMIN_PWD} ";
echo -e "${PRTY} Installing MariaDB ............. (  $(pwd)  )";

echo -e "${PRTY} Pre-seeding installer prompts .............>";
sudo -A DEBIAN_FRONTEND=noninteractive debconf-set-selections <<< "maria-db-${MARIADB_VERSION} mysql-server/root_password password ${RDBMS_ADMIN_PWD}";
sudo -A DEBIAN_FRONTEND=noninteractive debconf-set-selections <<< "maria-db-${MARIADB_VERSION} mysql-server/root_password_again password ${RDBMS_ADMIN_PWD}";
echo -e "   Pre-seeded";

echo -e "${PRTY} Obtaining dependencies .............>";
sudo -A apt-get install -y software-properties-common;
sudo -A apt-get install -y debconf-utils;

export MARIADB_SIGNING_KEY=$( \
   [[ "$(lsb_release -sr)" < "16.04" ]] && echo "0xcbcb082a1bb943db" || echo "0xF1656F24C74CD1D8" \
);
echo -e "${PRTY} MARIADB_SIGNING_KEY :: ${MARIADB_SIGNING_KEY}";
sudo -A apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 ${MARIADB_SIGNING_KEY};
sudo -A add-apt-repository "deb http://mirror.one.com/mariadb/repo/${MARIADB_VERSION}/ubuntu $(lsb_release -sc) main";

sudo -A apt-get -y update;
sudo -A apt-get -y upgrade;

echo -e "${PRTY} Installing MariaDB .............";
sudo -A DEBIAN_FRONTEND=noninteractive apt-get install -y mariadb-server;

echo -e "${PRTY} Restarting MariaDB .............";
sudo -A systemctl restart mysql;

echo -e "${PRTY} Testing MariaDB .............";
mysql -u root -p${RDBMS_ADMIN_PWD} -e "select User, Host from user;" mysql;

if [ $(dpkg-query -W -f='${Status}' expect 2>/dev/null | grep -c "ok installed") -eq 0 ]; then
  echo -e "${PRTY} Installing 'expect'.";
  sudo -A apt-get -y install expect;
fi

echo -e "${PRTY} Securing MariaDB . . . ";

SECURE_MYSQL=$(expect -c "

set timeout 3
spawn mysql_secure_installation

expect \"Enter current password for root (enter for none):\"
send \"${RDBMS_ADMIN_PWD}\r\"

expect \"Change the root password? \"
send \"n\r\"

expect \"Remove anonymous users?\"
send \"y\r\"

expect \"Disallow root login remotely?\"
send \"y\r\"

expect \"Remove test database and access to it?\"
send \"y\r\"

expect \"Reload privilege tables now?\"
send \"y\r\"

expect eof
")

echo -e "${PRTY} MySql secured. . . ";

echo -e "${PRTY} Opening remote access . . . ";
mysql -u root -p${RDBMS_ADMIN_PWD} -e "GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '${RDBMS_ADMIN_PWD}';" mysql;
mysql -u root -p${RDBMS_ADMIN_PWD} -e "FLUSH PRIVILEGES" mysql;
mysql -u root -p${RDBMS_ADMIN_PWD} -e "SELECT Host, User FROM user WHERE User = 'root' AND Host = '%';" mysql;

sudo -A sed -i '/bind-address/cbind-address\t\t= 0.0.0.0' /etc/mysql/my.cnf;

echo -e "${PRTY} Restarting MariaDB ..............";
sudo -A systemctl restart mysql;


exit 0;
