PYTHON=python3.5

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

install:
	sudo apt-get install -y $(PYTHON) $(PYTHON)-dev python3-pip python3-wheel python-virtualenv
	sudo apt-get install -y libpq-dev postgresql postgresql-contrib python-psycopg2 redis-server
	sudo apt-get install -y rabbitmq-server

# ------ Database -----

db_update:
	if [ ! -d "migrations" ]; then ./manage.py db init; fi;
	./manage.py db migrate
	./manage.py db upgrade

db_psql_create:
	sudo -u postgres psql -c "CREATE USER $(DB_USER) WITH PASSWORD '$(DB_PASSWORD)'"
	sudo -u postgres psql -c "CREATE DATABASE $(DB_NAME) OWNER $(DB_USER)"
	sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $(DB_NAME) TO $(DB_USER)"

db_test_create:
	sudo -u postgres dropdb -e --if-exists $(DB_TEST_NAME)
	sudo -u postgres dropuser -e --if-exists $(DB_TEST_USER)
	sudo -u postgres psql -c "CREATE USER $(DB_TEST_USER) WITH PASSWORD '$(DB_TEST_PASSWORD)'"
	sudo -u postgres psql -c "CREATE DATABASE $(DB_TEST_NAME) OWNER $(DB_TEST_USER)"
	sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $(DB_TEST_NAME) TO $(DB_TEST_USER)"

db_create: db_psql_create db_test_create db_update
	./manage.py create_admin
	./manage.py create_data

db_remove:
	rm -rf migrations
	rm -rf media/admin/*
	sudo -u postgres dropdb -e --if-exists $(DB_NAME)
	sudo -u postgres dropuser -e --if-exists $(DB_USER)

db_reset: db_remove db_create

db_revert:
	./manage.py db downgrade

db_clean:
	rm -rf migrations
	sudo -u postgres psql $(DB_NAME) -c "DROP SCHEMA public CASCADE"
	sudo -u postgres psql $(DB_NAME) -c "CREATE SCHEMA public"
	sudo -u postgres psql $(DB_NAME) -c "GRANT ALL ON SCHEMA public TO postgres"
	sudo -u postgres psql $(DB_NAME) -c "GRANT ALL ON SCHEMA public TO public"

db_dummy:
	./dummy.py --username=admin --password=password


# ----- Virtualenv -----

venv_init:
	if [ ! -d "venv" ]; then virtualenv --no-site-packages -p $(PYTHON) venv; fi;
	bash -c "source venv/bin/activate && pip install --upgrade wheel && pip install -r requirements.txt"


# ----- Build static -----

build_static:
	bash -c "cd frontend && make build"


# ----- Setup -----

setup: install venv_init db_create


# ----- Update -----

update: venv_init db_update


# ----- Remove -----

remove: db_remove
	rm -rf venv


# ----- Test -----

test: venv_init
	./manage.py test


# ----- Demo Server -----

setup_demo:
	fab setenv:demo setup

deploy:
	fab setenv:demo update


# ----- Run Server -----

runserver:
	./run.py --config=debug --reload


# ========== MacOS ==========

mac_db_install:
	brew install postgresql
	sudo PATH=$PATH:/usr/pgsql-9.5.1/bin/ pip install psycopg2
	sudo -u postgres psql -c "CREATE USER $(DB_USER) WITH PASSWORD '$(DB_PASSWORD)'"
	sudo -u postgres psql -c "CREATE DATABASE $(DB_NAME) OWNER $(DB_USER)"
	sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $(DB_NAME) TO $(DB_USER)"

mac_venv_install:
	virtualenv --no-site-packages -p /usr/local/bin/python3 venv
	bash -c "source venv/bin/activate && pip install -r requirements.txt"
