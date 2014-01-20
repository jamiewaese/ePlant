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
		var binSize = ZUI.camera.unprojectDistance(1) / 0.000015;
		$.getJSON("http://bar.utoronto.ca/~eplant/cgi-bin/genedensity.cgi?species=" + this.species.scientificName.replace(" ", "_") + "&binSize=" + binSize, $.proxy(function(response) {
			for (var n = 0; n < this.chromosomeViewObjects.length; n++) {
				for (var m = 0; m < response.length; m++) {
					if (this.chromosomeViewObjects[n].chromosome.name == response[m].name) {
						this.chromosomeViewObjects[n].heatmap = response[n].density;
						break;
					}
				}
			}
		}, this));
	}, this);
	/* Set icon */
	img = document.createElement("img");
	img.src = "img/heatmap.png";
	this.toggleHeatmap.appendChild(img);

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
	ZUI.container.style.cursor = "default";

	/* Append to view history */
	if (Eplant.viewHistory[Eplant.viewHistorySelected] != this) {
		Eplant.pushViewHistory(this);
	}

	/* Reset properties */
	this.mouseFramesIdle = 0;

	/* Set camera */
	ZUI.camera.x = 0;
	ZUI.camera.y = 0;
	ZUI.camera.distance = 500;

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

	/* Draw background */
	this.background.draw();

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

ChromosomeView.prototype.getZoomInEntryAnimationSettings = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.25, 0.1, 0.25, 1],
		sourceX: 0,
		sourceY: 0,
		sourceDistance: 10000,
		targetX: 0,
		targetY: 0,
		targetDistance: 500,
		draw: function(elapsedTime, remainingTime, view) {
			view.draw();
		}
	};
};

ChromosomeView.prototype.getZoomOutEntryAnimationSettings = function() {
	var element = Eplant.getSpeciesOfInterest(this.species).elementOfFocus.element;
	var chromosomeViewObject = this.getChromosomeViewObject(element.chromosome);
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.75, 0, 0.55, 0.9],
		sourceX: chromosomeViewObject.getX(),
		sourceY: chromosomeViewObject.getY() + (element.start + element.end) / 2 * 0.000015,
		sourceDistance: 0,
		targetX: 0,
		targetY: 0,
		targetDistance: 500,
		draw: function(elapsedTime, remainingTime, view) {
			view.draw();
		}
	};
};

ChromosomeView.prototype.getZoomInExitAnimationSettings = function() {
	var element = Eplant.getSpeciesOfInterest(this.species).elementOfFocus.element;
	var chromosomeViewObject = this.getChromosomeViewObject(element.chromosome);
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.25, 0.1, 0.25, 1],
		targetX: chromosomeViewObject.getX(),
		targetY: chromosomeViewObject.getY() + (element.start + element.end) / 2 * 0.000015,
		targetDistance: 0,
		draw: function(elapsedTime, remainingTime, view) {
			view.draw();
		}
	};
};

ChromosomeView.prototype.getZoomOutExitAnimationSettings = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.75, 0, 0.75, 0.9],
		targetX: 0,
		targetY: 0,
		targetDistance: 10000,
		draw: function(elapsedTime, remainingTime, view) {
			view.draw();
		}
	};
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
	this.viewObjects.push(annotation.label);
};
