# Smart Lab Management Backend (Python)

This backend serves device data from your local `labcopilot.db` SQLite database for the dashboard frontend.

## Prerequisites
- Python 3.8+
- `labcopilot.db` in the project root

## Installation
```powershell
cd backend
pip install -r requirements.txt
```

## Running the Backend
```powershell
python app.py
```
The API will be available at `http://localhost:5000/api/devices`

## API Endpoint
- `GET /api/devices` — Returns all devices and summary counts (total, online, warning, critical)

## Notes
- Adjust the SQL query in `app.py` if your table/column names differ.
- For production, use a proper WSGI server (e.g., gunicorn) and set `debug=False`.
