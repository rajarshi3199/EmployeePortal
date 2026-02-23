import { createContext, useContext, useState } from 'react'
const AuthContext = createContext(null)
export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('auth') === 'true')
  const [currentUser, setCurrentUser] = useState(() => sessionStorage.getItem('username') || '')
  function login(username, password) {
    if (username === 'testuser' && password === 'Test123') {
      setIsLoggedIn(true)
      setCurrentUser(username)
      sessionStorage.setItem('auth', 'true')
      sessionStorage.setItem('username', username)
      return true
    }
    return false
  }
  function logout() {
    setIsLoggedIn(false)
    setCurrentUser('')
    sessionStorage.clear()
  }
  return (
    <AuthContext.Provider value={{ isLoggedIn, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
export function useAuth() { return useContext(AuthContext) }
