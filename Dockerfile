# install and cache dependencies
FROM oven/bun:1 AS bun_cache
WORKDIR /cache/
COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile --production

FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS python_cache
ENV PATH="/cache/.venv/bin:$PATH"
WORKDIR /cache/
COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --frozen --no-dev

# build with bun
FROM bun_cache AS bun_builder
ARG VITE_SUBPATH
ARG VITE_MSG_MAX_LEN
ENV VITE_SUBPATH=${VITE_SUBPATH}
ENV VITE_MSG_MAX_LEN=${VITE_MSG_MAX_LEN}
WORKDIR /cache/
COPY frontend .
RUN bun run build

# serve frontend+backend
FROM python_cache AS runner
ENV PYTHONUNBUFFERED 1
WORKDIR /app/backend
COPY --from=bun_builder /cache/dist /app/frontend/dist
COPY backend .
CMD ["python3", "main.py"]
