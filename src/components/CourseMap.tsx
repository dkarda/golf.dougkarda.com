import { CircleMarker, MapContainer, TileLayer } from 'react-leaflet'

type CourseMapProps = {
  lat: number
  lng: number
  label: string
}

export default function CourseMap({ lat, lng, label }: CourseMapProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={14}
      scrollWheelZoom={false}
      className="z-0 h-72 w-full rounded-lg"
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker
        center={[lat, lng]}
        radius={10}
        pathOptions={{
          color: '#c9a227',
          fillColor: '#1a3c34',
          fillOpacity: 1,
          weight: 2,
        }}
      />
      <span className="sr-only">{label}</span>
    </MapContainer>
  )
}
