// frontend/src/components/chat/PropertyCard.tsx
'use client';
import { Property } from '~/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';

export function PropertyCard({ property }: { property: Property }) {
  const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);

  return (
    <Card className="w-full max-w-lg shadow-lg bg-white overflow-hidden">
      <CardHeader className="p-0">
        <img src={property.imageUrl} alt={`Property at ${property.address}`} className="object-cover h-52 w-full" />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg text-gray-900">{property.address}</CardTitle>
        <p className="text-2xl font-bold text-blue-600 my-2">{formatPrice(property.price)}</p>
        <p className="text-sm text-gray-600 mb-4">{property.description}</p>
        <div className="flex justify-start gap-4 text-sm text-gray-800">
          <span>**{property.beds}** beds</span>
          <span>**{property.baths}** baths</span>
          <span>**{property.sqft}** sqft</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-gray-50">
        <Button variant="outline" className="w-full" onClick={() => window.open(`https://www.google.com/maps?q=${encodeURIComponent(property.address)}`, '_blank')}>
          View on Map
        </Button>
      </CardFooter>
    </Card>
  );
}