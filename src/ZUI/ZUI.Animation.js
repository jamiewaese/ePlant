/**
 * Animation class for ZUI framework
 * Code by Hans Yu
 */

/* Class constructor */
ZUI.Animation = function(attributes) {
	this.view = (attributes.view === undefined) ? null : attributes.view;
	this.duration = (attributes.duration === undefined) ? 0 : attributes.duration;
	this.type = (attributes.type === undefined) ? "custom" : attributes.type;
	this._begin = (attributes.begin === undefined) ? function(){} : attributes.begin;
	this._end = (attributes.end === undefined) ? function(){} : attributes.end;
	this._draw = (attributes.draw === undefined) ? function(elapsedTime, remainingTime, view){} : attributes.draw;
	this.data = (attributes.data === undefined) ? null : attributes.data;
	if (this.type == "zoom") {
		this.bezier = (attributes.bezier === undefined) ? [0.25, 0.1, 0.25, 1] : attributes.bezier;
		this.spline = new ZUI.Util.KeySpline(this.bezier[0], this.bezier[1], this.bezier[2], this.bezier[3]);
		this.sourceX = (attributes.sourceX === undefined) ? undefined : attributes.sourceX;
		this.sourceY = (attributes.sourceY === undefined) ? undefined : attributes.sourceY;
		this.sourceDistance = (attributes.sourceDistance === undefined) ? undefined : attributes.sourceDistance;
		this.targetX = (attributes.targetX === undefined) ? undefined : attributes.targetX;
		this.targetY = (attributes.targetY === undefined) ? undefined : attributes.targetY;
		this.targetDistance = (attributes.targetDistance === undefined) ? undefined : attributes.targetDistance;
	}
};

ZUI.Animation.prototype.begin = function() {
	if (this.view) {
		this.view.animation = this;
	}
	this.startTime = ZUI.Util.getTime();
	this.remainingTime = this.duration;
	if (this.type == "zoom") {
		if (this.sourceX === undefined) this.sourceX = ZUI.camera._x;
		if (this.sourceY === undefined) this.sourceY = ZUI.camera._y;
		if (this.sourceDistance === undefined) this.sourceDistance = ZUI.camera._distance;
		if (this.targetX === undefined) this.targetX = this.sourceX;
		if (this.targetY === undefined) this.targetY = this.sourceY;
		if (this.targetDistance === undefined) this.targetDistance = this.sourceDistance;
	}
	this._begin(this.data);
	if (this.remainingTime <= 0) {
		this.end();
	}
};

ZUI.Animation.prototype.end = function() {
	if (this.view && this.view.animation == this) {
		this.view.animation = null;
	}
	if (this.type == "zoom") {
		ZUI.camera._x = ZUI.camera.x = this.targetX;
		ZUI.camera._y = ZUI.camera.y = this.targetY;
		ZUI.camera._distance = ZUI.camera.distance = this.targetDistance;
	}
	this._end(this.data);
};

ZUI.Animation.prototype.draw = function() {
	var currentTime = ZUI.Util.getTime();
	this.elapsedTime = currentTime - this.startTime;
	this.remainingTime = this.duration - this.elapsedTime;
	if (this.remainingTime > 0) {
		if (this.type == "zoom") {
			var time = this.elapsedTime / (this.elapsedTime + this.remainingTime);
			var progress = this.spline.get(time);
			ZUI.camera._x = ZUI.camera.x = (this.targetX - this.sourceX) * progress + this.sourceX;
			ZUI.camera._y = ZUI.camera.y = (this.targetY - this.sourceY) * progress + this.sourceY;
			ZUI.camera._distance = ZUI.camera.distance = (this.targetDistance - this.sourceDistance) * progress + this.sourceDistance;
		}
		this._draw(this.elapsedTime, this.remainingTime, this.view, this.data);
	}
	else {
		this.end();
	}
};
