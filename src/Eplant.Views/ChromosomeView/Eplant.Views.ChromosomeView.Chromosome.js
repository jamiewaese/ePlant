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
	this.centromereVO = null;			// ViewObject for the centromeres layer
	this.chromosomeVOs = [];			// ViewObjects for the chromosome segments minus the centromeres
	this.inputsVO = null;			// ViewObject layer for picking up input events
	this.labelVO = null;				// ViewObject for the Chromosome label
	this.lowerRangeVO = null;			// ViewObject indicating the lower limit of the visible base-pair range
	this.higherRangeVO = null;			// ViewObject indicating the higher limit of the visible base-pair range
	this.outerMiniVO = null;			// ViewObject for the outer layer of the mini chromosome
	this.innerMiniVO = null;			// ViewObject for the inner layer of the mini chromosome

	/* Create ViewObjects */
	this.createVOs();
};

/**
 * Creates ViewObjects for this Chromosome
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.createVOs = function() {
	/* Centromeric layer */
	this.centromereVO = new ZUI.ViewObject({
		shape: "rect",
		positionScale: "world",
		sizeScale: "world",
		x: this.x,
		y: this.y,
		width: this.width * 0.6,
		height: this.chromosome.size * this.perBpHeight,
		radius: this.width * 0.6 / 2,
		centerAt: "center top",
		stroke: false,
		fillColor: Eplant.Color.MedGrey
	});

	/* Non-centromeric layers */
	var start = 0;
	var centromeres = this.chromosome.getGeneticElementsByType("centromere");
	for (var n = 0; n < centromeres.length; n++) {
		this.chromosomeVOs.push(new ZUI.ViewObject({
			shape: "rect",
			positionScale: "world",
			sizeScale: "world",
			x: this.x,
			y: this.y + start * this.perBpHeight,
			width: this.width,
			height: (centromeres[n].start - start) * this.perBpHeight,
			radius: this.width / 2,
			centerAt: "center top",
			stroke: false,
			fillColor: Eplant.Color.MedGrey
		}));
		start = centromeres[n].end;
	}
	this.chromosomeVOs.push(new ZUI.ViewObject({
		shape: "rect",
		positionScale: "world",
		sizeScale: "world",
		x: this.x,
		y: this.y + start * this.perBpHeight,
		width: this.width,
		height: (this.chromosome.size - start) * this.perBpHeight,
		radius: this.width / 2,
		centerAt: "center top",
		stroke: false,
		fillColor: Eplant.Color.MedGrey
	}));

	/* Inputs layer */
	this.inputsVO = new ZUI.ViewObject({
		shape: "rect",
		positionScale: "world",
		sizeScale: "world",
		x: this.x,
		y: this.y,
		width: this.width,
		height: this.chromosome.size * this.perBpHeight,
		radius: this.width / 2,
		centerAt: "center top",
		stroke: false,
		fill: false,
		mouseMove: $.proxy(function() {
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
			ZUI.container.style.cursor = "pointer";
		}, this),
		mouseOut: $.proxy(function() {
			/* Restore cursor */
			ZUI.container.style.cursor = "default";

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
	});
	this.chromosomeView.viewObjects.push(this.inputsVO);

	/* Chromosome label */
	this.labelVO = new ZUI.ViewObject({
		shape: "text",
		positionScale: "world",
		sizeScale: "screen",
		x: this.x - this.width / 2,
		y: this.y - 10,
		centerAt: "center bottom",
		content: this.chromosome.name,
		strokeColor: Eplant.Color.LightGrey,
		fillColor: Eplant.Color.LightGrey,
		size: 14
	});

	/* Lower limit of the visible base-pair range */
	this.lowerRangeVO = new ZUI.ViewObject({
		shape: "text",
		positionScale: "screen",
		sizeScale: "screen",
		centerAt: "left center",
		strokeColor: Eplant.Color.LightGrey,
		fillColor: Eplant.Color.LightGrey,
		size: 12
	});

	/* Higher limit of the visible base-pair range */
	this.higherRangeVO = new ZUI.ViewObject({
		shape: "text",
		positionScale: "screen",
		sizeScale: "screen",
		centerAt: "left center",
		strokeColor: Eplant.Color.LightGrey,
		fillColor: Eplant.Color.LightGrey,
		size: 12
	});

	/* Outer layer of the mini chromosome */
	this.outerMiniVO = new ZUI.ViewObject({
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

	/* Inner layer of the mini chromosome */
	this.innerMiniVO = new ZUI.ViewObject({
		shape: "rect",
		positionScale: "screen",
		sizeScale: "screen",
		width: 10,
		radius: 5,
		centerAt: "center top",
		stroke: false,
		fillColor: Eplant.Color.LightGrey
	});
};

/**
 * Draws this Chromosome and its accessories.
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.draw = function() {
	/* Centromere layer */
	this.centromereVO.draw();

	/* Rest of Chromosome */
	for (var n = 0; n < this.chromosomeVOs.length; n++) {
		var chromosomeVO = this.chromosomeVOs[n];
		chromosomeVO.draw();
	}

	/* Inputs layer */
	this.inputsVO.draw();

	/* Chromosome label */
	this.labelVO.draw();

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
			this.lowerRangeVO.content = mb + " Mb";
			this.lowerRangeVO.x = xPosition + halfWidth + 5;
			this.lowerRangeVO.y = 6;
			this.lowerRangeVO.draw();
		}
	}
	else {
		/* Draw lower limit */
		this.lowerRangeVO.content = "0 Mb";
		this.lowerRangeVO.x = xPosition + halfWidth + 5;
		this.lowerRangeVO.y = (yTopPosition < 6) ? 6 : yTopPosition;
		this.lowerRangeVO.draw();
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
			this.higherRangeVO.content = mb + " Mb";
			this.higherRangeVO.x = xPosition + halfWidth + 5;
			this.higherRangeVO.y = ZUI.height - 6;
			this.higherRangeVO.draw();
		}
	}
	else {
		/* Draw lower limit */
		var mb = Math.round(this.chromosome.size / 10000) / 100;
		this.higherRangeVO.content = mb + " Mb";
		this.higherRangeVO.x = xPosition + halfWidth + 5;
		this.higherRangeVO.y = (yBottomPosition > ZUI.height - 6) ? ZUI.height - 6 : yBottomPosition;
		this.higherRangeVO.draw();
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
		this.outerMiniVO.x = xPosition + halfWidth + 15;
		this.outerMiniVO.y = y1;
		this.outerMiniVO.draw();
		this.innerMiniVO.x = xPosition + halfWidth + 15;
		this.innerMiniVO.y = y2;
		this.innerMiniVO.height = y3 - y2;
		this.innerMiniVO.draw();
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
	return this.inputsVO.screenX;
};

/**
 * Gets the screen y-coordinate of the Chromosome.
 *
 * @return {Number} Screen y-coordinate of the Chromosome.
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.getScreenY = function() {
	return this.inputsVO.screenY;
};

/**
 * Gets the screen width of the Chromosome.
 *
 * @return {Number} Screen width of the Chromosome.
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.getScreenWidth = function() {
	return this.inputsVO.screenWidth;
};

/**
 * Gets the screen height of the Chromosome.
 *
 * @return {Number} Screen height of the Chromosome.
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.getScreenHeight = function() {
	return this.inputsVO.screenHeight;
};

/**
 * Gets the world x-coordinate of the Chromosome.
 *
 * @return {Number} World x-coordinate of the Chromosome.
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.getX = function() {
	return this.inputsVO.x;
};

/**
 * Gets the world y-coordinate of the Chromosome.
 *
 * @return {Number} World y-coordinate of the Chromosome.
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.getY = function() {
	return this.inputsVO.y;
};

/**
 * Gets the world width of the Chromosome.
 *
 * @return {Number} World width of the Chromosome.
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.getWidth = function() {
	return this.inputsVO.width;
};

/**
 * Gets the world height of the Chromosome.
 *
 * @return {Number} World height of the Chromosome.
 */
Eplant.Views.ChromosomeView.Chromosome.prototype.getHeight = function() {
	return this.inputsVO.height;
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
	this.centromereVO.remove();

	/* Remove rest of Chromosome */
	for (var n = 0; n < this.chromosomeVOs.length; n++) {
		var chromosomeVO = this.chromosomeVOs[n];
		chromosomeVO.remove();
	}

	/* Remove inputs layer */
	this.inputsVO.remove();

	/* Remove Chromosome label */
	this.labelVO.remove();

	/* Remove limits of the visible base-pair range */
	this.lowerRangeVO.remove();
	this.higherRangeVO.remove();

	/* Remove mini chromosome */
	this.outerMiniVO.remove();
	this.innerMiniVO.remove();
};

})();
