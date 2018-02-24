var AM = new AssetManager();

AM.queueDownload("./img/Alien.png");
AM.queueDownload("./img/Soldier.png");
AM.queueDownload("./img/back.jpg");
AM.queueDownload("./img/Explosion.png");

AM.downloadAll(function() {
	var canvas = document.getElementById("gameWorld");
	var ctx = canvas.getContext("2d");

	var gameEngine = new GameEngine();

	var bg = new Background(gameEngine, AM.getAsset("./img/back.jpg"));

	var alien = new Alien(gameEngine, 50, 420);

	var soldier = new Soldier(gameEngine, 1050, 500);

	gameEngine.addEntity(bg);
	gameEngine.addEntity(alien);
	gameEngine.addEntity(soldier);
	gameEngine.init(ctx);
	gameEngine.start();
});