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
	this.userAnnotations = [];							// User annotations
	this.isHeatmap = false;							// Whether heatmap is activated
	this.annotationPopup = null;						// Annotation popup
	this.geneListPopup = null;							// Gene list popup
	this.loadProgress = 0;							// Loading progress (0 to 1)
	this.mouseFramesIdle = 0;							// Number of frames that the mouse stays idle

	/* Create view-specific UI elements */
		/* User annotation */
		this.userAnnotation = document.createElement("div");
		this.userAnnotation.className = "hint--top hint--success hint--rounded";
		this.userAnnotation.setAttribute("data-hint", "Annotate genes. See help tab for instructions.");
		this.userAnnotation.style.padding = "5px";
			/* Text input */
			this.userAnnotationText = Eplant.createTextInput();
			this.userAnnotationText.style.width = "150px";
			this.userAnnotation.appendChild(this.userAnnotationText);

			/* Button */
			this.userAnnotationButton = Eplant.createButton("Annotate", $.proxy(function() {
				/* Parse input */
				var input = this.userAnnotationText.value.split(":");
				var geneIdentifier = input[0];
				var width = input[1];
				var color = input[2];

				/* Validate input */
				var isValid = true;
				if (isNaN(width)) isValid = false;
				if (!ZUI.isValidColor(color)) isValid = false;

				/* Store gene if input is valid */
				if (isValid) {
					/* Check if a user annotation already exists */
					var userAnnotation = null;
					for (n = 0; n < this.userAnnotations.length; n++) {
						if (geneIdentifier.toUpperCase() == this.userAnnotations[n].gene.identifier.toUpperCase()) {
							userAnnotation = this.userAnnotations[n];
							break;
						}
					}

					/* Update user annotation */
					if (userAnnotation != null) {
						userAnnotation.width = width;
						userAnnotation.color = color;
					}
					else {
						var userAnnotation = new ChromosomeView.UserAnnotation(geneIdentifier, width, color, this);
						this.userAnnotations.push(userAnnotation);
					}

					/* Reset annotation */
					//TODO change this part
/*
					var gene = this.annotationPopup.gene;
					var geneListPopupItem = this.annotationPopup.geneListPopupItem;
					this.annotationPopup.clear();
					this.annotationPopup.populate(gene, geneListPopupItem);
*/
				}

				/* Provide feedback if input is invalid */
				else {
					alert("Oops! We cannot process your annotation. Please try again.");
				}
			}, this));
			this.userAnnotation.appendChild(this.userAnnotationButton);

		/* Toggle heatmap */
		this.toggleHeatmap = document.createElement("div");
		this.toggleHeatmap.className = "iconSmall hint--top hint--success hint--rounded";
		this.toggleHeatmap.setAttribute("data-hint", "Toggle heatmap of gene density. Dark - more dense. Light - less dense.");
		this.toggleHeatmap.style.padding = "5px";
		this.toggleHeatmap.style.verticalAlign = "middle";
		this.toggleHeatmap.onclick = $.proxy(function() {
			/* Change toggle status */
			this.isHeatmap = !this.isHeatmap;
		}, this);
			/* Set icon */
			this.toggleHeatmap.appendChild(Eplant.createImage("img/heatmap.png"));

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
				chromosome.genes = [];
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

	/* Append view-specific UI */
	var viewSpecificUI = document.getElementById("viewSpecificUI");
	viewSpecificUI.appendChild(this.userAnnotation);
	viewSpecificUI.appendChild(this.toggleHeatmap);

	/* Create UserAnnotations from GenesOfInterest */
	var genesOfInterest = Eplant.getSpeciesOfInterest(this.species).getGenesOfInterest();
	for (var n = 0; n < genesOfInterest.length; n++) {
		/* Check if GeneOfInterest is already annotated */
		var isAnnotated = false;
		for (var m = 0; m < this.userAnnotations.length; m++) {
			if (genesOfInterest[n].gene == this.userAnnotations[m].gene) {
				isAnnotated = true;
				break;
			}
		}

		/* Create UserAnnotation if GeneOfInterest is not annotated */
		if (!isAnnotated) {
			this.userAnnotations.push(new ChromosomeView.UserAnnotation(genesOfInterest[n].gene.identifier, 1.8, Eplant.Color.LightGrey, this));
		}
	}
};

/* Override inactive */
ChromosomeView.prototype.inactive = function() {
	/* Remove popups */
	if (this.geneListPopup != null) {
		this.geneListPopup.remove();
		this.geneListPopup = null;
	}
	if (this.annotationPopup != null) {
		this.annotationPopup.remove();
		this.annotationPopup = null;
	}

	/* Remove application specific UI */
	document.getElementById("viewSpecificUI").innerHTML = "";
};

/* Decorate gene list popup */
ChromosomeView.prototype.decorateGeneListPopup = function() {
	/* Draw whisker */
	ZUI.processing.stroke(ZUI.hexToColor(Eplant.Color.DarkGrey));
	var chromosomeViewObject = this.getChromosomeViewObject(this.geneListPopup.chromosome);
	ZUI.processing.line(chromosomeViewObject.getScreenX() - 10, this.geneListPopup.y, chromosomeViewObject.getScreenX() + chromosomeViewObject.getScreenWidth() + 10, this.geneListPopup.y);

	/* Draw connecting lines */
	ZUI.processing.stroke(ZUI.hexToColor(Eplant.Color.LightGrey));
	if (this.geneListPopup.orientation == "left") {
		ZUI.processing.line(this.geneListPopup.x - 10, this.geneListPopup.y, this.geneListPopup.x - this.geneListPopup.xOffset, this.geneListPopup.y + this.geneListPopup.yOffset);
		ZUI.processing.line(this.geneListPopup.x - 10, this.geneListPopup.y, this.geneListPopup.x - this.geneListPopup.xOffset, this.geneListPopup.y + this.geneListPopup.yOffset + this.geneListPopup.height + 12);
	}
	else {
		ZUI.processing.line(this.geneListPopup.x + 10, this.geneListPopup.y, this.geneListPopup.x + this.geneListPopup.xOffset, this.geneListPopup.y + this.geneListPopup.yOffset);
		ZUI.processing.line(this.geneListPopup.x + 10, this.geneListPopup.y, this.geneListPopup.x + this.geneListPopup.xOffset, this.geneListPopup.y + this.geneListPopup.yOffset + this.geneListPopup.height + 12);
	}

	/* Draw base pair range values */
	ZUI.processing.fill(ZUI.hexToColor(Eplant.Color.DarkGrey));
	ZUI.processing.textSize(10);
	if (this.geneListPopup.orientation == "left") {
		ZUI.processing.text(ZUI.getNumberWithComma(Math.ceil(this.geneListPopup.start)) + " bp", this.geneListPopup.x - this.geneListPopup.xOffset - this.geneListPopup.width - 6, this.geneListPopup.y + this.geneListPopup.yOffset - 3);
		ZUI.processing.text(ZUI.getNumberWithComma(Math.floor(this.geneListPopup.end)) + " bp", this.geneListPopup.x - this.geneListPopup.xOffset - this.geneListPopup.width - 6, this.geneListPopup.y + this.geneListPopup.yOffset + this.geneListPopup.height + 12 + 13);
	}
	else {
		ZUI.processing.text(ZUI.getNumberWithComma(Math.ceil(this.geneListPopup.start)) + " bp", this.geneListPopup.x + this.geneListPopup.xOffset + 6, this.geneListPopup.y + this.geneListPopup.yOffset - 3);
		ZUI.processing.text(ZUI.getNumberWithComma(Math.floor(this.geneListPopup.end)) + " bp", this.geneListPopup.x + this.geneListPopup.xOffset + 6, this.geneListPopup.y + this.geneListPopup.yOffset + this.geneListPopup.height + 12 + 13);
	}
};

/* Decorate annotation popup */
ChromosomeView.prototype.decorateAnnotationPopup = function() {
	if (this.annotationPopup != null && this.annotationPopup.source instanceof ChromosomeView.GeneListPopupItem) {
		/* Draw connecting lines */
		ZUI.processing.stroke(ZUI.hexToColor(Eplant.Color.LightGrey));
		if (this.annotationPopup.orientation == "left") {
			ZUI.processing.line(this.annotationPopup.x, this.annotationPopup.y, this.annotationPopup.x - 10, this.annotationPopup.y);
			ZUI.processing.line(this.annotationPopup.x - 10, this.annotationPopup.y, this.annotationPopup.x - this.annotationPopup.xOffset, this.annotationPopup.y + this.annotationPopup.yOffset);
			ZUI.processing.line(this.annotationPopup.x - 10, this.annotationPopup.y, this.annotationPopup.x - this.annotationPopup.xOffset, this.annotationPopup.y + this.annotationPopup.yOffset + this.annotationPopup.height + 12);
		}
		else {
			ZUI.processing.line(this.annotationPopup.x, this.annotationPopup.y, this.annotationPopup.x + 10, this.annotationPopup.y);
			ZUI.processing.line(this.annotationPopup.x + 10, this.annotationPopup.y, this.annotationPopup.x + this.annotationPopup.xOffset, this.annotationPopup.y + this.annotationPopup.yOffset);
			ZUI.processing.line(this.annotationPopup.x + 10, this.annotationPopup.y, this.annotationPopup.x + this.annotationPopup.xOffset, this.annotationPopup.y + this.annotationPopup.yOffset + this.annotationPopup.height + 12);
		}
	}
};

/* Draw heatmap */
ChromosomeView.prototype.drawHeatmap = function() {
	//TODO
};

/* Override draw */
ChromosomeView.prototype.draw = function() {
	this.mouseFramesIdle++;

	/* Get mouse status */
	var x = ZUI.mouseStatus.x;
	var y = ZUI.mouseStatus.y;

	/* Update camera */
	ZUI.camera.update();

	/* Draw chromosomes */
	for (var n = 0; n < this.chromosomeViewObjects.length; n++) {
		this.chromosomeViewObjects[n].draw();
	}

	/* Draw heatmap */
	this.drawHeatmap();

	/* Draw user annotations */
	for (n = 0; n < this.userAnnotations.length; n++) {
		this.userAnnotations[n].draw();
		//TODO check if in bound and create annotation popup: this.userAnnotations[n].isInBound(x, y)
	}

	/* Check whether gene list popup should be created */
	if (this.mouseFramesIdle == 20) {
		if (this.geneListPopup == null) {
			this.createGeneListPopup();
		}
	}

	/* Decorate gene list popup */
	if (this.geneListPopup != null) {
		this.decorateGeneListPopup();
	}

	/* Check whether annotation popup should be created */
	if (this.mouseFramesIdle == 20) {
		if (this.annotationPopup == null) {
			this.createAnnotationPopup();
		}
	}

	/* Decorate annotation popup and update its icons */
	if (this.annotationPopup != null) {
		this.decorateAnnotationPopup();
		this.annotationPopup.updateIcons();
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
		/* Check whether to clear annotation popup */
		if (this.annotationPopup != null) {
			if (!this.annotationPopup.isPinned && !this.annotationPopup.isInBound(x, y)) {
				var isRemove = true;
				if (this.annotationPopup.source instanceof ChromosomeView.UserAnnotation) {
					if (this.annotationPopup.source.isInBound(x, y)) {
						isRemove = false;
					}
				}
				if (isRemove) {
					this.annotationPopup.remove();
					this.annotationPopup = null;
				}
			}
		}

		/* Check whether to clear gene list popup */
		if (this.geneListPopup != null) {
			var chromosomeViewObject = this.getChromosomeViewObject(this.geneListPopup.chromosome);
			if (!this.geneListPopup.isPinned && 
			    !this.geneListPopup.isInBound(x, y) && 
			    (y != this.geneListPopup.y || x < chromosomeViewObject.getScreenX() || x > chromosomeViewObject.getScreenX() + chromosomeViewObject.getScreenWidth()) && 
			    (this.annotationPopup == null || !(this.annotationPopup.source instanceof ChromosomeView.GeneListPopupItem))) {
				this.geneListPopup.remove();
				this.geneListPopup = null;
			}
		}
	}
};

/* Override leftClick */
ChromosomeView.prototype.leftClick = function() {
	/* Get mouse status */
	var x = ZUI.mouseStatus.x;
	var y = ZUI.mouseStatus.y;

	/* Create popup if appropriate */
	if (this.geneListPopup == null) {
		this.createGeneListPopup();
	}
	if (this.annotationPopup == null) {
		this.createAnnotationPopup();
	}

	/* Pin popup if appropriate */
	if (this.annotationPopup != null) {
		if (!this.annotationPopup.isPinned) {
			if (this.annotationPopup.source instanceof ChromosomeView.UserAnnotation && this.annotationPopup.source.isInBound(x, y)) {
				this.annotationPopup.isPinned = true;
			}
		}
		else {
			this.annotationPopup.isPinned = false;
			this.annotationPopup.remove();
			this.annotationPopup = null;
		}
	}
	if (this.geneListPopup != null) {
		if (!this.geneListPopup.isPinned) {
			var chromosomeViewObject = this.getChromosomeViewObject(this.geneListPopup.chromosome);
			if (this.geneListPopup.y == y && x > chromosomeViewObject.getScreenX() && x < chromosomeViewObject.getScreenX() + chromosomeViewObject.getScreenWidth()) {
				this.geneListPopup.isPinned = true;
			}
		}
		else {
			this.geneListPopup.isPinned = false;
			this.geneListPopup.remove();
			this.geneListPopup = null;
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
	ZUI.camera.x += (point.x - ZUI.camera.x) * scroll * 0.05;
	ZUI.camera.y += (point.y - ZUI.camera.y) * scroll * 0.05;
	ZUI.camera.distance *= 1 - scroll * 0.05;
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

/* Creates gene list popup */
ChromosomeView.prototype.createGeneListPopup = function() {
	/* Get mouse status */
	var x = ZUI.mouseStatus.x;
	var y = ZUI.mouseStatus.y;

	/* Check whether mouse is over a chromosome */
	for (var n = 0; n < this.chromosomeViewObjects.length; n++) {
		var chromosomeViewObject = this.chromosomeViewObjects[n];
		if (chromosomeViewObject.isInBound(x, y) && chromosomeViewObject.chromosome.genes != null) {
			/* Create gene list popup */
			this.geneListPopup = new ChromosomeView.GeneListPopup(this);
			var range = chromosomeViewObject.mapPixelToBp(y);
			this.geneListPopup.setData(chromosomeViewObject.chromosome, range.start, range.end);
			var xCenter = chromosomeViewObject.getScreenX() + chromosomeViewObject.getScreenWidth() / 2;
			if (xCenter < ZUI.width / 2) {
				this.geneListPopup.setPosition(chromosomeViewObject.getScreenX() + chromosomeViewObject.getScreenWidth(), y, 35, null, 180, null, "right");
			}
			else {
				this.geneListPopup.setPosition(chromosomeViewObject.getScreenX(), y, 35, null, 180, null, "left");
			}
			this.geneListPopup.addToContainer(ZUI.container);

			break;
		}
	}
}

/* Creates annotation popup from user annotation */
ChromosomeView.prototype.createAnnotationPopup = function() {
	/* Get mouse status */
	var x = ZUI.mouseStatus.x;
	var y = ZUI.mouseStatus.y;

	/* Check whether mouse is over a user annotation */
	for (var n = 0; n < this.userAnnotations.length; n++) {
		var userAnnotation = this.userAnnotations[n];
		if (userAnnotation.isInBound(x, y)) {
			/* Create annotation popup */
			this.annotationPopup = new ChromosomeView.AnnotationPopup(this);
			this.annotationPopup.source = userAnnotation;
			var xCenter = (userAnnotation.xStart + userAnnotation.xEnd) / 2;
			if (xCenter < ZUI.width / 2) {
				this.annotationPopup.setPosition(userAnnotation.xEnd, (userAnnotation.yStart + userAnnotation.yEnd) / 2, 35, -210 * 0.3, 350, 205, "right");
			}
			else {
				this.annotationPopup.setPosition(userAnnotation.xStart, (userAnnotation.yStart + userAnnotation.yEnd) / 2, 35, -210 * 0.3, 350, 205, "left");
			}
			this.annotationPopup.setData(userAnnotation.gene);
			this.annotationPopup.addToContainer(ZUI.container);

			break;
		}
	}
}

/* ChromosomeViewObject class constructor */
ChromosomeView.ChromosomeViewObject = function(chromosome, view, index) {
	/* Field properties */
	this.chromosome = chromosome;
	this.view = view;
	this.index = index;

	/* Create view objects */
	this.viewObjects = [];
		/* Centromeric layer */
		this.viewObjects.push(new ZUI.ViewObject(		// Centromeric layer
			ZUI.ViewObject.Type.RoundedRect,
			ZUI.ViewObject.Scale.World,
			{
				x: -178 + index * 120,
				y: -220,
				width: 6,
				height: this.chromosome.length * 0.000015,
				radius: 3
			}
		));

		/* Non-centromeric layers */
		var start = 0;
		for (var n = 0; n < this.chromosome.centromeres.length; n++) {
			this.viewObjects.push(new ZUI.ViewObject(
				ZUI.ViewObject.Type.RoundedRect,
				ZUI.ViewObject.Scale.World,
				{
					x: -180 + index * 120,
					y: -220 + start * 0.000015,
					width: 10,
					height: (this.chromosome.centromeres[n].start - start) * 0.000015,
					radius: 5
				}
			));
			start = this.chromosome.centromeres[n].end;
		}

		/* Bottom non-centromeric layer */
		this.viewObjects.push(new ZUI.ViewObject(
			ZUI.ViewObject.Type.RoundedRect,
			ZUI.ViewObject.Scale.World,
			{
				x: -180 + index * 120,
				y: -220 + start * 0.000015,
				width: 10,
				height: (this.chromosome.length - start) * 0.000015,
				radius: 5
			}
		));
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
		/* Draw chromosome view object */
		ZUI.processing.fill(ZUI.hexToColor(Eplant.Color.MedGrey));
		ZUI.processing.noStroke();
		for (var n = 0; n < this.viewObjects.length; n++) {
			ZUI.drawViewObject(this.viewObjects[n]);
		}

		/* Get chromosome tips positions */
		var halfWidth = this.getScreenWidth() / 2;
		var topTip = {
			x : this.getScreenX() + halfWidth,
			y : this.getScreenY(),
		};
		var bottomTip = {
			x : this.getScreenX() + halfWidth,
			y : this.getScreenY() + this.getScreenHeight(),
		};

		/* Draw label */
		ZUI.processing.textSize(14);
		ZUI.processing.fill(ZUI.hexToColor(Eplant.Color.LightGrey));
		ZUI.processing.text(this.chromosome.name, topTip.x - this.chromosome.name.length * 4, topTip.y - 15);

		/* Draw chromosome base pair range */
		var rangeStart = 0;
		var rangeEnd = this.chromosome.length;
		ZUI.processing.textSize(12);
		ZUI.processing.fill(ZUI.hexToColor(Eplant.Color.LightGrey));
		if (topTip.y < 0) {
			var bpPerPixel = this.getBpPerPixel();
			rangeStart = (0 - this.getScreenY()) * bpPerPixel;
			if (rangeStart < this.chromosome.length) {
				/* Draw top base pair value */
				var mb = Math.round(rangeStart / 10000) / 100;
				ZUI.processing.text(mb + " Mb", topTip.x + halfWidth + 10, 12);

				/* Draw clipped top */
				ZUI.processing.stroke(ZUI.hexToColor(Eplant.Color.White));
				ZUI.processing.fill(ZUI.hexToColor(Eplant.Color.White));
				ZUI.processing.triangle(topTip.x, 0, topTip.x + halfWidth + 2, 0, topTip.x + halfWidth + 2, halfWidth);
				ZUI.processing.triangle(topTip.x, 0, topTip.x - halfWidth - 2, 0, topTip.x - halfWidth - 2, halfWidth);
			}
		}
		else {
			/* Draw top base pair value */
			ZUI.processing.text(0 + " Mb", topTip.x + halfWidth + 10, topTip.y + 12);
		}
		ZUI.processing.fill(ZUI.hexToColor(Eplant.Color.LightGrey));
		if (bottomTip.y > ZUI.height) {
			var bpPerPixel = this.getBpPerPixel();
			rangeEnd = (ZUI.height - this.getScreenY()) * bpPerPixel;
			if (rangeEnd >= 0) {
				/* Draw bottom base pair value */
				var mb = Math.round(rangeEnd / 10000) / 100;
				ZUI.processing.text(mb + " Mb", bottomTip.x + halfWidth + 10, ZUI.height - 2);

				/* Draw clipped bottom */
				ZUI.processing.stroke(ZUI.hexToColor(Eplant.Color.White));
				ZUI.processing.fill(ZUI.hexToColor(Eplant.Color.White));
				ZUI.processing.triangle(bottomTip.x, ZUI.height, bottomTip.x + halfWidth + 2, ZUI.height, bottomTip.x + halfWidth + 2, ZUI.height - halfWidth);
				ZUI.processing.triangle(bottomTip.x, ZUI.height, bottomTip.x - halfWidth - 2, ZUI.height, bottomTip.x - halfWidth - 2, ZUI.height - halfWidth);
			}
		}
		else {
			/* Draw bottom base pair value */
			var mb = Math.round(this.chromosome.length / 10000) / 100;
			ZUI.processing.text(mb + " Mb", bottomTip.x + halfWidth + 10, bottomTip.y - 2);
		}

		/* Draw mini chromosome */
		if (rangeStart > 0 || rangeEnd < this.chromosome.length) {
			if (rangeStart > this.chromosome.length) rangeStart = this.chromosome.length;
			if (rangeEnd < 0) rangeEnd = 0;
			ZUI.processing.stroke(ZUI.hexToColor(Eplant.Color.LightGrey));
			var y1 = ZUI.height / 2 - 50;
			var y2 = y1 + rangeStart / this.chromosome.length * 100;
			var y3 = y1 + rangeEnd / this.chromosome.length * 100;
			var y4 = y1 + 100;
			ZUI.processing.fill(ZUI.hexToColor(Eplant.Color.White));
			ZUI.processing.rect(bottomTip.x + halfWidth + 10, y1, 20, y2 - y1);
			ZUI.processing.rect(bottomTip.x + halfWidth + 10, y3 , 20, y4 - y3);
			ZUI.processing.fill(ZUI.hexToColor(Eplant.Color.LightGrey));
			ZUI.processing.rect(bottomTip.x + halfWidth + 10, y2 , 20, y3 - y2);
		}
	};

	/* Returns the x position of the chromosome view object on the screen */
	ChromosomeView.ChromosomeViewObject.prototype.getScreenX = function() {
		return this.viewObjects[1].screenX;
	};

	/* Returns the y position of the chromosome view object on the screen */
	ChromosomeView.ChromosomeViewObject.prototype.getScreenY = function() {
		return this.viewObjects[0].screenY;
	};

	/* Returns the width of the chromosome view object on the screen */
	ChromosomeView.ChromosomeViewObject.prototype.getScreenWidth = function() {
		return this.viewObjects[1].screenWidth;
	};

	/* Returns the height of the chromosome view object on the screen */
	ChromosomeView.ChromosomeViewObject.prototype.getScreenHeight = function() {
		return this.viewObjects[0].screenHeight;
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

/* UserAnnotation class constructor */
ChromosomeView.UserAnnotation = function(geneIdentifier, width, color, view) {
	/* Field attributes */
	this.geneIdentifier = geneIdentifier;
	this.width = width;
	this.color = color;
	this.view = view;
	this.gene = null;
	this.geneOfInterest = null;
	this.xStart = null;
	this.xEnd = null;
	this.yStart = null;
	this.yEnd = null;

	/* Get gene */
	var chromosomes = this.view.species.chromosomes;
	for (var n = 0; n < chromosomes.length; n++) {
		var chromosome = chromosomes[n];
		var genes = chromosome.genes;
		for (var m = 0; m < genes.length; m++) {
			var gene = genes[m];
			if (gene.identifier.toUpperCase() == geneIdentifier.toUpperCase()) {
				this.gene = gene;
				break;
			}
		}
		if (this.gene != null) break;
	}
	if (this.gene == null) {
		$.ajax({
			type: "GET",
			url: "cgi-bin/querygenebyidentifier.cgi?id=" + geneIdentifier,
			dataType: "json"
		}).done($.proxy(function(response) {
			var chromosome = null;
			var chromosomes = this.view.species.chromosomes;
			for (var n = 0; n < chromosomes.length; n++) {
				if (chromosomes[n].name == response.chromosome) {
					chromosome = chromosomes[n];
				}
			}
			if (chromosome == null) {
				alert("Sorry! We cannot find your gene. Please try again.");
				var index = this.view.userAnnotations.indexOf(this);
				if (index >= 0) {
					this.view.userAnnotations.splice(index, 1);
				}
			}
			else {
				this.gene = new Eplant.Gene(chromosome);
				this.gene.identifier = response.id;
				this.gene.start = response.start;
				this.gene.end = response.end;
				this.gene.strand = response.strand;
				this.gene.aliases = response.aliases;
				chromosome.genes.push(this.gene);
				this.geneOfInterest = Eplant.getSpeciesOfInterest(this.view.species).addGeneOfInterest(this.gene);
				if (this.view.annotationPopup != null && this.view.annotationPopup.gene == this.gene) {
					this.view.annotationPopup.geneOfInterest = this.geneOfInterest;
				}
			}
		}, this));
	}
	else {
		this.geneOfInterest = Eplant.getSpeciesOfInterest(this.view.species).addGeneOfInterest(this.gene);
		if (this.view.annotationPopup != null && this.view.annotationPopup.gene == this.gene) {
			this.view.annotationPopup.geneOfInterest = this.geneOfInterest;
		}
	}
};

	/* Retrieves the screen position of the user annotation */
	ChromosomeView.UserAnnotation.prototype.isInBound = function(x, y) {
		if (x >= this.xStart && x <= this.xEnd && y >= this.yStart && y <= this.yEnd) {
			return true;
		}
		else {
			return false;
		}
	};

	/* Draws the user annotation */
	ChromosomeView.UserAnnotation.prototype.draw = function() {
		if (this.gene != null) {
			var gene = this.gene;
			var chromosome = gene.chromosome;

			/* Get ChromosomeViewObject */
			var chromosomeViewObject = this.view.getChromosomeViewObject(chromosome);

			/* Map gene position onto chromosome */
			this.yStart = chromosomeViewObject.mapBpToPixel(gene.start);
			this.yEnd = chromosomeViewObject.mapBpToPixel(gene.end);
			if (gene.strand == "+") {
				this.xEnd = chromosomeViewObject.getScreenX();
				this.xStart = this.xEnd - this.width * chromosomeViewObject.getScreenWidth() / 2;
			}
			else {
				this.xStart = chromosomeViewObject.getScreenX() + chromosomeViewObject.getScreenWidth();
				this.xEnd = this.xStart + this.width * chromosomeViewObject.getScreenWidth() / 2;
			}

			/* Draw whisker */
			ZUI.processing.stroke(ZUI.hexToColor(this.color));
			ZUI.processing.fill(ZUI.hexToColor(this.color));
			ZUI.processing.rect(
				this.xStart,
				this.yStart,
				this.xEnd - this.xStart,
				this.yEnd - this.yStart
			);

			/* Draw label */
			ZUI.processing.textSize(12);
			var labelX = null;
			var labelY = (this.yStart + this.yEnd) / 2 + 5;
			if (gene.strand == "+") {
				labelX = this.xStart - 65 - 5;
				this.xStart = labelX;
			}
			else {
				labelX = this.xEnd + 5;
				this.xEnd = labelX + 65;
			}
			this.yStart = labelY - 12;
			this.yEnd = labelY + 3;
			ZUI.processing.text(
				gene.identifier,
				labelX,
				labelY
			);
		}
	};

/* GeneListPopup class constructor */
ChromosomeView.GeneListPopup = function(view) {
	/* Field properties */
	this.view = view;
	this.orientation = "left";
	this.x = 0;
	this.y = 0;
	this.width = 180;
	this.height = 18;
	this.xOffset = 0;
	this.yOffset = -this.height * 0.3;
	this.isPinned = false;		// Whether the popup is pinned

	this.chromosome = null;
	this.start = 0;
	this.end = 0;
	this.items = [];

	/* Create popup element */
	this.container = document.createElement("div");
	this.container.className = "popup";
	this.container.style.left = "0px";
	this.container.style.top = "0px";
	this.container.width = this.width + "px";
	this.container.height = this.height + "px";

	/* Add loading span */
	var span = document.createElement("span");
	span.innerHTML = "Loading...";
	span.style.cursor = "default";
	span.style.fontFamily = "Helvetica";
	span.style.fontSize = "14px";
	span.style.lineHeight = "18px";
	span.style.color = Eplant.Color.DarkGrey;
	span.style.display = "block";
	this.container.appendChild(span);
};

	/* Sets position of gene list popup */
	ChromosomeView.GeneListPopup.prototype.setPosition = function(x, y, xOffset, yOffset, width, height, orientation) {
		if (x != null) this.x = x;
		if (y != null) this.y = y;
		if (xOffset != null) this.xOffset = xOffset;
		if (yOffset != null) this.yOffset = yOffset;
		if (width != null) this.width = width;
		if (height != null) this.height = height;
		if (orientation != null) this.orientation = orientation;

		if (this.orientation == "left") {
			this.container.style.left = (this.x - this.width - this.xOffset - 12) + "px";
		}
		else {
			this.container.style.left = (this.x + this.xOffset) + "px";
		}
		this.container.style.top = (this.y + this.yOffset) + "px";
		this.container.style.width = this.width + "px";
		this.container.style.height = this.height + "px";
	};

	/* Adds the gene list popup element to the specified container */
	ChromosomeView.GeneListPopup.prototype.addToContainer = function(container) {
		container.appendChild(this.container);
	};

	/* Returns whether the specified position is within the bounds of the popup */
	ChromosomeView.GeneListPopup.prototype.isInBound = function(x, y) {
		var inBound = true;
		if (this.orientation == "left") {
			if (x < this.x - this.width - this.xOffset - 12 || x > this.x) {
				inBound = false;
			}
		}
		else {
			if (x < this.x || x > this.x + this.xOffset + this.width + 12) {
				inBound = false;
			}
		}
		if (y < this.y + this.yOffset || y > this.y + this.height + this.yOffset + 12) {
			inBound = false;
		}
		return inBound;
	};

	/* Remove gene list popup */
	ChromosomeView.GeneListPopup.prototype.remove = function() {
		if (this.container.parentNode != null) {
			this.container.parentNode.removeChild(this.container);
		}
	};

	/* Sets data */
	ChromosomeView.GeneListPopup.prototype.setData = function(chromosome, start, end) {
		this.chromosome = chromosome;
		this.start = start;
		this.end = end;

		/* Query genes and add to list */
		$.ajax({
			type: "GET",
			url: "cgi-bin/querygenesbyposition.cgi?chromosome=" + chromosome.name.replace(" ", "_") + "&start=" + start + "&end=" + end,
			dataType: "json"
		}).done($.proxy(function(response) {
			this.container.innerHTML = "";
			for (var n = 0; n < response.length; n++) {
				/* Get gene object */
				var gene = null;
				for (var m = 0; m < this.chromosome.genes.length; m++) {
					if (this.chromosome.genes[m].identifier == response[n].id) {
						gene = this.chromosome.genes[m];
					}
				}
				if (gene == null) {
					gene = new Eplant.Gene(this.chromosome);
					gene.identifier = response[n].id;
					gene.start = response[n].start;
					gene.end = response[n].end;
					gene.strand = response[n].strand;
					gene.aliases = response[n].aliases;
					this.chromosome.genes.push(gene);
				}

				/* Add item to gene list */
				var item = new ChromosomeView.GeneListPopupItem(gene, this);
				//TODO set mouse over/out/click behaviours
				this.items.push(item);
			}

			/* Set list size */
			var height = this.items.length * 18;
			if (height > 200) height = 200;
			this.setPosition(null, null, null, -height * 0.3, null, height, null);
		}, this));
	};


/* GeneListPopupItem class Constructor */
ChromosomeView.GeneListPopupItem = function(gene, geneListPopup) {
	/* Field properties */
	this.gene = gene;
	this.geneListPopup = geneListPopup;

	/* Create span element */
	this.span = document.createElement("span");
	this.span.style.cursor = "default";
	this.span.style.fontFamily = "Helvetica";
	this.span.style.fontSize = "14px";
	this.span.style.lineHeight = "18px";
	this.span.style.color = Eplant.Color.DarkGrey;
	this.span.style.display = "block";
	this.span.style.whiteSpace = "nowrap";
	this.span.style.overflow = "hidden";
	this.span.style.textOverflow = "ellipsis";
	this.geneListPopup.container.appendChild(this.span);

	/* Set data */
	this.span.innerHTML = this.gene.identifier;
	if (this.gene.aliases != null && this.gene.aliases.length > 0 && this.gene.aliases[0].length > 0) {
		this.span.innerHTML += " / " + this.gene.aliases.join(", ");
	}

	/* Sets mouse over behaviour */
	this.span.onmouseover = $.proxy(function() {
		if (this.geneListPopup.view.annotationPopup == null || !this.geneListPopup.view.annotationPopup.isPinned) {
			/* Remove previous annotation popup, if applicable */
			if (this.geneListPopup.view.annotationPopup != null) {
				this.geneListPopup.view.annotationPopup.remove();
				this.geneListPopup.view.annotationPopup = null;
			}

			/* Highlight item */
			this.span.style.backgroundColor = Eplant.Color.DarkGrey;
			this.span.style.color = Eplant.Color.White;

			/* Create annotation popup */
			this.geneListPopup.view.annotationPopup = new ChromosomeView.AnnotationPopup(this.geneListPopup.view);
			this.geneListPopup.view.annotationPopup.source = this;
			var xPos = null;
			if (this.geneListPopup.orientation == "right") {
				xPos = this.geneListPopup.x + this.geneListPopup.xOffset + this.geneListPopup.width + 12;
			}
			else {
				xPos = this.geneListPopup.x - this.geneListPopup.xOffset - this.geneListPopup.width - 12;
			}
			var yPos = this.span.offsetTop + this.geneListPopup.container.offsetTop - this.geneListPopup.container.scrollTop + this.span.offsetHeight / 2;
			this.geneListPopup.view.annotationPopup.setPosition(xPos, yPos, 35, -210 * 0.3, 350, 205, this.geneListPopup.orientation);
			this.geneListPopup.view.annotationPopup.setData(this.gene);
			this.geneListPopup.view.annotationPopup.addToContainer(ZUI.container);
		}
	}, this);

	/* Sets click behaviour */
	this.span.onclick = $.proxy(function() {
		if (this.geneListPopup.view.annotationPopup != null) {
			if (!this.geneListPopup.view.annotationPopup.isPinned) {
				this.geneListPopup.view.annotationPopup.isPinned = true;
				this.geneListPopup.isPinned = true;
			}
			else {
				this.geneListPopup.view.annotationPopup.isPinned = false;
				this.geneListPopup.view.annotationPopup.remove();
				this.geneListPopup.view.annotationPopup = null;
			}
		}
	}, this);
};

/* Annotation class constructor */
ChromosomeView.AnnotationPopup = function(view) {
	/* Field properties */
	this.view = view;
	this.orientation = "left";			// Side on which the popup is placed
	this.x = 0;
	this.y = 0;
	this.xOffset = 0;
	this.yOffset = 0;
	this.width = 350;
	this.height = 205;
	this.source = null;
	this.isPinned = false;		// Whether the popup is pinned

	this.gene = null;
	this.geneOfInterest = null;		// GeneOfInterest that the annotation popup is prepared for

	/* Create popup element */
	this.container = document.createElement("div");
	this.container.className = "popup";
	this.container.style.left = "0px";
	this.container.style.top = "0px";
	this.container.style.width = this.width + "px";
	this.container.style.height = this.height + "px";
		/* Content */
		this.content = document.createElement("div");
		this.content.style.height = "110px";
		this.content.style.padding = "5px";
		this.content.style.backgroundColor = Eplant.Color.White;
		this.content.style.overflow = "auto";
		this.container.appendChild(this.content);
			/* Identifier */
			this.identifier = document.createElement("span");
			this.identifier.style.fontFamily = "Helvetica";
			this.identifier.style.fontSize = "14px";
			this.identifier.style.display = "block";
			this.identifier.style.textIndent = "-75px";
			this.identifier.style.paddingLeft = "75px";
			this.content.appendChild(this.identifier);

			/* Aliases */
			this.aliases = document.createElement("span");
			this.aliases.style.fontFamily = "Helvetica";
			this.aliases.style.fontSize = "14px";
			this.aliases.style.display = "block";
			this.aliases.style.textIndent = "-75px";
			this.aliases.style.paddingLeft = "75px";
			this.content.appendChild(this.aliases);

			/* Annotation */
			this.annotation = document.createElement("span");
			this.annotation.style.fontFamily = "Helvetica";
			this.annotation.style.fontSize = "14px";
			this.annotation.style.display = "block";
			this.annotation.style.textIndent = "-75px";
			this.annotation.style.paddingLeft = "75px";
			this.content.appendChild(this.annotation);

		/* Controls */
		this.controls = document.createElement("div");
		this.controls.style.padding = "5px";
		this.controls.style.display = "table-cell";
		this.controls.style.verticalAlign = "middle";
		this.container.appendChild(this.controls);
			/* Get/Drop Data button */
			this.getDropData = Eplant.createButton("", function(){});
			this.controls.appendChild(this.getDropData);

			/* Top 50 Similar button */
			this.top50Similar = Eplant.createButton("Top 50 Similar", $.proxy(function() {
				//TODO top 50 similar
			}, this));
			this.controls.appendChild(this.top50Similar);

			/* Tags */
			this.tags = document.createElement("div");
			this.tags.style.display = "inline";
			this.tags.style.padding = "5px";
			this.tags.style.verticalAlign = "middle";
			this.controls.appendChild(this.tags);
				/* Tags label */
				this.tags.appendChild(Eplant.createLabel("Tags: "));

				//TODO append tag colors

		/* Views */
		this.viewIcons = document.createElement("div");
		this.viewIcons.style.padding = "5px";
		this.container.appendChild(this.viewIcons);
			/* World */
			this.worldViewIcon = document.createElement("div");
			this.worldViewIcon.className = "iconSmall";
			this.worldViewIcon.style.display = "inline";
			this.worldViewIcon.appendChild(Eplant.createImage("img/unavailable/world.png"));
			this.viewIcons.appendChild(this.worldViewIcon);

			/* Plant */
			this.plantViewIcon = document.createElement("div");
			this.plantViewIcon.className = "iconSmall";
			this.plantViewIcon.style.display = "inline";
			this.plantViewIcon.appendChild(Eplant.createImage("img/unavailable/plant.png"));
			this.viewIcons.appendChild(this.plantViewIcon);

			/* Cell */
			this.cellViewIcon = document.createElement("div");
			this.cellViewIcon.className = "iconSmall";
			this.cellViewIcon.style.display = "inline";
			this.cellViewIcon.appendChild(Eplant.createImage("img/unavailable/cell.png"));
			this.viewIcons.appendChild(this.cellViewIcon);

			/* Interaction */
			this.interactionViewIcon = document.createElement("div");
			this.interactionViewIcon.className = "iconSmall";
			this.interactionViewIcon.style.display = "inline";
			this.interactionViewIcon.appendChild(Eplant.createImage("img/unavailable/interaction.png"));
			this.viewIcons.appendChild(this.interactionViewIcon);

			/* Pathway */
			this.pathwayViewIcon = document.createElement("div");
			this.pathwayViewIcon.className = "iconSmall";
			this.pathwayViewIcon.style.display = "inline";
			this.pathwayViewIcon.appendChild(Eplant.createImage("img/unavailable/pathway.png"));
			this.viewIcons.appendChild(this.pathwayViewIcon);

			/* Molecule */
			this.moleculeViewIcon = document.createElement("div");
			this.moleculeViewIcon.className = "iconSmall";
			this.moleculeViewIcon.style.display = "inline";
			this.moleculeViewIcon.appendChild(Eplant.createImage("img/unavailable/molecule.png"));
			this.viewIcons.appendChild(this.moleculeViewIcon);

			/* Sequence */
			this.sequenceViewIcon = document.createElement("div");
			this.sequenceViewIcon.className = "iconSmall";
			this.sequenceViewIcon.style.display = "inline";
			this.sequenceViewIcon.appendChild(Eplant.createImage("img/unavailable/sequence.png"));
			this.viewIcons.appendChild(this.sequenceViewIcon);
};

	/* Updates the icons */
	ChromosomeView.AnnotationPopup.prototype.updateIcons = function() {
		/* WorldView */
		if (this.geneOfInterest == null || this.geneOfInterest.worldView == null || this.geneOfInterest.worldView.getLoadProgress() < 1) {
			this.worldViewIcon.getElementsByTagName("img")[0].src = "img/unavailable/world.png";
		}
		else if (this.geneOfInterest.worldView == ZUI.activeView) {
			this.worldViewIcon.getElementsByTagName("img")[0].src = "img/active/world.png";
		}
		else {
			this.worldViewIcon.getElementsByTagName("img")[0].src = "img/available/world.png";
		}

		/* PlantView */
		if (this.geneOfInterest == null || this.geneOfInterest.plantView == null || this.geneOfInterest.plantView.getLoadProgress() < 1) {
			this.plantViewIcon.getElementsByTagName("img")[0].src = "img/unavailable/plant.png";
		}
		else if (this.geneOfInterest.plantView == ZUI.activeView) {
			this.plantViewIcon.getElementsByTagName("img")[0].src = "img/active/plant.png";
		}
		else {
			this.plantViewIcon.getElementsByTagName("img")[0].src = "img/available/plant.png";
		}

		/* CellView */
		if (this.geneOfInterest == null || this.geneOfInterest.cellView == null || this.geneOfInterest.cellView.getLoadProgress() < 1) {
			this.cellViewIcon.getElementsByTagName("img")[0].src = "img/unavailable/cell.png";
		}
		else if (this.geneOfInterest.cellView == ZUI.activeView) {
			this.cellViewIcon.getElementsByTagName("img")[0].src = "img/active/cell.png";
		}
		else {
			this.cellViewIcon.getElementsByTagName("img")[0].src = "img/available/cell.png";
		}

		/* InteractionView */
		if (this.geneOfInterest == null || this.geneOfInterest.interactionView == null || this.geneOfInterest.interactionView.getLoadProgress() < 1) {
			this.interactionViewIcon.getElementsByTagName("img")[0].src = "img/unavailable/interaction.png";
		}
		else if (this.geneOfInterest.interactionView == ZUI.activeView) {
			this.interactionViewIcon.getElementsByTagName("img")[0].src = "img/active/interaction.png";
		}
		else {
			this.interactionViewIcon.getElementsByTagName("img")[0].src = "img/available/interaction.png";
		}

		/* PathwayView */
		if (this.geneOfInterest == null || this.geneOfInterest.pathwayView == null || this.geneOfInterest.pathwayView.getLoadProgress() < 1) {
			this.pathwayViewIcon.getElementsByTagName("img")[0].src = "img/unavailable/pathway.png";
		}
		else if (this.geneOfInterest.pathwayView == ZUI.activeView) {
			this.pathwayViewIcon.getElementsByTagName("img")[0].src = "img/active/pathway.png";
		}
		else {
			this.pathwayViewIcon.getElementsByTagName("img")[0].src = "img/available/pathway.png";
		}

		/* MoleculeView */
		if (this.geneOfInterest == null || this.geneOfInterest.moleculeView == null || this.geneOfInterest.moleculeView.getLoadProgress() < 1) {
			this.moleculeViewIcon.getElementsByTagName("img")[0].src = "img/unavailable/molecule.png";
		}
		else if (this.geneOfInterest.moleculeView == ZUI.activeView) {
			this.moleculeViewIcon.getElementsByTagName("img")[0].src = "img/active/molecule.png";
		}
		else {
			this.moleculeViewIcon.getElementsByTagName("img")[0].src = "img/available/molecule.png";
		}

		/* SequenceView */
		if (this.geneOfInterest == null || this.geneOfInterest.sequenceView == null || this.geneOfInterest.sequenceView.getLoadProgress() < 1) {
			this.sequenceViewIcon.getElementsByTagName("img")[0].src = "img/unavailable/sequence.png";
		}
		else if (this.geneOfInterest.sequenceView == ZUI.activeView) {
			this.sequenceViewIcon.getElementsByTagName("img")[0].src = "img/active/sequence.png";
		}
		else {
			this.sequenceViewIcon.getElementsByTagName("img")[0].src = "img/available/sequence.png";
		}
	};

	/* Sets the data button to Get Data */
	ChromosomeView.AnnotationPopup.prototype.setToGetData = function() {
		this.getDropData.value = "Get Data";
		this.getDropData.onclick = $.proxy(function() {
//TODO write function for adding user annotation
			/* Check if gene is already annotated */
			var isAnnotated = false;
			for (var m = 0; m < this.view.userAnnotations.length; m++) {
				if (this.gene == this.view.userAnnotations[m].gene) {
					isAnnotated = true;
					break;
				}
			}

			/* Create UserAnnotation if gene is not annotated */
			if (!isAnnotated) {
				this.view.userAnnotations.push(new ChromosomeView.UserAnnotation(this.gene.identifier, 1.8, Eplant.Color.LightGrey, this.view));
			}
			this.setToDropData();
		}, this);
	};

	/* Sets the data button to Drop Data */
	ChromosomeView.AnnotationPopup.prototype.setToDropData = function() {
		this.getDropData.value = "Drop Data";
		this.getDropData.onclick = $.proxy(function() {
			/* Drop GeneOfInterest */
			Eplant.getSpeciesOfInterest(this.view.species).removeGeneOfInterest(this.geneOfInterest);
			genesOfInterest_onChange();

			/* Drop UserAnnotation */
			for (var m = 0; m < this.view.userAnnotations.length; m++) {
				if (this.gene == this.view.userAnnotations[m].gene) {
					this.view.userAnnotations.splice(m, 1);
					break;
				}
			}
			this.setToGetData();
		}, this);
	};

	/* Sets position of annotation popup */
	ChromosomeView.AnnotationPopup.prototype.setPosition = function(x, y, xOffset, yOffset, width, height, orientation) {
		if (x != null) this.x = x;
		if (y != null) this.y = y;
		if (xOffset != null) this.xOffset = xOffset;
		if (yOffset != null) this.yOffset = yOffset;
		if (width != null) this.width = width;
		if (height != null) this.height = height;
		if (orientation != null) this.orientation = orientation;

		if (this.orientation == "left") {
			this.container.style.left = (this.x - this.width - this.xOffset - 12) + "px";
		}
		else {
			this.container.style.left = (this.x + this.xOffset) + "px";
		}
		this.container.style.top = (this.y + this.yOffset) + "px";
		this.container.style.width = this.width + "px";
		this.container.style.height = this.height + "px";
	};

	/* Adds the annotation popup element to the specified container */
	ChromosomeView.AnnotationPopup.prototype.addToContainer = function(container) {
		container.appendChild(this.container);
	};

	/* Returns whether the specified position is within the bounds of the popup */
	ChromosomeView.AnnotationPopup.prototype.isInBound = function(x, y) {
		var inBound = true;
		if (this.orientation == "left") {
			if (x < this.x - this.width - this.xOffset - 12 || x > this.x) {
				inBound = false;
			}
		}
		else {
			if (x < this.x || x > this.x + this.xOffset + this.width + 12) {
				inBound = false;
			}
		}
		if (y < this.y + this.yOffset || y > this.y + this.height + this.yOffset + 12) {
			inBound = false;
		}
		return inBound;
	};

	/* Sets data */
	ChromosomeView.AnnotationPopup.prototype.setData = function(gene) {
		/* Set data texts */
		this.gene = gene;
		this.setIdentifier(this.gene.identifier);
		this.setAliases(this.gene.aliases);
		if (this.gene.annotation != null) {
			this.setAnnotation(this.gene.annotation);
		}
		else {
			$.ajax({
				type: "GET",
				url: "http://bar.utoronto.ca/webservices/agiToAnnot.php?request={\"agi\":\"" + this.gene.identifier + "\"}",
				dataType: "json"
			}).done($.proxy(function(response) {
				var data = response.split("__");
				if (data.length == 1) {
					this.gene.annotation = data[0];
				}
				else {
					this.gene.annotation = data[1];
				}

				this.setAnnotation(this.gene.annotation);
			}, this));
		}

		/* Set data button */
		this.geneOfInterest = Eplant.getSpeciesOfInterest(this.view.species).getGeneOfInterest(this.gene);
		if (this.geneOfInterest == null) {
			this.setToGetData();
		}
		else {
			this.setToDropData();
		}
	};

	/* Remove annotation popup */
	ChromosomeView.AnnotationPopup.prototype.remove = function() {
		this.container.parentNode.removeChild(this.container);
		if (this.source instanceof ChromosomeView.GeneListPopupItem) {
			this.source.span.style.backgroundColor = Eplant.Color.White;
			this.source.span.style.color = Eplant.Color.DarkGrey;
		}
	};

	/* Sets identifier text */
	ChromosomeView.AnnotationPopup.prototype.setIdentifier = function(identifier) {
		this.identifier.innerHTML = "<label>Identifier:</label> &nbsp&nbsp&nbsp&nbsp" + identifier;
	};

	/* Sets aliases text */
	ChromosomeView.AnnotationPopup.prototype.setAliases = function(aliases) {
		if (aliases.length == 0) {
			this.aliases.innerHTML = "<label>Aliases:</label> &nbsp&nbsp&nbsp&nbsp&nbspNot available";
		}
		else {
			this.aliases.innerHTML = "<label>Aliases:</label> &nbsp&nbsp&nbsp&nbsp&nbsp" + aliases.join(", ");
		}
	};

	/* Sets annotation text */
	ChromosomeView.AnnotationPopup.prototype.setAnnotation = function(annotation) {
		if (annotation.length == 0) {
			this.annotation.innerHTML = "<label>Annotation:</label> Not available";
		}
		else {
			this.annotation.innerHTML = "<label>Annotation:</label> " + annotation;
		}
	};

