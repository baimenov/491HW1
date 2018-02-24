function Soldier(game, x, y) {
	var img = AM.getAsset("./img/Soldier.png");

	var expImg = AM.getAsset("./img/Explosion.png");

	this.actualHeight = 45;
	this.actualWidth = 31;
	this.scaleBy = 3.5;

	this.takeWeaponFrames = [new Frame(5, 911, 31, 45), new Frame(36, 911, 31, 45),
							new Frame(68, 911, 31, 45), new Frame(100, 911, 36, 45),
							new Frame(136, 909, 39, 47), new Frame(176, 913, 42, 43),
							new Frame(271, 913, 45, 43)];

	this.shootFrames = [new Frame(933, 912, 68, 45), new Frame(1001, 912, 60, 45)];

	this.winFrames = [new Frame(821, 143, 32, 43), new Frame(858, 139, 32, 47),
						new Frame(898, 139, 33, 47)];

	this.aimFrames = [new Frame(843, 915, 42, 41), new Frame(885, 911, 43, 45)];

	this.jumpFrames = [new Frame(245, 1908, 30, 45), new Frame(275, 1908, 29, 45),
						new Frame(303, 1908, 33, 45), new Frame(336, 1908, 32, 45),
						new Frame(368, 1908, 32, 45), new Frame(399, 1908, 29, 45),
						new Frame(428, 1907, 29, 45), new Frame(457, 1907, 35, 45),
						new Frame(492, 1907, 36, 45), new Frame(529, 1907, 42, 45),
						new Frame(571, 1907, 42, 45), new Frame(612, 1907, 41, 45),
						new Frame(612, 1907, 41, 45), new Frame(612, 1907, 41, 45),
						new Frame(612, 1907, 41, 45), new Frame(612, 1907, 41, 45),
						new Frame(612, 1907, 41, 45), new Frame(612, 1907, 41, 45),
						new Frame(612, 1907, 41, 45), new Frame(612, 1907, 41, 45),
						new Frame(612, 1907, 41, 45), new Frame(612, 1907, 41, 45),];

	this.suicideFrames = [new Frame(80, 2523, 82, 84), new Frame(162, 2520, 86, 87),
							new Frame(249, 2513, 89, 94), new Frame(338, 2498, 89, 109),
							new Frame(427, 2498, 93, 109), new Frame(3, 2616, 103, 109),
							new Frame(106, 2616, 106, 109), new Frame(213, 2614, 110, 111),
							new Frame(324, 2614, 110, 111), new Frame(434, 2610, 110, 115),
							new Frame(324, 2614, 110, 111), new Frame(434, 2610, 110, 115)];

	this.takeWeaponAnimation = new Animation(img,
		5, 911, 31, 45, 0.15, this.takeWeaponFrames.length, false, true, false, this.takeWeaponFrames);

	this.shootAnimation = new Animation(img,
		933, 912, 68, 45, 0.15, this.shootFrames.length, true, true, false, this.shootFrames);

	this.winAnimation = new Animation(img,
		821, 143, 32, 43, 0.15, this.winFrames.length, false, true, false, this.winFrames);

	this.aimAnimation = new Animation(img,
		843, 915, 42, 41, 0.15, this.aimFrames.length, true, true, false, this.aimFrames);

	this.jumpAnimation = new Animation(img,
		245, 1908, 30, 45, 0.10, this.jumpFrames.length, false, true, false, this.jumpFrames);

	this.suicideAnimation = new Animation(expImg,
		80, 2523, 82, 84, 0.12, this.suicideFrames.length, false, true, true, this.suicideFrames);



	this.allAnims = [this.takeWeaponAnimation, this.shootAnimation, this.winAnimation,
						this.aimAnimation, this.jumpAnimation];
	for (var i = 0; i < this.allAnims.length; i++) {
		this.allAnims[i].actualHeight = 45;
		this.allAnims[i].actualWidth = 31;
	}

	this.facing = "L";
	this.currentAnimation = this.takeWeaponAnimation;

	this.winCounter = 0;

	this.jumping = false;

	this.suiciding = false;

	Entity.call(this, game, x, y);
}

Soldier.prototype = new Entity();
Soldier.prototype.constructor = Soldier;

Soldier.prototype.update = function() {
	console.log(this.takeWeaponAnimation.isDone() + ","  + this.game.alienGettingShot + ", " + this.game.alienMoving );
	if (this.suiciding) {
		this.currentAnimation = this.suicideAnimation;
		if (this.suicideAnimation.isDone()) {
			this.game.soldierSuicide = true;
			this.removeFromWorld = true;
		}
	} else if (this.jumping) {
		this.currentAnimation = this.jumpAnimation;
		if (this.jumpAnimation.isDone()) {
			this.suiciding = true;
			this.jumping = false;
			this.y -= 250;
			this.x -= 55;
		} else {
			this.x -= 2.1;
			var jumpDistance = this.currentAnimation.elapsedTime / this.currentAnimation.totalTime;
			var totalHeight = 360;
			if (jumpDistance > 0.5) {
				jumpDistance = 1 - jumpDistance;
			}
			var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
			this.y = 500 - height;
		}
	} else if (this.takeWeaponAnimation.isDone() && (this.game.alienGettingShot || this.game.alienMoving) ) {
		this.currentAnimation = this.shootAnimation;
	} else if (this.game.alienRising) {
		this.currentAnimation = this.aimAnimation;
	} else if (this.game.alienGettingShot || this.game.alienDying) {
		this.currentAnimation = this.shootAnimation;
		this.takeWeaponAnimation.elapsedTime = this.takeWeaponAnimation.totalTime;
	} else if (this.game.alienDied) {
		this.currentAnimation = this.winAnimation;
		if (this.winAnimation.isDone()) {
			this.winCounter++;
			this.winAnimation.elapsedTime = 0;
			if (this.winCounter >= 4) {
				this.jumping = true;
			}
		}
	}
}

Soldier.prototype.draw = function(ctx) {
	this.currentAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scaleBy);
}