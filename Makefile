.PHONY: server
server:
	npm run start

.PHONY: undo
undo:
	npm run sequelize db:migrate:undo

.PHONY: migrate
migrate:
	npm run sequelize db:migrate

.PHONY: seed
seed:
	npm run sequelize db:seed:all

.PHONY: db_drop
db_drop:
	npm run sequelize db:drop

.PHONY: db_create
db_create:
	npm run sequelize db:create

.PHONY: demo
demo: db_drop db_create migrate seed

.PHONY: test
test:
	npm run test

.PHONY: server
deploy:
	ansible-playbook -i deploy/inventory.yaml deploy/prod.yaml
