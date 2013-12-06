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
