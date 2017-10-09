#!/usr/bin/env bash
#
export ENVAR_FILE=".bash_login";
function initNvmMaker() {


  local PTRN="# NVM prep for ${1}";
  local PTRNB="${PTRN} «begins»";
  local PTRNE="${PTRN} «ends»";
  echo -e "Creating : ${PTRN}";
  #
  BL_PATH="/home/${1}/${ENVAR_FILE}";
  touch ${BL_PATH};

  sed -i "/${PTRNB}/,/${PTRNE}/d" ${BL_PATH}; # Delete previous
  #
  echo -e "${PTRNB}
export NVM_DIR=\"\${HOME}/.nvm\"
[ -s \"\${NVM_DIR}/nvm.sh\" ] && \. \"\${NVM_DIR}/nvm.sh\"  # This loads nvm
[ -s \"\${NVM_DIR}/bash_completion\" ] && \. \"\${NVM_DIR}/bash_completion\"  # This loads nvm bash_completion
${PTRNE}
" >> ${BL_PATH}
  #
  sed -i "s/ *$//" ${BL_PATH}; # trim whitespace to EOL
  sed -i "/^$/N;/^\n$/D" ${BL_PATH}; # blank lines to 1 line

}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  initNvmMaker ${USER};
  source /home/${USER}/${ENVAR_FILE};
fi;
