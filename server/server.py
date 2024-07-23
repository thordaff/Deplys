from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
import numpy as np

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Konfigurasi koneksi ke PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://thordaff:Thoriqdaffa23@localhost:5432/skripsi'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Definisikan model Cases untuk tabel dalam database PostgreSQL
class Cases(db.Model):
    __tablename__ = 'cases'
    id = db.Column(db.Integer, primary_key=True)
    symptoms = db.Column(db.Text)
    depression_level = db.Column(db.String(50))

def calculate_phq9_score(responses):
    return sum(responses)

def classify_depression_level(score):
    if score <= 4:
        return "TD1: Tidak Depresi"
    elif score <= 9:
        return "TD2: Depresi Ringan"
    elif score <= 19:
        return "TD3: Depresi Sedang"
    else:
        return "TD4: Depresi Berat"

def parse_symptoms(symptoms_str):
    try:
        symptoms = [int(x) for x in symptoms_str.strip('{}').split(',')]
    except ValueError:
        symptoms = []
    return symptoms

def cosine_similarity(A, B):
    A = np.array(A)
    B = np.array(B)
    dot_product = np.dot(A, B)
    norm_A = np.linalg.norm(A)
    norm_B = np.linalg.norm(B)
    
    if norm_A == 0 or norm_B == 0:
        return 0.0  # Handle zero vector case
    
    return dot_product / (norm_A * norm_B)

@app.route('/analyze', methods=['POST'])
@cross_origin()
def analyze_cosine():
    data = request.json.get('responses', [])
    print('Received data:', data)  # Debug log

    if not isinstance(data, list) or not all(isinstance(i, int) for i in data):
        return jsonify({'error': 'Invalid input format, expected a list of integers'}), 400

    cases = Cases.query.all()
    if not cases:
        return jsonify({'error': 'No cases found in database'}), 404

    similarities = []
    for case in cases:
        symptoms_vector = np.array(parse_symptoms(case.symptoms))
        similarity = cosine_similarity(data, symptoms_vector)
        similarities.append(similarity)

    max_similarity = max(similarities)
    most_similar_index = np.argmax(similarities)
    result = cases[most_similar_index].depression_level

    new_score = calculate_phq9_score(data)
    new_depression_level = classify_depression_level(new_score)

    if max_similarity >= 0.9:
        similarity_range = "Highly Similar"
    elif max_similarity >= 0.7:
        similarity_range = "Moderately Similar"
    else:
        similarity_range = "Low Similarity"

    response = {
        'similarity_level': result,
        'similarity_range': similarity_range,
        'new_score': new_score,
        'new_depression_level': new_depression_level
    }
    print('Sending response:', response)  # Debug log
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
