#!/usr/bin/env bash
#
declare PRETTY="~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nIRIBLU Build and upload :: ";

export NEW_VERSION=${1:-0.0.0};
source .habitat/plan.sh;

pushd ../IriBluBuilt &>/dev/null;

  echo -e "${PRETTY} validate version bump number ...";
  source .habitat/scripts/semver-shell/semver.sh;

  semverValidate ${NEW_VERSION} || { echo "Bad version number '${NEW_VERSION}'"; exit 1; }

  semverGE ${NEW_VERSION} ${pkg_version} || { echo "The old version number '${pkg_version}' is greater than '${NEW_VERSION}'!"; exit 1; }

  echo -e "${PRETTY} patch package.json ...";
  sed -i "s|.*\"name\".*|  \"name\": \"${pkg_name}\",|" package.json
  sed -i "s|.*\"repository\".*|  \"repository\": \"${pkg_upstream_url}\",|" package.json
  sed -i "s|.*\"version\".*|  \"version\": \"${NEW_VERSION}\",|" package.json

popd &>/dev/null;

echo -e "${PRETTY} patch .habitat/plan.sh ...";
sed -i "s|^pkg_version.*|pkg_version=${NEW_VERSION}|" .habitat/plan.sh;
cp .habitat/plan.sh ../IriBluBuilt/.habitat;

pushd ../IriBluBuilt &>/dev/null;

  echo -e "${PRETTY} building ...";
  .habitat/BuildAndUpload.sh ${NEW_VERSION}

popd &>/dev/null;

echo -e "${PRETTY}
 ... done!";
