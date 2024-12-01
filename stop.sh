#!/bin/bash

if [[ $REVIEWIIITH_DIR == "" ]]; then
    REVIEWIIITH_DIR=.
fi

docker-compose -f $REVIEWIIITH_DIR/docker-compose.yml -p reviewiiith down
