DB_NAME=xopadmindb
DB_USER=xopadmin
DB_PASSWORD=UC4EhhQ6HkwNn7qK

DB_TEST_NAME=xopadmintestdb
DB_TEST_USER=xopadmintest
DB_TEST_PASSWORD=test123


# ========== Linux ==========


# ----- Install -----

install_python35_repo:
	sudo add-apt-repository ppa:fkrull/deadsnakes
	sudo apt-get update

install_python:
	sudo apt-get install python3.5 python3.5-dev python3-pip python3-wheel python-virtualenv

install_postgres:
	sudo apt-get install postgresql postgresql-contrib python-psycopg2

install: install_python install_postgres
	sudo chmod +x run.py
	sudo chmod +x manage.py


# ------ Database -----

db_psql_remove:
	sudo -u postgres dropdb -e --if-exists $(DB_NAME)
	sudo -u postgres dropuser -e --if-exists $(DB_USER)

db_psql_create: db_psql_remove
	sudo -u postgres psql -c "CREATE USER $(DB_USER) WITH PASSWORD '$(DB_PASSWORD)'"
	sudo -u postgres psql -c "CREATE DATABASE $(DB_NAME) OWNER $(DB_USER)"
	sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $(DB_NAME) TO $(DB_USER)"

db_clean:
	sudo -u postgres psql $(DB_NAME) -c "DROP SCHEMA public CASCADE"
	sudo -u postgres psql $(DB_NAME) -c "CREATE SCHEMA public"
	sudo -u postgres psql $(DB_NAME) -c "GRANT ALL ON SCHEMA public TO postgres"
	sudo -u postgres psql $(DB_NAME) -c "GRANT ALL ON SCHEMA public TO public"

db_test_create:
	sudo -u postgres dropdb -e --if-exists $(DB_TEST_NAME)
	sudo -u postgres dropuser -e --if-exists $(DB_TEST_USER)
	sudo -u postgres psql -c "CREATE USER $(DB_TEST_USER) WITH PASSWORD '$(DB_TEST_PASSWORD)'"
	sudo -u postgres psql -c "CREATE DATABASE $(DB_TEST_NAME) OWNER $(DB_TEST_USER)"
	sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $(DB_TEST_NAME) TO $(DB_TEST_USER)"

db_init: db_psql_create db_test_create
	rm -r -f migrations
	./manage.py db init
	./manage.py db migrate
	./manage.py db upgrade

db_update:
	./manage.py db migrate
	./manage.py db upgrade

db_revert:
	./manage.py db downgrade

db_create: db_psql_create db_update

db_dummy:
	node ./generators/index.js --target merchant --count 10
	node ./generators/index.js --target store --count 3 --mid 1..10


# ----- Virtualenv -----

venv_install:
	virtualenv --no-site-packages -p python3.5 venv
	bash -c "source venv/bin/activate && pip install -r requirements.txt"

venv_update:
	bash -c "source venv/bin/activate && pip install -r requirements.txt"


# ----- Test -----

test: venv_update
	./manage.py test


# ========== MacOS ==========

mac_venv_install:
	virtualenv --no-site-packages -p /usr/local/bin/python3 venv
	bash -c "source venv/bin/activate && pip install -r requirements.txt"
