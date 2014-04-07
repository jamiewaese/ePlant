(function() {

/**
 * Eplant.Views.ChromosomeView.Chromosome class
 * Coded by Hans Yu
 * UI designed by Jame Waese
 *
 * @constructor
 * @param {Eplant.Chromosome} chromosome The ePlant Chromosome object associated with this ChromosomeView Chromosome.
 * @param {Number} hPosition The horizontal position of this Chromosome.
 * @param {Eplant.Views.ChromosomeView} chromosomeView The ChromosomeView this Chromosome belongs to.
 */
Eplant.Views.ChromosomeView.Chromosome = function(chromosome, hPosition, chromosomeView) {
	/* Attributes */
	this.chromosome = chromosome;		// The ePlant Chromosome object associated with this ChromosomeView Chromosome
	this.hPosition = hPosition;			// The horizontal position of this Chromosome
	this.chromosomeView = chromosomeView;	// The ChromosomeView this Chromosome belongs to
	this.x = hPosition * 120;			// X-coordinate of the Chromosome
	this.y = -220;				// Y-coordinate of the Chromosome
	this.width = 10;				// Width of the Chromosome
	this.perBpHeight = 0.000015;		// Per-base-pair height of the Chromosome
	this.centromereRO = null;			// ViewObject for the centromeres layer
	this.chromosomeROs = [];			// ViewObjects for the chromosome segments minus the centromeres
	this.inputsRO = null;			// ViewObject layer for picking up input events
	this.labelRO = null;				// ViewObject for the Chromosome label
	this.lowerRangeRO = null;			// ViewObject indicating the lower limit of the visible base-pair range
	this.higherRangeRO = null;			// ViewObject indicating the higher limit of the visible base-pair range
	this.outerMiniRO = null;			// ViewObject for the outer layer of the mini chromosome
	this.innerMiniRO = null;			// ViewObject for the inner layer of the mini chromosome

	/* Create ViewObjects */
	this.createROs();
};

/**
 * Creates ViewObjects for this Chromosome
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.createROs = function() {
	/* Centromeric layer */
	this.centromereRO = new ZUI.RenderedObject.Rectangle({
		position: {
			x: this.x,
			y: this.y
		},
		positionScale: ZUI.Def.WorldScale,
		centerAt: {
			horizontal: ZUI.Def.Center,
			vertical: ZUI.Def.Top
		},
		stroke: false,
		fill: true,
		fillColor: Eplant.Color.MedGrey,
		radius: this.width * 0.6,
		radiusScale: ZUI.Def.World,
		width: this.width * 0.6,
		widhtScale: ZUI.Def.World,
		height: this.chromosome.size * this.perBpHeight,
		heightScale: ZUI.Def.World
	});
	this.centromereRO.attachToView(this.chromosomeView);

	/* Non-centromeric layers */
	var start = 0;
	var centromeres = this.chromosome.getGeneticElementsByType("centromere");
	for (var n = 0; n < centromeres.length; n++) {
		var chromosomeRO = new ZUI.RenderedObject.Rectangle({
			position: {
				x: this.x,
				y: this.y + start * this.perBpHeight
			},
			positionScale: ZUI.Def.WorldScale,
			centerAt: {
				horizontal: ZUI.Def.Center,
				vertical: ZUI.Def.Top
			},
			stroke: false,
			fill: true,
			fillColor: Eplant.Color.MedGrey,
			width: this.width,
			widthScale: ZUI.Def.WorldScale,
			height: (centromeres[n].start - start) * this.perBpHeight,
			heightScale: ZUI.Def.WorldScale,
			radius: this.width / 2,
			radiusScale: ZUI.Def.WorldScale
		});
		chromosomeRO.attachToView(this.chromosomeView);
		this.chromosomeROs.push(chromosomeRO);
		
		start = centromeres[n].end;
	}
	var chromosomeRO = new ZUI.RenderedObject.Rectangle({
		position: {
			x: this.x,
			y: this.y + start * this.perBpHeight
		},
		positionScale: ZUI.Def.WorldScale,
		centerAt: {
			horizontal: ZUI.Def.Center,
			vertical: ZUI.Def.Top
		},
		stroke: false,
		fill: true,
		fillColor: Eplant.Color.MedGrey,
		width: this.width,
		widthScale: ZUI.Def.WorldScale,
		height: (this.chromosome.size - start) * this.perBpHeight,
		heightScale: ZUI.Def.WorldScale,
		radius: this.width / 2,
		radiusScale: ZUI.Def.WorldScale
	});
	chromosomeRO.attachToView(this.chromosomeView);
	this.chromosomeROs.push(chromosomeRO);

	/* Inputs layer */
	this.inputsRO = new ZUI.RenderedObject.Rectangle({
		position: {
			x: this.x,
			y: this.y
		},
		positionScale: ZUI.Def.WorldScale,
		centerAt: {
			horizontal: ZUI.Def.Center,
			vertical: ZUI.Def.Top
		},
		stroke: false,
		fill: false,
		width: this.width,
		widthScale: ZUI.Def.WorldScale,
		height: this.chromosome.size * this.perBpHeight,
		heightScale: ZUI.Def.WorldScale,
		radius: this.width / 2,
		radiusScale: ZUI.Def.WorldScale,
		eventListeners: {
			mouseMove: $.proxy(function () {
				/* Create new timer for GeneticElementList creation if appropriate */
				if (!this.chromosomeView.geneticElementListInfo || this.chromosomeView.geneticElementListInfo.vPosition != ZUI.mouseStatus.y) {
					this.chromosomeView.geneticElementListInfo = {
						finish: ZUI.appStatus.progress + 500,
						chromosome: this,
						vPosition: ZUI.mouseStatus.y,
						pin: false
					};
				}
			}, this),
			mouseOver: $.proxy(function() {
				/* Change cursor */
				ZUI.canvas.style.cursor = "pointer";
			}, this),
			mouseOut: $.proxy(function() {
				/* Restore cursor */
				ZUI.canvas.style.cursor = "default";

				/* Remove countdown */
				this.chromosomeView.geneticElementListInfo = null;
			}, this),
			leftClick: $.proxy(function() {
				/* Pin GeneticElementListDialog if created, else create and pin */
				if (this.chromosomeView.geneticElementList && !this.chromosomeView.geneticElementList.pinned) {
					this.chromosomeView.geneticElementList.pinned = true;
				}
				else {
					/* Remove old GeneticElementList if not pinned */
					if (this.chromosomeView.geneticElementList) {
						this.chromosomeView.geneticElementList.close();
						this.chromosomeView.geneticElementList = null;
					}

					/* Prepare to create new GeneticElementList */
					this.chromosomeView.geneticElementListInfo = {
						finish: ZUI.appStatus.progress,
						chromosome: this,
						vPosition: ZUI.mouseStatus.y,
						pin: true
					};
				}
			}, this)
		}
	});
	this.inputsRO.attachToView(this.chromosomeView);

	/* Chromosome label */
	this.labelRO = new ZUI.RenderedObject.Text({
		position: {
			x: this.x - this.width / 2,
			y: this.y - 10
		},
		positionScale: ZUI.Def.WorldScale,
		centerAt: {
			horizontal: ZUI.Def.Center,
			vertical: ZUI.Def.Bottom
		},
		stroke: false,
		fill: true,
		fillColor: Eplant.Color.LightGrey,
		content: this.chromosome.name,
		size: 14,
		sizeScale: ZUI.Def.Screen
	});
	this.labelRO.attachToView(this.chromosomeView);

	/* Lower limit of the visible base-pair range */
	this.lowerRangeRO = new ZUI.RenderedObject.Text({
		positionScale: ZUI.Def.ScreenScale,
		centerAt: {
			horizontal: ZUI.Def.Left,
			vertical: ZUI.Def.Center
		},
		stroke: false,
		fill: true,
		fillColor: Eplant.Color.LightGrey,
		size: 12,
		sizeScale: ZUI.Def.Screen
	});
	this.lowerRangeRO.attachToView(this.chromosomeView);

	/* Higher limit of the visible base-pair range */
	this.higherRangeRO = new ZUI.RenderedObject.Text({
		positionScale: ZUI.Def.ScreenScale,
		centerAt: {
			horizontal: ZUI.Def.Left,
			vertical: ZUI.Def.Center
		},
		stroke: false,
		fill: true,
		fillColor: Eplant.Color.LightGrey,
		size: 12,
		sizeScale: ZUI.Def.Screen
	});
	this.higherRangeRO.attachToView(this.chromosomeView);

	/* Outer layer of the mini chromosome */
	this.outerMiniRO = new ZUI.RenderedObject.Rectangle({
		positionScale: ZUI.Def.ScreenScale,
		centerAt: {
			horizontal: ZUI.Def.Center,
			vertical: ZUI.Def.Top
		},
		width: 10,
		widthScale: ZUI.Def.Screen,
		height: 80,
		heightScale: ZUI.Def.Screen,
		radius: 5,
		radiusScale: ZUI.Def.Screen,
		stroke: true,
		strokeColor: Eplant.Color.LightGrey,
		fill: true,
		fillColor: Eplant.Color.White
	});

	/* Inner layer of the mini chromosome */
	this.innerMiniRO = new ZUI.RenderedObject.Rectangle({
		positionScale: ZUI.Def.ScreenScale,
		centerAt: {
			horizontal: ZUI.Def.Center,
			vertical: ZUI.Def.Top
		},
		width: 10,
		widthScale: ZUI.Def.Screen,
		heightScale: ZUI.Def.Screen,
		radius: 5,
		radiusScale: ZUI.Def.Screen,
		stroke: true,
		strokeColor: Eplant.Color.LightGrey,
		fill: true,
		fillColor: Eplant.Color.LightGrey
	});
};

/**
 * Draws this Chromosome and its accessories.
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.draw = function() {
	/* Get position information of the chromosome */
	var halfWidth = this.getScreenWidth() / 2;
	var xPosition = this.getScreenX();
	var yTopPosition = this.getScreenY();
	var yBottomPosition = yTopPosition + this.getScreenHeight();

	/* Visible base-pair range */
	var rangeStart = 0;
	var rangeEnd = this.chromosome.size;
	var bpPerPixel = this.getBpPerPixel();
	var clipHeight = halfWidth;
	if (clipHeight > 20) clipHeight = 20;
	/* Lower limit  */
	if (yTopPosition < 0) {		// Clip
		rangeStart = (0 - yTopPosition) * bpPerPixel;
		if (rangeStart < this.chromosome.size) {	// Chromosome is in visible range
			/* Draw top clip */
			ZUI.context.save();
			ZUI.context.beginPath();
			ZUI.context.moveTo(xPosition - halfWidth - 0.5, 0);
			ZUI.context.lineTo(xPosition + halfWidth + 0.5, 0);
			ZUI.context.lineTo(xPosition + halfWidth + 0.5, clipHeight);
			ZUI.context.lineTo(xPosition, 0);
			ZUI.context.lineTo(xPosition - halfWidth - 0.5, clipHeight);
			ZUI.context.lineTo(xPosition - halfWidth - 0.5, 0);
			ZUI.context.closePath();
			ZUI.context.strokeStyle = Eplant.Color.White;
			ZUI.context.fillStyle = Eplant.Color.White;
			ZUI.context.stroke();
			ZUI.context.fill();
			ZUI.context.restore();

			/* Draw lower limit */
			var mb = Math.round(rangeStart / 10000) / 100;
			this.lowerRangeRO.content = mb + " Mb";
			this.lowerRangeRO.position.x = xPosition + halfWidth + 5;
			this.lowerRangeRO.position.y = 6;
		}
	}
	else {
		/* Draw lower limit */
		this.lowerRangeRO.content = "0 Mb";
		this.lowerRangeRO.position.x = xPosition + halfWidth + 5;
		this.lowerRangeRO.position.y = (yTopPosition < 6) ? 6 : yTopPosition;
	}
	/* Upper limit */
	if (yBottomPosition > ZUI.height) {		// Clip
		rangeEnd = (ZUI.height - yTopPosition) * bpPerPixel;
		if (rangeEnd >= 0) {		// Chromosome is in visible range
			/* Draw bottom clip */
			ZUI.context.save();
			ZUI.context.beginPath();
			ZUI.context.moveTo(xPosition - halfWidth - 0.5, ZUI.height);
			ZUI.context.lineTo(xPosition + halfWidth + 0.5, ZUI.height);
			ZUI.context.lineTo(xPosition + halfWidth + 0.5, ZUI.height - clipHeight);
			ZUI.context.lineTo(xPosition, ZUI.height);
			ZUI.context.lineTo(xPosition - halfWidth - 0.5, ZUI.height - clipHeight);
			ZUI.context.lineTo(xPosition - halfWidth - 0.5, ZUI.height);
			ZUI.context.closePath();
			ZUI.context.strokeStyle = Eplant.Color.White;
			ZUI.context.fillStyle = Eplant.Color.White;
			ZUI.context.stroke();
			ZUI.context.fill();
			ZUI.context.restore();

			/* Draw higher limit */
			var mb = Math.round(rangeEnd / 10000) / 100;
			this.higherRangeRO.content = mb + " Mb";
			this.higherRangeRO.position.x = xPosition + halfWidth + 5;
			this.higherRangeRO.position.y = ZUI.height - 6;
		}
	}
	else {
		/* Draw lower limit */
		var mb = Math.round(this.chromosome.size / 10000) / 100;
		this.higherRangeRO.content = mb + " Mb";
		this.higherRangeRO.position.x = xPosition + halfWidth + 5;
		this.higherRangeRO.position.y = (yBottomPosition > ZUI.height - 6) ? ZUI.height - 6 : yBottomPosition;
	}

	/* Mini chromosome */
	var bitmask = 0;
	if (rangeStart > 0) bitmask += 1;
	if (rangeEnd < this.chromosome.size) bitmask += 2;
	if (bitmask > 0) {
		if (rangeStart > this.chromosome.size) rangeStart = this.chromosome.size;
		if (rangeEnd < 0) rangeEnd = 0;
		var y1;
		if (bitmask == 1) y1 = 15;
		else if (bitmask == 2) y1 = ZUI.height - 95;
		else y1 = ZUI.height / 2 - 40;
		var y2 = y1 + rangeStart / this.chromosome.size * 80;
		var y3 = y1 + rangeEnd / this.chromosome.size * 80;
		var y4 = y1 + 80;
		this.outerMiniRO.position.x = xPosition + halfWidth + 15;
		this.outerMiniRO.position.y = y1;
		this.innerMiniRO.position.x = xPosition + halfWidth + 15;
		this.innerMiniRO.position.y = y2;
		this.innerMiniRO.height = y3 - y2;
		if (this.chromosomeView.renderedObjects.indexOf(this.outerMiniRO) < 0) {
			this.outerMiniRO.render();
			this.outerMiniRO.attachToView(this.chromosomeView);
		}
		if (this.chromosomeView.renderedObjects.indexOf(this.innerMiniRO) < 0) {
			this.innerMiniRO.render();
			this.innerMiniRO.attachToView(this.chromosomeView);
		}
	}
	else {
		if (this.chromosomeView.renderedObjects.indexOf(this.outerMiniRO) >= 0) {
			this.outerMiniRO.detachFromView(this.chromosomeView);
		}
		if (this.chromosomeView.renderedObjects.indexOf(this.innerMiniRO) >= 0) {
			this.innerMiniRO.detachFromView(this.chromosomeView);
		}
	}

	/* Heatmap */
	// TODO
};

/**
 * Gets the screen x-coordinate of the Chromosome.
 *
 * @return {Number} Screen x-coordinate of the Chromosome.
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.getScreenX = function() {
	return this.inputsRO.renderedPosition.x;
};

/**
 * Gets the screen y-coordinate of the Chromosome.
 *
 * @return {Number} Screen y-coordinate of the Chromosome.
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.getScreenY = function() {
	return this.inputsRO.renderedPosition.y;
};

/**
 * Gets the screen width of the Chromosome.
 *
 * @return {Number} Screen width of the Chromosome.
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.getScreenWidth = function() {
	return this.inputsRO.renderedWidth;
};

/**
 * Gets the screen height of the Chromosome.
 *
 * @return {Number} Screen height of the Chromosome.
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.getScreenHeight = function() {
	return this.inputsRO.renderedHeight;
};

/**
 * Gets the world x-coordinate of the Chromosome.
 *
 * @return {Number} World x-coordinate of the Chromosome.
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.getX = function() {
	return this.inputsRO.position.x;
};

/**
 * Gets the world y-coordinate of the Chromosome.
 *
 * @return {Number} World y-coordinate of the Chromosome.
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.getY = function() {
	return this.inputsRO.position.y;
};

/**
 * Gets the world width of the Chromosome.
 *
 * @return {Number} World width of the Chromosome.
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.getWidth = function() {
	return this.inputsRO.width;
};

/**
 * Gets the world height of the Chromosome.
 *
 * @return {Number} World height of the Chromosome.
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.getHeight = function() {
	return this.inputsRO.height;
};

/**
 * Gets the number of base-pairs per pixel.
 *
 * @return {Number} Number of base-pairs per pixel.
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.getBpPerPixel = function() {
	return this.chromosome.size / (this.getScreenHeight() - 1);
};

/**
 * Gets the number of pixels per base-pair.
 *
 * @return {Number} Number of pixels per base-pair.
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.getPixelsPerBp = function() {
	return 1 / this.getBpPerPixel();
};

/**
 * Converts a pixel value to the equivalent base-pair range.
 *
 * @param {Number} pixel A screen y-coordinate.
 * @return {Number} Equivalent base-pair range.
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.pixelToBp = function(pixel) {
	if (pixel > this.getScreenY() && pixel < this.getScreenY() + this.getScreenHeight()) {
		range = {
			start: (pixel - 1 - this.getScreenY()) * this.getBpPerPixel() + 1,
			end: (pixel - this.getScreenY()) * this.getBpPerPixel()
		};
		if (range.end > this.chromosome.size) {
			range.end = this.chromosome.size;
		}
		return range;
	}
	else {
		return null;
	}
};

/**
 * Converts a base-pair value to the equivalent pixel value.
 *
 * @param {Number} bp A base-pair value.
 * @return {Number} Equivalent screen y-coordinate.
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.bpToPixel = function(bp) {
	return this.getScreenY() + (bp - 1) * this.getPixelsPerBp() + 1;
};

/**
 * Cleans up the ChromosomeView Chromosome.
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.remove = function() {
	/* Remove centromere layer */
	this.centromereRO.detachFromView(this.chromosomeView);

	/* Remove rest of Chromosome */
	for (var n = 0; n < this.chromosomeROs.length; n++) {
		var chromosomeRO = this.chromosomeROs[n];
		chromosomeRO.detachFromView(this.chromosomeView);
	}

	/* Remove inputs layer */
	this.inputsRO.detachFromView(this.chromosomeView);

	/* Remove Chromosome label */
	this.labelRO.detachFromView(this.chromosomeView);

	/* Remove limits of the visible base-pair range */
	this.lowerRangeRO.detachFromView(this.chromosomeView);

	/* Remove mini chromosome */
	this.outerMiniRO.detachFromView(this.chromosomeView);
	this.innerMiniRO.detachFromView(this.chromosomeView);
};

})();
