import os
import json

from appwrite.client import Client
from appwrite.services.database import Database
from appwrite.exception import AppwriteException

def init_client():
    """Initialize Appwrite client"""
    client = Client()
    client.set_endpoint(os.getenv("APPWRITE_ENDPOINT"))
    client.set_project(os.getenv("APPWRITE_FUNCTION_PROJECT_ID"))
    client.set_key(os.getenv("APPWRITE_API_KEY"))

    return client

def main():
    EVENT_DATA = json.loads(os.getenv("APPWRITE_FUNCTION_EVENT_DATA"))

    client = init_client()
    database = Database(client)

    result = database.delete_collection(
        EVENT_DATA["$id"] # collection id
    )
    print(f"Deleted collection: {result}")

if __name__ == "__main__":
    main()