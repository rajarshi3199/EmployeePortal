import { createContext, useContext, useState, useRef, useCallback } from 'react'
import axios from 'axios'
const DataContext = createContext(null)
export function DataProvider({ children }) {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [capturedPhoto, setCapturedPhoto] = useState(null)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const fetchedRef = useRef(false)
  const fetchEmployees = useCallback(async (force = false) => {
    if (fetchedRef.current && !force) return
    fetchedRef.current = true
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post('/api/backend_dev/gettabledata.php', { username: 'test', password: '123456' }, { headers: { 'Content-Type': 'application/json' } })
      const rows = res.data?.TABLE_DATA?.data || []
      const list = rows.map((row, idx) => ({ id: idx + 1, name: row[0] || '', position: row[1] || '', city: row[2] || '', age: row[3] || '', start_date: row[4] || '', salary: row[5] ? row[5].replace(/[$,]/g, '') : '0', salary_display: row[5] || '$0' }))
      setEmployees(list)
    } catch (err) {
      fetchedRef.current = false
      setError('Failed to fetch data. Please try again.')
    } finally { setLoading(false) }
  }, [])
  return (
    <DataContext.Provider value={{ employees, loading, error, fetchEmployees, capturedPhoto, setCapturedPhoto, selectedEmployee, setSelectedEmployee }}>
      {children}
    </DataContext.Provider>
  )
}
export function useData() { return useContext(DataContext) }
