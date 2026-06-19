# 🌊 Bordeaux Flood Simulation

> A real-time 3D flood simulation of Bordeaux, France built with **React** + **CesiumJS**. Watch floodwater rise from the Garonne River and gradually submerge the city — with live building damage indicators and road blockage alerts.

![Bordeaux Flood Simulation](https://img.shields.io/badge/CesiumJS-1.111-blue) ![React](https://img.shields.io/badge/React-18-61dafb) ![Vite](https://img.shields.io/badge/Vite-5-646cff) ![License](https://img.shields.io/badge/license-MIT-green)

---

## 📸 Preview

The simulation shows:
- **Garonne River** with animated water layer
- **4,075 real roads** from Bordeaux SUMO network data
- **3D OSM Buildings** with flood damage coloring
- **5 progressive flood phases** — from river overflow to catastrophic inundation

---

## ✨ Features

### 🌊 Realistic Flood Simulation
- Floodwater rises **naturally from the Garonne River** outward into the city
- **Animated murky water** (brown-blue color like real floods) with multi-frequency wave ripples
- **5 progressive flood phases** that expand zone by zone

### 🏠 Building Damage Indicator
| Color | Status | Flood Level |
|-------|--------|-------------|
| 🟤 Beige | Safe — No Risk | 0m |
| 🟡 Yellow | Low Risk | 1–3m |
| 🟠 Orange | Medium Damage | 3–6m |
| 🔴 Red | Submerged | 6m+ |

### 🛣️ Road Danger System (Google Maps Style)
| Color | Status | Description |
|-------|--------|-------------|
| ⬛ Grey | Normal | Road is clear |
| 🟡 Yellow | Caution | Waterlogging possible |
| 🟠 Orange | Dangerous | High water, avoid |
| 🔴 Red | Blocked | Road impassable |

Roads **pulse and animate** when affected — just like Google Maps traffic!

### 📊 Real-time Stats Panel
- Live count of affected buildings (low / medium / submerged)
- Live count of affected roads (caution / dangerous / blocked)
- Total flooded area in km²

### 🎮 Simulation Controls
- **Start Flood** — automatic gradual flood rise
- **Drain Water** — watch water recede
- **Reset** — back to normal city view
- **Street View** — fly to ground level camera
- **Manual Slider** — control water level (0–15m) yourself

---

## 🗂️ Project Structure

```
bordeaux-flood/
├── public/
│   ├── bordeaux_rivers.geojson     # River & stream network (OSMnx)
│   ├── bordeaux_roads.geojson      # 4,075 roads (from SUMO network XML)
│   └── garonne_polygon.geojson     # Garonne river water polygon
│
├── src/
│   ├── components/
│   │   ├── FloodMap.jsx            # Main CesiumJS 3D map
│   │   ├── FloodControls.jsx       # Slider + control buttons
│   │   ├── FloodStats.jsx          # Live impact statistics
│   │   ├── FloodLegend.jsx         # Color legend panel
│   │   └── FloodAlert.jsx          # Emergency alert banner
│   │
│   ├── hooks/
│   │   └── useFloodSimulation.js   # All flood logic & state
│   │
│   ├── utils/
│   │   └── floodConfig.js          # Flood zones, road configs, phase labels
│   │
│   ├── App.jsx                     # Root component
│   └── main.jsx                    # React entry point
│
├── index.html                      # CesiumJS loaded via CDN here
├── vite.config.js
├── package.json
└── README.md
```

---

## 🚀 How to Run

### Prerequisites
- [Node.js](https://nodejs.org) v18 or higher
- A free [Cesium Ion account](https://ion.cesium.com) for the access token

### Step 1 — Clone the repository
```bash
git clone https://github.com/Muhammadusmanmalik701/bordeaux-flood-simulation.git
cd bordeaux-flood-simulation
```

### Step 2 — Add missing GeoJSON file
Generate `garonne_polygon.geojson` using the Python script below and place it in `public/`:

```python
# run: python generate_garonne.py
import json
from shapely.geometry import LineString, mapping, shape

with open("public/bordeaux_rivers.geojson", "r") as f:
    data = json.load(f)

garonne_lines = []
for feature in data['features']:
    if feature['properties'].get('waterway') == 'river':
        garonne_lines.append(shape(feature['geometry']))

features = []
for line in garonne_lines:
    buffered = line.buffer(0.003)
    features.append({
        "type": "Feature",
        "properties": {"name": "La Garonne"},
        "geometry": mapping(buffered)
    })

with open("public/garonne_polygon.geojson", "w") as f:
    json.dump({"type": "FeatureCollection", "features": features}, f)

print("✅ garonne_polygon.geojson created!")
```

```bash
pip install shapely
python generate_garonne.py
```

### Step 3 — Add your Cesium Ion Token
Open `src/components/FloodMap.jsx` and replace the token on line 13:
```js
Cesium.Ion.defaultAccessToken = 'YOUR_TOKEN_HERE';
```
Get your free token at: https://ion.cesium.com/tokens

### Step 4 — Install & Run
```bash
npm install
npm run dev
```

Open your browser at: **http://localhost:5173**

### Step 5 — Build for Production
```bash
npm run build
npm run preview
```

---

## 🔬 Data Sources

| Data | Source | Description |
|------|--------|-------------|
| River network | OpenStreetMap via OSMnx | Garonne + all waterways |
| Road network | SUMO network XML (map_net.xml) | 4,075 drivable roads |
| 3D Buildings | Cesium OSM Buildings (Ion Asset 96188) | Real building footprints & heights |
| Terrain | Cesium World Terrain | Real elevation data |
| Satellite imagery | Cesium Ion default imagery | Bing Maps aerial |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| [React 18](https://react.dev) | UI components & state management |
| [CesiumJS 1.111](https://cesium.com) | 3D globe, terrain, buildings |
| [Vite 5](https://vitejs.dev) | Build tool & dev server |
| Python + OSMnx | GeoJSON data preparation |
| Python + Shapely | River polygon generation |

---

## 🗺️ Flood Phases Explained

| Phase | Water Level | Area Affected |
|-------|-------------|---------------|
| Phase 1 | 0.8 – 2m | River banks overflow |
| Phase 2 | 2 – 4m | Low-lying areas near river |
| Phase 3 | 4 – 6m | City streets begin flooding |
| Phase 4 | 6 – 10m | City center submerged |
| Phase 5 | 10 – 15m | Catastrophic — entire city |

---

## 📁 Generating Road Data from SUMO XML

If you have a SUMO network file (`map_net.xml`), convert it to GeoJSON:

```python
# python convert_roads.py
import xml.etree.ElementTree as ET
import json, math

tree = ET.parse('map_net.xml')
root = tree.getroot()

location   = root.find('location')
offset_x   = -float(location.get('netOffset').split(',')[0])
offset_y   = -float(location.get('netOffset').split(',')[1])

def utm_to_latlon(x, y, zone=30):
    a=6378137.0; e=0.0818191908426; e2=e*e; k0=0.9996
    x-=500000; M=y/k0
    mu=M/(a*(1-e2/4-3*e2**2/64-5*e2**3/256))
    e1=(1-math.sqrt(1-e2))/(1+math.sqrt(1-e2))
    fp=mu+e1*(3/2-27*e1**2/32)*math.sin(2*mu)
    N1=a/math.sqrt(1-e2*math.sin(fp)**2)
    T1=math.tan(fp)**2; C1=e2/(1-e2)*math.cos(fp)**2
    R1=a*(1-e2)/(1-e2*math.sin(fp)**2)**1.5
    D=x/(N1*k0)
    lat=fp-(N1*math.tan(fp)/R1)*(D**2/2-(5+3*T1+10*C1-4*C1**2-9*e2/(1-e2))*D**4/24)
    lon=math.radians((zone-1)*6-180+3)+(D-(1+2*T1+C1)*D**3/6)/math.cos(fp)
    return math.degrees(lat), math.degrees(lon)

features=[]
for edge in root.findall('edge'):
    if edge.get('function','')=='internal': continue
    for lane in edge.findall('lane'):
        coords=[]
        for pt in (lane.get('shape','') or '').split():
            try:
                x,y=map(float,pt.split(','))
                la,lo=utm_to_latlon(x+offset_x,y+offset_y)
                coords.append([lo,la])
            except: pass
        if len(coords)>=2:
            features.append({"type":"Feature","properties":{"highway":edge.get('type','road').replace('highway.','')},"geometry":{"type":"LineString","coordinates":coords}})

with open('public/bordeaux_roads.geojson','w') as f:
    json.dump({"type":"FeatureCollection","features":features},f)
print(f'✅ {len(features)} roads saved!')
```

---

## 🤝 Contributing

Pull requests welcome! Areas to improve:
- More accurate flood zone polygons from DEM data
- Real historical flood data integration
- Time-lapse of actual Bordeaux 2021 floods
- Mobile responsive UI

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 👤 Author

**Muhammad Usman Malik**
- GitHub: [@Muhammadusmanmalik701](https://github.com/Muhammadusmanmalik701)

---

> ⚠️ **Disclaimer:** This is a simulation for educational and visualization purposes only. Flood zones are approximate and should not be used for emergency planning or official purposes.
