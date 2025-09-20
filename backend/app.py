from flask import Flask, jsonify
import os
import json

app = Flask(__name__)

# Helper to load all device anomaly and trend data from received_data
RECEIVED_DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'received_json')
ANOMALY_DIR = os.path.join(RECEIVED_DATA_DIR, 'anomaly')
TREND_DIR = os.path.join(RECEIVED_DATA_DIR, 'trend')

def load_json_files_from_dir(directory):
    data = []
    for fname in os.listdir(directory):
        if fname.endswith('.json'):
            fpath = os.path.join(directory, fname)
            with open(fpath, 'r', encoding='utf-8') as f:
                try:
                    data.append(json.load(f))
                except Exception as e:
                    print(f"Error loading {fpath}: {e}")
    return data

@app.route('/api/devices')
def get_devices():
    # For demo: flatten all anomaly files as devices
    # Get all anomaly JSON filenames
    anomaly_files = [fname for fname in os.listdir(ANOMALY_DIR) if fname.endswith('.json')]
    anomaly_data = load_json_files_from_dir(ANOMALY_DIR)
    devices = []
    online_count = 0
    warning_count = 0
    critical_count = 0
    for idx, entry in enumerate(anomaly_data):
        fname = anomaly_files[idx] if idx < len(anomaly_files) else ''
        # Partner assignment by filename
        if 'lnl' in fname:
            partner = 'Intel'
        elif 'strx' in fname:
            partner = 'AMD'
        else:
            partner = 'Qualcomm'
        # Gather all anomalies in this file
        all_anomalies = []
        if isinstance(entry, list):
            for batch in entry:
                all_anomalies.extend(batch.get('anomalies', []))
        elif isinstance(entry, dict):
            all_anomalies.extend(entry.get('anomalies', []))
        # Find latest anomaly by timestamp
        latest = None
        if all_anomalies:
            latest = max(all_anomalies, key=lambda a: a.get('timestamp', ''))
        # Severity mapping for latest anomaly
        if latest:
            sev = str(latest.get('severity', '')).lower()
            if sev in ['low', 'online']:
                status = 'Online'
                online_count += 1
            elif sev in ['medium', 'moderate', 'warning']:
                status = 'Warning'
                warning_count += 1
            elif sev in ['high', 'critical']:
                status = 'Critical'
                critical_count += 1
            else:
                status = 'Unknown'
        else:
            status = 'Unknown'
        # Set message: for warning/critical, use system_state; for online, use severity
        if status == 'Online':
            msg = latest.get('severity', '') if latest else ''
        elif status in ['Warning', 'Critical']:
            msg = latest.get('system_state', '') if latest else ''
        else:
            msg = ''
        device_name = fname[:-5] if fname.endswith('.json') else fname
        device = {
            'name': device_name,
            'status': status,
            'partner': partner,
            'message': msg,
            'id': device_name,
            'timestamp': latest.get('timestamp', '') if latest else '',
            'metrics': latest.get('system_metrics', {}) if latest else {},
        }
        devices.append(device)
    summary = {
        'total': len(anomaly_files),
        'online': online_count,
        'warning': warning_count,
        'critical': critical_count,
    }
    return jsonify({'devices': devices, 'summary': summary})


# Serve trend and anomaly files for frontend fetch
from flask import send_from_directory

@app.route('/received_json/trend/<path:filename>')
def serve_trend_file(filename):
    return send_from_directory(TREND_DIR, filename)

@app.route('/received_json/anomaly/<path:filename>')
def serve_anomaly_file(filename):
    return send_from_directory(ANOMALY_DIR, filename)

if __name__ == '__main__':
    app.run(debug=True)
