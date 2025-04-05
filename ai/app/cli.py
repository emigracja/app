import typer

from .tests import cli

app = typer.Typer(no_args_is_help=True)
app.add_typer(cli.app, name="tests", help="Tests")

if __name__ == "__main__":
    app()
