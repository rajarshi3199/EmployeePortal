import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import Navbar from '../components/Navbar'
import './ListPage.css'
const COLUMNS = [{ key: 'name', label: 'Name' }, { key: 'position', label: 'Position' }, { key: 'city', label: 'City' }, { key: 'age', label: 'Age' }, { key: 'start_date', label: 'Start Date' }, { key: 'salary_display', label: 'Salary' }]
export default function ListPage() {
  const { employees, loading, error, fetchEmployees, setSelectedEmployee } = useData()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const PER = 10
  useEffect(() => { fetchEmployees() }, [fetchEmployees])
  const filtered = employees.filter(emp => Object.values(emp).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
  const paginated = filtered.slice((page - 1) * PER, page * PER)
  const totalPages = Math.ceil(filtered.length / PER)
  return (
    <div className="page">
      <Navbar />
      <main className="list-main container">
        <div className="list-header">
          <h1>Employee Directory</h1>
          <p>{loading ? 'Loading...' : `${filtered.length} employees`}</p>
          <div className="list-actions">
            <button className="btn btn-accent" onClick={() => navigate('/bar-graph')}>📊 Salary Chart</button>
            <button className="btn btn-secondary" onClick={() => navigate('/map')}>🗺️ City Map</button>
          </div>
        </div>
        <div className="list-controls">
          <input type="text" placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} className="search-input" />
        </div>
        {loading && <div className="list-loading"><div className="spinner" /><p>Loading...</p></div>}
        {error && <div className="list-error"><span>⚠️</span><div><strong>Error</strong><p>{error}</p></div><button className="btn btn-primary" onClick={() => fetchEmployees(true)}>Retry</button></div>}
        {!loading && !error && employees.length > 0 && (
          <>
            <div className="table-wrap"><table className="emp-table">
              <thead><tr><th>#</th>{COLUMNS.map(c => <th key={c.key}>{c.label}</th>)}<th>Action</th></tr></thead>
              <tbody>{paginated.map((emp, i) => (
                <tr key={emp.id} onClick={() => { setSelectedEmployee(emp); navigate(`/details/${emp.id}`) }}>
                  <td>{emp.id}</td>{COLUMNS.map(c => <td key={c.key}>{emp[c.key] || '—'}</td>)}
                  <td><button className="btn btn-primary view-btn" onClick={e => { e.stopPropagation(); setSelectedEmployee(emp); navigate(`/details/${emp.id}`) }}>View →</button></td>
                </tr>
              ))}</tbody>
            </table></div>
            {totalPages > 1 && <div className="pagination"><button className="btn btn-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button><span>Page {page} of {totalPages}</span><button className="btn btn-secondary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button></div>}
          </>
        )}
        {!loading && !error && employees.length === 0 && <div className="list-empty"><p>No employee data.</p></div>}
      </main>
    </div>
  )
}
