(function() {

/**
 * Eplant.Views.ChromosomeView class
 * Coded by Hans Yu
 * UI designed by Jame Waese
 * 
 * ePlant View for browsing Chromosomes and selecting GeneticElements.
 *
 * @constructor
 * @augments Eplant.View
 * @param {Eplant.Species} species The Species associated with this View.
 */
Eplant.Views.ChromosomeView = function(species) {
	// Get constructor
	var constructor = Eplant.Views.ChromosomeView;

	// Call parent constructor
	Eplant.View.call(this,
		constructor.viewName,				// Name of the View visible to the user
		constructor.hierarchy,			// Hierarchy of the View
		constructor.magnification,			// Magnification level of the View
		constructor.description,			// Description of the View visible to the user
		constructor.citation,			// Citation template of the View
		constructor.activeIconImageURL,		// URL for the active icon image
		constructor.availableIconImageURL,		// URL for the available icon image
		constructor.unavailableIconImageURL	// URL for the unavailable icon image
	);

	// Attributes
	this.species = species;		// The Species associated with this View
	this.chromosomes = null;		// ChromosomeView.Chromosome objects of this View
	this.annotations = [];		// ChromosomeView.Annotation objects of this View
	this.geneticElementList = null;		// GeneticElement list dialog
	this.geneticElementListInfo = null;	// Object for storing GeneticElement list dialog information for delayed creation
	this.backgroundRO = null;		// Background ViewObject for picking up user inputs
	this.eventListeners = [];		// Event listeners

	/* Create view-specific UI buttons */
	this.createViewSpecificUIButtons();

	/* Load data */
	this.loadData();

	/* Create background ViewObject */
	this.backgroundRO = new ZUI.RenderedObject.Rectangle({
		position: {
			x: 0,
			y: 0
		},
		positionScale: ZUI.Def.ScreenScale,
		stroke: false,
		fill: false,
		centerAt: {
			horizontal: ZUI.Def.Left,
			vertical: ZUI.Def.Top
		},
		eventListeners: {
			leftMouseDown: $.proxy(function () {
				/* Close GeneticElementList if open */
				if (this.geneticElementList) {
					this.geneticElementList.close();
					this.geneticElementList = null;
				}
			}, this)
		},
		width: ZUI.width,
		widthScale: ZUI.Def.ScreenScale,
		height: ZUI.height,
		heightScale: ZUI.Def.ScreenScale
	});
	this.backgroundRO.attachToView(this);

	/* Bind events */
	this.bindEvents();
};
ZUI.Helper.inheritClass(Eplant.View, Eplant.Views.ChromosomeView);	// Inherit parent prototype

Eplant.Views.ChromosomeView.viewName = "Chromosome Viewer";
Eplant.Views.ChromosomeView.hierarchy = "species";
Eplant.Views.ChromosomeView.magnification = 50;
Eplant.Views.ChromosomeView.description = "Chromosome viewer";
Eplant.Views.ChromosomeView.citation = "";
Eplant.Views.ChromosomeView.activeIconImageURL = "img/active/chromosome.png";
Eplant.Views.ChromosomeView.availableIconImageURL = "img/available/chromosome.png";
Eplant.Views.ChromosomeView.unavailableIconImageURL = "img/unavailable/chromosome.png";

/**
 * Active callback method.
 *
 * @override
 */
Eplant.Views.ChromosomeView.prototype.active = function() {
	/* Call parent method */
	Eplant.View.prototype.active.call(this);
};

/**
 * Inactive callback method.
 *
 * @override
 */
Eplant.Views.ChromosomeView.prototype.inactive = function() {
	/* Call parent method */
	Eplant.View.prototype.inactive.call(this);

	/* Remove GeneticElementList, if applicable */
	if (this.geneticElementList) {
		this.geneticElementList.close();
		this.geneticElementList = null;
	}
};

/**
 * Update callback method.
 *
 * @override
 */
Eplant.Views.ChromosomeView.prototype.update = function() {
	/* Call parent method */
	Eplant.View.prototype.update.call(this);

	/* Create GeneticElementList if necessary */
	if (this.geneticElementListInfo && this.geneticElementListInfo.finish <= ZUI.appStatus.progress && !this.geneticElementList) {
		/* Create GeneticElementList */
		this.geneticElementList = new Eplant.Views.ChromosomeView.GeneticElementList(
			this.geneticElementListInfo.chromosome,		// chromosome
			this.geneticElementListInfo.vPosition,		// vPosition
			this							// chromosomeView
		);

		/* Pin if necessary */
		if (this.geneticElementListInfo.pin) {
			this.geneticElementList.pinned = true;
		}

		/* Reset GeneticElementList information container object */
		this.geneticElementListInfo = null;
	}
};

/**
 * Draw callback method.
 *
 * @override
 */
Eplant.Views.ChromosomeView.prototype.draw = function() {
	/* Call parent method */
	Eplant.View.prototype.draw.call(this);

	/* Draw chromosomes */
	for (var n = 0; n < this.chromosomes.length; n++) {
		var chromosome = this.chromosomes[n];
		chromosome.draw();
	}

	/* Draw annotations */
	for (var n = 0; n < this.annotations.length; n++) {
		var annotation = this.annotations[n];
		annotation.draw();
	}

	/* Draw GeneticElementList */
	if (this.geneticElementList) {
		this.geneticElementList.draw();
	}
};

/**
 * MouseMove callback method.
 *
 * @override
 */
Eplant.Views.ChromosomeView.prototype.mouseMove = function() {
	/* Check whether mouse is pressed down to determine behaviour */
	if (ZUI.mouseStatus.leftDown) {		// Down
		/* Pan camera */
		ZUI.camera.position.x -= ZUI.camera.unprojectDistance(ZUI.mouseStatus.x - ZUI.mouseStatus.xLast);
		ZUI.camera.position.y -= ZUI.camera.unprojectDistance(ZUI.mouseStatus.y - ZUI.mouseStatus.yLast);
	}
	else {		// Up
		/* Remove GeneticElementList if appropriate */
		if (this.geneticElementList) {
			var chromosome = this.geneticElementList.chromosome;
			var xCenter = chromosome.getScreenX();
			var halfWidth = chromosome.getScreenWidth() / 2;
			if (!this.geneticElementList.pinned && 
			    !this.geneticElementList.isInBound(ZUI.mouseStatus.x, ZUI.mouseStatus.y) && 
			    (ZUI.mouseStatus.y != this.geneticElementList.y || ZUI.mouseStatus.x < xCenter - halfWidth || ZUI.mouseStatus.x > xCenter + halfWidth)) {
				this.geneticElementList.close();
				this.geneticElementList = null;
			}
		}
	}
};

/**
 * MouseWheel callback method.
 *
 * @override
 */
Eplant.Views.ChromosomeView.prototype.mouseWheel = function(scroll) {
	/* Zoom at mouse position */
	var point = ZUI.camera.unprojectPoint({
		x: ZUI.mouseStatus.x, 
		y: ZUI.mouseStatus.y
	});
	ZUI.camera.position.x += (point.x - ZUI.camera.position.x) * scroll * 0.1;
	ZUI.camera.position.y += (point.y - ZUI.camera.position.y) * scroll * 0.1;
	ZUI.camera.distance *= 1 - scroll * 0.1;
};

/**
 * Cleans up this view.
 *
 * @override
 */
Eplant.Views.ChromosomeView.prototype.remove = function() {
	/* Call parent method */
	Eplant.View.prototype.remove.call(this);

	/* Remove background ViewObject */
	this.backgroundRO.detachFromView(this);

	/* Remove Chromosomes */
	for (var n = 0; n < this.chromosomes.length; n++) {
		var chromosome = this.chromosomes[n];
		chromosome.remove();
	}

	/* Remove Annotations */
	for (var n = 0; n < this.annotations.length; n++) {
		var annotation = this.annotations[n];
		annotation.remove();
	}

	/* Remove GeneticElementList, if exists */
	if (this.geneticElementList) {
		this.geneticElementList.close();
		this.geneticElementList = null;
	}

	/* Remove EventListeners */
	for (var n = 0; n < this.eventListeners.length; n++) {
		var eventListener = this.eventListeners[n];
		ZUI.removeEventListener(eventListener);
	}
};

/**
 * Creates view-specific UI buttons.
 */
Eplant.Views.ChromosomeView.prototype.createViewSpecificUIButtons = function() {
	/* Annotate */
	var viewSpecificUIButton = new Eplant.ViewSpecificUIButton(
		"img/annotation.png",	// imageSource
		"Annotate genes. See help tab for instructions.",		// Description
		function(data) {			// click
			/* Create and open dialog */
			var annotateDialog = new Eplant.Views.ChromosomeView.AnnotateDialog(data.chromosomeView);
		},
		{				// data
			chromosomeView: this
		}
	);
	this.viewSpecificUIButtons.push(viewSpecificUIButton);

	/* Heatmap toggle */
	var viewSpecificUIButton = new Eplant.ViewSpecificUIButton(
		"img/heatmap.png",		// imageSource
		"Toggle heatmap of gene density. Dark - more dense. Light - less dense.",		// Description
		$.proxy(function() {			// click
			/* Loop through chromosomes to get the visible segments */
			for (var n = 0; n < this.chromosomes.length; n++) {
				/* Get chromosome */
				var chromosome = this.chromosomes[n];

				/* Determine the visible segment */
				// TODO
			}

			/* Request heatmap */
			// TODO
		}, this),
		{				// data
		}
	);
	this.viewSpecificUIButtons.push(viewSpecificUIButton);
};

/**
 * Loads data for SpeciesView.
 */
Eplant.Views.ChromosomeView.prototype.loadData = function() {
	/* Load Chromosomes */
	if (!this.species.isLoadedChromosomes) {
		/* Set up event listener for load-chromosomes */
		var eventListener = new ZUI.EventListener("load-chromosomes", this.species, function(event, eventData, listenerData) {
			/* Remove this EventListener */
			ZUI.removeEventListener(this);

			/* Create ChromosomeView.Chromosome objects */
			listenerData.chromosomeView.chromosomes = [];
			var hPosition = -(listenerData.chromosomeView.species.chromosomes.length - 1) / 2;
			for (var n = 0; n < listenerData.chromosomeView.species.chromosomes.length; n++) {
				/* Create Chromosome */
				var chromosome = new Eplant.Views.ChromosomeView.Chromosome(
					listenerData.chromosomeView.species.chromosomes[n],	// chromosome
					hPosition,							// hPosition
					listenerData.chromosomeView					// chromosomeView
				);
				listenerData.chromosomeView.chromosomes.push(chromosome);

				/* Next hPosition */
				hPosition ++;
			}

			/* Finish loading */
			listenerData.chromosomeView.loadFinish();
		}, {
			chromosomeView: this
		});
		ZUI.addEventListener(eventListener);

		/* Load Chromosomes */
		this.species.loadChromosomes();
	}
	else {
		/* Create ChromosomeView.Chromosome objects */
		this.chromosomes = [];
		var hPosition = -(listenerData.chromosomeView.species.chromosomes.length - 1) / 2;
		for (var n = 0; n < this.species.chromosomes.length; n++) {
			/* Create Chromosome */
			var chromosome = new Eplant.Views.ChromosomeView.Chromosome(
				this.species.chromosomes[n],	// chromosome
				hPosition,				// hPosition
				this					// chromosomeView
			);
			this.chromosomes.push(chromosome);

			/* Next hPosition */
			hPosition ++;
		}

		/* Create Annotations */
		this.updateAnnotations();

		/* Finish loading */
		listenerData.chromosomeView.loadFinish();
	}
};

/**
 * Listens for events for this ChromosomeView.
 */
Eplant.Views.ChromosomeView.prototype.bindEvents = function() {
	/* load-views */
	var eventListener = new ZUI.EventListener("load-views", null, function(event, eventData, listenerData) {
		/* Check whether the target GeneticElement's parent Species is associated with this ChromosomeView */
		if (listenerData.chromosomeView.species == event.target.species) {	// Yes
			/* Update Annotations */
			listenerData.chromosomeView.updateAnnotations();
		}
	}, {
		chromosomeView: this
	});
	this.eventListeners.push(eventListener);
	ZUI.addEventListener(eventListener);

	/* drop-views */
	var eventListener = new ZUI.EventListener("drop-views", null, function(event, eventData, listenerData) {
		/* Check whether the target GeneticElement's parent Species is associated with this ChromosomeView */
		if (listenerData.chromosomeView.species == event.target.species) {	// Yes
			/* Update Annotations */
			listenerData.chromosomeView.updateAnnotations();
		}
	}, {
		chromosomeView: this
	});
	this.eventListeners.push(eventListener);
	ZUI.addEventListener(eventListener);

	/* update-activeGeneticElement */
	var eventListener = new ZUI.EventListener("update-activeGeneticElement", this.species, function(event, eventData, listenerData) {
		/* Restore Annotation label for the previous active GeneticElement */
		var annotation = listenerData.chromosomeView.getAnnotation(eventData.previousActiveGeneticElement);
		if (annotation) {
			annotation.labelVO.stroke = false;
		}

		/* Highlight Annotation label for the current active GeneticElement */
		var annotation = listenerData.chromosomeView.getAnnotation(event.target.activeGeneticElement);
		if (annotation) {
			annotation.labelVO.stroke = true;
		}
	}, {
		chromosomeView: this
	});
	this.eventListeners.push(eventListener);
	ZUI.addEventListener(eventListener);

	/* mouseover-geneticElementPanel-item */
	var eventListener = new ZUI.EventListener("mouseover-geneticElementPanel-item", null, function(event, eventData, listenerData) {
		/* Check whether the target GeneticElement's parent Species is associated with this ChromosomeView */
		if (listenerData.chromosomeView.species == event.target.species) {	// Yes
			/* Highlight annotation */
			var annotation = listenerData.chromosomeView.getAnnotation(event.target);
			annotation.labelVO.bold = true;
		}
	}, {
		chromosomeView: this
	});
	this.eventListeners.push(eventListener);
	ZUI.addEventListener(eventListener);

	/* mouseout-geneticElementPanel-item */
	var eventListener = new ZUI.EventListener("mouseout-geneticElementPanel-item", null, function(event, eventData, listenerData) {
		/* Check whether the target GeneticElement's parent Species is associated with this ChromosomeView */
		if (listenerData.chromosomeView.species == event.target.species) {	// Yes
			/* Restore annotation */
			var annotation = listenerData.chromosomeView.getAnnotation(event.target);
			annotation.labelVO.bold = false;
		}
	}, {
		chromosomeView: this
	});
	this.eventListeners.push(eventListener);
	ZUI.addEventListener(eventListener);
};

/**
 * Gets the ChromosomeView.Chromosome object correponding to the specified Chromosome object.
 *
 * @return {Eplant.Views.ChromosomeView.Chromosome} The ChromosomeView Chromosome object corresponding to the specified Chromosome.
 */
Eplant.Views.ChromosomeView.prototype.getChromosome = function(chromosome) {
	/* Search for the ChromosomeView.Chromosome object */
	for (var n = 0; n < this.chromosomes.length; n++) {
		var _chromosome = this.chromosomes[n];
		if (_chromosome.chromosome == chromosome) {	// Found
			return _chromosome;
		}
	}

	/* Not found */
	return null;
};

/**
 * Gets the Annotation object for a given GeneticElement.
 *
 * @return {Eplant.Views.ChromosomeView.Annotation} The Annotation object for the given GeneticElement.
 */
Eplant.Views.ChromosomeView.prototype.getAnnotation = function(geneticElement) {
	/* Search for the Annotation object */
	for (var n = 0; n < this.annotations.length; n++) {
		var annotation = this.annotations[n];
		if (annotation.geneticElement == geneticElement) {		// Found
			return annotation;
		}
	}

	/* Not found */
	return null;
};

/**
 * Updates Annotations.
 */
Eplant.Views.ChromosomeView.prototype.updateAnnotations = function() {
	/* Skip if data is not ready */
	if (!this.isLoadedData) {
		return;
	}

	/* Look through Chromosomes */
	for (var n = 0; n < this.chromosomes.length; n++) {
		/* Get Chromosome */
		var chromosome = this.chromosomes[n];

		/* Loop through GeneticElements of this Chromosome */
		for (var m = 0; m < chromosome.chromosome.geneticElements.length; m++) {
			/* Get GeneticElement */
			var geneticElement = chromosome.chromosome.geneticElements[m];

			/* Check whether views are loaded for this GeneticElement */
			if (geneticElement.isLoadedViews) {	// Yes
				/* Check whether Annotation already exists */
				var annotation = this.getAnnotation(geneticElement);
				if (!annotation) {		// No
					/* Create annotation */
					var color = "#000000";	// Black
					var size = 5;
					annotation = new Eplant.Views.ChromosomeView.Annotation(geneticElement, color, size, this);
					this.annotations.push(annotation);
				}
			}
			else {		// No
				/* Check whether Annotation exists */
				var annotation = this.getAnnotation(geneticElement);
				if (annotation) {		// Yes
					/* Clean up Annotation */
					annotation.remove();

					/* Remove from array */
					var index = this.annotations.indexOf(annotation);
					if (index >= 0) {
						this.annotations.splice(index, 1);
					}
				}
			}
		}
	}
};

/**
 * Returns The enter-out animation configuration.
 *
 * @override
 * @return {Object} The enter-out animation configuration.
 */
Eplant.Views.ChromosomeView.prototype.getEnterOutAnimationConfig = function() {
	var config = Eplant.View.prototype.getEnterOutAnimationConfig.call(this);
	var geneticElement = this.species.activeGeneticElement;
	if (geneticElement) {
		var chromosome = this.getChromosome(geneticElement.chromosome);
		if (chromosome) {
			config.sourceX = chromosome.getX();
			config.sourceY = chromosome.getY() + (geneticElement.start + geneticElement.end) / 2 * chromosome.perBpHeight;
		}
	}
	return config;
};

/**
 * Returns The exit-in animation configuration.
 *
 * @override
 * @return {Object} The exit-in animation configuration.
 */
Eplant.Views.ChromosomeView.prototype.getExitInAnimationConfig = function() {
	var config = Eplant.View.prototype.getExitInAnimationConfig.call(this);
	var geneticElement = this.species.activeGeneticElement;
	if (geneticElement) {
		var chromosome = this.getChromosome(geneticElement.chromosome);
		if (chromosome) {
			config.targetX = chromosome.getX();
			config.targetY = chromosome.getY() + (geneticElement.start + geneticElement.end) / 2 * chromosome.perBpHeight;
		}
	}
	return config;
};

})();
