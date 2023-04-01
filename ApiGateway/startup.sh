#!/bin/bash

ENV_VAR=$(printenv ENV)
echo  $ENV_VAR

echo 'Running startup.sh'

rm -rf ./node_modules/*

yarn run dev
