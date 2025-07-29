// frontend/src/types/index.ts

export interface PropertyScorecardData {
  type: 'property_scorecard';
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  imageUrl: string;
  scores: {
    lifestyleFit: number;
    commuteScore: number;
    valueScore: number;
  };
}