# install and cache dependencies
FROM node:20-slim AS node_cache
WORKDIR /cache/
COPY frontend/package*.json ./
RUN npm install --prefer-offline --no-audit --progress=true --loglevel verbose --omit=dev

FROM python:3.12-slim AS python_cache
ENV VIRTUAL_ENV=/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
WORKDIR /cache/
COPY backend/requirements.txt .
RUN python -m venv /venv
RUN pip install -r requirements.txt

# build with npm
FROM node:20-slim AS node_builder
ARG HOST_SUBPATH
ARG MSG_MAX_LEN
ENV VITE_BASE ${HOST_SUBPATH}/
ENV VITE_MSG_MAX_LEN ${MSG_MAX_LEN}
WORKDIR /frontend
COPY --from=node_cache /cache/ .
COPY frontend .
RUN npm run build

# serve frontend+backend
FROM python:3.12-slim AS runner
ENV PYTHONUNBUFFERED 1
WORKDIR /app
ENV VIRTUAL_ENV=/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
COPY --from=python_cache /venv /venv
COPY --from=node_builder /frontend/dist /app/frontend/dist
COPY backend backend
WORKDIR /app/backend
CMD ["python3", "main.py"]
