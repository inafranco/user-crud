include .env

run:
	docker-compose down
	mkdir -p db_data
	docker-compose build
	docker-compose up -d

test:
	docker-compose exec api pytest -s src/tests/tests.py -W ignore::DeprecationWarning

clear-and-run: clear-db run
	sleep 3

reset-test: clear-and-run test

enter-db:
	docker-compose exec db psql --username=${POSTGRES_USER} --dbname=${POSTGRES_DB}

clear-db:
	docker-compose down
	sudo chown -R ${USER} db_data
	rm -rf db_data
