function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration,
	frames, loop, reverse, saveLast, readyFrames) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.startX = startX;
    this.startY = startY;
    this.saveLast = saveLast;
    this.reverse = reverse;
    this.readyFrames= readyFrames;
    //Scorpion's actual width. 
    this.actualWidth = 58;
    this.actualHeight = 128;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
	var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    } 
    
    if (!this.readyFrames) {
	    var frame = this.currentFrame();
	    var lastFrame = this.frames - 1;
	    if (this.saveLast && this.isDone()) {
	    	frame = lastFrame;
	    }

	    var index = this.reverse ? this.frames - frame - 1 : frame;
	    var vindex = 0;
	    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
	        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
	        vindex++;
	    }
	    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
	        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
	        vindex++;
	    }
	    var locX = x;
	    var locY = y;
	    var offset = vindex === 0 ? this.startX : 0;
	    ctx.drawImage(this.spriteSheet,
	                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
	                  this.frameWidth, this.frameHeight,
	                  locX, locY,
	                  this.frameWidth * scaleBy,
	                  this.frameHeight * scaleBy);
	} else {
		var frame = this.currentFrame();
		var lastFrame = this.frames - 1;
		if (this.saveLast && this.isDone()) {
	    	frame = lastFrame;
	    }

	    

	    var index = frame % this.frames;

	    var actualY = this.readyFrames[0].startY;
	    var currY = this.readyFrames[index].startY;
	    var actualX = this.readyFrames[0].frameWidth;
	    var currX = this.readyFrames[index].frameWidth;

	    var heightDiff = this.actualHeight - this.readyFrames[index].frameHeight;
	    

	    var vindex = 0;

	   
	    var locX = x;
	    var locY = y + (heightDiff * scaleBy);

	    var offset = vindex === 0 ? this.startX : 0;

	    /*var sx = this.reverse ? this.spriteSheet.width - this.readyFrames[index].startX -
	    						this.readyFrames[index].frameWidth : this.readyFrames[index].startX;
	    */
	    var sx = this.readyFrames[index].startX;
	    
	    var sy = this.readyFrames[index].startY;
	    
	    if (this.reverse) {
	    	
	    	var xDiff = this.readyFrames[index].frameWidth - this.actualWidth;
	    	locX = xDiff === 0 ? x : x - (xDiff * scaleBy);
	    }

	    
	    ctx.drawImage(this.spriteSheet,
	    			  sx, sy,
	    			  this.readyFrames[index].frameWidth, this.readyFrames[index].frameHeight,
	    			  locX, locY,
	    			  this.readyFrames[index].frameWidth * scaleBy, this.readyFrames[index].frameHeight * scaleBy);
	}
    
    
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

Animation.prototype.revesrse = function() {

}

Animation.prototype.getFrameWidth = function() {
	var frame = this.currentFrame();
	var lastFrame = this.frames - 1;
	if (this.saveLast && this.isDone()) {
	    frame = lastFrame;
	}
	var index = frame % this.frames;
	if (!this.readyFrames) {
		//console.log("current boxWidth is: " + this.frameWidth);
		return this.frameWidth;
	} else {
		//console.log("current boxWidth is: " + this.readyFrames[index].frameWidth);
		return this.readyFrames[index].frameWidth;
	}
}

Animation.prototype.getFrameHeight = function() {
	var frame = this.currentFrame();
	var lastFrame = this.frames - 1;
	if (this.saveLast && this.isDone()) {
	    frame = lastFrame;
	}
	var index = frame % this.frames;
	if (!this.readyFrames) {
		//console.log("current boxWidth is: " + this.frameHeight);
		return this.frameHeight;
	} else {
		//console.log("current boxWidth is: " + this.readyFrames[index].frameHeight);
		return this.readyFrames[index].frameHeight;
	}
}


Animation.prototype.getX = function(x, scaleBy) {
	var frame = this.currentFrame();
	var lastFrame = this.frames - 1;
	if (this.saveLast && this.isDone()) {
	    frame = lastFrame;
	}
	var index = frame % this.frames;
	if (this.reverse && this.readyFrames) {
		var xDiff = this.readyFrames[index].frameWidth - this.actualWidth;
	    locX = xDiff === 0 ? x : x - (xDiff * scaleBy);
	    return locX;
	} else {
		return x;
	}
}

Animation.prototype.getY = function(y, scaleBy) {
	if (this.readyFrames) {
		var frame = this.currentFrame();
		var lastFrame = this.frames - 1;
		if (this.saveLast && this.isDone()) {
	    	frame = lastFrame;
		}
		var index = frame % this.frames;
		var heightDiff = this.actualHeight - this.readyFrames[index].frameHeight;
		var locY = y + (heightDiff * scaleBy);
		return locY;
	} else {
		return y;
	}
}

function Background(game, spritesheet) {
	this.game = game;
	this.spritesheet = spritesheet;
	this.ctx = game.ctx;
	this.x = 0;
	this.y = 0;
}


Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.draw = function(ctx) {	
	ctx.drawImage(this.spritesheet, this.x, this.y);
}						

Background.prototype.update = function() {

}

function Frame(startX, startY, frameWidth, frameHeight) {
	this.startX = startX;
	this.startY = startY;
	this.frameWidth = frameWidth;
	this.frameHeight = frameHeight;
}