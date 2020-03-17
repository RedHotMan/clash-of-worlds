.DEFAULT_GOAL := help

### Project
# ¯¯¯¯¯¯¯¯

install: ## Install project
	${MAKE} api.install && ${MAKE} client.install

start: ## Start project
	${MAKE} docker.up ARG=-d

stop: ## Stop project
	${MAKE} docker.stop

reset: ## Reset project
	${MAKE} docker.destroy && ${MAKE} docker.build && ${MAKE} docker.up ARG=-d

include makefiles/client.mk
include makefiles/api.mk
include makefiles/database.mk
include makefiles/docker.mk
include makefiles/help.mk
