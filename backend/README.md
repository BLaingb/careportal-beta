# ProjectName - Backend

## Requirements

* [Docker](https://www.docker.com/).
* [uv](https://docs.astral.sh/uv/) for Python package and environment management.

## Built With
- FastAPI
- uv
- SQLModel
- SQlite

## General Workflow

Recommended use with VSCode DevContainers.
By default, the dependencies are managed with [uv](https://docs.astral.sh/uv/), go there and install it.

From `./backend/` you can install all the dependencies with:

```console
$ uv sync
```

Then you can activate the virtual environment with:

```console
$ source .venv/bin/activate
```

Run in dev mode
```console
$ fastapi dev --reload app/main.py
```

Make sure your editor is using the correct Python virtual environment, with the interpreter at `backend/.venv/bin/python`.

### Models
Use SQLModel to create database models, register them on app/alembic/env.py to keep track of migrations

Create migrations with
```console
alembic revision --autogenerate -m "migration name"
```

Run migrations with
```console
alembic upgrade heaad
```

## Deployment
Best to deploy by running the Docker Image. Set the environment variables, and docker run. Run migrations after running the image
