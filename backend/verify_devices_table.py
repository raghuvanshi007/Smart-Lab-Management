import sqlite3

DB_PATH = r'C:\Users\praghuvanshi\Documents\sqllitex64\labcopilot.db'

def verify_table():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, status, message FROM devices')
    rows = cursor.fetchall()
    conn.close()
    print('Devices table contents:')
    for row in rows:
        print(row)

if __name__ == '__main__':
    verify_table()