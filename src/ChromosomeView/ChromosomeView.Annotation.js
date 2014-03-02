/**
 * Annotation class
 * Handles annotations in the ChromosomeView
 *
 * UI design by Jamie Waese
 * Code by Hans Yu
 */

/* Constructor */
ChromosomeView.Annotation = function(elementOfInterest, view) {
	/* Properties */
	this.elementOfInterest = elementOfInterest;	// Corresponding ElementOfInterest
	this.view = view;		// Parent view
	this.whisker = null;		// Whisker view object
	this.label = null;		// Label view object
	this.tags = null;		// Tag view objects

	/* Create whisker */
	var chromosomeViewObject = view.getChromosomeViewObject(elementOfInterest.element.chromosome);
	var size = (elementOfInterest.size === undefined) ? 5 : elementOfInterest.size * 5;
	var color = (elementOfInterest.color === undefined) ? Eplant.Color.Black : elementOfInterest.color;
	this.whisker = new ZUI.ViewObject({
		shape: "path",
		positionScale: "world",
		sizeScale: "world",
		x: (elementOfInterest.element.strand == "+") ? chromosomeViewObject.getX() - chromosomeViewObject.getWidth() / 2 : chromosomeViewObject.getX() + chromosomeViewObject.getWidth() / 2,
		y: chromosomeViewObject.getY() + (elementOfInterest.element.start + elementOfInterest.element.end) / 2 * 0.000015,
		vertices: [
			{
				x: 0,
				y: 0
			},
			{
				x: (elementOfInterest.element.strand == "+") ? 10 : -10,
				y: 0
			}
		],
		strokeColor: color,
		fillColor: color
	});

	/* Create element label */
	this.label = new ZUI.ViewObject({
		shape: "text",
		positionScale: "world",
		sizeScale: "screen",
		x: (elementOfInterest.element.strand == "+") ? chromosomeViewObject.getX() - chromosomeViewObject.getWidth() / 2 : chromosomeViewObject.getX() + chromosomeViewObject.getWidth() / 2,
		y: chromosomeViewObject.getY() + (elementOfInterest.element.start + elementOfInterest.element.end) / 2 * 0.000015,
		size: 12,
		offsetX: ((elementOfInterest.element.strand == "+") ? -1 : 1) * (size + 3),
		centerAt: ((elementOfInterest.element.strand == "+") ? "right" : "left") + " center",
		content: this.elementOfInterest.element.identifier,
		strokeColor: "#E6F9AF",
		stroke: false,
		strokeWidth: 5,
		fillColor: color,
		mouseOver: $.proxy(function() {
			/* Change cursor */
			ZUI.container.style.cursor = "pointer";

			/* Change label bold */
			this.label.bold = true;

			/* Create element dialog */
			if (Eplant.getElementDialog(this.elementOfInterest.element) == null) {
				var x = this.label.screenX + ((this.elementOfInterest.element.strand == "+") ? -1 : 1) * this.label.screenWidth / 2;
				var orientation = (x < ZUI.width / 2) ? "right" : "left";
				var elementDialog = new Eplant.ElementDialog({
					x: x + ((orientation == "left") ? -1 : 1) * this.label.screenWidth / 2,
					y: this.label.screenY,
					orientation: orientation,
					element: this.elementOfInterest.element,
				});
			}
		}, this),
		mouseOut: $.proxy(function() {
			/* Restore cursor */
			ZUI.container.style.cursor = "default";

			/* Restore label bold */
			this.label.bold = false;

			/* Close element dialog */
			var elementDialog = Eplant.getElementDialog(this.elementOfInterest.element);
			if (elementDialog != null && !elementDialog.pinned) {
				elementDialog.close();
			}
		}, this),
		leftClick: $.proxy(function() {
			/* Pin element dialog */
			var elementDialog = Eplant.getElementDialog(this.elementOfInterest.element);
			if (elementDialog != null) {
				elementDialog.pinned = true;
			}
			this.elementOfInterest.speciesOfInterest.setElementOfFocus(this.elementOfInterest);
		}, this)
	});

	/* Create tags */
	this.tags = [];
	var offset = 5;
	for (var n = 0; n < this.elementOfInterest.tags.length; n++) {
		this.tags.push(new ZUI.ViewObject({
			shape: "circle",
			positionScale: "world",
			sizeScale: "screen",
			x: this.label.x,
			y: this.label.y,
			offsetX: this.label.offsetX + ((this.elementOfInterest.element.strand == "+") ? -1 : 1) * (this.label.width + offset),
			radius: 3,
			centerAt: "center center",
			strokeColor: this.elementOfInterest.tags[n].color,
			fillColor: this.elementOfInterest.tags[n].color
		}));
		offset += 8;
	}
	this.tagsUpdateEventListener = new ZUI.EventListener("update-tags", this.elementOfInterest, function(event, eventData, listenerData) {
		var elementOfInterest = event.target;
		var view = listenerData.view;
		view.tags = [];
		var offset = 5;
		for (var n = 0; n < elementOfInterest.tags.length; n++) {
			view.tags.push(new ZUI.ViewObject({
				shape: "circle",
				positionScale: "world",
				sizeScale: "screen",
				x: view.label.x,
				y: view.label.y,
				offsetX: view.label.offsetX + ((elementOfInterest.element.strand == "+") ? -1 : 1) * (view.label.width + offset),
				radius: 3,
				centerAt: "center center",
				strokeColor: elementOfInterest.tags[n].color,
				fillColor: elementOfInterest.tags[n].color
			}));
			offset += 8;
		}
	}, {
		view: this
	});
	ZUI.addEventListener(this.tagsUpdateEventListener);
};

	/* Draws this annotation */
	ChromosomeView.Annotation.prototype.draw = function() {
		/* Check whether elementOfInterest has been removed */
		if (this.elementOfInterest.speciesOfInterest.elementsOfInterest.indexOf(this.elementOfInterest) < 0) {
			this.remove();
			return;
		}

		/* Draw whisker */
		this.whisker.vertices[0].x = ((this.elementOfInterest.element.strand == "+") ? -1 : 1) * ZUI.camera.unprojectDistance((this.elementOfInterest.size === undefined) ? 5 : this.elementOfInterest.size * 5);
		this.whisker.strokeWidth = (this.elementOfInterest.element.end - this.elementOfInterest.element.start) * 0.000015;
		var unitWidth = ZUI.camera.unprojectDistance(1);
		if (this.whisker.strokeWidth < unitWidth) this.whisker.strokeWidth = unitWidth;
		this.whisker.draw();

		/* Draw label */
		this.label.draw();

		/* Draw tags */
		for (var n = 0; n < this.tags.length; n++) {
			this.tags[n].draw();
		}
	};

	/* Removes this annotation */
	ChromosomeView.Annotation.prototype.remove = function() {
		var index = this.view.annotations.indexOf(this);
		if (index >= 0) {
			this.view.annotations.splice(index, 1);
			var viewObjects = this.view.viewObjects;
			for (var n = 0; n < viewObjects.length; n++) {
				if (viewObjects[n] == this.label) {
					viewObjects.splice(n, 1);
					break;
				}
			}
		}

		/* Remove view objects */
		this.label.remove();
		this.whisker.remove();
		for (var n = 0; n < this.tags.length; n++) {
			this.tags[n].remove();
		}

		/* Remove event listeners */
		ZUI.removeEventListener(this.tagsUpdateEventListener);
	};