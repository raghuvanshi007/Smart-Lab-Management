
from flask import Flask, jsonify
from flask_cors import CORS
import os
import json
import glob

app = Flask(__name__)
CORS(app)

JSONDATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'jsondata')


@app.route('/api/devices')
def get_devices():
    # Scan all JSON files in jsondata folder
    device_files = glob.glob(os.path.join(JSONDATA_DIR, '*.json'))
    devices = []
    status_counts = {'total': 0, 'online': 0, 'warning': 0, 'critical': 0}

    for file_path in device_files:
        filename = os.path.basename(file_path)
        # Partner inference by keywords in filename
        fname_lower = filename.lower()
        if any(x in fname_lower for x in ['qualcomm', 'cadmus', 'qc']):
            partner = 'qualcomm'
        elif 'strx' in fname_lower:
            partner = 'amd'
        elif 'lnl' in fname_lower:
            partner = 'intel'
        else:
            partner = 'unknown'

        # Load device data
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
        except Exception:
            continue


        # Each file represents one device; use only the latest timestamp entry
        if isinstance(data, list) and data:
            latest_entry = max(data, key=lambda x: x.get('epoch_timestamp', 0))
            sev = latest_entry.get('severity', '').lower()
            if sev in ['medium', 'moderate']:
                status = 'warning'
            elif sev == 'low':
                status = 'online'
            elif sev in ['high', 'critical']:
                status = 'critical'
            else:
                status = 'unknown'

            # Device name: filename up to (but not including) '_anomaly' or '-anomaly'
            name = filename
            for sep in ['_anomaly', '-anomaly']:
                if sep in name:
                    name = name.split(sep)[0]
            device = {
                'id': filename,  # Use filename as unique id
                'name': name,
                'partner': partner,
                'status': status,
                'system_state': latest_entry.get('system_state', ''),
                'severity': latest_entry.get('severity', ''),
                'timestamp': latest_entry.get('timestamp', ''),
                'message': latest_entry.get('system_state', '')
            }
            devices.append(device)
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
