import networkx as nx

user_graphs = {}

def update_user_profile(user_id: str, action: str, detail: str):
    if user_id not in user_graphs:
        user_graphs[user_id] = nx.DiGraph()
    
    G = user_graphs[user_id]
    G.add_node(user_id)
    G.add_node(detail)
    G.add_edge(user_id, detail, action=action)

def get_user_graph(user_id: str):
    return user_graphs.get(user_id)
