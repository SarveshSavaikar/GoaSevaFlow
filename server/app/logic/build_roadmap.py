import json
from pathlib import Path
from app.logic.firebase_utlts import get_service

def gen_roadmap(intent: str, missing_document: str , location: str , nodes_ = [] , edges_ = [] , id_ = 1 , x_ = 100 , y_ = 100 , type_ = "start" , origin= 0):
    services_path = Path(__file__).parent.parent / "data" / "services.json"
    id = id_
    x_offsset = x_
    y_offset = y_
    with open(services_path, "r") as f:
        services = json.load(f)
    service = get_service(intent)
    if(type_ == "start"):
        print("START\n")
        nodes = [
            {
                "id": '1',
                "type": 'custom', 
                "position": { "x": 100, "y": 100 },
                "data": {
                    "title": 'START Here',
                    "description": 'Follow the steps below to apply',
                    "status": 'Pending',
                    "documents": "none",
                    "type":"Start",
                    "link":""
                },
            }
        ]
        y_offset = y_offset + 400
        id = id + 1
        edges = []
        # print(nodes)
        
    
        
    
    
    
    normalized_intent = intent.strip().lower()
    print("intent"+intent)

# Now safely get steps
    steps = service.get("steps", [])
    # print("Printing steps")
    # print(steps)
    missing_flag = False
    for i in steps:
        # print(intent)
        # print(i['title'])
        
        temp = {
            "id" : str(id),
            "type" : "custom",
            "position": { "x":x_offsset , "y":y_offset},
            "data" : {
                "title":i['title'],
                "description":i['description'],
                "status":'Pending',
                "type":"steps",
                "documents":i['documents_required'],
                "link": services.get(normalized_intent, {}).get("official_links", [])
            }       
        }
        if( len(i['documents_required']) <= 0):
            print("\n!\n")
            pass
        elif( type(i['documents_required'][0]) == dict):
            print("Scanning dict")
            if("identity_proof_required" in i['documents_required'][0].keys()):
                print("Identity proof")
                temp_count = i['documents_required'][0]['identity_proof_required']['count']
                for j in i['documents_required'][0]['identity_proof_required']['options']:
                    if(missing_document != j):
                        temp_count -= 1
                        if(temp_count == 0):
                            break
                if(temp_count > 0 ):
                    missing_flag = True
            elif("address_proof_required" in i['documents_required'][0].keys()):
                temp_count = i['documents_required'][0]['address_proof_required']['count']
                for j in i['documents_required'][0]['address_proof_required']['options']:
                    if(missing_document != j):
                        temp_count -= 1
                        if(temp_count == 0):
                            break
                if(temp_count > 0 ):
                    missing_flag = True
        else:
            print("else")
            for j in i['documents_required']:
                if(missing_document == j):
                    missing_flag = True
                    
        if( missing_flag == True):
            print("MISSING DOC ALERT ! ",missing_document)
            nodes , edges = gen_roadmap(intent=missing_document , missing_document=missing_document ,location=location , nodes_=nodes , id_=id + 1 , x_=x_offsset + 500 , y_=y_offset-100 , type_="steps" , origin=id)
                        
        nodes.append(temp)
        temp_edge = {
            "id": f"e{id-1}-{id}","target":f"{id}","source":f"{id-1}","type":"default"
        }
        edges.append(temp_edge)
        y_offset = y_offset + 400
        id = id + 1
    # print(nodes)
    # print("Printing the edges data")
    # print(edges)
    # print(nodes)
    return {
        "nodes": nodes,
        "edges": edges,
        "intent": intent,
    }