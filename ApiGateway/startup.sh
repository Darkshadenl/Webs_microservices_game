#!/bin/bash

ENV_VAR=$(printenv ENV)

echo 'Running startup.sh'

rm -rf ./node_modules/*

yarn run "${ENV_VAR}"
