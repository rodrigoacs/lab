from datetime import datetime
from dotenv import load_dotenv
import os
import sqlite3
import mysql.connector

load_dotenv()

def log(message):
    return f'[{datetime.now().strftime("%d/%m/%Y - %H:%M:%S")}] {message}'

def connect_to_sqlite():
    sqlite_conn = sqlite3.connect("../../../../mnt/c/Users/rodri/OneDrive/Documentos/Calibre/metadata.db")
    sqlite_cursor = sqlite_conn.cursor()
    return sqlite_conn, sqlite_cursor

def connect_to_mysql():
    host = os.getenv('MYSQL_HOST')
    database = os.getenv('MYSQL_DATABASE')
    password = os.getenv('MYSQL_PASSWORD')
    user = os.getenv('MYSQL_USER')

    mysql_conn = mysql.connector.connect(
        user=user,
        password=password,
        host=host,
        database=database
    )
    mysql_cursor = mysql_conn.cursor()
    return mysql_conn, mysql_cursor

def create_mysql_table(mysql_cursor, table_name, columns_info):
    mysql_cursor.execute(f"DROP TABLE IF EXISTS {table_name}")
    create_table_query = f"CREATE TABLE {table_name} (id_aux INT)"
    mysql_cursor.execute(create_table_query)

    for column_info in columns_info:
        column_name = column_info[1]
        data_type = column_info[2]
        mysql_cursor.execute(
            f"ALTER TABLE {table_name} ADD COLUMN `{column_name}` {data_type}")


def migrate_data(sqlite_cursor, mysql_cursor, table_name, columns_info):
    sqlite_cursor.execute(f"SELECT * FROM {table_name}")
    rows = sqlite_cursor.fetchall()

    if rows:
        columns = ", ".join(f"`{column_info[1]}`" for column_info in columns_info)
        values = ", ".join("%s" for _ in rows[0])

        insert_query = f"INSERT INTO {table_name} ({columns}) VALUES ({values})"
        for row in rows:
            mysql_cursor.execute(insert_query, row)
    else:
        print(f"{log(f'tabela {table_name} no SQLite está vazia.')}")

def main():
    sqlite_conn, sqlite_cursor = connect_to_sqlite()
    mysql_conn, mysql_cursor = connect_to_mysql()

    sqlite_cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = sqlite_cursor.fetchall()
    
    for table_name in tables:
        table_name = table_name[0]

        if any(table_name.startswith(prefix) for prefix in ["annotation", "sqlite_"]):
            print(f"{log(f'ignorando tabela {table_name}...')}")
            continue

        sqlite_cursor.execute(f"PRAGMA table_info({table_name})")
        columns_info = sqlite_cursor.fetchall()

        create_mysql_table(mysql_cursor, table_name, columns_info)
        migrate_data(sqlite_cursor, mysql_cursor, table_name, columns_info)

        print(f"{log(f'tabela {table_name} concluída')}")

    mysql_conn.commit()
    sqlite_conn.close()
    mysql_conn.close()

if __name__ == "__main__":
    main()
