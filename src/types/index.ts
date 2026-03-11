export type PlaceType = 'park' | 'cafe' | 'pet_store' | 'vet' | 'dog_park' | 'beach' | 'pub'
;

export interface Place {
  id: string;
  name: string;
  type: PlaceType;
  description?: string;
  address: string;
  coordinates: [number, number];
  rating?: number;
  phone?: string;
  website?: string;
}
