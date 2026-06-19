import { useRef, useState, useCallback } from 'react';
import {
  FLOOD_ZONES, ROAD_DANGER, ROAD_WIDTH, SKIP_ROAD_TYPES
} from '../utils/floodConfig';

export function useFloodSimulation(viewerRef) {
  const [level, setLevel]           = useState(0);
  const [isFlooding, setIsFlooding] = useState(false);
  const [stats, setStats]           = useState({
    low: 0, med: 0, high: 0,
    roadLow: 0, roadMed: 0, roadHigh: 0, area: '0'
  });

  const floodEntitiesRef = useRef([]);
  const intervalRef      = useRef(null);
  const buildingsRef     = useRef(null);
  const roadsDSRef       = useRef(null);
  const currentLevelRef  = useRef(0);

  const C = () => window.Cesium;

  const makeFloodColor = (zoneIdx, lvl) =>
    new (C().ColorMaterialProperty)(
      new (C().CallbackProperty)(() => {
        const t     = Date.now() / 1000;
        const depth = Math.min(1, (lvl - FLOOD_ZONES[zoneIdx].minLevel) / 5);
        const wave  = Math.sin(t * 1.8 + zoneIdx * 1.1) * 0.05
                    + Math.sin(t * 3.3 + zoneIdx * 0.7) * 0.03;
        const alpha = Math.min(0.88, Math.max(0.45, 0.60 + depth * 0.20 + wave));
        return new (C().Color)(0.10 + depth*0.06, 0.22 + depth*0.04, 0.58 - depth*0.08, alpha);
      }, false)
    );

  const makeWaterSurface = (lvl, zoneIdx) =>
    new (C().CallbackProperty)(() => {
      const t = Date.now() / 1000;
      return lvl * 0.72
        + Math.sin(t * 2.0 + zoneIdx * 1.1) * 0.15
        + Math.sin(t * 3.7 + zoneIdx * 0.7) * 0.08
        + Math.sin(t * 1.3 + zoneIdx * 1.5) * 0.10;
    }, false);

  const getRoadStyle = (hw, lvl) => {
    if (SKIP_ROAD_TYPES.includes(hw)) return null;
    const def = { color: '#999999', alpha: 0.65, width: ROAD_WIDTH[hw] || 1.5, pulse: false };
    if (lvl <= 0) return def;
    const d = ROAD_DANGER[hw] || { low: 2.5, med: 5.0, high: 7.5 };
    if (lvl >= d.high) return { color: '#f44336', alpha: 0.95, width: (ROAD_WIDTH[hw]||2)+1, pulse: true, fast: true };
    if (lvl >= d.med)  return { color: '#ff9800', alpha: 0.92, width: ROAD_WIDTH[hw]||2,     pulse: true, fast: false };
    if (lvl >= d.low)  return { color: '#ffeb3b', alpha: 0.88, width: ROAD_WIDTH[hw]||1.5,   pulse: true, fast: false };
    return def;
  };

  const styleRoads = useCallback((lvl) => {
    if (!roadsDSRef.current) return { rLow: 0, rMed: 0, rHigh: 0 };
    let rLow = 0, rMed = 0, rHigh = 0;

    roadsDSRef.current.entities.values.forEach(entity => {
      if (!entity.polyline) return;
      const hw    = entity.properties?.highway?.getValue() || 'road';
      const style = getRoadStyle(hw, lvl);
      if (!style) { entity.polyline.show = false; return; }

      entity.polyline.show  = true;
      entity.polyline.width = style.width;

      if (style.pulse) {
        const { color, alpha, fast } = style;
        entity.polyline.material = new (C().ColorMaterialProperty)(
          new (C().CallbackProperty)(() => {
            const t = Date.now() / 1000;
            const p = alpha + Math.sin(t * (fast ? 4.0 : 2.0)) * 0.18;
            return C().Color.fromCssColorString(color).withAlpha(Math.min(1, Math.max(0.4, p)));
          }, false)
        );
        if (color === '#f44336') rHigh++;
        else if (color === '#ff9800') rMed++;
        else rLow++;
      } else {
        entity.polyline.material = new (C().ColorMaterialProperty)(
          C().Color.fromCssColorString(style.color).withAlpha(style.alpha)
        );
      }
    });

    return { rLow, rMed, rHigh };
  }, []);

  const updateBuildings = useCallback((lvl) => {
    if (!buildingsRef.current) return;
    let colorExpr;
    if (lvl <= 0)     colorExpr = "color('#e8d5b0', 0.95)";
    else if (lvl < 3) colorExpr = "color('#ffeb3b', 0.92)";
    else if (lvl < 6) colorExpr = "color('#ff9800', 0.95)";
    else              colorExpr = "color('#f44336', 0.97)";
    buildingsRef.current.style = new (C().Cesium3DTileStyle)({ color: colorExpr });
  }, []);

  const updateFlood = useCallback((newLevel) => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const Cesium = C();

    const lvl = Math.max(0, Math.min(15, newLevel));
    currentLevelRef.current = lvl;
    setLevel(lvl);

    floodEntitiesRef.current.forEach(e => viewer.entities.remove(e));
    floodEntitiesRef.current = [];

    updateBuildings(lvl);
    const { rLow, rMed, rHigh } = styleRoads(lvl);

    setStats({
      low:      lvl > 0 ? Math.round(lvl * 24) : 0,
      med:      lvl > 0 ? Math.round(lvl * 16) : 0,
      high:     lvl > 0 ? Math.round(lvl * 9)  : 0,
      roadLow:  rLow, roadMed: rMed, roadHigh: rHigh,
      area:     (lvl * lvl * 0.18).toFixed(1),
    });

    if (lvl <= 0) return;

    FLOOD_ZONES.forEach((zone, i) => {
      if (lvl < zone.minLevel) return;
      const entity = viewer.entities.add({
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(
            Cesium.Cartesian3.fromDegreesArray(zone.coords)
          ),
          height: 0,
          extrudedHeight: makeWaterSurface(lvl, i),
          material: makeFloodColor(i, lvl),
          outline: false,
          classificationType: Cesium.ClassificationType.TERRAIN,
        }
      });
      floodEntitiesRef.current.push(entity);
    });
  }, [viewerRef, updateBuildings, styleRoads]);

  const startFlood = useCallback(() => {
    if (isFlooding) return;
    setIsFlooding(true);
    intervalRef.current = setInterval(() => {
      const cur = currentLevelRef.current;
      if (cur >= 15) { clearInterval(intervalRef.current); setIsFlooding(false); return; }
      const speed = cur < 2 ? 0.04 : cur < 8 ? 0.10 : 0.05;
      updateFlood(cur + speed);
    }, 80);
  }, [isFlooding, updateFlood]);

  const drainFlood = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsFlooding(false);
    intervalRef.current = setInterval(() => {
      const cur = currentLevelRef.current;
      if (cur <= 0) { clearInterval(intervalRef.current); updateFlood(0); return; }
      updateFlood(cur - 0.10);
    }, 70);
  }, [updateFlood]);

  const resetFlood = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsFlooding(false);
    updateFlood(0);
  }, [updateFlood]);

  const sliderChange = useCallback((val) => {
    clearInterval(intervalRef.current);
    setIsFlooding(false);
    updateFlood(parseFloat(val));
  }, [updateFlood]);

  return {
    level, isFlooding, stats,
    buildingsRef, roadsDSRef,
    startFlood, drainFlood, resetFlood, sliderChange, updateFlood
  };
}
