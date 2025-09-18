import sqlite3

DB_PATH = r'C:\Users\praghuvanshi\Documents\sqllitex64\labcopilot.db'

def create_table():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS devices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            status TEXT NOT NULL,
            message TEXT
        )
    ''')
    conn.commit()
    # Insert sample data
    cursor.execute("SELECT COUNT(*) FROM devices")
    count = cursor.fetchone()[0]
    if count == 0:
        cursor.execute("""
            INSERT INTO devices (name, status, message) VALUES
            ('AMD-1', 'online', NULL),
            ('QC-1', 'warning', 'device is not stable as cpu utilization is very high')
        """)
        conn.commit()
    conn.close()

def insert_new_devices():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.executemany("""
        INSERT INTO devices (name, status, message) VALUES (?, ?, ?)
    """, [
        ('NVIDIA-1', 'critical', 'device is not reachable'),
        ('Intel-1', 'online', None),
        ('QC-2', 'warning', 'device is not stable as cpu utilization is very high')
    ])
    conn.commit()
    conn.close()

if __name__ == '__main__':
    create_table()
    insert_new_devices()