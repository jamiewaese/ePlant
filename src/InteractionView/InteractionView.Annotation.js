InteractionView.Annotation = function(elementOfInterest, x, y, view) {
	/* Properties */
	this.elementOfInterest = elementOfInterest;
	this.x = x;
	this.y = y;
	this.view = view;
	this.tags = [];
};

InteractionView.Annotation.prototype.draw = function() {
	/* Check whether elementOfInterest has been removed */
	if (this.elementOfInterest.speciesOfInterest.elementsOfInterest.indexOf(this.elementOfInterest) < 0) {
		this.remove();
		return;
	}

	/* Draw tags */
	this.tags = [];
	for (var n = 0; n < this.elementOfInterest.tags.length; n++) {
		this.tags.push(new ZUI.ViewObject({
			shape: "circle",
			positionScale: "world",
			sizeScale: "world",
			x: this.x,
			y: this.y,
			offsetX: (-(this.elementOfInterest.tags.length - 1) / 2 + n) * 8,
			radius: 3,
			centerAt: "center center",
			strokeColor: this.elementOfInterest.tags[n].color,
			fillColor: this.elementOfInterest.tags[n].color
		}));
	}
	for (n = 0; n < this.tags.length; n++) {
		this.tags[n].draw();
	}
};

/* Removes this annotation */
InteractionView.Annotation.prototype.remove = function() {
	var index = this.view.annotations.indexOf(this);
	if (index >= 0) {
		this.view.annotations.splice(index, 1);
	}
};
