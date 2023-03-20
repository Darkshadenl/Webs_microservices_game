#!/bin/bash

ENV_VAR=$(printenv ENV)

rm -rf ./node_modules/*

yarn run "${ENV_VAR}"


