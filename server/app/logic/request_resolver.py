import json
from pathlib import Path
from app.logic.build_roadmap import gen_roadmap

def resolve_request(intent, missing_docs, location):
    services_path = Path("app/data/services.json")
    docs_path = Path("app/data/documents.json")
    locations_path = Path("app/data/locations.json")

    services = json.loads(services_path.read_text())
    documents = json.loads(docs_path.read_text())
    locations_data = json.loads(locations_path.read_text())
    print("Documents:- ",documents)
    print("in resolution")
    # print("missing_doucment",missing_docs)

    # service_info = services.get(intent, {})
    # required_documents = documents.get(intent, [])
    # offline_locations = locations_data.get(location.lower(), [])

    alternatives = []
    # for doc in missing_docs:
        # if doc in service_info.get("alternatives", {}):
            # alternatives.append(service_info["alternatives"][doc])
            
    # gen_roadmap("voter_id_application","","")

    return gen_roadmap(intent=intent , missing_document=missing_docs , location=location , type_="start")
