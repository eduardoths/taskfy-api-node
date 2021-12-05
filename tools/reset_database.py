import os
import sqlalchemy

RESET_DB = """
DELETE FROM virtual_boards;
DELETE FROM managers;
DELETE FROM boards;
DELETE FROM users;
DELETE FROM organizations;
"""


def main():
    database = os.getenv("DATABASE_URL")
    try: 
        engine = sqlalchemy.create_engine(database)
    except sqlalchemy.exc.NoSuchModuleError:
        engine = sqlalchemy.create_engine("postgresql" + database[8:])
    engine.execute(RESET_DB)


if __name__=="__main__":
    main()
