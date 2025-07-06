from neo4j import GraphDatabase
import os
from dotenv import load_dotenv


load_dotenv()

URI = os.getenv("NEO4J_DB_URL")
AUTH = (
    os.getenv("NEO4J_DB_USERNAME"),
    os.getenv("NEO4J_DB_PASSWORD"),
)

with GraphDatabase.driver(URI, auth=AUTH) as driver:
    driver.verify_connectivity()
