function Alien(game, x, y) {
	
	var img = AM.getAsset("./img/Alien.png");

	this.actualWidth = 130;
	this.acutalHeight = 77;

	this.walkFrames = [new Frame(58, 28, 136, 77), new Frame(198, 28, 140, 77),
						new Frame(339, 26, 146, 79), new Frame(485, 25, 141, 80),
						new Frame(650, 16, 136, 79), new Frame(792, 20, 140, 77),
						new Frame(948, 20, 144, 77)];

	this.gettingShotFrames = [new Frame(182, 502, 102, 103), new Frame(308, 504, 100, 99),
								new Frame(440, 504, 90, 94)];

	this.fallAndRiseFrames = [new Frame(114, 811, 151, 53), new Frame(308, 811, 140, 45),
								new Frame(308, 811, 140, 45), new Frame(308, 811, 140, 45),
								new Frame(308, 811, 140, 45), new Frame(308, 811, 140, 45),
								new Frame(308, 811, 140, 45), new Frame(308, 811, 140, 45),
								new Frame(308, 811, 140, 45), new Frame(480, 811, 140, 45),
								new Frame(630, 802, 142, 45), new Frame(807, 785, 151, 72),
								new Frame(979, 780, 161, 68), new Frame(126, 890, 115, 70),
								new Frame(255, 880, 85, 76), new Frame(355, 880, 121, 76),
								new Frame(753, 916, 121, 43), new Frame(595, 897, 135, 61),
								new Frame(485, 875, 108, 88), new Frame(61, 389, 120, 94)];

	this.dyingFrames = [new Frame(185, 390, 102, 86), new Frame(310, 390, 85, 86),
						new Frame(410, 378, 85, 90), new Frame(519, 396, 147, 45),
						new Frame(679, 433, 127, 32)];

	this.walkAnimation = new Animation(img,
		58, 28, 136, 77, 0.12, this.walkFrames.length, false, false, false, this.walkFrames);

	this.gettingShotAnimation = new Animation(img,
		182, 502, 102, 103, 0.11, this.gettingShotFrames.length, false, false, false, this.gettingShotFrames);

	this.fallAndRiseAnimation = new Animation(img,
		114, 811, 151, 53, 0.10, this.fallAndRiseFrames.length, false, false, false, this.fallAndRiseFrames);

	this.dyingAnimation = new Animation(img,
		185, 390, 102, 86, 0.12, this.dyingFrames.length, false, false, true, this.dyingFrames);


	this.allAnims = [this.walkAnimation, this.gettingShotAnimation, this.fallAndRiseAnimation];
	for (var i = 0; i < this.allAnims.length; i++) {
		this.allAnims[i].acutalHeight = 77;
		this.allAnims[i].actualWidth = 130;
	}

	this.moving = true;
	this.gettingShot = false;
	this.rising = false;
	this.dying = false;

	this.gettingShotCounter = 0;
	this.fallenCounter = 0;

	this.currentAnimation = this.walkAnimation;
	this.scaleBy = 2;

	Entity.call(this, game, x, y);
}

Alien.prototype = new Entity();
Alien.prototype.constructor = Alien;

Alien.prototype.update = function() {
	if (this.game.soldierSuicide) {
		this.removeFromWorld = true;
	} else if (this.moving) {
		this.currentAnimation = this.walkAnimation;
		this.game.alienMoving = true;
		if (this.walkAnimation.isDone()) {
			this.moving = false;
			this.game.alienMoving = null;
			this.gettingShot = true;
			this.game.alienGettingShot = true;
			this.walkAnimation.elapsedTime = 0;
		}
		if (this.x < 1280) {
			this.x += 3.6;
		} else {
			this.x = -272;
		}
	} else if (this.gettingShot) {
		this.currentAnimation = this.gettingShotAnimation;
		if (this.gettingShotAnimation.isDone()) {
			this.gettingShotCounter++;
			if (this.gettingShotCounter++ < 4) {
				
				this.gettingShotAnimation.elapsedTime = 0;
			} else {
				//this.gettingShotCounter = 0;
				this.gettingShot = false;
				this.game.alienGettingShot = null;
				this.rising = true;
				this.game.alienRising = true;
				//this.currentAnimation = this.fallAndRiseAnimation;
			}
		}
	
	} else if (this.rising) {
		this.currentAnimation = this.fallAndRiseAnimation;
		if (this.fallAndRiseAnimation.isDone()) {
			//this.gettingShotAnimation.elapsedTime = 0;
			this.gettingShotCounter = 0;
			this.fallenCounter++;
			if (this.fallenCounter < 3) {
				this.moving = true;
				this.game.alienMoving = true;
				this.rising = false;
				this.game.alienRising = null;
			} else {
				this.dying = true;
				this.rising = false;
				this.game.alienRising = null;
			}
			//this.currentAnimation = this.gettingShotAnimation;
			this.fallAndRiseAnimation.elapsedTime = 0;
		}
	} else if (this.dying) {
		this.currentAnimation = this.dyingAnimation;
		this.game.alienDying = true;
		if (this.dyingAnimation.isDone()) {
			this.game.alienDied = true;
			this.game.alienDying = null;
		}
	}
	/*if (this.walkAnimation.isDone()) {
		this.moving = false;
		this.gettingShot = true;
		//this.currentAnimation = this.gettingShotAnimation;
		this.walkAnimation.elapsedTime = 0;
	}*/
	
	/*if (this.fallAndRiseAnimation.isDone()) {
		//this.gettingShotAnimation.elapsedTime = 0;
		this.gettingShotCounter = 0;

		this.currentAnimation = this.gettingShotAnimation;
		this.fallAndRiseAnimation.elapsedTime = 0;
	}*/
	
}

Alien.prototype.draw = function(ctx) {
	this.currentAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scaleBy);
}