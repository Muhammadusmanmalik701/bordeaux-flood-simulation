const Row = ({ icon, label, value, color }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
    <span>{icon} {label}</span>
    <b style={{ color: color || 'white' }}>{value}</b>
  </div>
);

export default function FloodStats({ stats }) {
  return (
    <div style={{
      position: 'absolute', top: 16, left: 16,
      background: 'rgba(5,15,30,0.88)',
      border: '1px solid rgba(100,180,255,0.2)',
      color: 'white', padding: '14px 18px', borderRadius: 12,
      fontFamily: "'Segoe UI', sans-serif", fontSize: 12,
      lineHeight: 2.0, backdropFilter: 'blur(6px)',
      minWidth: 210, zIndex: 10,
    }}>
      <div style={{ color: '#4fc3f7', fontWeight: 700, marginBottom: 4 }}>
        📊 Flood Impact
      </div>

      <div style={{ color: '#aaa', fontSize: 11, marginBottom: 2 }}>BUILDINGS</div>
      <Row icon="🟡" label="Low Risk"  value={stats.low}  color="#ffeb3b" />
      <Row icon="🟠" label="Medium"    value={stats.med}  color="#ff9800" />
      <Row icon="🔴" label="Submerged" value={stats.high} color="#f44336" />

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '6px 0' }} />

      <div style={{ color: '#aaa', fontSize: 11, marginBottom: 2 }}>ROADS</div>
      <Row icon="🟡" label="Caution"   value={stats.roadLow}  color="#ffeb3b" />
      <Row icon="🟠" label="Dangerous" value={stats.roadMed}  color="#ff9800" />
      <Row icon="🔴" label="Blocked"   value={stats.roadHigh} color="#f44336" />

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '6px 0' }} />

      <Row icon="💧" label="Flood Area" value={`${stats.area} km²`} color="#4fc3f7" />
    </div>
  );
}
