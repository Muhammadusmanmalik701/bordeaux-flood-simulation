import { useRef } from 'react';
import FloodMap      from './components/FloodMap';
import FloodControls from './components/FloodControls';
import FloodStats    from './components/FloodStats';
import FloodLegend   from './components/FloodLegend';
import FloodAlert    from './components/FloodAlert';
import { useFloodSimulation } from './hooks/useFloodSimulation';

export default function App() {
  const viewerRef = useRef(null);

  const {
    level, isFlooding, stats,
    buildingsRef, roadsDSRef,
    startFlood, drainFlood, resetFlood, sliderChange, updateFlood,
  } = useFloodSimulation(viewerRef);

  const streetView = () => {
    if (!viewerRef.current || !window.Cesium) return;
    const Cesium = window.Cesium;
    viewerRef.current.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(-0.5650, 44.8380, 500),
      orientation: {
        heading: Cesium.Math.toRadians(25),
        pitch:   Cesium.Math.toRadians(-18),
        roll:    0,
      },
      duration: 2.5,
    });
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <FloodMap
        viewerRef={viewerRef}
        buildingsRef={buildingsRef}
        roadsDSRef={roadsDSRef}
        updateFlood={updateFlood}
      />
      <FloodAlert    level={level} />
      <FloodStats    stats={stats} />
      <FloodLegend />
      <FloodControls
        level={level}
        isFlooding={isFlooding}
        onFlood={startFlood}
        onDrain={drainFlood}
        onReset={resetFlood}
        onCamera={streetView}
        onSlider={sliderChange}
      />
    </div>
  );
}
