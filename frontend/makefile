# Nom de l'image
IMAGE_NAME=spinshare_frontend

# Commande pour construire l'image Docker
build:
	docker build -t $(IMAGE_NAME) .

# Commande pour lancer le conteneur
run:
	docker run -it --rm -p 5173:5173 $(IMAGE_NAME)