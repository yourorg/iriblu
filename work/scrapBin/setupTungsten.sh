#!/usr/bin/env bash

declare PRTY="\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nTungsten -- Setup :: ";

export TUNGSTEN_USER="tungsten";
export TUNGSTEN_PATH="tungsten-replicator";
export TUNGSTEN_VERSION="4.0.1-123";


export GITHUB_TUNGSTEN="https://github.com/vmware/${TUNGSTEN_PATH}/releases/download/";

export DEPLOY_VARS="/dev/shm/deploy.sh";
cat << EODPY > ${DEPLOY_VARS}
export MYSQL_PORT=3306;
export MYSQL_BASEDIR="/usr/bin/mysql";
export MYSQL_CONF="/etc/mysql/my.cnf";
export MYSQL_BINLOG_DIRECTORY="/var/log/mysql/";
export DEPLOY_HOME="/opt/continuent/deploy";
export MYSQL_DEPLOY=\$DEPLOY_HOME/mysql;
export MONGODB_DEPLOY=\$DEPLOY_HOME/mongodb;
export MONGODB_PORT=27017;
export TUNGSTEN_BINARIES=/opt/continuent/software/tungsten-replicator;
export MASTER_THL_PORT=12500;
export SLAVE_THL_PORT=12600;
export MASTER_RMI_PORT=11500;
export SLAVE_RMI_PORT=11600;
EODPY
chmod +x ${DEPLOY_VARS};

source ${DEPLOY_VARS};
echo -e "MYSQL_DEPLOY = ${MYSQL_DEPLOY}";

export INSTALL_SCRIPT="/dev/shm/install_master.sh";
cat << EOIM > ${INSTALL_SCRIPT}
#!/usr/bin/env bash
#
. ${DEPLOY_VARS}

export PATH=${MYSQL_BASEDIR}/bin:${PATH};

cd ${TUNGSTEN_BINARIES};

./tools/tpm --master-slave -a \
  --datasource-type=mysql \
  --master-host=127.0.0.1  \
  --datasource-user=tungsten  \
  --datasource-password=secret  \
  --datasource-mysql-conf=${MYSQL_CONF} \
  --datasource-log-directory=${MYSQL_BINLOG_DIRECTORY} \
  --datasource-port=${MYSQL_PORT} \
  --service-name=mongodb \
  --home-directory=${MYSQL_DEPLOY} \
  --cluster-hosts=127.0.0.1 \
  --thl-port=${MASTER_THL_PORT} \
  --rmi-port=${MASTER_RMI_PORT} \
  --java-file-encoding=UTF8 \
  --mysql-use-bytes-for-string=false \
  --mysql-enable-enumtostring=true \
  --mysql-enable-settostring=true \
  --svc-extractor-filters=colnames,pkey \
  --svc-parallelization-type=none --start-and-report
EOIM
chmod +x ${INSTALL_SCRIPT};
# --------------------------------

echo -e "${PRTY} Starting ..............";

sudo -A adduser --disabled-password --gecos "" ${TUNGSTEN_USER};
sudo -A sudo usermod -a -G adm  "${TUNGSTEN_USER}";

dpkg -s ruby-full >/dev/null || sudo apt-get install -y ruby-full;

pushd /opt >/dev/null;

  sudo -A mkdir -p continuent/software;
  pushd continuent >/dev/null;

    if [[ ! -f software/${TUNGSTEN_PATH}/tools/tpm ]]; then
      pushd software >/dev/null;
        sudo -A rm -fr ${TUNGSTEN_PATH};
        sudo -A wget -O ${TUNGSTEN_PATH}.deb \
             ${GITHUB_TUNGSTEN}v4.0.1/${TUNGSTEN_PATH}_${TUNGSTEN_VERSION}_all.deb;
        sudo -A dpkg -i ${TUNGSTEN_PATH}.deb;
        sudo -A ln -s ${TUNGSTEN_PATH}-oss-${TUNGSTEN_VERSION} ${TUNGSTEN_PATH};
        sudo -A rm -fr ${TUNGSTEN_PATH}.deb;
        sudo -A rm -fr ${TUNGSTEN_PATH}-oss-${TUNGSTEN_VERSION}.tar.gz;
      popd >/dev/null;
    fi;
    
    sudo -A mkdir -p deploy/mysql;
    sudo -A mkdir -p deploy/mongodb;
    pushd deploy >/dev/null;


    popd >/dev/null;

  popd >/dev/null;

popd >/dev/null;

${INSTALL_SCRIPT};

echo -e "${PRTY} Done setup ...............";

exit 0;
