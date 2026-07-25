import json
import osmnx as ox

# Load graph
G = ox.load_graphml("data/raw/bangalore_graph.graphml")

AREAS = {
    "Majestic": (12.9767, 77.5713),
    "Koramangala": (12.9352, 77.6245),
    "Indiranagar": (12.9784, 77.6408),
    "Whitefield": (12.9698, 77.7500),
    "Electronic City": (12.8456, 77.6603),
    "Hebbal": (13.0358, 77.5970),
    "Yelahanka": (13.1007, 77.5963),
    "Jayanagar": (12.9250, 77.5938),
    "BTM Layout": (12.9166, 77.6101),
    "HSR Layout": (12.9116, 77.6474),
    "Banashankari": (12.9255, 77.5468),
    "Rajajinagar": (12.9915, 77.5553),
    "Malleshwaram": (13.0035, 77.5706),
    "Marathahalli": (12.9591, 77.6974),
    "Bellandur": (12.9255, 77.6760),
    "KR Puram": (13.0077, 77.6950),
    "MG Road": (12.9758, 77.6097),
    "Shivajinagar": (12.9866, 77.6033),
    "Basavanagudi": (12.9417, 77.5755),
}

mapping = {}

for area, (lat, lon) in AREAS.items():
    node = ox.distance.nearest_nodes(G, X=lon, Y=lat)
    mapping[area] = int(node)

print(mapping)

with open("data/raw/area_node_mapping.json", "w") as f:
    json.dump(mapping, f, indent=4)

print("✅ Saved area mapping to data/raw/area_node_mapping.json")