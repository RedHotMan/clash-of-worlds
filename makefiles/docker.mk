### DOCKER
# ¯¯¯¯¯¯¯¯

docker.pull: ## Pull the external images
	docker-compose pull

docker.build: ## Build the containers
	docker-compose build

docker.up: ARG=
docker.up: ## Up the containers
	docker-compose up ${ARG}

docker.stop: ## Stop the containers
	docker-compose stop

docker.down: ## Down the containers
	docker-compose down

docker.destroy:  ## Destroy the containersand volumes
	docker-compose down -v

docker.restart: ## Restart containers
	docker-compose restart

docker.logs: ## Show containers logs
	docker-compose logs -f
