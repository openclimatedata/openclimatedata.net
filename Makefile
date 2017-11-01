all: venv
	./venv/bin/python generate_page.py

dev:
	onchange template.html data.yaml assets/* generate_page.py --  make & reload

venv: requirements.txt
	[ -d ./venv ] || python3 -m venv venv
	./venv/bin/pip install --upgrade pip
	./venv/bin/pip install -Ur requirements.txt
	touch venv

.PHONY: dev
