# cache dependencies
FROM python:3.12 AS python_cache
ENV VIRTUAL_ENV=/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
WORKDIR /cache/
COPY requirements.txt .
RUN python -m venv /venv
RUN pip install -r requirements.txt

# build and start
FROM python:3.12-slim AS build
EXPOSE 8000
ENV PYTHONUNBUFFERED 1
WORKDIR /app
ENV VIRTUAL_ENV=/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
COPY --from=python_cache /venv /venv
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
