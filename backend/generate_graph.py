import os
import osmnx as ox

# Create the directory if it doesn't exist
os.makedirs("data/raw", exist_ok=True)

# Download drivable road network for Bengaluru
print("Downloading Bengaluru road network...")

G = ox.graph_from_place(
    "Bengaluru, Karnataka, India",
    network_type="drive"
)

# Save graph
print("Saving graph...")
ox.save_graphml(G, "data/raw/bangalore_graph.graphml")

print("✅ Graph saved to data/raw/bangalore_graph.graphml")
print(f"Nodes: {len(G.nodes)}")
print(f"Edges: {len(G.edges)}")