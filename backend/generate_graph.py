import osmnx as ox

# Download drivable road network for Bangalore
print("Downloading Bangalore road network...")

G = ox.graph_from_place(
    "Bengaluru, Karnataka, India",
    network_type="drive"
)

# Save graph
ox.save_graphml(G, "data/raw/bangalore_graph.graphml")

print("✅ Graph saved to data/raw/bangalore_graph.graphml")
print(f"Nodes: {len(G.nodes)}")
print(f"Edges: {len(G.edges)}")