import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import Navbar from '../components/Navbar'
import './PhotoResultPage.css'
export default function PhotoResultPage() {
  const { capturedPhoto, setCapturedPhoto, selectedEmployee } = useData()
  const navigate = useNavigate()
  const emp = selectedEmployee
  const name = emp ? emp.name : 'Employee'
  if (!capturedPhoto) return <div className="page"><Navbar /><div className="photo-empty"><p>No photo captured.</p><button className="btn btn-primary" onClick={() => navigate('/list')}>← Back</button></div></div>
  function handleDownload() {
    const a = document.createElement('a')
    a.href = capturedPhoto
    a.download = `${name.replace(/\s+/g, '_')}_photo.jpg`
    a.click()
  }
  return (
    <div className="page">
      <Navbar />
      <main className="photo-main container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="photo-grid">
          <div className="card photo-frame">
            <img src={capturedPhoto} alt="Captured" className="captured-img" />
            <div className="photo-overlay"><strong>{name}</strong><span>{new Date().toLocaleString()}</span></div>
          </div>
          <div className="photo-actions">
            <button className="btn btn-success btn-lg" onClick={handleDownload}>⬇️ Download</button>
            <button className="btn btn-primary btn-lg" onClick={() => { setCapturedPhoto(null); navigate(-1) }}>📷 Retake</button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/list')}>👥 List</button>
          </div>
        </div>
      </main>
    </div>
  )
}
