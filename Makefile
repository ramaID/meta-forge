install:
	docker compose -f docker-compose.builder.yml run --rm install
	docker run --rm -v ./backend:/opt -w /opt -it ramageek/php:beta-8.1-sprint-laravel bash -c "composer install"
build:
	docker compose -f docker-compose.builder.yml run --rm build
dev:
	docker compose up -d
stop:
	docker compose stop
down:
	docker compose down
be:
	docker compose exec backend bash
