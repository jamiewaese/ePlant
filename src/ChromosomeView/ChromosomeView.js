/**
 * ChromosomeView class
 * Describes the view for browsing chromosome-related data
 *
 * UI design by Jamie Waese
 * Code by Hans Yu
 */

/* Constructor */
function ChromosomeView(species) {
	/* Define field properties */
	this.species = species;							// Species of interest
	this.chromosomeViewObjects = [];						// List of chromosome view objects
	this.annotations = [];							// User annotations
	this.elementListDialog = null;						// Element list dialog
	this.elementListDialogCountdown = null;					// Countdown object to display element list dialog
	this.loadProgress = 0;							// Loading progress (0 to 1)
	this.mouseFramesIdle = 0;							// Number of frames that the mouse stays idle
	this.viewObjects = [];

	/* Create background */
	this.background = new ZUI.ViewObject({
		shape: "rect",
		positionScale: "screen",
		sizeScale: "screen",
		x: 0,
		y: 0,
		width: ZUI.width,
		height: ZUI.height,
		centerAt: "left top",
		stroke: false,
		fill: false,
		leftClick: $.proxy(function() {
			if (this.elementListDialog && this.elementListDialog.pinned) {
				this.elementListDialog.close();
				this.elementListDialog = null;
			}
		}, this)
	});
	this.viewObjects.push(this.background);
	this.background.draw();

	/* Create view-specific UI elements */
		this.annotationContainerElement = document.createElement("div");
		this.annotationContainerElement.className = "iconSmall hint--top hint--success hint--rounded";
		this.annotationContainerElement.setAttribute("data-hint", "Annotate genes. See help tab for instructions.");
		this.annotationContainerElement.setAttribute("data-enabled", Eplant.tooltipSwitch.toString());
		this.annotationContainerElement.style.padding = "5px";
		this.annotationContainerElement.onclick = $.proxy(function() {
			new Eplant.AnnotationDialog();
		}, this);
			/* Set icon */
			var img = document.createElement("img");
			img.src = "img/annotation.png";
			this.annotationContainerElement.appendChild(img);

		/* Toggle heatmap */
		this.toggleHeatmap = document.createElement("div");
		this.toggleHeatmap.className = "iconSmall hint--top hint--success hint--rounded";
		this.toggleHeatmap.setAttribute("data-hint", "Toggle heatmap of gene density. Dark - more dense. Light - less dense.");
		this.toggleHeatmap.setAttribute("data-enabled", Eplant.tooltipSwitch.toString());
		this.toggleHeatmap.style.padding = "5px";
		this.toggleHeatmap.onclick = $.proxy(function() {
			//TODO
		}, this);
			/* Set icon */
			img = document.createElement("img");
			img.src = "img/heatmap.png";
			this.toggleHeatmap.appendChild(img);

	/* Set animations */
	//TODO add view parameter and change context to animation, then data can be stored in the animation object
	this.zoomInEntryAnimation = new ZUI.Animation(30, $.proxy(function(currentFrame) {
		ZUI.camera.distance = 10000 * Math.pow(0.85, currentFrame) + 400;
		this.draw();
	}, this));
	this.zoomOutExitAnimation = new ZUI.Animation(30, $.proxy(function(currentFrame) {
		ZUI.camera.distance = 10000 * Math.pow(0.85, 29 - currentFrame) + 400;
		this.draw();
	}, this));

	/* Load chromosomes */
	if (this.species.chromosomes == null) {
		$.ajax({
			type: "GET",
			url: "cgi-bin/chromosomeinfo.cgi?species=" + this.species.scientificName.replace(" ", "_"),
			dataType: "json"
		}).done($.proxy(function(response) {
			/* Store data */
			this.species.chromosomes = [];
			for (var n = 0; n < response.chromosomes.length; n++) {
				var chromosome = new Eplant.Chromosome(this.species);
				chromosome.name = response.chromosomes[n].name;
				chromosome.length = response.chromosomes[n].length;
				chromosome.elements = [];
				chromosome.centromeres = [];
				for (var m = 0; m < response.chromosomes[n].centromeres.length; m++) {
					var centromere = new Eplant.Centromere(chromosome);
					centromere.start = response.chromosomes[n].centromeres[m].start;
					centromere.end = response.chromosomes[n].centromeres[m].end;
					chromosome.centromeres.push(centromere);
				}
				this.species.chromosomes.push(chromosome);
			}

			/* Create ChromosomeViewObjects */
			for (n = 0; n < this.species.chromosomes.length; n++) {
				var chromosome = this.species.chromosomes[n];
				var chromosomeViewObject = new ChromosomeView.ChromosomeViewObject(chromosome, this, n);
				this.chromosomeViewObjects.push(chromosomeViewObject);
			}

			this.loadProgress += 1.0;
		}, this));
	}
	else {
		/* Create ChromosomeViewObjects */
		for (n = 0; n < this.species.chromosomes.length; n++) {
			var chromosome = this.species.chromosomes[n];
			var chromosomeViewObject = new ChromosomeView.ChromosomeViewObject(chromosome, this, n);
			this.chromosomeViewObjects.push(chromosomeViewObject);
		}

		this.loadProgress += 1.0;
	}
}

/* Inherit from View superclass */
ChromosomeView.prototype = new ZUI.View();
ChromosomeView.prototype.constructor = ChromosomeView;

/* Override active */
ChromosomeView.prototype.active = function() {
	/* Reset properties */
	this.mouseFramesIdle = 0;

	/* Set camera */
	ZUI.camera.x = 0;
	ZUI.camera.y = 0;

	/* Append view-specific UI */
	var viewSpecificUI = document.getElementById("viewSpecificUI");
	viewSpecificUI.appendChild(this.annotationContainerElement);
	viewSpecificUI.appendChild(this.toggleHeatmap);
};

/* Override inactive */
ChromosomeView.prototype.inactive = function() {
	/* Remove element list dialog */
	if (this.elementListDialog) {
		this.elementListDialog.close();
		this.elementListDialog = null;
	}

	/* Remove application specific UI */
	document.getElementById("viewSpecificUI").innerHTML = "";
};

/* Override draw */
ChromosomeView.prototype.draw = function() {
	/* Get mouse status */
	var x = ZUI.mouseStatus.x;
	var y = ZUI.mouseStatus.y;

	/* Update camera */
	ZUI.camera.update();

	/* Draw chromosomes */
	for (var n = 0; n < this.chromosomeViewObjects.length; n++) {
		this.chromosomeViewObjects[n].draw();
	}

	/* Draw annotations */
	for (n = 0; n < this.annotations.length; n++) {
		this.annotations[n].draw();
	}

	/* Check whether element list dialog should be created */
	if (this.elementListDialogCountdown && this.elementListDialogCountdown.finish <= ZUI.appStatus.progress && !this.elementListDialog) {
		var conf = this.elementListDialogCountdown;
		this.elementListDialog = new ChromosomeView.ElementListDialog(conf.chromosomeViewObject.chromosome, conf.start, conf.end, conf.x, conf.y, conf.orientation, this);
		this.elementListDialog.pinned = conf.pin;
		this.elementListDialogCountdown = null;
	}

	/* Draw element list dialog */
	if (this.elementListDialog) {
		this.elementListDialog.draw();
	}
};

/* Override mouseMove */
ChromosomeView.prototype.mouseMove = function() {
	/* Get mouse status */
	var x = ZUI.mouseStatus.x;
	var y = ZUI.mouseStatus.y;
	var xLast = ZUI.mouseStatus.xLast;
	var yLast = ZUI.mouseStatus.yLast;
	var leftDown = ZUI.mouseStatus.leftDown;

	if (xLast != x || yLast != y) {
		this.mouseFramesIdle = 0;
	}


	/* Left drag behaviour */
	if (leftDown) {
		/* Move camera */
		ZUI.camera.x -= ZUI.camera.unprojectDistance(x - xLast);
		ZUI.camera.y -= ZUI.camera.unprojectDistance(y - yLast);
	}

	/* Default behaviour */
	else {
		/* Remove element list dialog if appropriate */
		if (this.elementListDialog) {
			var chromosomeViewObject = this.getChromosomeViewObject(this.elementListDialog.chromosome);
			var xCenter = chromosomeViewObject.getScreenX();
			var halfWidth = chromosomeViewObject.getScreenWidth() / 2;
			if (!this.elementListDialog.pinned && 
			    !this.elementListDialog.isInBound(x, y) && 
			    (y != this.elementListDialog.y || x < xCenter - halfWidth || x > xCenter + halfWidth)) {
				this.elementListDialog.close();
				this.elementListDialog = null;
			}
		}
	}
};

/* Override mouseWheel */
ChromosomeView.prototype.mouseWheel = function(scroll) {
	/* Get mouse status */
	var x = ZUI.mouseStatus.x;
	var y = ZUI.mouseStatus.y;

	/* Zoom at mouse position */
	var point = ZUI.camera.unprojectPoint(x, y);
	ZUI.camera.x += (point.x - ZUI.camera.x) * scroll * 0.1;
	ZUI.camera.y += (point.y - ZUI.camera.y) * scroll * 0.1;
	ZUI.camera.distance *= 1 - scroll * 0.1;
};

/* Retrieves the ChromosomeViewObject corresponding to the Chromosome */
ChromosomeView.prototype.getChromosomeViewObject = function(chromosome) {
	for (var n = 0; n < this.chromosomeViewObjects.length; n++) {
		if (this.chromosomeViewObjects[n].chromosome == chromosome) {
			return this.chromosomeViewObjects[n];
		}
	}
	return null;
};

/* ChromosomeViewObject class constructor */
ChromosomeView.ChromosomeViewObject = function(chromosome, view, index) {
	/* Field properties */
	this.chromosome = chromosome;
	this.view = view;
	this.index = index;

	/* Create view objects */
	this.viewObjects = [];
		/* Centromeric layer */
		this.viewObjects.push(new ZUI.ViewObject({
			shape: "rect",
			positionScale: "world",
			sizeScale: "world",
			x: -350 + index * 120,
			y: -220,
			width: 6,
			height: this.chromosome.length * 0.000015,
			radius: 3,
			centerAt: "center top",
			stroke: false,
			fillColor: Eplant.Color.MedGrey
		}));

		/* Non-centromeric layers */
		var start = 0;
		for (var n = 0; n < this.chromosome.centromeres.length; n++) {
			this.viewObjects.push(new ZUI.ViewObject({
				shape: "rect",
				positionScale: "world",
				sizeScale: "world",
				x: -350 + index * 120,
				y: -220 + start * 0.000015,
				width: 10,
				height: (this.chromosome.centromeres[n].start - start) * 0.000015,
				radius: 5,
				centerAt: "center top",
				stroke: false,
				fillColor: Eplant.Color.MedGrey
			}));
			start = this.chromosome.centromeres[n].end;
		}

		/* Bottom non-centromeric layer */
		this.viewObjects.push(new ZUI.ViewObject({
			shape: "rect",
			positionScale: "world",
			sizeScale: "world",
			x: -350 + index * 120,
			y: -220 + start * 0.000015,
			width: 10,
			height: (this.chromosome.length - start) * 0.000015,
			radius: 5,
			centerAt: "center top",
			stroke: false,
			fillColor: Eplant.Color.MedGrey
		}));

	/* Create mouse event layer */
	this.mouseEventLayer = new ZUI.ViewObject({		// Centromeric layer
		shape: "rect",
		positionScale: "world",
		sizeScale: "world",
		x: -350 + index * 120,
		y: -220,
		width: 10,
		height: this.chromosome.length * 0.000015,
		radius: 5,
		centerAt: "center top",
		stroke: false,
		fill: false,
		mouseMove: $.proxy(function() {
			var y = ZUI.mouseStatus.y;
			if (!this.view.elementListDialogCountdown || this.view.elementListDialogCountdown.y != y) {
				/* Reset countdown */
				var range = this.mapPixelToBp(y);
				this.view.elementListDialogCountdown = {
					finish: ZUI.appStatus.progress + 500,
					chromosomeViewObject: this,
					orientation: (this.getScreenX() < ZUI.width / 2) ? "right" : "left",
					x: (this.getScreenX() < ZUI.width / 2) ? this.getScreenX() + this.getScreenWidth() / 2 : this.getScreenX() - this.getScreenWidth() / 2,
					y: y,
					start: range.start,
					end: range.end,
					pin: false
				};
			}
		}, this),
		mouseOver: $.proxy(function() {
			/* Change cursor */
			ZUI.container.style.cursor = "pointer";
		}, this),
		mouseOut: $.proxy(function() {
			/* Restore cursor */
			ZUI.container.style.cursor = "default";

			/* Remove countdown */
			this.view.elementListDialogCountdown = null;
		}, this),
		leftClick: $.proxy(function() {
			/* Pin dialog if created, else create and pin */
			if (this.view.elementListDialog && !this.view.elementListDialog.pinned) {
				this.view.elementListDialog.pinned = true;
			}
			else {
				if (this.view.elementListDialog) {
					this.view.elementListDialog.close();
					this.view.elementListDialog = null;
				}
				var y = ZUI.mouseStatus.y;
				var range = this.mapPixelToBp(y);
				this.view.elementListDialogCountdown = {
					finish: ZUI.appStatus.progress,
					chromosomeViewObject: this,
					orientation: (this.getScreenX() < ZUI.width / 2) ? "right" : "left",
					x: (this.getScreenX() < ZUI.width / 2) ? this.getScreenX() + this.getScreenWidth() / 2 : this.getScreenX() - this.getScreenWidth() / 2,
					y: y,
					start: range.start,
					end: range.end,
					pin: true
				};
			}
		}, this)
	});
	this.view.viewObjects.push(this.mouseEventLayer);

	/* Chromosome label */
	this.label = new ZUI.ViewObject({
		shape: "text",
		positionScale: "world",
		sizeScale: "screen",
		x: -350 + index * 120,
		y: -230,
		centerAt: "center bottom",
		content: this.chromosome.name,
		strokeColor: Eplant.Color.LightGrey,
		fillColor: Eplant.Color.LightGrey,
		size: 14
	});

	/* Base pair range labels */
	this.lowBpRangeLabel = new ZUI.ViewObject({
		shape: "text",
		positionScale: "screen",
		sizeScale: "screen",
		centerAt: "left top",
		strokeColor: Eplant.Color.LightGrey,
		fillColor: Eplant.Color.LightGrey,
		size: 12
	});
	this.highBpRangeLabel = new ZUI.ViewObject({
		shape: "text",
		positionScale: "screen",
		sizeScale: "screen",
		centerAt: "left bottom",
		strokeColor: Eplant.Color.LightGrey,
		fillColor: Eplant.Color.LightGrey,
		size: 12
	});

	/* Mini chromosome */
	this.miniOuter = new ZUI.ViewObject({
		shape: "rect",
		positionScale: "screen",
		sizeScale: "screen",
		width: 10,
		height: 80,
		radius: 5,
		centerAt: "center top",
		strokeColor: Eplant.Color.LightGrey,
		fillColor: Eplant.Color.White
	});
	this.miniInner = new ZUI.ViewObject({
		shape: "rect",
		positionScale: "screen",
		sizeScale: "screen",
		width: 10,
		radius: 5,
		centerAt: "center top",
		stroke: false,
		fillColor: Eplant.Color.LightGrey
	});

	/* Clips */
	this.topClip = new ZUI.ViewObject({
		shape: "polygon",
		positionScale: "screen",
		sizeScale: "world",
		y: 0,
		vertices: [
			{
				x: 0,
				y: 0
			},
			{
				x: -5,
				y: 5
			},
			{
				x: -5,
				y: 0
			},
			{
				x: 5,
				y: 0
			},
			{
				x: 5,
				y: 5
			}
		],
		strokeColor: Eplant.Color.White,
		fillColor: Eplant.Color.White
	});
	this.bottomClip = new ZUI.ViewObject({
		shape: "polygon",
		positionScale: "screen",
		sizeScale: "world",
		y: ZUI.height,
		vertices: [
			{
				x: 0,
				y: 0
			},
			{
				x: -5,
				y: -5
			},
			{
				x: -5,
				y: 0
			},
			{
				x: 5,
				y: 0
			},
			{
				x: 5,
				y: -5
			}
		],
		strokeColor: Eplant.Color.White,
		fillColor: Eplant.Color.White
	});
};

	/* Converts a pixel to number of base pairs */
	ChromosomeView.ChromosomeViewObject.prototype.getBpPerPixel = function() {
		return this.chromosome.length / (this.getScreenHeight() - 1);
	};

	/* Returns whether the specified position is within the bounds of the chromosome */
	ChromosomeView.ChromosomeViewObject.prototype.isInBound = function(x, y) {
		if (x > this.getScreenX() && x < this.getScreenX() + this.getScreenWidth() &&
		    y > this.getScreenY() && y < this.getScreenY() + this.getScreenHeight()) {
			return true;
		}
		else {
			return false;
		}
	};

	/* Draws chromosome */
	ChromosomeView.ChromosomeViewObject.prototype.draw = function() {
		/* Draw chromosome view objects */
		for (var n = 0; n < this.viewObjects.length; n++) {
			this.viewObjects[n].draw();
		}

		/* Recalculate mouse event layer position */
		this.mouseEventLayer.draw();

		/* Draw label */
		this.label.draw();

		/* Get chromosome tips positions */
		var halfWidth = this.getScreenWidth() / 2;
		var topTip = {
			x : this.getScreenX(),
			y : this.getScreenY(),
		};
		var bottomTip = {
			x : this.getScreenX(),
			y : this.getScreenY() + this.getScreenHeight(),
		};

		/* Draw chromosome base pair range */
		var rangeStart = 0;
		var rangeEnd = this.chromosome.length;
		if (topTip.y < 0) {
			var bpPerPixel = this.getBpPerPixel();
			rangeStart = (0 - this.getScreenY()) * bpPerPixel;
			if (rangeStart < this.chromosome.length) {
				/* Draw top base pair value */
				var mb = Math.round(rangeStart / 10000) / 100;
				this.lowBpRangeLabel.content = mb + " Mb";
				this.lowBpRangeLabel.x = topTip.x + halfWidth + 5;
				this.lowBpRangeLabel.y = 0;
				this.lowBpRangeLabel.draw();

				/* Draw clipped top */
				this.topClip.x = topTip.x;
				this.topClip.draw();
			}
		}
		else {
			/* Draw top base pair value */
			this.lowBpRangeLabel.content = 0 + " Mb";
			this.lowBpRangeLabel.x = topTip.x + halfWidth + 5;
			this.lowBpRangeLabel.y = topTip.y;
			this.lowBpRangeLabel.draw();
		}

		if (bottomTip.y > ZUI.height) {
			var bpPerPixel = this.getBpPerPixel();
			rangeEnd = (ZUI.height - this.getScreenY()) * bpPerPixel;
			if (rangeEnd >= 0) {
				/* Draw bottom base pair value */
				var mb = Math.round(rangeEnd / 10000) / 100;
				this.highBpRangeLabel.content = mb + " Mb";
				this.highBpRangeLabel.x = bottomTip.x + halfWidth + 5;
				this.highBpRangeLabel.y = ZUI.height;
				this.highBpRangeLabel.draw();

				/* Draw clipped bottom */
				this.bottomClip.x = bottomTip.x;
				this.bottomClip.draw();
			}
		}
		else {
			/* Draw bottom base pair value */
			var mb = Math.round(this.chromosome.length / 10000) / 100;
			this.highBpRangeLabel.content = mb + " Mb";
			this.highBpRangeLabel.x = bottomTip.x + halfWidth + 5;
			this.highBpRangeLabel.y = bottomTip.y;
			this.highBpRangeLabel.draw();
		}

		/* Draw mini chromosome */
		var bitmask = 0;
		if (rangeStart > 0) bitmask += 1;
		if (rangeEnd < this.chromosome.length) bitmask += 2;
		if (bitmask > 0) {
			if (rangeStart > this.chromosome.length) rangeStart = this.chromosome.length;
			if (rangeEnd < 0) rangeEnd = 0;
			var y1;
			if (bitmask == 1) y1 = 15;
			else if (bitmask == 2) y1 = ZUI.height - 95;
			else y1 = ZUI.height / 2 - 40;
			var y2 = y1 + rangeStart / this.chromosome.length * 80;
			var y3 = y1 + rangeEnd / this.chromosome.length * 80;
			var y4 = y1 + 80;
			this.miniOuter.x = bottomTip.x + halfWidth + 15;
			this.miniOuter.y = y1;
			this.miniOuter.draw();
			this.miniInner.x = bottomTip.x + halfWidth + 15;
			this.miniInner.y = y2;
			this.miniInner.height = y3 - y2;
			this.miniInner.draw();
		}
	};

	/* Returns the x position of the chromosome view object on the screen */
	ChromosomeView.ChromosomeViewObject.prototype.getScreenX = function() {
		return this.mouseEventLayer.screenX;
	};

	/* Returns the y position of the chromosome view object on the screen */
	ChromosomeView.ChromosomeViewObject.prototype.getScreenY = function() {
		return this.mouseEventLayer.screenY;
	};

	/* Returns the width of the chromosome view object on the screen */
	ChromosomeView.ChromosomeViewObject.prototype.getScreenWidth = function() {
		return this.mouseEventLayer.screenWidth;
	};

	/* Returns the height of the chromosome view object on the screen */
	ChromosomeView.ChromosomeViewObject.prototype.getScreenHeight = function() {
		return this.mouseEventLayer.screenHeight;
	};

	ChromosomeView.ChromosomeViewObject.prototype.getX = function() {
		return this.mouseEventLayer.x;
	};

	ChromosomeView.ChromosomeViewObject.prototype.getY = function() {
		return this.mouseEventLayer.y;
	};

	ChromosomeView.ChromosomeViewObject.prototype.getWidth = function() {
		return this.mouseEventLayer.width;
	};

	ChromosomeView.ChromosomeViewObject.prototype.getHeight = function() {
		return this.mouseEventLayer.height;
	};

	/* Converts a base pair position to the y pixel position corresponding to the chromosome view object */
	ChromosomeView.ChromosomeViewObject.prototype.mapBpToPixel = function(bp) {
		return this.getScreenY() + (bp - 1) / this.getBpPerPixel() + 1;
	};

	/* Converts a y pixel position corresponding to the chromosome view object to a range of base pair positions */
	ChromosomeView.ChromosomeViewObject.prototype.mapPixelToBp = function(pixel) {
		if (pixel > this.getScreenY() && pixel < this.getScreenY() + this.getScreenHeight()) {
			range = {
				start: (pixel - 1 - this.getScreenY()) * this.getBpPerPixel() + 1,
				end: (pixel - this.getScreenY()) * this.getBpPerPixel()
			};
			if (range.end > this.chromosome.length) {
				range.end = this.chromosome.length;
			}
			return range;
		}
		else {
			return null;
		}
	};

/* Class for dialog listing chromosomal elements */
ChromosomeView.ElementListDialog = function(chromosome, start, end, x, y, orientation, view) {
	/* Store parameters as attributes */
	this.chromosome = chromosome;
	this.start = start;
	this.end = end;
	this.x = x;
	this.y = y;
	this.orientation = orientation;
	this.view = view;

	/* Define other attributes */
	this.xOffset = 35;
	this.yOffset = 0;
	this.pinned = false;
	this.items = [];

	/* Create element */
	this.containerElement = document.createElement("div");
		/* Add loading span */
		var span = document.createElement("span");
		span.innerHTML = "Loading...";
		span.className = "elementListDialogItem";
		this.containerElement.appendChild(span);

	/* Query elements */
	$.ajax({
		type: "GET",
		url: "cgi-bin/querygenesbyposition.cgi?chromosome=" + chromosome.name.replace(" ", "_") + "&start=" + start + "&end=" + end,
		dataType: "json"
	}).done($.proxy(function(response) {
		/* Populate list */
		this.containerElement.innerHTML = "";
		for (var n = 0; n < response.length; n++) {
			/* Get or create element object */
			var element = null;
			for (var m = 0; m < this.chromosome.elements.length; m++) {
				if (this.chromosome.elements[m].identifier == response[n].id) {
					element = this.chromosome.elements[m];
				}
			}
			if (element == null) {
				element = new Eplant.Element(this.chromosome);
				element.identifier = response[n].id;
				element.start = response[n].start;
				element.end = response[n].end;
				element.strand = response[n].strand;
				element.aliases = response[n].aliases;
				element.annotation = response[n].annotation;
				this.chromosome.elements.push(element);
			}

			/* Add item to element list */
			var item = new ChromosomeView.ElementListDialogItem(element, this);
			this.items.push(item);
		}

		/* Adjust yOffset */
		this.yOffset = $(this.containerElement).outerHeight() * -0.35;
		var hPosition = (orientation == "left") ? "right" : "left";
		var xOffset = (orientation == "left") ? -this.xOffset + 1 : this.xOffset;
		if ($(this.containerElement).parent().length > 0) {
			$(this.containerElement).dialog({
				position: {
					my: hPosition + " top",
					at: "left+" + (x + xOffset) +" top+" + (y + this.yOffset),
					of: ZUI.canvas
				},
			});
		}

		/* Adjust connector */
		var sign = (this.orientation == "left") ? -1 : 1;
		this.connector.vertices = [
			{
				x: this.xOffset * sign,
				y: this.yOffset + $(this.containerElement).position().top
			},
			{
				x: 0,
				y: 0
			},
			{
				x: this.xOffset * sign,
				y: this.yOffset + $(this.containerElement).parent().outerHeight() - $(this.containerElement).position().top
			}
		];

		/* Adjust range indicators */
		this.lowRangeIndicator.y = this.y + this.yOffset - 2;
		this.highRangeIndicator.y = this.y + this.yOffset - $(this.containerElement).position().top + $(this.containerElement).parent().outerHeight() + 2;
	}, this));

	/* Create dialog */
	var hPosition = (orientation == "left") ? "right" : "left";
	var xOffset = (orientation == "left") ? -this.xOffset + 1 : this.xOffset;
	$(this.containerElement).dialog({
		dialogClass: "noTitleBar",
		width: 180,
		height: "auto",
		resizable: false,
		draggable: false,
		minHeight: 0,
		maxHeight: 200,
		close: $.proxy(function(event, ui) {
			$(this.containerElement).remove();
		}, this)
	});
	this.yOffset = $(this.containerElement).outerHeight() * -0.35;
	$(this.containerElement).dialog({
		position: {
			my: hPosition + " top",
			at: "left+" + (x + xOffset) +" top+" + (y + this.yOffset),
			of: ZUI.canvas
		},
	});

	/* Whisker */
	var chromosomeViewObject = this.view.getChromosomeViewObject(this.chromosome);
	this.whisker = new ZUI.ViewObject({
		shape: "path",
		positionScale: "world",
		sizeScale: "world",
		x: chromosomeViewObject.getX(),
		y: chromosomeViewObject.getY() + this.start * 0.000015,
		vertices: [
			{
				x: -5,
				y: 0
			},
			{
				x: 5,
				y: 0
			}
		],
		strokeColor: Eplant.Color.DarkGrey
	});

	/* Connector */
	var sign = (this.orientation == "left") ? -1 : 1;
	this.connector = new ZUI.ViewObject({
		shape: "path",
		positionScale: "screen",
		sizeScale: "screen",
		x: this.x,
		y: this.y,
		vertices: [
			{
				x: this.xOffset * sign,
				y: this.yOffset + $(this.containerElement).position().top
			},
			{
				x: 0,
				y: 0
			},
			{
				x: this.xOffset * sign,
				y: this.yOffset + $(this.containerElement).parent().outerHeight() - $(this.containerElement).position().top
			}
		],
		strokeColor: Eplant.Color.LightGrey
	});

	/* Range indicators */
	this.lowRangeIndicator = new ZUI.ViewObject({
		shape: "text",
		positionScale: "screen",
		sizeScale: "screen",
		x: this.x + (this.xOffset + 10) * sign,
		y: this.y + this.yOffset - 2,
		centerAt: hPosition + " bottom",
		content: ZUI.getNumberWithComma(Math.ceil(start)),
		strokeColor: Eplant.Color.LightGrey,
		fillColor: Eplant.Color.LightGrey
	});
	this.highRangeIndicator = new ZUI.ViewObject({
		shape: "text",
		positionScale: "screen",
		sizeScale: "screen",
		x: this.x + (this.xOffset + 10) * sign,
		y: this.y + this.yOffset - $(this.containerElement).position().top + $(this.containerElement).parent().outerHeight() + 2,
		centerAt: hPosition + " top",
		content: ZUI.getNumberWithComma(Math.floor(end)),
		strokeColor: Eplant.Color.LightGrey,
		fillColor: Eplant.Color.LightGrey
	});
};

	ChromosomeView.ElementListDialog.prototype.close = function() {
		this.pinned = false;
		$(this.containerElement).dialog("close");
	};

	ChromosomeView.ElementListDialog.prototype.draw = function() {
		this.whisker.draw();
		this.connector.draw();
		this.lowRangeIndicator.draw();
		this.highRangeIndicator.draw();
	};

	ChromosomeView.ElementListDialog.prototype.isInBound = function(x, y) {
		var inBound = true;
		if (this.orientation == "left") {
			if (x < this.x - this.xOffset || x > this.x) {
				inBound = false;
			}
		}
		else {
			if (x < this.x || x > this.x + this.xOffset) {
				inBound = false;
			}
		}
		if (y < this.y + this.yOffset || y > this.y + this.yOffset - $(this.containerElement).position().top + $(this.containerElement).parent().outerHeight()) {
			inBound = false;
		}
		return inBound;
	};

/* Class for items in the element list dialog */
ChromosomeView.ElementListDialogItem = function(element, elementListDialog) {
	/* Store parameters as attributes */
	this.element = element;
	this.elementListDialog = elementListDialog;

	/* Create element */
	this.containerElement = document.createElement("span");
	this.containerElement.innerHTML = element.identifier;
	if (element.aliases != null && element.aliases.length > 0 && element.aliases[0].length > 0) {
		this.containerElement.innerHTML += " / " + element.aliases.join(", ");
	}
	this.containerElement.className = "elementListDialogItem";
	this.containerElement.onmouseover = $.proxy(function() {
		/* Create element dialog */
		if (Eplant.getElementDialog(this.element) == null) {
			var elementDialog = new Eplant.ElementDialog({
				x: (this.elementListDialog.orientation == "left") ? this.elementListDialog.x - this.elementListDialog.xOffset - $(this.elementListDialog.containerElement).outerWidth() : this.elementListDialog.x + this.elementListDialog.xOffset + $(this.elementListDialog.containerElement).outerWidth(),
				y: $(this.containerElement).offset().top - $(ZUI.canvas).offset().top + $(this.containerElement).height() / 2,
				orientation: this.elementListDialog.orientation,
				element: this.element,
			});
		}
	}, this);
	this.containerElement.onmouseout = $.proxy(function() {
		/* Close element dialog */
		var elementDialog = Eplant.getElementDialog(this.element);
		if (elementDialog != null && !elementDialog.pinned) {
			elementDialog.close();
		}
	}, this);
	this.containerElement.onclick = $.proxy(function() {
		/* Pin element dialog */
		var elementDialog = Eplant.getElementDialog(this.element);
		if (elementDialog != null) {
			elementDialog.pinned = true;
		}
	}, this);
	this.elementListDialog.containerElement.appendChild(this.containerElement);
};

/* Retrieves the annotation object for the provided ElementOfInterest */
ChromosomeView.prototype.getAnnotation = function(elementOfInterest) {
	for (var n = 0; n < this.annotations.length; n++) {
		if (this.annotations[n].elementOfInterest == elementOfInterest) {
			return this.annotations[n];
		}
	}
	return null;
};

/* Add annotation */
ChromosomeView.prototype.addAnnotation = function(annotation) {
	this.annotations.push(annotation);
	this.viewObjects.push(annotation.whisker);
	this.viewObjects.push(annotation.label);
};

/* Class for handling annotations in the ChromosomeView */
ChromosomeView.Annotation = function(elementOfInterest, view) {
	this.elementOfInterest = elementOfInterest;
	this.view = view;

	/* Create whisker */
	var chromosomeViewObject = view.getChromosomeViewObject(elementOfInterest.element.chromosome);
	var size = (elementOfInterest.size === undefined) ? 5 : elementOfInterest.size * 5;
	var color = (elementOfInterest.color === undefined) ? Eplant.Color.LightGrey : elementOfInterest.color;
	this.whisker = new ZUI.ViewObject({
		shape: "path",
		positionScale: "world",
		sizeScale: "screen",
		x: (elementOfInterest.element.strand == "+") ? chromosomeViewObject.getX() - chromosomeViewObject.getWidth() / 2 : chromosomeViewObject.getX() + chromosomeViewObject.getWidth() / 2,
		y: chromosomeViewObject.getY() + elementOfInterest.element.start * 0.000015,
		vertices: [
			{
				x: 0,
				y: 0
			},
			{
				x: (elementOfInterest.element.strand == "+") ? -size : size,
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
		x: this.whisker.x,
		y: this.whisker.y,
		offsetX: ((elementOfInterest.element.strand == "+") ? -1 : 1) * (size + 3),
		centerAt: ((elementOfInterest.element.strand == "+") ? "right" : "left") + " center",
		content: this.elementOfInterest.element.identifier,
		strokeColor: color,
		fillColor: color,
		mouseOver: $.proxy(function() {
			/* Change cursor */
			ZUI.container.style.cursor = "pointer";

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
		}, this)
	});
};

	/* Draws this annotation */
	ChromosomeView.Annotation.prototype.draw = function() {
		this.whisker.draw();
		this.label.draw();

		this.tags = [];
		var offset = 5;
		for (var n = 0; n < this.elementOfInterest.tags.length; n++) {
			this.tags.push(new ZUI.ViewObject({
				shape: "circle",
				positionScale: "world",
				sizeScale: "screen",
				x: this.label.x,
				y: this.label.y,
				offsetX: this.whisker.vertices[1].x + ((this.elementOfInterest.element.strand == "+") ? -1 : 1) * (3 + this.label.width + offset),
				radius: 3,
				centerAt: "center center",
				strokeColor: this.elementOfInterest.tags[n].color,
				fillColor: this.elementOfInterest.tags[n].color
			}));
			offset += 8;
		}
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
	};

