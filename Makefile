all:
	@onejs build package.json web/fox.js --exclude express,glob,optimist,require-like,cli-color
