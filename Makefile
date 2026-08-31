ifneq (,$(wildcard ./.env))
    include .env
    export
endif

# Configurable variables
DOCKER_COMPOSE_FILE ?= deployment/dev/docker-compose.yml
STACK_NAME ?= esup-pod-front
DOCKER_COMPOSE_CMD := docker compose -p $(STACK_NAME) -f $(DOCKER_COMPOSE_FILE)
LOG_PREFIX := \033[36m[make]\033[0m

CMD := $(firstword $(MAKECMDGOALS))
DYNAMIC_CMDS := start stop clean logs shell
ifneq ($(filter $(CMD),$(DYNAMIC_CMDS)),)
  SERVICE_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  $(eval $(SERVICE_ARGS):;@:)
endif

define info
	@printf "$(LOG_PREFIX) %s\n" "$(1)"
endef

.PHONY: help start restart full-restart logs shell build stop clean ci lint typecheck test

help: ## List available make commands
	@grep -h -E '^[a-zA-Z0-9_.-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Docker commands

start: ## Start the project/service (detached, build if needed). Usage: make start
	$(call info,Starting Docker environment...)
	$(DOCKER_COMPOSE_CMD) up --build -d $(SERVICE_ARGS)
	$(call info,Server running in background — use 'make logs' to follow output.)

restart: ## Restart containers (stop then start)
	$(call info,Restarting stack '$(STACK_NAME)' (stop -> start)...)
	$(MAKE) stop
	$(MAKE) start

full-restart: ## Full reset then start (clean + start)
	$(call info,Performing full restart: clean -> start...)
	$(MAKE) clean
	$(MAKE) start

logs: ## Follow logs. Usage: make logs
	$(call info,Attaching to logs...)
	@$(DOCKER_COMPOSE_CMD) logs -f --tail=100 $(SERVICE_ARGS)

shell: start ## Launch an isolated shell. Usage: make shell
	$(call info,Opening a new ephemeral shell in service 'frontend'...)
	$(DOCKER_COMPOSE_CMD) run --rm --service-ports frontend sh

build: ## Force Docker image rebuild
	$(call info,Building Docker images (stack: $(STACK_NAME))...)
	$(DOCKER_COMPOSE_CMD) build

stop: ## Stop running containers. Usage: make stop
	$(call info,Stopping containers...)
	$(DOCKER_COMPOSE_CMD) stop $(SERVICE_ARGS)
	$(call info,Containers stopped. Use 'make clean' to remove them entirely.)

clean: stop ## Full shutdown and cleanup. Usage: make clean
	$(call info,Cleaning...)
	@$(DOCKER_COMPOSE_CMD) down --remove-orphans --volumes

# Local QA commands

ci: lint typecheck test build ## Local CI pipeline: lint → typecheck → test → build
	$(call info,CI sequence completed.)

lint: ## Run linter
	$(call info,Running eslint...)
	yarn lint

typecheck: ## Run TypeScript typecheck
	$(call info,Running typecheck...)
	yarn typecheck

test: ## Run Vitest tests
	$(call info,Running tests...)
	yarn test --run
