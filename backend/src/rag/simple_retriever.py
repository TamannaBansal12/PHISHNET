import os
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(os.path.dirname(current_dir))
KB_DIR = os.path.join(backend_dir, "data", "knowledge_base")

def retrieve_relevant_context(query, top_k=3):
    results = []

    for file in os.listdir(KB_DIR):
        if not file.endswith(".txt"):
            continue

        path = os.path.join(KB_DIR, file)

        with open(path, "r", errors="ignore") as f:
            content = f.read()

        score = sum(1 for word in query.lower().split() if word in content.lower())

        results.append({
            "source": file,
            "score": score,
            "content": content[:800]
        })

    results = sorted(results, key=lambda x: x["score"], reverse=True)
    return results[:top_k]