import sqlite3
import mysql.connector

# Conectar ao SQLite
sqlite_conn = sqlite3.connect("metadata.db")
sqlite_cursor = sqlite_conn.cursor()

# Conectar ao MySQL
mysql_conn = mysql.connector.connect(
    host="",
    user="",
    password="",
    database=""
)
mysql_cursor = mysql_conn.cursor()

# Obter informações sobre as tabelas no SQLite
sqlite_cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = sqlite_cursor.fetchall()
tables = [table for table in tables if table[0] in ['authors', 'books', 'books_authors_link',
                                                    'books_languages_link', 'books_publishers_link',
                                                    'books_series_link', 'books_tags_link',
                                                    'publishers', 'series', 'tags']]

# Para cada tabela no SQLite
for table_name in tables:
    table_name = table_name[0]

    # Obter informações sobre as colunas no SQLite
    sqlite_cursor.execute(f"PRAGMA table_info({table_name})")
    columns_info = sqlite_cursor.fetchall()

    # Criar a tabela no MySQL
    mysql_cursor.execute(f"DROP TABLE IF EXISTS {table_name}")
    create_table_query = f"CREATE TABLE {table_name} (id_aux INT)"
    print("\ntabela:", table_name)
    mysql_cursor.execute(create_table_query)

    # Obter os dados da tabela no SQLite
    sqlite_cursor.execute(f"SELECT * FROM {table_name}")
    rows = sqlite_cursor.fetchall()

    # Verificar se há dados antes de inserir no MySQL
    if rows:
        # Para cada coluna no SQLite
        for column_info in columns_info:
            column_name = column_info[1]
            data_type = column_info[2]
            print(f"\t{column_name} ({data_type})")

            # Adicionar a coluna no MySQL
            mysql_cursor.execute(
                f"ALTER TABLE {table_name} ADD COLUMN `{column_name}` {data_type}")

        # Para cada linha na tabela do SQLite
        for row in rows:
            # Construir a string de colunas
            columns = ", ".join(
                f"`{column_info[1]}`" for column_info in columns_info)

            # Construir a string de valores
            values = ", ".join("%s" for _ in row)

            # Inserir a linha no MySQL
            insert_query = f"INSERT INTO {table_name} ({columns}) VALUES ({values})"
            mysql_cursor.execute(insert_query, row)
    mysql_cursor.execute(
        f"ALTER TABLE {table_name} DROP COLUMN id_aux")


# Commit as alterações no MySQL
mysql_conn.commit()
sqlite_conn.close()
mysql_conn.close()
