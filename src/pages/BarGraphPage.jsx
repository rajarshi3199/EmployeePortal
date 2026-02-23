import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useData } from '../context/DataContext'
import Navbar from '../components/Navbar'
import './BarGraphPage.css'
export default function BarGraphPage() {
  const { employees, loading, fetchEmployees } = useData()
  const navigate = useNavigate()
  const [topN, setTopN] = useState(10)
  useEffect(() => { fetchEmployees() }, [fetchEmployees])
  const chartData = [...employees].filter(e => e.salary && !isNaN(parseFloat(e.salary)))
    .map(e => ({ name: e.name.split(' ')[0], fullName: e.name, salary: parseFloat(e.salary), city: e.city }))
    .sort((a, b) => b.salary - a.salary)
    .slice(0, topN)
  const avg = chartData.length ? Math.round(chartData.reduce((s, d) => s + d.salary, 0) / chartData.length) : 0
  return (
    <div className="page">
      <Navbar />
      <main className="graph-main container">
        <button className="back-btn" onClick={() => navigate('/list')}>← Back</button>
        <h1>📊 Salary Analytics</h1>
        {loading ? <div className="graph-loading"><div className="spinner" /></div> : (
          <>
            <div className="stats-row">
              <div className="stat-card card"><span>💰 Avg</span><strong>${avg.toLocaleString()}</strong></div>
              <div className="stat-card card"><span>👥 Shown</span><strong>{chartData.length}</strong></div>
            </div>
            <div className="chart-controls"><label>Top</label>{[5,10,15,20].map(n => <button key={n} className={`type-btn ${topN === n ? 'active' : ''}`} onClick={() => setTopN(n)}>{n}</button>)}</div>
            <div className="card chart-card">
              <h2>Top {topN} Salaries</h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,.5)" />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} angle={-35} textAnchor="end" interval={0} />
                  <YAxis tick={{ fill: '#94a3b8' }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={v => [`$${Number(v).toLocaleString()}`, 'Salary']} />
                  <Bar dataKey="salary" fill="#6366f1" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
