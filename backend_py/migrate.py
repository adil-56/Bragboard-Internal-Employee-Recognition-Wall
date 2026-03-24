import sqlite3
import traceback

try:
    conn = sqlite3.connect('bragboard.db')
    conn.execute('ALTER TABLE users ADD COLUMN avatar_url VARCHAR;')
    conn.commit()
    print('Added avatar_url column to users table')
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e).lower():
        print("Column already exists!")
    else:
        traceback.print_exc()
finally:
    conn.close()
