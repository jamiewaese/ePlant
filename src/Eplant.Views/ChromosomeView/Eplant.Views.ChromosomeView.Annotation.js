(function() {

/**
 * Eplant.Views.ChromosomeView.Annotation class
 * Coded by Hans Yu
 * UI designed by Jamie Waese
 *
 * @constructor
 * @param {Eplant.GeneticElement} geneticElement The GeneticElement associated with this Annotation.
 * @param {String} color The color of the Annotation.
 * @param {Number} size The size of the Annotation.
 * @param {Eplant.Views.ChromosomeView} chromosomeView The ChromosomeView that owns this Annotation.
 */
Eplant.Views.ChromosomeView.Annotation = function(geneticElement, color, size, chromosomeView) {
	/* Attributes */
	this.geneticElement = geneticElement;	// The GeneticElement associated with this Annotation
	this.color = color;
	this.size = size;
	this.chromosomeView = chromosomeView;	// The ChromosomeView that owns this Annotation
	this.whiskerRO = null;			// ViewObject for the whisker marking the position of the GeneticElement
	this.labelRO = null;				// ViewObject for the label of the GeneticElement
	this.tagROs = [];				// Array of ViewObjects for GeneticElement tags
	this.updateAnnotationTagsEventListener = null;	// EventListener for update-annotationTags targeted at this GeneticElement

	/* Create ViewObjects */
	this.createROs();

	/* Bind events */
	this.bindEvents();
};

/**
 * Creates ViewObjects of this Annotation.
 */
Eplant.Views.ChromosomeView.Annotation.prototype.createROs = function() {
	/* Get ChromosomeView.Chromosome object */
	var chromosome = this.chromosomeView.getChromosome(this.geneticElement.chromosome);

	/* Whisker */
	this.whiskerRO = new ZUI.RenderedObject.LinePath({
		position: {
			x: chromosome.getX() + ((this.geneticElement.strand == "+") ? -1 : 1) * chromosome.getWidth() / 2,
			y: chromosome.getY() + (this.geneticElement.start + this.geneticElement.end) / 2 * chromosome.perBpHeight
		},
		positionScale: ZUI.Def.WorldScale,
		vertices: [
			{
				x: 0,
				y: 0
			},
			{
				x: (this.geneticElement.strand == "+") ? 10 : -10,
				y: 0
			}
		],
		verticesScale: [ ZUI.Def.WorldScale, ZUI.Def.WorldScale ],
		stroke: true,
		strokeColor: this.color,
		fill: false
	});
	this.whiskerRO.attachToView(this.chromosomeView);

	/* Label */
	this.labelRO = new ZUI.RenderedObject.Text({
		position: {
			x: chromosome.getX() + ((this.geneticElement.strand == "+") ? -1 : 1) * chromosome.getWidth() / 2,
			y: chromosome.getY() + (this.geneticElement.start + this.geneticElement.end) / 2 * chromosome.perBpHeight
		},
		positionScale: ZUI.Def.WorldScale,
		positionOffset: {
			x: ((this.geneticElement.strand == "+") ? -1 : 1) * (this.size + 3),
			y: 0
		},
		positionOffsetScale: ZUI.Def.ScreenScale,
		centerAt: {
			horizontal: (this.geneticElement.strand == "+") ? ZUI.Def.Right : ZUI.Def.Left,
			vertical: ZUI.Def.Center
		},
		size: 12,
		sizeScale: ZUI.Def.ScreenScale,
		stroke: false,
		strokeColor: "#E6F9AF",
		strokeThickness: 30,
		strokeThicknessScale: ZUI.Def.ScreenScale,
		fill: true,
		fillColor: this.color,
		content: this.geneticElement.identifier,
		eventListeners: {
			mouseOver: $.proxy(function() {
				/* Change cursor */
				ZUI.canvas.style.cursor = "pointer";

				/* Change label bold */
				this.labelRO.isBold = true;
				this.labelRO.forceRender();

				/* Create element dialog */
				if (!this.geneticElement.geneticElementDialog) {
					var x = this.labelRO.renderedPosition.x + ((this.geneticElement.strand == "+") ? -1 : 1) * this.labelRO.renderedWidth / 2;
					var orientation = (x < ZUI.width / 2) ? "right" : "left";
					var x = x + ((orientation == "left") ? -1 : 1) * this.labelRO.renderedWidth / 2;
					var y = this.labelRO.renderedPosition.y;
					this.geneticElement.geneticElementDialog = new Eplant.GeneticElementDialog(this.geneticElement, x, y);
				}
			}, this),
			mouseOut: $.proxy(function() {
				/* Restore cursor */
				ZUI.canvas.style.cursor = "default";

				/* Restore label bold */
				this.labelRO.isBold = false;
				this.labelRO.forceRender();

				/* Close element dialog */
				if (this.geneticElement.geneticElementDialog && !this.geneticElement.geneticElementDialog.pinned) {
					this.geneticElement.geneticElementDialog.close();
					this.geneticElement.geneticElementDialog = null;
				}
			}, this),
			leftClick: $.proxy(function() {
				/* Pin element dialog */
				if (this.geneticElement.geneticElementDialog) {
					this.geneticElement.geneticElementDialog.pinned = true;
				}
				this.geneticElement.species.setActiveGeneticElement(this.geneticElement);
			}, this)
		}
	});
	this.labelRO.attachToView(this.chromosomeView);

	/* Tags */
	this.updateTags();
};

/**
 * Binds events.
 */
Eplant.Views.ChromosomeView.Annotation.prototype.bindEvents = function() {
	/* update-annotationTags */
	this.updateAnnotationTagsEventListener = new ZUI.EventListener("update-annotationTags", this.geneticElement, function(event, eventData, listenerData) {
		/* Get ChromosomeView Annotation object */
		var annotation = listenerData.annotation;

		/* Update tags */
		annotation.updateTags();
	}, {
		annotation: this
	});
	ZUI.addEventListener(this.updateAnnotationTagsEventListener);

	/* update-activeGeneticElement */
	this.updateActiveGeneticElementListener = new ZUI.EventListener("update-activeGeneticElement", this.chromosomeView.species, function(event, eventData, listenerData) {
		/* Get ChromosomeView Annotation object */
		var annotation = listenerData.annotation;

		/* Update tags */
		annotation.updateTags();
	}, {
		annotation: this
	});
	ZUI.addEventListener(this.updateActiveGeneticElementListener);
};

/**
 * Recreates tag ViewObjects.
 */
Eplant.Views.ChromosomeView.Annotation.prototype.updateTags = function() {
	/* Remove old tags */
	for (var n = 0; n < this.tagROs.length; n++) {
		var tagRO = this.tagROs[n];
		tagRO.detachFromView(this.chromosomeView);
	}
	this.tagROs = [];

	/* Create new tags */
	var offset = 5;
	for (var n = 0; n < this.geneticElement.annotationTags.length; n++) {
		/* Get AnnotationTag */
		var annotationTag = this.geneticElement.annotationTags[n];

		/* Pass if AnnotationTag is not selected */
		if (!annotationTag.isSelected) {
			continue;
		}

		/* Create tag */
		var tagRO = new ZUI.RenderedObject.Circle({
			position: {
				x: this.labelRO.position.x,
				y: this.labelRO.position.y
			},
			positionScale: ZUI.Def.WorldScale,
			positionOffset: {
				x: this.labelRO.positionOffset.x + ((this.geneticElement.strand == "+") ? -1 : 1) * (this.labelRO.width + offset),
				y: 0
			},
			positionOffsetScale: ZUI.Def.ScreenScale,
			radius: 3,
			radiusScale: ZUI.Def.ScreenScale,
			centerAt: {
				horizontal: ZUI.Def.Center,
				vertical: ZUI.Def.Center
			},
			stroke: true,
			strokeColor: annotationTag.color,
			fill: true,
			fillColor: annotationTag.color
		});
		tagRO.attachToView(this.chromosomeView);
		this.tagROs.push(tagRO);

		/* Increase offset */
		offset += 8;
	}
};

/**
 * Updates the Annotation after changing color or size.
 */
Eplant.Views.ChromosomeView.Annotation.prototype.update = function() {
	/* Update size */
	this.labelRO.positionOffset.x = ((this.geneticElement.strand == "+") ? -1 : 1) * (this.size + 3);

	/* Update color */
	this.whiskerRO.strokeColor = this.color;
	this.whiskerRO.fillColor = this.color;
	this.labelRO.fillColor = this.color;

	this.whiskerRO.forceRender();
	this.labelRO.forceRender();
};

/**
 * Draws the Annotation.
 */
Eplant.Views.ChromosomeView.Annotation.prototype.draw = function() {
	/* Get Chromosome */
	var chromosome = this.chromosomeView.getChromosome(this.geneticElement.chromosome);

	/* Update whisker */
	this.whiskerRO.vertices[0].x = ((this.geneticElement.strand == "+") ? -1 : 1) * ZUI.camera.unprojectDistance(this.size);
	this.whiskerRO.strokeThickness = (this.geneticElement.end - this.geneticElement.start) * chromosome.perBpHeight;
	var unitWidth = ZUI.camera.unprojectDistance(1);
	if (this.whiskerRO.strokeThickness < unitWidth) {
		this.whiskerRO.strokeThickness = unitWidth;
	}

	/* Draw whisker */
	this.whiskerRO.forceRender();

	/* Draw label */
	this.labelRO.forceRender();

	/* Draw tags */
	var offset = 5;
	for (var n = 0; n < this.tagROs.length; n++) {
		/* Get tag ViewObject */
		var tagRO = this.tagROs[n];

		/* Update x-offset */
		tagRO.positionOffset.x = this.labelRO.positionOffset.x + ((this.geneticElement.strand == "+") ? -1 : 1) * (this.labelRO.renderedWidth + offset);
		offset += 8;

		/* Draw */
		tagRO.forceRender();
	}
};

/**
 * Cleans up this Annotation object.
 */
Eplant.Views.ChromosomeView.Annotation.prototype.remove = function() {
	/* Clean up ViewObjects */
	this.whiskerRO.detachFromView(this.chromosomeView);
	this.labelRO.detachFromView(this.chromosomeView);
	for (var n = 0; n < this.tagROs.length; n++) {
		var tagRO = this.tagROs[n];
		tagRO.detachFromView(this.chromosomeView);
	}

	/* Remove event listeners */
	ZUI.removeEventListener(this.updateAnnotationTagsEventListener);

	/* Remove label from ViewObjects array */
	var index = this.chromosomeView.viewObjects.indexOf(this.labelRO);
	if (index >= 0) {
		this.chromosomeView.viewObjects.splice(index, 1);
	}
};

})();