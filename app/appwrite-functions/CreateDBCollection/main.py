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
    print(f"Endpoint: {os.getenv('APPWRITE_ENDPOINT')}")
    print(f"Project: {os.getenv('APPWRITE_FUNCTION_PROJECT_ID')}")
    print(f"Key: {os.getenv('APPWRITE_API_KEY')}")

    return client

def main():
    EVENT_DATA = json.loads(os.getenv("APPWRITE_FUNCTION_EVENT_DATA"))

    client = init_client()
    database = Database(client)
    
    result = database.create_collection(
        EVENT_DATA["$id"], # set collection id to file id
        EVENT_DATA["name"], # set collection name to file name
        "collection", # permissions on collection level
        EVENT_DATA["$read"], # copy read permission from file
        EVENT_DATA["$write"] # copy write permission from file
    )
    print(f"Create collection: {result}")

    database.create_string_attribute(
        EVENT_DATA["$id"], # collection id
        "bodyValue", # attribute name
        512, # attribute length
        True # attribute is required
    )

    database.create_enum_attribute(
        EVENT_DATA["$id"],
        "motivation",
        ["commenting", "replying"], # possible values
        True
    )

    database.create_string_attribute(
        EVENT_DATA["$id"],
        "targetSelector",
        1024,
        False
    )

    database.create_float_attribute(
        EVENT_DATA["$id"], # collection id
        "targetInkList", # attribute name
        False, # not required
        None, # min value, will be ignored?
        None, # max value, will be ignored?
        None, # default value, will be ignored?
        True # attribute is array
    )
    
    database.create_integer_attribute(
        EVENT_DATA["$id"],
        "targetInkListLengths",
        False,
        None,
        None,
        None,
        True
    )

    database.create_string_attribute(
        EVENT_DATA["$id"],
        "stylesheetValue",
        1024,
        False
    )

    database.create_string_attribute(
        EVENT_DATA["$id"],
        "targetSource",
        64,
        True
    )

    database.create_string_attribute(
        EVENT_DATA["$id"],
        "creatorId",
        64,
        True
    )

    database.create_string_attribute(
        EVENT_DATA["$id"],
        "creatorName",
        64,
        True
    )

    database.create_string_attribute(
        EVENT_DATA["$id"],
        "created",
        20,
        True
    )

    database.create_string_attribute(
        EVENT_DATA["$id"],
        "modified",
        20,
        True
    )

if __name__ == "__main__":
    main()