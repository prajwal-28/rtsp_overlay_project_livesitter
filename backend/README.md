# RTSP Overlay Backend

This is the Flask backend for the RTSP Overlay project. It provides a REST API to manage overlays using a MongoDB database.

## Prerequisites

- Python 3.8+
- MongoDB (running locally on port 27017)

## Installation

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2.  Create a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    # Windows
    .\venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Running the Server

1.  Ensure your MongoDB instance is running.
2.  Start the Flask application:
    ```bash
    python app.py
    ```
3.  The API will be available at `http://localhost:5000`.

## API Endpoints

-   `GET /api/overlays`: Get all overlays.
-   `POST /api/overlays`: Create a new overlay.
    -   Body: `{ "type": "text"|"image", "content": "...", "x": 0, "y": 0, "width": 100, "height": 50 }`
-   `PUT /api/overlays/<id>`: Update an overlay.
-   `DELETE /api/overlays/<id>`: Delete an overlay.
