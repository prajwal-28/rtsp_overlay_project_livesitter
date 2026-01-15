from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson.errors import InvalidId

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database Configuration
# Assumes MongoDB is running locally on default port 27017
client = MongoClient('mongodb://localhost:27017/')
db = client.rtsp_overlay_db
overlays_collection = db.overlays

def serialize_doc(doc):
    """
    Helper to convert MongoDB document to JSON serializable format.
    Converts '_id' ObjectId to string 'id'.
    """
    if not doc:
        return None
    doc['id'] = str(doc['_id'])
    del doc['_id']
    return doc

@app.route('/api/overlays', methods=['GET'])
def get_overlays():
    """Retrieve all overlays."""
    try:
        overlays = list(overlays_collection.find())
        return jsonify([serialize_doc(doc) for doc in overlays]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/overlays', methods=['POST'])
def create_overlay():
    """Create a new overlay."""
    data = request.json
    if not data:
        return jsonify({'error': 'Invalid JSON data'}), 400

    # Basic validation for required fields
    required_fields = ['type', 'content', 'x', 'y', 'width', 'height']
    missing_fields = [field for field in required_fields if field not in data]
    
    if missing_fields:
        return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400

    # Ensure type is valid
    if data.get('type') not in ['text', 'image']:
        return jsonify({'error': 'Invalid type. Must be "text" or "image"'}), 400

    try:
        result = overlays_collection.insert_one(data)
        new_overlay = overlays_collection.find_one({'_id': result.inserted_id})
        return jsonify(serialize_doc(new_overlay)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/overlays/<id>', methods=['PUT'])
def update_overlay(id):
    """Update an existing overlay."""
    data = request.json
    if not data:
        return jsonify({'error': 'Invalid JSON data'}), 400

    try:
        oid = ObjectId(id)
    except InvalidId:
        return jsonify({'error': 'Invalid ID format'}), 400

    # Prevent _id from being updated if passed
    if '_id' in data:
        del data['_id']

    try:
        result = overlays_collection.update_one({'_id': oid}, {'$set': data})
        
        if result.matched_count == 0:
            return jsonify({'error': 'Overlay not found'}), 404
            
        updated_overlay = overlays_collection.find_one({'_id': oid})
        return jsonify(serialize_doc(updated_overlay)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/overlays/<id>', methods=['DELETE'])
def delete_overlay(id):
    """Delete an overlay."""
    try:
        oid = ObjectId(id)
    except InvalidId:
        return jsonify({'error': 'Invalid ID format'}), 400
        
    try:
        result = overlays_collection.delete_one({'_id': oid})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Overlay not found'}), 404
            
        return jsonify({'message': 'Overlay deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
