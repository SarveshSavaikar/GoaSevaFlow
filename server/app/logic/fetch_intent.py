import json
from pathlib import Path
import requests
from transformers import AutoModelForCausalLM, AutoTokenizer , pipeline , AutoModelForSequenceClassification
from app.logic.fetch_documents import extract_missing_documents
from app.logic.firebase_utlts import get_service

def fetch_service(intent: str , missing_doc: list):
    print("origingal intent")
    print(intent)
    OLLAMA_URL = "http://localhost:11434/api/generate"
    services_path = Path(__file__).parent.parent / "data" / "services.json"
    documents_path = Path(__file__).parent.parent / "data" / "documents.json"
    result = get_service(intent)
    if result:
        print("Fetched service data:-\n",result)
    with open(services_path, "r") as f:
        services = json.load(f)
        
    with open(documents_path, "r") as f:
        documents = json.load(f)
    
    documents_labels = [i for i in documents['documents']]
    services_key = list(services.keys())
    services_labels = [
        services.get(i, {}).get("description", []) for i in services_key
    ]
    model_path = "F:/HF_Models/hub/models--roberta-large-mnli/snapshots/2a8f12d27941090092df78e4ba6f0928eb5eac98"

    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model = AutoModelForSequenceClassification.from_pretrained(model_path)

    classifier = pipeline("zero-shot-classification", model=model, tokenizer=tokenizer)
    # missing_doc_label = classifier(missing_doc[0], documents_labels)
    # Use offline
    intent_label = classifier(intent, services_labels)
    intent_key = next(
    (k for k, v in services.items() if 'description' in v and v['description'] == intent_label["labels"][0]),
    None
    )
    print("Intent :- ",intent)
    print("Predicted label:",intent_key)
    
    # print("Predicted Missing doc : ",missing_doc_label["labels"][0])
    
    # payload = {
    #     "stream": False,
    #     "model": "gemma3:1b",
    #     "prompt": (
    # f"This is the request of a client: '{intent}'. "
    # "You are a helpful assistant for a government service chatbot in Goa."+

    # "From the list below, identify and return the exact name of the service the user is asking about. Only choose from the list.\n"+
    # "if no match is fount then reply 'null'"+
    # "Services: ["
    # + ", ".join(f"'{key}'" for key in services_key)
    # + "]\n"
    # "Respond with the exact service name in string / text format from the list above. response should be on of the values from serices list "
    # "This reply will be used as a key to search in the services directly."+
    # "So if the request of the client is 'Application for aadhar card - No Pan card' then focus on the main intent that is applicationn for aadhar card and services whose name is having similar meaning to this intent"+
    # "if the no match is found then respond with 'null' by default "
    # )
    # }
    # print(" ".join(f"'{key}'" for key in services_key))
    
    # response = requests.post(OLLAMA_URL, json=payload)
    # data = response.json()
    # response_text = data["response"]
    # print("\n\nprinting the fetched intent"+response_text)
    return intent_key 
