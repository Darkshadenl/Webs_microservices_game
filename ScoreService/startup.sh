#!/bin/bash

ENV_VAR=$(printenv ENV)

rm -rf ./node_modules/*
mv .yarnrc_docker.yml .yarnrc.yml

yarn run "${ENV_VAR}"


