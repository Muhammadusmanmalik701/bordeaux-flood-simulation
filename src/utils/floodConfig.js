export const CESIUM_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NTE5Y2U4Zi05MGJhLTQ3MGItOTQ4MS0xMjI4OWQzMDlmMzMiLCJpZCI6NDM5NTYxLCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3ODA0MjcxNzd9.7SzZ7Ejwn_2E2GMezlroJcv3kTEcyW4XFKmO0OTXXp8';

export const FLOOD_ZONES = [
  {
    minLevel: 0.8,
    coords: [
      -0.5540,44.8700, -0.5510,44.8680, -0.5490,44.8650,
      -0.5480,44.8610, -0.5490,44.8570, -0.5510,44.8540,
      -0.5540,44.8510, -0.5570,44.8490, -0.5600,44.8480,
      -0.5630,44.8490, -0.5650,44.8510, -0.5660,44.8540,
      -0.5650,44.8580, -0.5630,44.8620, -0.5600,44.8650,
      -0.5570,44.8670,
    ]
  },
  {
    minLevel: 2.0,
    coords: [
      -0.5450,44.8750, -0.5400,44.8710, -0.5370,44.8660,
      -0.5360,44.8600, -0.5370,44.8540, -0.5400,44.8490,
      -0.5450,44.8450, -0.5520,44.8420, -0.5600,44.8410,
      -0.5680,44.8420, -0.5730,44.8450, -0.5760,44.8500,
      -0.5770,44.8560, -0.5750,44.8620, -0.5710,44.8670,
      -0.5660,44.8710, -0.5600,44.8730, -0.5530,44.8740,
    ]
  },
  {
    minLevel: 4.0,
    coords: [
      -0.5300,44.8820, -0.5230,44.8760, -0.5190,44.8680,
      -0.5180,44.8590, -0.5210,44.8500, -0.5270,44.8420,
      -0.5360,44.8360, -0.5470,44.8320, -0.5600,44.8310,
      -0.5730,44.8330, -0.5830,44.8380, -0.5900,44.8450,
      -0.5930,44.8540, -0.5910,44.8640, -0.5860,44.8720,
      -0.5770,44.8790, -0.5660,44.8830, -0.5530,44.8840,
      -0.5400,44.8840,
    ]
  },
  {
    minLevel: 6.0,
    coords: [
      -0.5100,44.8950, -0.5020,44.8870, -0.4980,44.8760,
      -0.4990,44.8640, -0.5040,44.8520, -0.5130,44.8410,
      -0.5260,44.8320, -0.5420,44.8260, -0.5600,44.8250,
      -0.5780,44.8270, -0.5930,44.8330, -0.6040,44.8430,
      -0.6090,44.8550, -0.6070,44.8680, -0.5990,44.8790,
      -0.5860,44.8880, -0.5690,44.8940, -0.5500,44.8960,
      -0.5300,44.8960,
    ]
  },
  {
    minLevel: 10.0,
    coords: [
      -0.4800,44.9200, -0.4700,44.9000, -0.4720,44.8700,
      -0.4800,44.8400, -0.4950,44.8150, -0.5200,44.7980,
      -0.5500,44.7900, -0.5800,44.7920, -0.6100,44.8030,
      -0.6350,44.8220, -0.6500,44.8480, -0.6520,44.8760,
      -0.6400,44.9020, -0.6200,44.9200, -0.5900,44.9300,
      -0.5600,44.9320, -0.5300,44.9250, -0.5050,44.9150,
    ]
  }
];

export const ROAD_DANGER = {
  primary:        { low: 1.0, med: 3.0, high: 5.5 },
  secondary:      { low: 1.5, med: 3.5, high: 6.0 },
  secondary_link: { low: 1.5, med: 3.5, high: 6.0 },
  tertiary:       { low: 2.0, med: 4.0, high: 6.5 },
  tertiary_link:  { low: 2.0, med: 4.0, high: 6.5 },
  residential:    { low: 2.5, med: 5.0, high: 7.5 },
  living_street:  { low: 2.5, med: 5.0, high: 7.5 },
  unclassified:   { low: 3.0, med: 5.5, high: 8.0 },
  service:        { low: 3.0, med: 5.5, high: 8.0 },
  road:           { low: 2.0, med: 4.0, high: 6.5 },
};

export const ROAD_WIDTH = {
  primary: 5, secondary: 4, secondary_link: 3,
  tertiary: 3, tertiary_link: 2.5,
  residential: 2, living_street: 2,
  service: 1.5, unclassified: 2, road: 2.5,
};

export const SKIP_ROAD_TYPES = ['footway', 'cycleway', 'pedestrian', 'path', 'steps'];

export const getPhaseLabel = (level) => {
  if (level <= 0)  return 'STATUS: NORMAL';
  if (level < 2)   return '⚠️  PHASE 1 — RIVER OVERFLOW';
  if (level < 4)   return '🟡 PHASE 2 — LOW AREAS FLOODED';
  if (level < 6)   return '🟠 PHASE 3 — STREETS FLOODED';
  if (level < 10)  return '🔴 PHASE 4 — CITY CENTER SUBMERGED';
  return              '🆘 PHASE 5 — CATASTROPHIC FLOOD';
};
