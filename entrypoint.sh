#!/bin/sh

# https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/
set -eu
sh -c "npm install --production"
sh -c "node index.js $*"
