# backend/tools/property_tools.py
import os
import requests
from langchain.tools import tool
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

def _attom_api_request(params: dict) -> str:
    # ... (This helper function remains the same as the last version) ...
    api_key = os.getenv("ATTOM_API_KEY")
    if not api_key:
        return "Error: ATTOM_API_KEY not found."

    url = "https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/snapshot"
    headers = {"accept": "application/json", "apikey": api_key}
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        properties = data.get('property', [])
        if not properties:
            return "No properties were found matching the specified criteria."
        address_list = [prop.get('address', {}).get('oneLine', 'Address not available') for prop in properties[:5]]
        return "Found properties: " + "; ".join(address_list)
    except requests.exceptions.HTTPError as e:
        return f"API Error: {e.response.status_code} - {e.response.text}"
    except Exception as e:
        return f"An unexpected error occurred: {e}"

class FindPropertiesInput(BaseModel):
    location: str = Field(description="The city and state, e.g., 'Austin, TX'")

@tool("find-properties", args_schema=FindPropertiesInput)
def find_properties(location: str) -> str:
    """Searches for real estate properties in a given city and state."""
    params = {'address': location}
    return _attom_api_request(params)

class FindPropertiesWithCriteriaInput(BaseModel):
    location: str = Field(description="The city and state, e.g., 'Austin, TX'")
    min_beds: int = Field(description="The minimum number of bedrooms.")
    max_price: int = Field(description="The maximum price.")

@tool("find-properties-with-criteria", args_schema=FindPropertiesWithCriteriaInput)
def find_properties_with_criteria(location: str, min_beds: int, max_price: int) -> str:
    """Searches for properties with specific criteria like minimum beds or maximum price."""
    params = {'address': location, 'minBeds': min_beds, 'maxAssessedValue': max_price}
    return _attom_api_request(params)