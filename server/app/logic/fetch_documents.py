import re
import json
from pathlib import Path

def extract_missing_documents(user_query):
    print("*****************************************")
    user_query = user_query.lower()
    missing_docs = []
    documents_path = Path(__file__).parent.parent / "data" / "documents.json"
    with open(documents_path, "r") as f:
        documents = json.load(f)
    for doc in documents['documents']:
        doc_lower = doc.lower()
        for phrase in ["don't have", "do not have", "haven't", "missing", "without", "lost", "not having", "no" , "dont have"]:
            pattern = re.compile(rf"{phrase}.*{re.escape(doc_lower)}|{re.escape(doc_lower)}.*{phrase}")
            if pattern.search(user_query):
                missing_docs.append(doc)
                break
    print("\nmissing docs ---- \n",missing_docs)
    return missing_docs