#!/usr/bin/env bash
#
declare START_TIME=$(date +%s);
declare PRETTY="~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nIRIBLU Initialize :: ";

sudo ls >/dev/null;

echo -e "${PRETTY} prepare NodeJS versions ...";
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

export INSTALL="curl";
dpkg -s ${INSTALL} >/dev/null && echo " - ${INSTALL} is installed" || sudo apt-get install -y ${INSTALL};

export INSTALL="jq";
dpkg -s ${INSTALL} >/dev/null && echo " - ${INSTALL} is installed" || sudo apt-get install -y ${INSTALL};

export PURGE="nodejs";
dpkg -s ${PURGE} &>/dev/null && sudo apt-get purge -y ${PURGE} || echo " - ${PURGE} has been purged";

export NVM_VERSION=$(curl -s https://api.github.com/repos/creationix/nvm/releases/latest | jq -r ".name");
export NVM_INSTALLED=$(nvm --version);
if [[  "${NVM_VERSION}" = "v${NVM_INSTALLED}"  ]]; then
  echo -e " - nvm '${NVM_VERSION}' is installed";
else
  echo -e " - freshen nvm '${NVM_VERSION}'";
  wget -qO- https://raw.githubusercontent.com/creationix/nvm/${NVM_VERSION}/install.sh | bash;
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
fi;

export NODE_VERSION=4;
nvm ls ${NODE_VERSION} >/dev/null \
  && echo " - node '$( nvm version ${NODE_VERSION})' is installed" \
  || nvm install ${NODE_VERSION};

export NODE_VERSION=6;
nvm ls ${NODE_VERSION} >/dev/null \
  && echo " - node '$( nvm version ${NODE_VERSION})' is installed" \
  || nvm install ${NODE_VERSION};


echo -e "${PRETTY} Prepare 'mmks' ...";
rm -fr ./mmks;
# rm -fr ../mmks;
# rm -fr ../IriBlu;

if [[ ! -d ../mmks ]]; then
  echo "../mmks not found. Cloning into parent directory.";
  pushd .. &>/dev/null;
    git clone git@github.com:yourse1f-yourorg/mmks.git;
    pushd mmks &>/dev/null;
      git checkout -b Sep23 3af6ac71dd48818c4b8f8d4ca7fa3e460bccfcfa
      git submodule update --init --recursive;
      pushd meteor-mantra-kickstarter &>/dev/null;
        git checkout Sep23
      popd &>/dev/null;
    popd &>/dev/null;
  popd &>/dev/null;
else
  echo "Found existing '../mmks'. Updating.";
  pushd ../mmks &>/dev/null;
    git pull;
    git submodule update --recursive;
  popd &>/dev/null;
fi;

# echo -e "${PRETTY} Add more pauses ..."
# node --version
# read -n 1 -s -p "Press any key to continue";


echo -e "${PRETTY} copy in 'mmks' ..."
cp -r ../mmks . 2>/dev/null;

# read -n 1 -s -p "Press any key to continue";

echo -e "${PRETTY} purge 'mmks' demo packages..."
rm -fr mmks/.pkgs/mmks_*;
rm -fr mmks/.pkgs/*.json;

echo -e "${PRETTY} copy in our definitive packages ..."
cp -r packages/* mmks/.pkgs;


. ./standard_env_vars.sh;

echo -e "${PRETTY} step into 'mmks' subdirectory  ..."
pushd mmks &>/dev/null;

  echo -e "${PRETTY} source our user variables ..."
  if [[  -f ~/.userVars.sh  ]]; then
    . ~/.userVars.sh;
  else
    echo -e "${PRETTY} preparing user variables ..."
    .scripts/preFlightCheck.sh || exit 1;
    . ~/.userVars.sh;
  fi;
  . ${SECRETS_PATH}/${HOST_SERVER_NAME}/secrets.sh;
  echo " Specify Meteor Node version : ${METEOR_NODE_VERSION}";
  nvm use ${METEOR_NODE_VERSION};

  echo -e "${PRETTY} install 'IriBlu' ...";
  # read -n 1 -s -p "Press any key to continue";

  ./install_all.sh;

popd &>/dev/null;


echo -e "
Execution time :";
date -d@$(expr $(date +%s) - $START_TIME) -u +%H:%M:%S;
