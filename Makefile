install:
	npm ci
lint:
	npx eslint .
test:
	npm test
build:
	NODE_ENV=production npx webpack --watch
develop:
	npx webpack serve