
from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)
DB_PATH = r'C:\Users\praghuvanshi\Documents\sqllitex64\labcopilot.db'

@app.route('/api/devices')
def get_devices():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # Try to fetch message column if it exists
    try:
        cursor.execute('SELECT id, name, status, message FROM devices')
    except sqlite3.OperationalError:
        cursor.execute('SELECT id, name, status FROM devices')
    rows = cursor.fetchall()
    conn.close()

    devices = []
    status_counts = {'total': 0, 'online': 0, 'warning': 0, 'critical': 0}
    for row in rows:
        device = {'id': row[0], 'name': row[1], 'status': row[2]}
        # Add message if available
        if len(row) > 3:
            device['message'] = row[3]
        devices.append(device)
        status = row[2].lower()
        status_counts['total'] += 1
        if status == 'online':
            status_counts['online'] += 1
        elif status == 'warning':
            status_counts['warning'] += 1
        elif status == 'critical':
            status_counts['critical'] += 1

    return jsonify({
        'devices': devices,
        'summary': status_counts
    })

if __name__ == '__main__':
    app.run(debug=True)
