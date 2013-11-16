/**
 * Animation class for ZUI framework
 * By Hans Yu
 */

/* Class constructor */
ZUI.Animation = function(frames, drawFrame, begin, end) {
	this.frames = frames;
	this.drawFrame = drawFrame || function(currentFrame){};
	this.begin = begin || function(){};
	this.end = end || function(){};
	this.currentFrame = 0;
};

/* Draw next frame */
ZUI.Animation.prototype.next = function() {
	this.drawFrame(this.currentFrame);
	this.currentFrame++;
};

/* Check whether animation is over */
ZUI.Animation.prototype.isOver = function() {
	if (this.currentFrame < this.frames) return false;
	else return true;
};

/* Reset animation */
ZUI.Animation.prototype.reset = function() {
	this.currentFrame = 0;
};

