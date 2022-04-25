export interface Coordinates {
  lat: string | number;
  lng: string | number;
}

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  lat: string;
  lng: string;
}
