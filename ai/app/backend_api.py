import uuid

from .schemas import Stock


def get_stocks() -> list[Stock]:
    # TODO: Fetch the list from backend API
    return [
        Stock(
            id=uuid.uuid4(),
            symbol="AAPL",
            name="Apple Inc.",
            description="Apple Inc. is an American multinational technology company that specializes in consumer electronics, computer software, and online services.",
            city="Cupertino",
            country="United States",
        ),
        Stock(
            id=uuid.uuid4(),
            symbol="MSFT",
            name="Microsoft Corporation",
            description="Microsoft Corporation is an American multinational technology company that produces computer software, consumer electronics, personal computers, and related services.",
            ekd="Technology",
            city="Redmond",
            country="United States",
        ),
        Stock(
            id=uuid.uuid4(),
            symbol="AMZN",
            name="Amazon.com Inc.",
            description="Amazon.com Inc. is an American multinational technology company that focuses on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
            ekd="Consumer Cyclical",
            city="Seattle",
            country="United States",
        ),
    ]
