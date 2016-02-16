setup:
	sudo apt-get install python3.4 python3-pip python-virtualenv

venv_install:
	virtualenv --no-site-packages -p python3.4 venv
	bash -c "source venv/bin/activate && pip install -r requirements.txt"

venv_update:
	bash -c "source venv/bin/activate && pip install -r requirements.txt"
