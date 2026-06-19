const LegRow = ({ color, label, isLine }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div style={{
      width: 16,
      height: isLine ? 4 : 12,
      background: color,
      borderRadius: 3,
      flexShrink: 0,
    }} />
    <span>{label}</span>
  </div>
);

export default function FloodLegend() {
  return (
    <div style={{
      position: 'absolute', top: 16, right: 16,
      background: 'rgba(5,15,30,0.88)',
      border: '1px solid rgba(100,180,255,0.2)',
      color: 'white', padding: '14px 18px', borderRadius: 12,
      fontFamily: "'Segoe UI', sans-serif", fontSize: 12,
      lineHeight: 2.2, backdropFilter: 'blur(6px)',
      minWidth: 200, zIndex: 10,
    }}>
      <div style={{ color: '#4fc3f7', fontWeight: 700, marginBottom: 4 }}>🏠 Buildings</div>
      <LegRow color="#e8d5b0" label="Safe" />
      <LegRow color="#ffeb3b" label="Low Risk (1–3m)" />
      <LegRow color="#ff9800" label="Medium (3–6m)" />
      <LegRow color="#f44336" label="Submerged (6m+)" />

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '6px 0' }} />

      <div style={{ color: '#4fc3f7', fontWeight: 700, marginBottom: 4 }}>🛣️ Roads</div>
      <LegRow color="#999999" label="Normal"    isLine />
      <LegRow color="#ffeb3b" label="Caution"   isLine />
      <LegRow color="#ff9800" label="Dangerous" isLine />
      <LegRow color="#f44336" label="Blocked"   isLine />

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '6px 0' }} />

      <div style={{ color: '#4fc3f7', fontWeight: 700, marginBottom: 4 }}>🌊 Water</div>
      <LegRow color="rgba(30,80,200,0.75)" label="Flood Water" />
      <LegRow color="rgba(8,71,158,0.85)"  label="Deep Flood" />
    </div>
  );
}
