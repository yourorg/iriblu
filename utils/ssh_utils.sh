export PRETTY="ssh_utils :: ";

function startSSHAgent() {

  echo "SSH_AUTH_SOCK -- ${SSH_AUTH_SOCK}";
  if [ -S "${SSH_AUTH_SOCK}" ]; then
    echo -e "${PRETTY} Started 'ssh-agent' ...";
  else
    echo -e "${PRETTY} Starting 'ssh-agent' because SSH_AUTH_SOCK='${SSH_AUTH_SOCK}'...";
    eval $(ssh-agent -s);
    echo -e "${PRETTY} Started 'ssh-agent' ...";
  fi;

};

function AddSSHkeyToAgent() {

  local KEY_FILE="${1}";
  local PASS_PHRASE="${2}";

  # echo "PASS_PHRASE = '${PASS_PHRASE}', KEY_FILE = '${KEY_FILE}'";

  local KEY_PRESENT=$(ssh-add -l | grep -c ${KEY_FILE});
  if [[ "${KEY_PRESENT}" -gt "0" ]]; then
    return 1;
  elif [[ -f ${KEY_FILE} ]]; then
    echo -e "${PRETTY} Remembering SSH key: '${KEY_FILE}'...";
    startSSHAgent;
    expect << EOF
      spawn ssh-add ${KEY_FILE}
      expect "Enter passphrase"
      send -- "${PASS_PHRASE}\r"
      expect eof
EOF
  else
    return 1;
  fi;

};

function makeTargetAuthorizedHostSshKeyIfNotExist() {

  COMMENT="${1}";
  PASS_PHRASE="${2}";
  KEY_PATH="${3}";  # HABITAT_USER_SSH_KEY_PATH
  KEY_FILE="${4}";  # HABITAT_USER_SSH_KEY_FILE

  echo "COMMENT = '${COMMENT}', PASS_PHRASE = '${PASS_PHRASE}'";
  echo "KEY_PATH = '${KEY_PATH}', KEY_FILE = '${KEY_FILE}'";
  mkdir -p ${KEY_PATH};

  if [[ -f ${KEY_FILE} && -f ${KEY_FILE}.pub ]]; then
    echo -e "${PRETTY}Target server 'authorized_host' key pair already exists.";
  else
    echo -e "${PRETTY}Target server 'authorized_host' key pair not found.  Creating now.";
    rm -f ${KEY_FILE}*;
    ssh-keygen \
      -t rsa \
      -C "${COMMENT}" \
      -f "${KEY_FILE}" \
      -P "${PASS_PHRASE}" \
      && cat ${KEY_FILE}.pub;
    chmod go-rwx ${KEY_FILE};
    chmod go-wx ${KEY_FILE}.pub;
    chmod go-w ${KEY_PATH};
  fi;
  echo -e "  -- keys are here : '${KEY_PATH}'.";

}

function chkHostConn() {
    echo -e "${PRETTY}Verifying target server rear access : ${TARGET_SRVR}.";
    ping -c 4 ${TARGET_SRVR};

    echo -e "${PRETTY}Verifying target server front access : ${VIRTUAL_HOST_DOMAIN_NAME}.";
    ping -c 4 ${VIRTUAL_HOST_DOMAIN_NAME};
}

function makeSSH_Config_File() {

  mkdir -p ${SSH_PATH};
  touch ${SSH_CONF_FILE};
  cp ${SSH_CONF_FILE} ${SSH_CONF_FILE}_BK &>/dev/null;
  chmod ugo-w ${SSH_CONF_FILE}_BK;

}
#

function addSSH_Config_Identity() {
  USER_ID=${1};
  SRVR=${2};
  SSH_KEY_FILE=${3};

  export PTRN="# ${USER_ID} account on ${SRVR}";
  export PTRNB="${PTRN} «begins»";
  export PTRNE="${PTRN} «ends»";
  #
  sed -i "/${PTRNB}/,/${PTRNE}/d" ${SSH_CONF_FILE};
  #
echo -e "${PTRNB}
Host ${SRVR}
    HostName ${SRVR}
    User ${USER_ID}
    PreferredAuthentications publickey
    IdentityFile ${SSH_KEY_FILE}
${PTRNE}
" >> ${SSH_CONF_FILE}

  sed -i "s/ *$//" ${SSH_CONF_FILE}; # trim whitespace to EOL
  sed -i "/^$/N;/^\n$/D" ${SSH_CONF_FILE}; # blank lines to 1 line
}

