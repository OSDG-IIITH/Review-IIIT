#!/bin/bash

if [[ $REVIEWIIITH_DIR == "" ]]; then
    REVIEWIIITH_DIR=.
fi

# Default value
ENV=${1:-prod}

case $ENV in
    "dev")
        # install frontend dependencies, run frontend in dev mode, in background
        cd frontend
        bun i
        bun run --env-file=../.env dev &

        # install backend dependencies, run backend in dev mode
        cd ../backend
        uv run --env-file=../.env fastapi dev
        ;;
    "prod")
        docker-compose -f $REVIEWIIITH_DIR/docker-compose.yml -p reviewiiith up --build
        ;;
    *)
        echo "Invalid argument. Use 'dev' or 'prod'"
        exit 1
        ;;
esac
