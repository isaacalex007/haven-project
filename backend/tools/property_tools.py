# backend/tools/property_tools.py
from langchain.tools import tool
from pydantic import BaseModel, Field

# MOCK DATA - In a real app, these would call live APIs
PROPERTIES_DB = {
    "aspen, co": [{
        "address": "12 Lakeview Dr, Aspen, CO 81611", "price": 1250000, "beds": 2, "baths": 2, "sqft": 1500,
        "description": "Stunning condo with panoramic lake and mountain views, minutes from the slopes.",
        "imageUrl": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop"
    }]
}
MAPS_DB = { "12 Lakeview Dr, Aspen, CO 81611": {"commute_time_mins": 25, "nearby_parks": 3} }
YELP_DB = { "12 Lakeview Dr, Aspen, CO 81611": {"nearby_cafes": 5, "rating": 4.5} }

class SearchInput(BaseModel):
    query: str = Field(description="A detailed, natural language description of the user's dream house and lifestyle.")

@tool("property_search", args_schema=SearchInput)
def property_search(query: str) -> list:
    """Performs a semantic search for properties based on a rich, natural language description."""
    print(f"--- PROPERTY SEARCH FOR: {query} ---")
    # In a real app, this would query a vector database.
    # We'll simulate a match for "lake and mountain view".
    if "lake" in query.lower() and "mountain" in query.lower():
        return PROPERTIES_DB.get("aspen, co", [])
    return []

@tool("maps_service")
def maps_service(address: str) -> dict:
    """Finds commute time and nearby parks for a given property address."""
    print(f"--- MAPS SEARCH FOR: {address} ---")
    return MAPS_DB.get(address, {})

@tool("yelp_service")
def yelp_service(address: str) -> dict:
    """Finds nearby cafes and local ratings for a given property address."""
    print(f"--- YELP SEARCH FOR: {address} ---")
    return YELP_DB.get(address, {})