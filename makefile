preprod:
	docker compose -f docker-compose.preprod.yml --env-file .env.preprod up

preprod-detach:
	docker compose -f docker-compose.preprod.yml --env-file .env.preprod up -d

preprod-stop:
	docker compose -f docker-compose.preprod.yml --env-file .env.preprod down


prod:
	docker compose -f docker-compose.prod.yml --env-file .env.prod up

prod-detach:
	docker compose -f docker-compose.prod.yml --env-file .env.prod up -d

prod-stop:
	docker compose -f docker-compose.prod.yml --env-file .env.prod down

dev:
	docker compose -f docker-compose.dev.yml --env-file .env.dev watch
