// frontend/src/components/chat/LifestyleScorecard.tsx
'use client';

import { PropertyScorecardData } from '~/types';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';

interface Props {
  data: PropertyScorecardData;
}

export function LifestyleScorecard({ data }: Props) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="w-full max-w-lg border-2 border-blue-500 shadow-xl bg-white">
      <CardHeader>
        <img src={`https://source.unsplash.com/800x600/?house,modern,${data.address.split(',')[0]}`} alt={`Property at ${data.address}`} className="rounded-lg mb-4 object-cover h-48 w-full" />
        <CardTitle className="text-lg text-gray-900">{data.address}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <p className="text-2xl font-bold text-blue-600">{formatPrice(data.price)}</p>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>{data.beds} beds</span>
            <span>{data.baths} baths</span>
            <span>{data.sqft} sqft</span>
          </div>
        </div>
        <div>
          <h3 className="text-md font-semibold mb-2 text-gray-800">Lifestyle Fit Analysis:</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Overall Lifestyle Fit</span>
              <Badge variant={data.scores.lifestyleFit > 7 ? "default" : "secondary"}>{data.scores.lifestyleFit}/10</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Commute Score</span>
               <Badge variant={data.scores.commuteScore > 7 ? "default" : "secondary"}>{data.scores.commuteScore}/10</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Value Score</span>
               <Badge variant={data.scores.valueScore > 7 ? "default" : "secondary"}>{data.scores.valueScore}/10</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}