preprod:
	cd frontend && \
	docker build -t snipshare-frontend-preprod -f dockerfile.preprod . && \
	cd ../backend && \
	docker build -t snipshare-backend-preprod -f dockerfile.preprod . && \
	cd .. && \
	docker compose -f docker-compose.preprod.yml --env-file .env.preprod up

preprod-detach:
	cd frontend && \
	docker build -t snipshare-frontend-preprod -f dockerfile.preprod . && \
	cd ../backend && \
	docker build -t snipshare-backend-preprod -f dockerfile.preprod . && \
	cd .. && \
	docker compose -f docker-compose.preprod.yml --env-file .env.preprod up -d

preprod-stop:
	docker compose -f docker-compose.preprod.yml --env-file .env.preprod down


prod:
	cd frontend && \
	docker build -t snipshare-frontend-prod -f dockerfile.prod . && \
	cd ../backend && \
	docker build -t snipshare-backend-prod -f dockerfile.prod . && \
	cd .. && \
	docker compose -f docker-compose.prod.yml --env-file .env.prod up

prod-detach:
	cd frontend && \
	docker build -t snipshare-frontend-prod -f dockerfile.prod . && \
	cd ../backend && \
	docker build -t snipshare-backend-prod -f dockerfile.prod . && \
	cd .. && \
	docker compose -f docker-compose.prod.yml --env-file .env.prod up -d

prod-stop:
	docker compose -f docker-compose.prod.yml --env-file .env.prod down
