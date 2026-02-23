import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useData } from '../context/DataContext'
import Navbar from '../components/Navbar'
import './MapPage.css'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})
const COORDS = { edinburgh: [55.95, -3.19], tokyo: [35.68, 139.65], 'san francisco': [37.77, -122.42], 'new york': [40.71, -74.01], london: [51.51, -0.13], sydney: [-33.87, 151.21], sidney: [-33.87, 151.21] }
function getCoords(city) {
  if (!city) return null
  const k = city.toLowerCase().trim()
  if (COORDS[k]) return COORDS[k]
  for (const [key, v] of Object.entries(COORDS)) { if (k.includes(key)) return v }
  return null
}
export default function MapPage() {
  const { employees, loading, fetchEmployees } = useData()
  const navigate = useNavigate()
  useEffect(() => { fetchEmployees() }, [fetchEmployees])
  const cityData = useMemo(() => {
    const acc = {}
    employees.forEach(emp => {
      const city = emp.city
      if (!city) return
      const coords = getCoords(city)
      if (!coords) return
      if (!acc[city]) acc[city] = { city, coords, count: 0, employees: [] }
      acc[city].count++
      acc[city].employees.push(emp)
    })
    return Object.values(acc)
  }, [employees])
  const maxC = Math.max(...cityData.map(c => c.count), 1)
  return (
    <div className="page">
      <Navbar />
      <main className="map-main container">
        <button className="back-btn" onClick={() => navigate('/list')}>← Back</button>
        <h1>🗺️ City Map</h1>
        {loading ? <div className="map-loading"><div className="spinner" /></div> : cityData.length > 0 ? (
          <div className="card map-wrap">
            <MapContainer center={[30, 10]} zoom={2} style={{ height: 500, width: '100%' }}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="© OpenStreetMap © CARTO" />
              {cityData.map((c, i) => (
                <CircleMarker key={i} center={c.coords} radius={8 + (c.count / maxC) * 20} pathOptions={{ fillColor: '#6366f1', fillOpacity: 0.8, color: '#818cf8', weight: 2 }}>
                  <Popup><strong>{c.city}</strong><br />{c.count} employees</Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        ) : <div className="map-empty">No city data to display.</div>}
      </main>
    </div>
  )
}
