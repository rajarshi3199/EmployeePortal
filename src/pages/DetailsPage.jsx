import { useRef, useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import Navbar from '../components/Navbar'
import './DetailsPage.css'
export default function DetailsPage() {
  const { selectedEmployee, setCapturedPhoto } = useData()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const [countdown, setCountdown] = useState(null)
  const stopCamera = useCallback(() => { if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null } setCameraOpen(false) }, [])
  useEffect(() => () => stopCamera(), [stopCamera])
  async function openCamera() {
    setCameraError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      streamRef.current = stream
      setCameraOpen(true)
      setTimeout(() => { if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play() } }, 100)
    } catch (err) { setCameraError('Camera access denied.') }
  }
  function capturePhoto() {
    let c = 3
    setCountdown(c)
    const iv = setInterval(() => {
      c--
      if (c === 0) { clearInterval(iv); setCountdown(null); doCapture() }
      else setCountdown(c)
    }, 1000)
  }
  function doCapture() {
    const v = videoRef.current
    const c = canvasRef.current
    if (!v || !c) return
    c.width = v.videoWidth || 640
    c.height = v.videoHeight || 480
    c.getContext('2d').drawImage(v, 0, 0, c.width, c.height)
    setCapturedPhoto(c.toDataURL('image/jpeg'))
    stopCamera()
    navigate('/photo-result')
  }
  if (!selectedEmployee) return <div className="page"><Navbar /><div className="details-empty"><p>No employee selected.</p><button className="btn btn-primary" onClick={() => navigate('/list')}>← Back</button></div></div>
  const emp = selectedEmployee
  return (
    <div className="page">
      <Navbar />
      <main className="details-main container">
        <button className="back-btn" onClick={() => navigate('/list')}>← Back</button>
        <div className="details-grid">
          <div className="card details-profile">
            <h2>{emp.name}</h2>
            <p className="role">{emp.position}</p>
            <div className="quick-info"><div>📍 {emp.city}</div><div>💰 {emp.salary_display}</div><div>🎂 Age {emp.age}</div><div>📅 {emp.start_date}</div></div>
            <div className="camera-section">
              <h3>📸 Capture Photo</h3>
              {!cameraOpen ? <button className="btn btn-primary" onClick={openCamera}>📷 Open Camera</button> : (
                <div className="camera-controls">
                  <button className="btn btn-accent" onClick={capturePhoto} disabled={countdown}>📸 {countdown || 'Capture'}</button>
                  <button className="btn btn-danger" onClick={stopCamera}>Close</button>
                </div>
              )}
              {cameraError && <div className="camera-error">{cameraError}</div>}
            </div>
          </div>
          <div className="details-right">
            {cameraOpen && <div className="card camera-container"><video ref={videoRef} autoPlay playsInline muted />{countdown && <div className="countdown">{countdown}</div>}<canvas ref={canvasRef} style={{ display: 'none' }} /></div>}
            <div className="card details-info">
              <h3>Details</h3>
              <div className="info-grid"><div><span>Name</span><span>{emp.name}</span></div><div><span>Position</span><span>{emp.position}</span></div><div><span>City</span><span>{emp.city}</span></div><div><span>Age</span><span>{emp.age}</span></div><div><span>Start Date</span><span>{emp.start_date}</span></div><div><span>Salary</span><span>{emp.salary_display}</span></div></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
