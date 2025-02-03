# Review-IIIT

Review portal for students, by students.

## Running the portal

For convenience of development, the commands to run the project are made into a script - `run.sh`.

### Developing in dev mode (with hot module replacement)

- Install `bun` and `uv` for your distribution.
- Setup `.env` using `.env.example`.
- Run `./run.sh dev` to serve the frontend and backend in development mode.
- Use the hostname/IP that the backend is serving on (the frontend will be proxied via the backend).
- Any changes made to the frontend or backend will be reflected immediately, no need to rebuild or rerun anything!

### Testing and deploying with Docker

- Install `docker` and `docker-compose` for your distribution.
- Setup `.env` using `.env.example`.
- Run `./run.sh` to serve both frontend and backend in a single process running under docker.
- Use the hostname/IP that the backend is serving on (the frontend will be served directly from the backend).
- Run `./stop.sh` to stop the container if it is running in the background.
