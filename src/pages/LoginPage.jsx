import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './LoginPage.css'
export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password.trim()) { setError('Please enter both username and password.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    if (login(username.trim(), password)) navigate('/list')
    else { setError('Invalid credentials. Use testuser / Test123'); setLoading(false) }
  }
  return (
    <div className="login-page">
      <div className="login-card fade-in">
        <h1 className="login-title">🏢 Employee Portal</h1>
        <p className="login-subtitle">Sign in to continue</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <input type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} autoFocus />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="login-hint">Demo: testuser / Test123</p>
      </div>
    </div>
  )
}
