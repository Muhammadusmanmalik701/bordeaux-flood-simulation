"""
Run this script once to generate garonne_polygon.geojson
Usage: python generate_garonne.py
Requires: pip install shapely
"""
import json
from shapely.geometry import mapping, shape

print("Generating Garonne river polygon...")

with open("public/bordeaux_rivers.geojson", "r") as f:
    data = json.load(f)

garonne_lines = []
for feature in data['features']:
    wtype = feature['properties'].get('waterway', '')
    name  = feature['properties'].get('name', '')
    if wtype == 'river' or 'Garonne' in str(name):
        garonne_lines.append(shape(feature['geometry']))
        print(f"  Found: {name}")

features = []
for line in garonne_lines:
    buffered = line.buffer(0.003)  # ~300m width
    features.append({
        "type": "Feature",
        "properties": {"name": "La Garonne", "type": "riverbank"},
        "geometry": mapping(buffered)
    })

geojson = {"type": "FeatureCollection", "features": features}
with open("public/garonne_polygon.geojson", "w") as f:
    json.dump(geojson, f, indent=2)

print(f"✅ Done! {len(features)} polygons saved to public/garonne_polygon.geojson")
