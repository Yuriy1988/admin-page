setup:
	sudo apt-get install python3.4 python3-pip python-virtualenv

venv_install:
	virtualenv --no-site-packages -p python3.4 venv
	bash -c "source venv/bin/activate && pip install -r requirements.txt"

venv_update:
	bash -c "source venv/bin/activate && pip install -r requirements.txt"

cron_setup:
	echo '0 0 * * * bash -c "cd $(CURDIR)/currency_daemon && ./update.py"' > temp
	echo '0 6 * * * bash -c "cd $(CURDIR)/currency_daemon && ./update.py"' >> temp
	echo '0 12 * * * bash -c "cd $(CURDIR)/currency_daemon && ./update.py"' >> temp
	echo '0 18 * * * bash -c "cd $(CURDIR)/currency_daemon && ./update.py"' >> temp
	bash -c "crontab temp"
	rm temp
