from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle
from pathlib import Path
import numpy as np
import sklearn

from pydantic import BaseModel

class QueryRequest(BaseModel):
    query: str
    
model = load_model(Path(__file__).resolve().parent.parent / "model" / "semantic-intent-matcher.h5")
tokenizer_path = Path(__file__).resolve().parent.parent / "model" / "tokenizer.pkl"
# tokenizer_path = "C:\Users\Sarvesh\Documents\infipre internship\govt-servies-chatbot-api\app\model\tokenizer.pkl"
label_encoder_path = Path(__file__).resolve().parent.parent / "model" / "label_encoder.pkl"


def ask_sementic_intent_matching_model(data: QueryRequest):
    # Load the saved model

# Load tokenizer
    with open(tokenizer_path, "rb") as f:
        tokenizer = pickle.load(f)

    # Load label encoder
    with open(label_encoder_path, "rb") as f:
        label_encoder = pickle.load(f)

    # Same MAX_SEQUENCE_LEN used during training
    MAX_SEQUENCE_LEN = 25  

# Example query
    query = data.query
    seq = tokenizer.texts_to_sequences([query])
    padded = pad_sequences(seq, maxlen=MAX_SEQUENCE_LEN, padding='post')
    prediction = model.predict(padded)
    print("PRediction :- ",label_encoder.inverse_transform([np.argmax(prediction)])[0])
    return str(label_encoder.inverse_transform([np.argmax(prediction)])[0])
