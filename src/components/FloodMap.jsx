import { useEffect, useRef } from 'react';

export default function FloodMap({ viewerRef, buildingsRef, roadsDSRef, updateFlood }) {
  const containerRef = useRef(null);
  const initialized  = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const waitForCesium = setInterval(async () => {
      if (!window.Cesium) return;
      clearInterval(waitForCesium);

      const Cesium = window.Cesium;
      Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

      const terrainProvider = await Cesium.createWorldTerrainAsync();
      const viewer = new Cesium.Viewer(containerRef.current, {
        terrainProvider, timeline: false, animation: false, shadows: true,
      });

      viewerRef.current = viewer;
      viewer.scene.globe.enableLighting = true;
      try { viewer.scene.fog.enabled = true; viewer.scene.fog.density = 0.00015; } catch(e) {}

      // 3D Buildings
      try {
        const buildings = await Cesium.createOsmBuildingsAsync();
        viewer.scene.primitives.add(buildings);
        buildings.style = new Cesium.Cesium3DTileStyle({ color: "color('#e8d5b0', 0.95)" });
        buildingsRef.current = buildings;
      } catch(e) { console.warn('Buildings:', e); }

      // Roads
      try {
        const roadsDS = await Cesium.GeoJsonDataSource.load('/bordeaux_roads.geojson');
        roadsDS.entities.values.forEach(entity => {
          if (!entity.polyline) return;
          entity.polyline.clampToGround = true;
          entity.polyline.width = 1.5;
          entity.polyline.material = new Cesium.ColorMaterialProperty(
            Cesium.Color.fromCssColorString('#999999').withAlpha(0.65)
          );
        });
        viewer.dataSources.add(roadsDS);
        roadsDSRef.current = roadsDS;
      } catch(e) { console.warn('Roads:', e); }

      // Rivers
      try {
        const streamsDS = await Cesium.GeoJsonDataSource.load('/bordeaux_rivers.geojson');
        streamsDS.entities.values.forEach(entity => {
          if (!entity.polyline) return;
          const ww = entity.properties?.waterway?.getValue();
          entity.polyline.clampToGround = true;
          entity.polyline.width = ww === 'river' ? 5 : 2;
          entity.polyline.material = new Cesium.ColorMaterialProperty(
            new Cesium.CallbackProperty(() => {
              const t = Date.now() / 1000;
              return new Cesium.Color(0.08, 0.28, 0.65, 0.80 + Math.sin(t*1.4)*0.08);
            }, false)
          );
        });
        viewer.dataSources.add(streamsDS);
      } catch(e) { console.warn('Rivers:', e); }

      // Garonne polygon
      try {
        const polyDS = await Cesium.GeoJsonDataSource.load('/garonne_polygon.geojson');
        polyDS.entities.values.forEach(entity => {
          if (!entity.polygon) return;
          entity.polygon.material = new Cesium.ColorMaterialProperty(
            new Cesium.CallbackProperty(() => {
              const t = Date.now() / 1000;
              return new Cesium.Color(0.08, 0.28, 0.62, 0.78 + Math.sin(t*1.4)*0.08);
            }, false)
          );
          entity.polygon.height = 0;
          entity.polygon.outline = false;
          entity.polygon.classificationType = Cesium.ClassificationType.TERRAIN;
        });
        viewer.dataSources.add(polyDS);
      } catch(e) { console.warn('Garonne:', e); }

      // Camera
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-0.5600, 44.8300, 3000),
        orientation: {
          heading: Cesium.Math.toRadians(10),
          pitch: Cesium.Math.toRadians(-28),
          roll: 0,
        },
        duration: 2,
      });

      updateFlood(0);
      console.log('✅ Map ready!');
    }, 100);

    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={containerRef}
      style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}
    />
  );
}
