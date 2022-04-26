export interface Coordinates {
  lat: string
  lng: string
}

export interface Restaurant {
  id: number
  name: string
  address: string
  lat: string
  lng: string
  direction: string // JSON
}
