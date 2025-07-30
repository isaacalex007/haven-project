// frontend/src/types/index.ts
export interface Property {
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  description: string;
  imageUrl: string;
}
export interface PropertyCardData {
type: 'property_card';
properties: Property[];
}