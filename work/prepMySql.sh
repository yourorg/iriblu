#!/usr/bin/env bash

declare PRTY="\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nMYSQL -- Installation :: ";

export MARIADB_VERSION="10.2";

sudo -A apt-get install -y software-properties-common;
sudo -A apt-get install -y debconf-utils;

sudo -A apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xF1656F24C74CD1D8;
sudo -A add-apt-repository "deb http://mariadb.mirror.colo-serv.net/repo/${MARIADB_VERSION=}/ubuntu $(lsb_release -sc) main";

sudo -A apt-get -y update;
sudo -A apt-get -y upgrade;

export RDBMS_PWD="MemorableHieroglyphs+2-1-1";

sudo -A debconf-set-selections <<< "maria-db-${MARIADB_VERSION} mysql-server/root_password password ${RDBMS_PWD}";
sudo -A debconf-set-selections <<< "maria-db-${MARIADB_VERSION} mysql-server/root_password_again password ${RDBMS_PWD}";

echo -e "${PRTY} Installing MariaDB .............";
sudo -A apt-get install -y mariadb-server;

echo -e "${PRTY} Restarting MariaDB .............";
sudo -A systemctl restart mysql;

echo -e "${PRTY} Testing MariaDB .............";
mysql -u root -p${RDBMS_PWD} -e "select User, Host from user;" mysql;

if [ $(dpkg-query -W -f='${Status}' expect 2>/dev/null | grep -c "ok installed") -eq 0 ]; then
  echo -e "${PRTY} Installing 'expect'.";
  sudo -A apt-get -y install expect;
fi

echo -e "${PRTY} Securing MySql . . . ";

SECURE_MYSQL=$(expect -c "

set timeout 3
spawn mysql_secure_installation

expect \"Enter current password for root (enter for none):\"
send \"${RDBMS_PWD}\r\"

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
exit 0;
