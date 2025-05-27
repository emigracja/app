# AI 

API docs can be found under `/docs` and `/redoc`.

Refer to the main README.md for deployment instructions.

## CLI

```bash
poetry run python -m app.cli

# For example, if you wish to run simple tests:
poetry run python -m app.cli tests run

# For advanced configuration:
poetry run python -m app.cli tests run --help
```


## Development

Please set up pre-commit hooks on your local machine:

```bash
pip install pre-commit
pre-commit install
```

This will automatically reformat the code before a commit.

## Package management

If you wish to add a package to the container, use Poetry:

```bash
poetry add package
```
