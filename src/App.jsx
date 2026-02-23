import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import LoginPage from './pages/LoginPage'
import ListPage from './pages/ListPage'
import DetailsPage from './pages/DetailsPage'
import PhotoResultPage from './pages/PhotoResultPage'
import BarGraphPage from './pages/BarGraphPage'
import MapPage from './pages/MapPage'

function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { isLoggedIn } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={isLoggedIn ? <Navigate to="/list" replace /> : <LoginPage />} />
      <Route path="/list" element={<PrivateRoute><ListPage /></PrivateRoute>} />
      <Route path="/details/:id" element={<PrivateRoute><DetailsPage /></PrivateRoute>} />
      <Route path="/photo-result" element={<PrivateRoute><PhotoResultPage /></PrivateRoute>} />
      <Route path="/bar-graph" element={<PrivateRoute><BarGraphPage /></PrivateRoute>} />
      <Route path="/map" element={<PrivateRoute><MapPage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
