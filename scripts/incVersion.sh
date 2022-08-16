#!/usr/bin/env bash

if [ "$1" = "major" ]; then
  yarn changelog -M && yarn version major
elif [ "$1" = "minor" ]; then
  yarn changelog -m && yarn version minor
elif [ "$1" = "patch" ]; then
  yarn changelog -p && yarn version patch
else
  echo "ERROR! None of supported arguments found [major, minor, patch]"
  exit 1
fi

PACKAGE_VERION=v$(node -p -e "require('./package.json').version")

git add CHANGELOG.md && git add package.json && git commit -m $PACKAGE_VERION && git push
git tag $PACKAGE_VERION
git push origin --tags
