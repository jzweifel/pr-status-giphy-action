#!/bin/sh

# Exit if any subcommand fails
set -e

sh -c "node index.js $*"
