import os
import time
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
    
    result = database.create_collection(
        EVENT_DATA["$id"], # set collection id to file id
        EVENT_DATA["name"], # set collection name to file name
        "collection", # permissions on collection level
        EVENT_DATA["$read"], # copy read permission from file
        EVENT_DATA["$write"] # copy write permission from file
    )
    print(f"Create collection: {result}")

    result = database.create_string_attribute(
        EVENT_DATA["$id"], # collection id
        "comment", # attribute name
        255, # attribute length
        True, # attribute is required
        "", # default value will be ignored 
        True # attribute is array
    )
    print(f"Create comment attribute: {result}")

    result = database.create_string_attribute(
        EVENT_DATA["$id"], # collection id
        "userID", # attribute name
        255, # attribute length
        True, # attribute is required
        "", # default value will be ignored
        True # attribute is array
    )
    print(f"Create userID attribute: {result}")

    # creating int attributes failes, using string as workaround
    result = database.create_string_attribute(
        EVENT_DATA["$id"], # collection id
        "timestamp", # attribute name
        255, # attribute length
        True, # attribute is required
        "", # default value will be ignored
        True # attribute is array
    )
    print(f"Create timestamp attribute: {result}")

    result = database.create_boolean_attribute(
        EVENT_DATA["$id"], # collection id
        "isDone", # attribute name
        True # attribute is required
    )
    print(f"Create isDone attribuet: {result}")

    result = database.create_integer_attribute(
        EVENT_DATA["$id"], # collection id
        "lastActivity", # attribute name
        True # attribute is required
    )
    print(f"Create lastActivity attribute: {result}")

    while result["status"] != "available":
        time.sleep(0.5)
        result = database.get_attribute(
            EVENT_DATA["$id"],
            "lastActivity"
        )

    result = database.create_index(
        EVENT_DATA["$id"], # collection id
        "timeKey", # index name
        "key", # index type
        ["lastActivity"], # attributes to index
        ["desc"] # attribute order
    )
    print(f"Create index: {result}")




if __name__ == "__main__":
    main()