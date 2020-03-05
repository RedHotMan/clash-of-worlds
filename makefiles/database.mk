### Database
# ¯¯¯¯¯¯¯¯

database.seed: ## Seed database with some data
	cd api && npx sequelize-cli db:seed:all

databse.unseed: ## Remove seed database data
	cd api && npx sequelize-cli db:seed:undo:all
