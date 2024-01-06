install:
	docker-compose -f docker-compose.builder.yml run --rm install
build:
	docker-compose -f docker-compose.builder.yml run --rm build
dev:
	docker-compose up
stop:
	docker-compose stop
down:
	docker-compose down
be:
	docker-compose exec backend bash
