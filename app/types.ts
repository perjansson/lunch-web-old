export interface Coordinates {
  lat: number
  lng: number
}

export interface Restaurant {
  id: number
  name: string
  address: string
  lat: number
  lng: number
  directions: google.maps.DirectionsResult
}
