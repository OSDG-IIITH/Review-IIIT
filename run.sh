#!/bin/bash

if [[ $REVIEWIIITH_DIR == "" ]]; then
    REVIEWIIITH_DIR=.
fi

# Default value
ENV=${1:-prod}

case $ENV in
    "dev")
        source .env  # load env variables into environment

        cd frontend
        bun i  # install frontend dependencies
        bun run dev &  # run frontend in dev mode, in background

        cd ../backend
        uv sync # install backend dependencies
        fastapi dev  # run backend in dev mode
        ;;
    "prod")
        docker-compose -f $REVIEWIIITH_DIR/docker-compose.yml -p reviewiiith up --build
        ;;
    *)
        echo "Invalid argument. Use 'dev' or 'prod'"
        exit 1
        ;;
esac
