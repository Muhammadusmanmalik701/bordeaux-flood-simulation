import { getPhaseLabel } from '../utils/floodConfig';

export default function FloodAlert({ level }) {
  if (level < 4) return null;

  return (
    <>
      <style>{`
        @keyframes alertPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.65; }
        }
      `}</style>
      <div style={{
        position: 'absolute', top: 16, left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(183,28,28,0.92)',
        color: 'white', padding: '10px 28px',
        borderRadius: 8,
        fontFamily: "'Segoe UI', sans-serif",
        fontSize: 13, fontWeight: 700,
        letterSpacing: 1, whiteSpace: 'nowrap',
        animation: 'alertPulse 1.5s infinite',
        zIndex: 20,
      }}>
        ⚠️ FLOOD EMERGENCY — {getPhaseLabel(level)}
      </div>
    </>
  );
}
