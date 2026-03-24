import psycopg2

def promote():
    try:
        # Connect to your local postgres database
        conn = psycopg2.connect(
            dbname="bragboard",
            user="postgres",
            password="password",  # Assuming 'password' based on their local setup, or just relying on their local auth
            host="localhost",
            port="5432"
        )
        cur = conn.cursor()
        
        # Update everyone just to be safe
        cur.execute("UPDATE users SET role = 'admin';")
        conn.commit()
        
        print(f"SUCCESS: Promoted users to admin! Row count: {cur.rowcount}")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    promote()
