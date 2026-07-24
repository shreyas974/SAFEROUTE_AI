import json
import os
import sys

import networkx as nx
import osmnx as ox

# -------------------------------------------------
# Allow importing from project root
# -------------------------------------------------
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from models.predict import predict_risk

# -------------------------------------------------
# Load Road Network
# -------------------------------------------------
GRAPH_PATH = "data/raw/bangalore_graph.graphml"

print("Loading road network...")
G = ox.load_graphml(GRAPH_PATH)
print("Road network loaded successfully!")

# -------------------------------------------------
# Load Area -> Node Mapping
# -------------------------------------------------
with open("data/raw/area_node_mapping.json", "r") as f:
    AREA_NODES = json.load(f)

# -------------------------------------------------
# Cache coordinates of mapped areas
# -------------------------------------------------
AREA_COORDS = {}

for area, node in AREA_NODES.items():
    node = int(node)
    AREA_COORDS[area] = (
        G.nodes[node]["x"],
        G.nodes[node]["y"]
    )


# -------------------------------------------------
# Predict risk for all areas
# -------------------------------------------------
def build_area_risk(hour):

    risks = {}

    for area in AREA_NODES.keys():
        try:
            risks[area] = predict_risk(area, hour)
        except Exception:
            # Areas not present in ML model
            risks[area] = 0.5

    return risks


# -------------------------------------------------
# Find nearest mapped area
# -------------------------------------------------
def nearest_area(x, y):

    nearest = None
    best = float("inf")

    for area, (ax, ay) in AREA_COORDS.items():

        d = (x - ax) ** 2 + (y - ay) ** 2

        if d < best:
            best = d
            nearest = area

    return nearest


# -------------------------------------------------
# Shortest Route
# -------------------------------------------------
def shortest_route(source_area, destination_area):

    source = int(AREA_NODES[source_area])
    destination = int(AREA_NODES[destination_area])

    path = nx.shortest_path(
        G,
        source,
        destination,
        weight="length"
    )

    distance = nx.shortest_path_length(
        G,
        source,
        destination,
        weight="length"
    )

    return path, distance


# -------------------------------------------------
# Safest Route
# -------------------------------------------------
def safest_route(source_area, destination_area, hour):

    source = int(AREA_NODES[source_area])
    destination = int(AREA_NODES[destination_area])

    area_risk = build_area_risk(hour)

    G_safe = G.copy()

    PENALTY = 5000

    for u, v, k, data in G_safe.edges(keys=True, data=True):

        x = G_safe.nodes[u]["x"]
        y = G_safe.nodes[u]["y"]

        area = nearest_area(x, y)

        risk = area_risk[area]

        distance = data.get("length", 1)

        data["safe_weight"] = distance + (risk * PENALTY)

    path = nx.shortest_path(
        G_safe,
        source,
        destination,
        weight="safe_weight"
    )

    cost = nx.shortest_path_length(
        G_safe,
        source,
        destination,
        weight="safe_weight"
    )

    return path, cost, area_risk.get(destination_area, 0.5)


# -------------------------------------------------
# Main
# -------------------------------------------------
if __name__ == "__main__":

    print("\n========== SafeRoute AI ==========\n")

    print("Available Locations:\n")

    for area in sorted(AREA_NODES.keys()):
        print("•", area)

    print()

    source = input("Enter Source Area: ").strip()
    destination = input("Enter Destination Area: ").strip()

    if source not in AREA_NODES:
        print("\nInvalid Source Area")
        sys.exit()

    if destination not in AREA_NODES:
        print("\nInvalid Destination Area")
        sys.exit()

    try:
        hour = int(input("Enter Hour (0-23): "))
    except ValueError:
        print("\nHour must be an integer")
        sys.exit()

    shortest_path, shortest_distance = shortest_route(
        source,
        destination
    )

    safe_path, safe_cost, risk = safest_route(
        source,
        destination,
        hour
    )

    print("\n==============================")
    print("      ROUTE RESULTS")
    print("==============================")

    print(f"\nSource      : {source}")
    print(f"Destination : {destination}")
    print(f"Hour        : {hour}")

    print(f"\nDestination Risk : {risk:.3f}")

    print("\n------ Shortest Route ------")
    print(f"Distance : {shortest_distance/1000:.2f} km")
    print(f"Nodes    : {len(shortest_path)}")

    print("\n------ Safest Route ------")
    print(f"Weighted Cost : {safe_cost/1000:.2f}")
    print(f"Nodes         : {len(safe_path)}")

    if shortest_path == safe_path:
        print("\nRoutes are still identical.")
        print("Try increasing PENALTY from 5000 to 10000 or 15000.")
    else:
        print("\nDifferent safer route found!")