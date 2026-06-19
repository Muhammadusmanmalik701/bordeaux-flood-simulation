import { getPhaseLabel } from '../utils/floodConfig';

const btn = (label, bg, onClick) => (
  <button
    key={label}
    onClick={onClick}
    style={{
      padding: '9px 16px', border: 'none', borderRadius: 8,
      cursor: 'pointer', fontSize: 13, fontWeight: 600,
      background: bg, color: 'white', transition: 'all 0.2s',
      letterSpacing: '0.5px',
    }}
    onMouseEnter={e => { e.target.style.opacity = '0.85'; e.target.style.transform = 'translateY(-1px)'; }}
    onMouseLeave={e => { e.target.style.opacity = '1';    e.target.style.transform = 'translateY(0)'; }}
  >
    {label}
  </button>
);

export default function FloodControls({
  level, isFlooding,
  onFlood, onDrain, onReset, onCamera, onSlider,
}) {
  return (
    <div style={{
      position: 'absolute', bottom: 24, left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(5,15,30,0.90)',
      border: '1px solid rgba(100,180,255,0.25)',
      color: 'white', padding: '18px 28px', borderRadius: 16,
      fontFamily: "'Segoe UI', sans-serif",
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 12, minWidth: 420,
      backdropFilter: 'blur(10px)',
      zIndex: 10,
    }}>
      <h3 style={{
        margin: 0, fontSize: 13, letterSpacing: 2,
        color: '#4fc3f7', textTransform: 'uppercase',
      }}>
        🌊 Bordeaux Flood Simulation
      </h3>

      <div style={{
        fontSize: 30, fontWeight: 700, color: 'white',
        textShadow: '0 0 20px rgba(79,195,247,0.8)',
      }}>
        {level.toFixed(1)} m
      </div>

      <div style={{ fontSize: 12, color: '#ffcc00', letterSpacing: 1, fontWeight: 600 }}>
        {getPhaseLabel(level)}
      </div>

      {/* Slider */}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 11, color: '#aaa' }}>0m</span>
        <input
          type="range" min={0} max={15} step={0.05}
          value={level}
          onChange={e => onSlider(e.target.value)}
          style={{ flex: 1, height: 6, accentColor: '#4fc3f7', cursor: 'pointer' }}
        />
        <span style={{ fontSize: 11, color: '#aaa' }}>15m</span>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        {btn(isFlooding ? '🌊 Flooding...' : '🌊 Start Flood', '#e53935', onFlood)}
        {btn('💧 Drain Water', '#1565c0', onDrain)}
        {btn('↺ Reset',        '#37474f', onReset)}
        {btn('📷 Street View', '#2e7d32', onCamera)}
      </div>
    </div>
  );
}
