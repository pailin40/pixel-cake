import { useRef, useState } from 'react'
import CakeCanvas from './components/CakeCanvas'

export default function App() {
  const [seed, setSeed] = useState('')
  const [showCandles, setShowCandles] = useState(true)
  const canvasRef = useRef()

  const handleDownload = () => {
    canvasRef.current?.downloadImage(`${seed || 'pixel-cake'}.png`)
  }

  return (
    <div className="app">
      <h1>🎂 Pixel Cake Generator</h1>
      <p style={{ 
        color: '#ff00cc', 
        fontSize: '0.9rem', 
        marginBottom: '1rem',
        textShadow: '0 0 5px #ff00cc44'
      }}>
        Enter your name to generate your unique cake!
      </p>

      <input
        type="text"
        placeholder="Enter a name to bake your cake..."
        value={seed}
        onChange={(e) => setSeed(e.target.value)}
      />

      <CakeCanvas ref={canvasRef} seed={seed} showCandles={showCandles} />

      {seed && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <button
            onClick={() => setShowCandles(!showCandles)}
            style={{
              background: showCandles ? '#ff00cc' : '#1a1a2e',
              color: showCandles ? '#fff' : '#ff00cc',
              border: '1px solid #ff00cc',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: 'fit-content'
            }}
          >
            {showCandles ? '🕯️ Remove Candles' : '🕯️ Add Candles'}
          </button>

          <button
            onClick={handleDownload}
            style={{
              background: '#1a1a2e',
              color: '#00ffcc',
              border: '1px solid #00ffcc',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: 'fit-content'
            }}
          >
            📥 Download Cake
          </button>

          <div style={{
            color: '#ff00cc',
            fontSize: '1.1rem',
            textShadow: '0 0 5px #ff00cc',
            animation: 'fadeIn 0.5s ease'
          }}>
            🍰 {seed}'s Special Cake
          </div>
        </div>
      )}
    </div>
  )
}
