#!/bin/sh

# https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/
set -eu
sh -c "npm --prefix /action install /action --production"
sh -c "node /action/index.js $*"
