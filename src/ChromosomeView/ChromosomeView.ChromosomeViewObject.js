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
				var clipHeight = halfWidth;
				if (clipHeight > 20) clipHeight = 20;
				ZUI.context.save();
				ZUI.context.beginPath();
				ZUI.context.moveTo(topTip.x - halfWidth, 0);
				ZUI.context.lineTo(topTip.x + halfWidth, 0);
				ZUI.context.lineTo(topTip.x + halfWidth, clipHeight);
				ZUI.context.lineTo(topTip.x, 0);
				ZUI.context.lineTo(topTip.x - halfWidth, clipHeight);
				ZUI.context.lineTo(topTip.x - halfWidth, 0);
				ZUI.context.closePath();
				ZUI.context.strokeStyle = Eplant.Color.White;
				ZUI.context.fillStyle = Eplant.Color.White;
				ZUI.context.stroke();
				ZUI.context.fill();
				ZUI.context.restore();
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
				var clipHeight = halfWidth;
				if (clipHeight > 20) clipHeight = 20;
				ZUI.context.save();
				ZUI.context.beginPath();
				ZUI.context.moveTo(bottomTip.x - halfWidth, ZUI.height);
				ZUI.context.lineTo(bottomTip.x + halfWidth, ZUI.height);
				ZUI.context.lineTo(bottomTip.x + halfWidth, ZUI.height - clipHeight);
				ZUI.context.lineTo(bottomTip.x, ZUI.height);
				ZUI.context.lineTo(bottomTip.x - halfWidth, ZUI.height - clipHeight);
				ZUI.context.lineTo(bottomTip.x - halfWidth, ZUI.height);
				ZUI.context.closePath();
				ZUI.context.strokeStyle = Eplant.Color.White;
				ZUI.context.fillStyle = Eplant.Color.White;
				ZUI.context.stroke();
				ZUI.context.fill();
				ZUI.context.restore();
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
