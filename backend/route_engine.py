import osmnx as ox
import networkx as nx

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

    return {
        "distance_km": round(total_distance / 1000, 2),
        "average_risk": round(average_risk, 3),
        "route_points": len(route),
        "route": route_coordinates
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