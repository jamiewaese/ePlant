(function() {

/**
 * Eplant.Views.ChromosomeView.GeneticElementList class
 * Coded by Hans Yu
 * UI designed by Jame Waese
 *
 * @constructor
 * @param {Eplant.Views.ChromosomeView.Chromosome} chromosome The ChromosomeView Chromosome object that this GeneticElementList is created for.
 * @param {Number} vPosition The screen y-coordinate on the Chromosome.
 */
Eplant.Views.ChromosomeView.GeneticElementList = function(chromosome, vPosition, chromosomeView) {
	/* Attributes */
	this.chromosome = chromosome;			// The ChromosomeView Chromosome object that this GeneticElementList is created for
	this.x = chromosome.getScreenX();			// The x-coordinate position
	this.y = vPosition;					// The y-coordinate position
	this.start = null;					// The start base-pair position
	this.end = null;					// The end base-pair position
	this.chromosomeView = chromosomeView;		// The ChromosomeView that owns this GeneticElementList
	this.xOffset = 35;					// The position xOffset
	this.yOffset = 0;					// The position yOffset
	this.orientation = null;				// Orientation
	this.pinned = false;					// Whether this GeneticElementList is pinned
	this.choices = [];					// Array of Choices
	this.domContainer = null;				// DOM container
	this.whiskerRO = null;				// ViewObject for the whisker that indicates the Chromosome position
	this.connectorRO = null;				// ViewObject for lines connecting this GeneticElementList to the corresponding Chromosome position
	this.lowerRangeRO = null;				// ViewObject for the lower-range base-pair value covered by the GeneticElementList
	this.higherRangeRO = null;				// ViewObject for the higher-range base-pair value covered by the GeneticElementList

	/* Calculate start and end base-pair positions */
	var range = this.chromosome.pixelToBp(this.y);
	this.start = range.start;
	this.end = range.end;

	/* Determine orientation */
	this.orientation = (this.x > ZUI.width / 2) ? "left" : "right";

	/* Create DOM elements */
	this.domContainer = document.createElement("div");
	var span = document.createElement("span");
	$(span).html("Loading...");
	$(span).addClass("eplant-geneticElementList-choice");
	$(this.domContainer).append(span);

	/* Query GeneticElements */
	$.getJSON(Eplant.ServiceUrl + 'querygenesbyposition.cgi?chromosome=' + this.chromosome.chromosome.identifier + "&start=" + this.start + "&end=" + this.end, $.proxy(function(response) {
		/* Clear loading message */
		$(this.domContainer).empty();

		/* Find or create GeneticElement objects corresponding to the query results */
		for (var n = 0; n < response.length; n++) {
			/* Get GeneticElement information */
			var geneticElementInfo = response[n];

			/* Try to find GeneticElement */
			var geneticElement = this.chromosome.chromosome.getGeneticElementByIdentifier(geneticElementInfo.id);

			/* Create GeneticElement if not found */
			if (!geneticElement) {
				geneticElement = new Eplant.GeneticElement({
					chromosome: this.chromosome.chromosome,
					identifier: geneticElementInfo.id,
					aliases: geneticElementInfo.aliases,
					annotation: geneticElementInfo.annotation,
					type: "gene",
					strand: geneticElementInfo.strand,
					start: geneticElementInfo.start,
					end: geneticElementInfo.end
				});
				this.chromosome.chromosome.addGeneticElement(geneticElement);
			}

			/* Add Choice to GeneticElementList */
			var choice = new Eplant.Views.ChromosomeView.GeneticElementList.Choice(geneticElement, this);
			this.choices.push(choice);
		}

		/* Adjust yOffset */
		this.yOffset = $(this.domContainer).outerHeight() * -0.35;
		var hPosition = (this.orientation == "left") ? "right" : "left";
		var xOffset = (this.orientation == "left") ? -this.xOffset + 1 : this.xOffset - 1;
		var halfWidth = ((this.orientation == "left") ? -1 : 1) * this.chromosome.getWidth() / 2;
		if ($(this.domContainer).parent().length) {		// Check if dialog is still open
			$(this.domContainer).dialog({
				position: {
					my: hPosition + " top",
					at: "left+" + (this.x + halfWidth + xOffset) +" top+" + (this.y + this.yOffset),
					of: ZUI.canvas
				}
			});
		}

		/* Adjust position of connector */
		var sign = (this.orientation == "left") ? -1 : 1;
		this.connectorRO.vertices = [
			{
				x: this.xOffset * sign,
				y: this.yOffset + $(this.domContainer).position().top
			},
			{
				x: 0,
				y: 0
			},
			{
				x: this.xOffset * sign,
				y: this.yOffset + $(this.domContainer).parent().outerHeight() - $(this.domContainer).position().top
			}
		];
		this.connectorRO.forceRender();

		/* Adjust position of range indicators */
		this.lowerRangeRO.position.y = this.y + this.yOffset - 2;
		this.lowerRangeRO.forceRender();
		this.higherRangeRO.position.y = this.y + this.yOffset - $(this.domContainer).position().top + $(this.domContainer).parent().outerHeight() + 2;
		this.higherRangeRO.forceRender();
	}, this));

	/* Create jQuery UI dialog */
	var hPosition = (this.orientation == "left") ? "right" : "left";
	var xOffset = (this.orientation == "left") ? -this.xOffset + 1 : this.xOffset - 1;
	var halfWidth = ((this.orientation == "left") ? -1 : 1) * this.chromosome.getWidth() / 2;
	$(this.domContainer).dialog({
		dialogClass: "ui-dialog-noTitleBar",
		width: 180,
		height: "auto",
		resizable: false,
		draggable: false,
		minHeight: 0,
		maxHeight: 200,
		close: $.proxy(function(event, ui) {
			this.remove();
		}, this)
	});
	this.yOffset = $(this.domContainer).outerHeight() * -0.35;
	$(this.domContainer).dialog({
		position: {
			my: hPosition + " top",
			at: "left+" + (this.x + halfWidth + xOffset) +" top+" + (this.y + this.yOffset),
			of: ZUI.canvas
		},
	});

	/* Whisker */
	this.whiskerRO = new ZUI.RenderedObject.LinePath({
		position: {
			x: this.x,
			y: this.y
		},
		positionScale: ZUI.Def.ScreenScale,
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
		verticesScale: [
			ZUI.Def.ScreenScale,
			ZUI.Def.ScreenScale
		],
		stroke: true,
		strokeColor: Eplant.Color.DarkGrey,
		fill: false
	});
	this.whiskerRO.attachToView(this.chromosomeView);

	/* Connector */
	var sign = (this.orientation == "left") ? -1 : 1;
	this.connectorRO = new ZUI.RenderedObject.LinePath({
		position: {
			x: this.x + halfWidth,
			y: this.y
		},
		positionScale: ZUI.Def.ScreenScale,
		vertices: [
			{
				x: this.xOffset * sign,
				y: this.yOffset + $(this.domContainer).position().top
			},
			{
				x: 0,
				y: 0
			},
			{
				x: this.xOffset * sign,
				y: this.yOffset + $(this.domContainer).parent().outerHeight() - $(this.domContainer).position().top
			}
		],
		verticesScale: [
			ZUI.Def.ScreenScale,
			ZUI.Def.ScreenScale,
			ZUI.Def.ScreenScale
		],
		stroke: true,
		strokeColor: Eplant.Color.LightGrey,
		fill: false
	});
	this.connectorRO.attachToView(this.chromosomeView);

	/* Range */
	this.lowerRangeRO = new ZUI.RenderedObject.Text({
		position: {
			x: this.x + halfWidth + (this.xOffset + 10) * sign,
			y: this.y + this.yOffset - 2
		},
		positionScale: ZUI.Def.ScreenScale,
		sizeScale: ZUI.Def.ScreenScale,
		centerAt: {
			horizontal: (hPosition == 'right') ? ZUI.Def.Right : ZUI.Def.Left,
			vertical: ZUI.Def.Bottom
		},
		content: ZUI.Helper.getNumberWithComma(Math.ceil(this.start)),
		stroke: false,
		fill: true,
		fillColor: Eplant.Color.LightGrey
	});
	this.lowerRangeRO.attachToView(this.chromosomeView);
	this.higherRangeRO = new ZUI.RenderedObject.Text({
		position: {
			x: this.x + halfWidth + (this.xOffset + 10) * sign,
			y: this.y + this.yOffset - $(this.domContainer).position().top + $(this.domContainer).parent().outerHeight() + 2
		},
		positionScale: ZUI.Def.ScreenScale,
		sizeScale: ZUI.Def.ScreenScale,
		centerAt: {
			horizontal: (hPosition == 'right') ? ZUI.Def.Right : ZUI.Def.Left,
			vertical: ZUI.Def.Top
		},
		content: ZUI.Helper.getNumberWithComma(Math.floor(this.end)),
		stroke: false,
		fill: true,
		fillColor: Eplant.Color.LightGrey
	});
	this.higherRangeRO.attachToView(this.chromosomeView);
};

/**
 * Draws the GeneticElementList accessories.
 */
Eplant.Views.ChromosomeView.GeneticElementList.prototype.draw = function() {
	/* Update whisker thickness */
	var thickness = ZUI.camera.unprojectDistance(1);
	if (thickness != this.whiskerRO.strokeWidth) {
		this.whiskerRO.strokeWidth = thickness;
		this.whiskerRO.forceRender();
	}
};

/**
 * Checks whether the specified point is within the bounds of the GeneticElementList.
 *
 * @param {Number} x The x-coordinate.
 * @param {Number} y The y-coordinate.
 * @return {Boolean} Whether the specified point is within the bounds of the GeneticElementList.
 */
Eplant.Views.ChromosomeView.GeneticElementList.prototype.isInBound = function(x, y) {
	/* Initialize return value */
	var inBound = true;

	/* Check whether out of bounds */
	var halfWidth = this.chromosome.getScreenWidth() / 2;
	if (this.orientation == "left") {
		if (x < this.x - halfWidth - this.xOffset || x > this.x - halfWidth) {
			inBound = false;
		}
	}
	else {
		if (x < this.x + halfWidth || x > this.x + halfWidth + this.xOffset) {
			inBound = false;
		}
	}
	if (y < this.y + this.yOffset || y > this.y + this.yOffset - $(this.domContainer).position().top + $(this.domContainer).parent().outerHeight()) {
		inBound = false;
	}

	/* Return default */
	return inBound;
};

/**
 * Pins this GeneticElementList.
 */
Eplant.Views.ChromosomeView.GeneticElementList.prototype.pin = function() {
	this.pinned = true;
};

/**
 * Unpins this GeneticElementList.
 */
Eplant.Views.ChromosomeView.GeneticElementList.prototype.unpin = function() {
	this.pinned = false;
};

/**
 * Closes the GeneticElementList.
 */
Eplant.Views.ChromosomeView.GeneticElementList.prototype.close = function() {
	$(this.domContainer).dialog("close");
};

/**
 * Cleans up this GeneticElementList.
 */
Eplant.Views.ChromosomeView.GeneticElementList.prototype.remove = function() {
	/* Clean up Choice objects */
	for (var n = 0; n < this.choices.length; n++) {
		this.choices[n].remove();
	}

	/* Clean up DOM elements */
	$(this.domContainer).remove();

	/* Clean up ViewObjects */
	this.whiskerRO.detachFromView(this.chromosomeView);
	this.connectorRO.detachFromView(this.chromosomeView);
	this.lowerRangeRO.detachFromView(this.chromosomeView);
	this.higherRangeRO.detachFromView(this.chromosomeView);
};

})();
