import osmnx as ox
import networkx as nx
import math

from backend.location_utils import get_nearest_area
from models.predict import predict_risk

# ---------------------------------------------------
# Load Graph
# ---------------------------------------------------

print("Loading Bengaluru road graph...")

G = ox.load_graphml("data/raw/bangalore_graph.graphml")

print("Graph loaded successfully!")

RISK_WEIGHT = 5


# ---------------------------------------------------
# Assign Risk Scores
# ---------------------------------------------------

def assign_risk(hour):

    risk_cache = {}

    print(f"Assigning risk scores for hour {hour}...")

    for u, v, key, data in G.edges(keys=True, data=True):

        lat = G.nodes[u]["y"]
        lon = G.nodes[u]["x"]

        area = get_nearest_area(lat, lon)

        if area not in risk_cache:
            risk_cache[area] = predict_risk(area, hour)

        risk = risk_cache[area]

        distance = data.get("length", 1)

        data["risk"] = risk
        data["cost"] = distance * (1 + RISK_WEIGHT * risk)

    print("Risk assignment completed!")


# ---------------------------------------------------
# Safe Route Function
# ---------------------------------------------------

def bearing(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    d_lon = lon2 - lon1
    x = math.sin(d_lon) * math.cos(lat2)
    y = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(d_lon)
    return (math.degrees(math.atan2(x, y)) + 360) % 360


def turn_direction(bearing_before, bearing_after):
    diff = (bearing_after - bearing_before + 360) % 360
    if diff > 180:
        diff -= 360
    if diff > 30:
        return "Turn right"
    if diff < -30:
        return "Turn left"
    if diff > 10:
        return "Slight right"
    if diff < -10:
        return "Slight left"
    return "Continue straight"


def build_steps(route):
    edge_names = []
    edge_bearings = []
    edge_lengths = []

    for u, v in zip(route[:-1], route[1:]):
        edge = G.get_edge_data(u, v)
        edge_data = list(edge.values())[0]

        name = edge_data.get("name", "unnamed road")
        if isinstance(name, list):
            name = name[0]

        lat1, lon1 = G.nodes[u]["y"], G.nodes[u]["x"]
        lat2, lon2 = G.nodes[v]["y"], G.nodes[v]["x"]

        edge_names.append(name)
        edge_bearings.append(bearing(lat1, lon1, lat2, lon2))
        edge_lengths.append(edge_data.get("length", 0))

    if not edge_names:
        return []

    steps = []
    current_name = edge_names[0]
    current_length = edge_lengths[0]
    current_direction = "Continue straight"

    for i in range(1, len(edge_names)):
        if edge_names[i] == current_name:
            current_length += edge_lengths[i]
        else:
            steps.append({
                "instruction": current_direction,
                "street": current_name,
                "distance_m": round(current_length, 1)
            })
            current_direction = turn_direction(edge_bearings[i - 1], edge_bearings[i])
            current_name = edge_names[i]
            current_length = edge_lengths[i]

    steps.append({
        "instruction": current_direction,
        "street": current_name,
        "distance_m": round(current_length, 1)
    })

    return steps


def find_safe_route(source, destination, hour=21):

    assign_risk(hour)

    source_node = ox.distance.nearest_nodes(
        G,
        X=source[1],
        Y=source[0]
    )

    destination_node = ox.distance.nearest_nodes(
        G,
        X=destination[1],
        Y=destination[0]
    )

    try:
        route = nx.shortest_path(
            G,
            source_node,
            destination_node,
            weight="cost"
        )

    except nx.NetworkXNoPath:
        return {
            "error": "No safe route found."
        }

    total_distance = 0
    total_risk = 0

    for u, v in zip(route[:-1], route[1:]):

        edge = G.get_edge_data(u, v)

        edge_data = list(edge.values())[0]

        total_distance += edge_data.get("length", 0)
        total_risk += edge_data.get("risk", 0)

    average_risk = total_risk / max(len(route) - 1, 1)

    route_coordinates = []

    for node in route:

        route_coordinates.append({
            "lat": G.nodes[node]["y"],
            "lon": G.nodes[node]["x"]
        })

    steps = build_steps(route)

    return {
        "distance_km": round(total_distance / 1000, 2),
        "average_risk": round(average_risk, 3),
        "route_points": len(route),
        "route": route_coordinates,
        "steps": steps
    }


# ---------------------------------------------------
# Example (Run Only for Testing)
# ---------------------------------------------------

if __name__ == "__main__":

    source = (12.9352, 77.6245)      # Koramangala

    destination = (12.9756, 77.6050) # MG Road

    result = find_safe_route(
        source=source,
        destination=destination,
        hour=21
    )

    if "error" in result:
        print(result["error"])

    else:
        print("\n========== SAFE ROUTE ==========\n")

        print(f"Distance      : {result['distance_km']} km")
        print(f"Average Risk  : {result['average_risk']}")
        print(f"Route Points  : {result['route_points']}")

        print("\nFirst 5 Coordinates:")

        for point in result["route"][:5]:
            print(point)