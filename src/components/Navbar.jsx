import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'
export default function Navbar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <div className="navbar-brand" onClick={() => navigate('/list')}>🏢 EmpPortal</div>
        <div className="navbar-links">
          <button className={`nav-link ${location.pathname === '/list' ? 'active' : ''}`} onClick={() => navigate('/list')}>👥 Employees</button>
          <button className={`nav-link ${location.pathname === '/bar-graph' ? 'active' : ''}`} onClick={() => navigate('/bar-graph')}>📊 Chart</button>
          <button className={`nav-link ${location.pathname === '/map' ? 'active' : ''}`} onClick={() => navigate('/map')}>🗺️ Map</button>
        </div>
        <div className="navbar-user">
          <span>{currentUser}</span>
          <button className="btn btn-secondary btn-sm" onClick={() => { logout(); navigate('/login') }}>Logout</button>
        </div>
      </div>
    </nav>
  )
}
