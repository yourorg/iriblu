#!/usr/bin/env bash
#
function makeAskPassService() {
  SSHPTH="/home/${1}/.ssh";
  SUPWD="${SSHPTH}/.supwd.sh";
  mkdir -p ${SSHPTH};
  echo -e '#!/usr/bin/env bash' > ${SUPWD};
  echo -e '#' >> ${SUPWD};
  echo -e "echo '${2}';" >> ${SUPWD};
  chmod a+x,go-rwx ${SUPWD};
  echo "Created the ASKPASS service.";
  #
  export PTRN="# ASK_PASS service for ${1}";
  export PTRNB="${PTRN} «begins»";
  export PTRNE="${PTRN} «ends»";
  #
  BL_PATH="/home/${1}/.bash_login";
  touch ${BL_PATH};
  sed -i "/${PTRNB}/,/${PTRNE}/d" ${BL_PATH};
  #
  echo -e "${PTRNB}
export SUDO_ASKPASS=\"${SUPWD}\";
if [ -f "$HOME/.profile" ]; then
. "$HOME/.profile"
fi
${PTRNE}
" >> ${BL_PATH}
  #
  sed -i "s/ *$//" ${BL_PATH}; # trim whitespace to EOL
  sed -i "/^$/N;/^\n$/D" ${BL_PATH}; # blank lines to 1 line

}
