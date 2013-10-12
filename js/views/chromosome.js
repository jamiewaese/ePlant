/**
 * Chromosome View class
 * UI design by Jamie Waese
 * Code by Hans Yu
 */

/* Constructor */
function ChromosomeView() {
	/* User annotation element */
	this.userAnnotationWrapperElement = document.createElement("div");
	this.userAnnotationWrapperElement.className = "hint--top hint--success hint--rounded";
	this.userAnnotationWrapperElement.setAttribute("data-hint", "Annotate genes. See help tab for instructions.");
	this.userAnnotationWrapperElement.style.padding = "5px";
	/* User annotation text element */
	this.userAnnotationTextElement = document.createElement("input");
	this.userAnnotationTextElement.type = "text";
	this.userAnnotationTextElement.style.width = "150px";
	this.userAnnotationWrapperElement.appendChild(this.userAnnotationTextElement);
	/* User annotation button element */
	this.userAnnotationButtonElement = document.createElement("input");
	this.userAnnotationButtonElement.type = "button";
	this.userAnnotationButtonElement.value = "Annotate";
	this.userAnnotationButtonElement.className = "button";
	this.userAnnotationButtonElement.onclick = $.proxy(function() {
		var descriptions = this.userAnnotationTextElement.value.split(":");
		var identifier = descriptions[0];
		var width = descriptions[1];
		var color = descriptions[2];
		/* Search for gene */
		var gene = null;
		for (var n = 0; n < this.chromosomes.length; n++) {
			var chromosome = this.chromosomes[n];
			for (var m = 0; m < chromosome.genes.length; m++) {
				if (chromosome.genes[m].agi.toUpperCase() == identifier.toUpperCase()) {
					gene = chromosome.genes[m];
					break;
				}
			}
			if (gene != null) break;
		}
		var isValid = true;
		if (gene == null) isValid = false;
		if (isNaN(width)) isValid = false;
		if (color == null) isValid = false;		//TODO fix
		if (isValid) {
			this.markedGenes.push(new ChromosomeView.MarkedGene(gene, width, color));
		}
		else {
			alert("Oops! We cannot process your annotation. Please try again.");
		}
	}, this);
	this.userAnnotationWrapperElement.appendChild(this.userAnnotationButtonElement);

	/* Toggle heatmap element */
	this.toggleHeatmapElement = document.createElement("div");
	var img = document.createElement("img");
	img.src = "img/heatmap.png";
	this.toggleHeatmapElement.appendChild(img);
	this.toggleHeatmapElement.onclick = $.proxy(function() {
		this.toggleHeatmap = !this.toggleHeatmap;
	}, this);
	this.toggleHeatmapElement.className = "iconSmall hint--top hint--success hint--rounded";
	this.toggleHeatmapElement.setAttribute("data-hint", "Toggle heatmap of gene density. Dark - more dense. Light - less dense.");
	this.toggleHeatmapElement.style.padding = "5px";
	this.toggleHeatmapElement.style.verticalAlign = "middle";

	/* Toggle heatmap */
	this.toggleHeatmap = false;

	/* Array of chromosomes */
	this.chromosomes = [];

	/* Define chromosomes */
	this.chromosomes.push(new ChromosomeView.Chromosome(
		"Chromosome 1",		//name
		30427671,			//length
		[
			new ChromosomeView.Chromosome.Centromere(15086046, 15087045),	//centromere
		],
		this.chromosomes.length	//index
	));
	this.chromosomes.push(new ChromosomeView.Chromosome(
		"Chromosome 2",
		19698289,
		[
			new ChromosomeView.Chromosome.Centromere(3607930, 3608929),
		],
		this.chromosomes.length
	));
	this.chromosomes.push(new ChromosomeView.Chromosome(
		"Chromosome 3",
		23459830,
		[
			new ChromosomeView.Chromosome.Centromere(13587787, 13588786),
			new ChromosomeView.Chromosome.Centromere(13799418, 13800417),
			new ChromosomeView.Chromosome.Centromere(14208953, 14209952),
		],
		this.chromosomes.length
	));
	this.chromosomes.push(new ChromosomeView.Chromosome(
		"Chromosome 4",
		18585056,
		[
			new ChromosomeView.Chromosome.Centromere(3956022, 3957021),
		],
		this.chromosomes.length
	));
	this.chromosomes.push(new ChromosomeView.Chromosome(
		"Chromosome 5",
		26975502,
		[
			new ChromosomeView.Chromosome.Centromere(11725025, 11726024),
		],
		this.chromosomes.length
	));

	/* Marked genes */
	this.markedGenes = [];

	/* Create annotation */
	this.annotation = new ChromosomeView.Annotation(this.markedGenes);

	/* Create gene list */
	this.geneList = new ChromosomeView.GeneList(this.annotation);

	/* Load chromosomes */
	for (var n = 0; n < this.chromosomes.length; n++) {
		/* Get chromosome data by Ajax */
		var chromosome = this.chromosomes[n];
		$.ajax({
			type: "GET",
			url: "data/gene/list/" + chromosome.name.replace(" ", "_"),
			dataType: "text"
		}).done($.proxy(function(response) {
			/* Parse chromosome data */
			var genesData = response.split("\n");
			for (var n = 0; n < genesData.length; n++) {
				/* Get gene information */
				var geneData = genesData[n];
				var fields = geneData.split("\t");
				if (fields.length < 4) continue;
				this.genes.push(new ChromosomeView.Chromosome.Gene(
					fields[0],			//agi
					fields[1].split(","),	//aliases
					fields[2],			//start
					fields[3],			//end
					this				//chromosome
				));
			}
			this.isLoaded = true;
		}, chromosome));
	}
}

/* Inherit from View superclass */
ChromosomeView.prototype = new ZUI.View();
ChromosomeView.prototype.constructor = ChromosomeView;

/* Override active */
ChromosomeView.prototype.active = function() {
	/* Set icon to active */
	document.getElementById("geneSelectorIcon").getElementsByTagName("img")[0].src = "img/active/geneSelector.png";

	/* Reset camera */
	ZUI.camera.reset();

	/* Append gene list HTML element to view */
	ZUI.container.appendChild(this.geneList.element);

	/* Append annotation HTML element to view */
	ZUI.container.appendChild(this.annotation.element);

	/* Set application specific UI */
	var specificApplicationUI_container = document.getElementById("specificApplicationUI_container");
	specificApplicationUI_container.innerHTML = "";
	specificApplicationUI_container.appendChild(this.userAnnotationWrapperElement);
	specificApplicationUI_container.appendChild(this.toggleHeatmapElement);
};

/* Override inactive */
ChromosomeView.prototype.inactive = function() {
	/* Set icon to inactive */
	document.getElementById("geneSelectorIcon").getElementsByTagName("img")[0].src = "img/available/geneSelector.png";

	/* Remove gene list HTML element to view */
	ZUI.container.removeChild(this.geneList.element);
};

/* Override draw */
ChromosomeView.prototype.draw = function() {
	/* Update camera */
	ZUI.camera.update();

	/* Draw chromosomes */
	for (var n = 0; n < this.chromosomes.length; n++) {
		var chromosome = this.chromosomes[n];
		if (chromosome.isLoaded) {
			/* Draw chromosome */
			ZUI.processing.fill(ZUI.hexToColor(COLOR.MED_GREY));
			ZUI.processing.stroke(ZUI.hexToColor(COLOR.MED_GREY));
			for (var m = 0; m < chromosome.viewObjects.length; m++) {
				ZUI.drawViewObject(chromosome.viewObjects[m]);
			}

			/* Get screen coordinates of chromosome tips */
			var halfWidth = chromosome.viewObjects[1].attributes.screenWidth / 2;
			var topTip = {
				x : chromosome.viewObjects[1].attributes.screenX + halfWidth,
				y : chromosome.viewObjects[0].attributes.screenY,
			};
			var bottomTip = {
				x : chromosome.viewObjects[1].attributes.screenX + halfWidth,
				y : chromosome.viewObjects[0].attributes.screenY + chromosome.viewObjects[0].attributes.screenHeight,
			};

			/* Draw label */
			ZUI.processing.textSize(14);
			ZUI.processing.fill(ZUI.hexToColor(COLOR.LIGHT_GREY));
			ZUI.processing.text(chromosome.name, topTip.x - chromosome.name.length * 4, topTip.y - 15);

			/* Visible chromosome range in base pairs */
			var visibleStart = 0;
			var visibleEnd = chromosome.length;

			ZUI.processing.textSize(12);
			ZUI.processing.fill(ZUI.hexToColor(COLOR.LIGHT_GREY));
			if (topTip.y < 0) {
				var bpPerPixel = chromosome.length / (Math.round(chromosome.viewObjects[0].attributes.screenHeight) - 1);
				visibleStart = (0 - Math.floor(chromosome.viewObjects[0].attributes.screenY) - 1) * bpPerPixel;
				if (visibleStart <= chromosome.length) {
					/* Draw top base pair value */
					var mb = Math.round(visibleStart / 10000) / 100;
					ZUI.processing.text(mb + " Mb", topTip.x + halfWidth + 10, 12);

					/* Draw clipped top */
					ZUI.processing.fill(ZUI.hexToColor(COLOR.WHITE));
					ZUI.processing.stroke(ZUI.hexToColor(COLOR.WHITE));
					ZUI.processing.triangle(topTip.x, 0, topTip.x + halfWidth + 2, 0, topTip.x + halfWidth + 2, halfWidth);
					ZUI.processing.triangle(topTip.x, 0, topTip.x - halfWidth - 2, 0, topTip.x - halfWidth - 2, halfWidth);
				}
			}
			else {
				/* Draw top base pair value */
				ZUI.processing.text(0 + " Mb", topTip.x + halfWidth + 10, topTip.y + 12);
			}
			ZUI.processing.fill(ZUI.hexToColor(COLOR.LIGHT_GREY));
			if (bottomTip.y > ZUI.height) {
				var bpPerPixel = chromosome.length / (Math.round(chromosome.viewObjects[0].attributes.screenHeight) - 1);
				visibleEnd = (ZUI.height - Math.ceil(chromosome.viewObjects[0].attributes.screenY)) * bpPerPixel + 1;
				if (visibleEnd >= 1) {
					/* Draw bottom base pair value */
					var mb = Math.round(visibleEnd / 10000) / 100;
					ZUI.processing.text(mb + " Mb", bottomTip.x + halfWidth + 10, ZUI.height - 2);

					/* Draw clipped bottom */
					ZUI.processing.fill(ZUI.hexToColor(COLOR.WHITE));
					ZUI.processing.stroke(ZUI.hexToColor(COLOR.WHITE));
					ZUI.processing.triangle(bottomTip.x, ZUI.height, bottomTip.x + halfWidth + 2, ZUI.height, bottomTip.x + halfWidth + 2, ZUI.height - halfWidth);
					ZUI.processing.triangle(bottomTip.x, ZUI.height, bottomTip.x - halfWidth - 2, ZUI.height, bottomTip.x - halfWidth - 2, ZUI.height - halfWidth);
				}
			}
			else {
				/* Draw bottom base pair value */
				var mb = Math.round(chromosome.length / 10000) / 100;
				ZUI.processing.text(mb + " Mb", bottomTip.x + halfWidth + 10, bottomTip.y - 2);
			}

			/* Draw mini chromosome at bottom right */
			if (visibleStart > 0 || visibleEnd < chromosome.length) {
				if (visibleStart > chromosome.length) visibleStart = chromosome.length;
				if (visibleEnd < 0) visibleEnd = 0;
				ZUI.processing.stroke(ZUI.hexToColor(COLOR.LIGHT_GREY));
				var y1 = ZUI.height / 2 - 50;
				var y2 = y1 + visibleStart / chromosome.length * 100;
				var y3 = y1 + visibleEnd / chromosome.length * 100;
				var y4 = y1 + 100;
				ZUI.processing.fill(ZUI.hexToColor(COLOR.WHITE));
				ZUI.processing.rect(bottomTip.x + halfWidth + 10, y1, 20, y2 - y1);
				ZUI.processing.rect(bottomTip.x + halfWidth + 10, y3 , 20, y4 - y3);
				ZUI.processing.fill(ZUI.hexToColor(COLOR.LIGHT_GREY));
				ZUI.processing.rect(bottomTip.x + halfWidth + 10, y2 , 20, y3 - y2);
			}
		}
	}

	/* Draw heat map */
	if (this.toggleHeatmap) {
		var heatmapData = [];
		var maximum = 0;
		for (n = 0; n < this.chromosomes.length; n++) {
			var chromosome = this.chromosomes[n];
			heatmapData.push({});
			heatmapData[n].binSize = chromosome.getBpPerPixel();
			heatmapData[n].numberOfBins = chromosome.viewObjects[0].screenHeight;
			//initialize bins
			heatmapData[n].bins = [];
			for (var m = 0; m < heatmapData[n].numberOfBins; m++) {
				heatmapData[n].bins.push(0);
			}
			for (m = 0; m < chromosome.genes.length; m++) {
				var gene = chromosome.genes[m];
				var startBin = Math.floor(gene.start / heatmapData[n].binSize);
				var endBin = Math.floor(gene.end / heatmapData[n].binSize);
				for (var o = startBin; o <= endBin; o++) {
					heatmapData[n].bins[o]++;
				}
			}
			heatmapData[n].startPixel = 0;
			if (chromosome.viewObjects[0].screenY < 0) heatmapData[n].startPixel -= Math.round(chromosome.viewObjects[0].screenY);
			heatmapData[n].endPixel = chromosome.viewObjects[0].screenHeight;
			if (chromosome.viewObjects[0].screenY + chromosome.viewObjects[0].screenHeight > ZUI.height) heatmapData[n].endPixel -= Math.round(chromosome.viewObjects[0].screenY + chromosome.viewObjects[0].screenHeight - ZUI.height);
			/* Get highest count */
			for (m = 0; m < heatmapData[n].bins.length; m++) {
				if (heatmapData[n].bins[m] > maximum) maximum = heatmapData[n].bins[m];
			}
		}
		for (n = 0; n < this.chromosomes.length; n++) {
			var chromosome = this.chromosomes[n];
			/* Normalize bin counts */
			for (var m = 0; m < heatmapData[n].bins.length; m++) {
				heatmapData[n].bins[m] = (maximum - heatmapData[n].bins[m]) / maximum;
			}
			/* Draw */
			var centerX1 = chromosome.viewObjects[0].screenX + chromosome.viewObjects[0].screenWidth / 8;
			var centerX2 = chromosome.viewObjects[0].screenX + chromosome.viewObjects[0].screenWidth / 8 * 7;
			for (m = heatmapData[n].startPixel; m < heatmapData[n].endPixel; m++) {
				var y = m + chromosome.viewObjects[0].screenY;
				ZUI.processing.fill(heatmapData[n].bins[m] * 255);
				ZUI.processing.stroke(heatmapData[n].bins[m] * 255);
				ZUI.processing.line(centerX1, y, centerX2, y);
			}
		}
	}

	/* Draw marked genes */ //TODO CHANGE
	for (n = 0; n < this.markedGenes.length; n++) {
		var gene = this.markedGenes[n].gene;
		var pixelsPerBp = 1 / gene.chromosome.getBpPerPixel();
		var x = gene.chromosome.viewObjects[1].attributes.screenX + gene.chromosome.viewObjects[1].attributes.screenWidth / 2;
		var y = Math.floor(gene.chromosome.viewObjects[0].attributes.screenY) + Math.floor((gene.start - 1) * pixelsPerBp) + 1;
		var height = Math.floor((gene.end - gene.start) * pixelsPerBp);
		var width = gene.chromosome.viewObjects[1].attributes.screenWidth * this.markedGenes[n].markerWidth;
		ZUI.processing.stroke(ZUI.hexToColor(this.markedGenes[n].markerColor));
		ZUI.processing.fill(ZUI.hexToColor(this.markedGenes[n].markerColor));
		ZUI.processing.rect(
			x - width / 2,
			y,
			width,
			height
		);

		/* Draw label */
		ZUI.processing.text(gene.agi, x - width / 2 - 70, y + height / 2 + 5);
		//TODO change this to a ZUI text object, so that its position and size can be tracked to allow for mouse interactions
	}

	/* If gene list is active */
	if (this.geneList.isActive) {
		/* Draw lines connecting gene list to chromosome if gene list is visible */
		ZUI.processing.stroke(ZUI.hexToColor(COLOR.LIGHT_GREY));
		ZUI.processing.strokeWeight(1);
		if (this.geneList.side == "left") {
			ZUI.processing.line(this.geneList.x + this.geneList.width + 19, this.geneList.y, this.geneList.x + this.geneList.width, this.geneList.y + this.geneList.yOffset + 1);
			ZUI.processing.line(this.geneList.x + this.geneList.width + 19, this.geneList.y, this.geneList.x + this.geneList.width, this.geneList.y + this.geneList.yOffset + this.geneList.height + 2);
		}
		else {
			ZUI.processing.line(this.geneList.x - 19, this.geneList.y, this.geneList.x, this.geneList.y + this.geneList.yOffset + 1);
			ZUI.processing.line(this.geneList.x - 19, this.geneList.y, this.geneList.x, this.geneList.y + this.geneList.yOffset + this.geneList.height + 2);
		}

		/* Draw horizontal marker on chromosome */
		ZUI.processing.stroke(ZUI.hexToColor(COLOR.DARK_GREY));
		if (this.geneList.side == "left") {
			ZUI.processing.line(this.geneList.x + this.geneList.width + 19, this.geneList.y, this.geneList.x + this.geneList.width + 30 + this.geneList.chromosome.viewObjects[1].screenWidth, this.geneList.y);
		}
		else {
			ZUI.processing.line(this.geneList.x - 30 - this.geneList.chromosome.viewObjects[1].attributes.screenWidth, this.geneList.y, this.geneList.x - 20, this.geneList.y);
		}

		/* Draw top and bottom base pair values for gene list */
		ZUI.processing.fill(ZUI.hexToColor(COLOR.DARK_GREY));
		ZUI.processing.textSize(10);
		ZUI.processing.text(ZUI.getNumberWithComma(Math.ceil(this.geneList.start)) + " bp", this.geneList.x, this.geneList.y + this.geneList.yOffset - 3);
		ZUI.processing.text(ZUI.getNumberWithComma(Math.floor(this.geneList.end)) + " bp", this.geneList.x, this.geneList.y + this.geneList.yOffset + this.geneList.height + 18);

		/* If annotation is also active */
		if (this.annotation.isActive && this.annotation.geneListItem != null) {
			/* Draw lines connecting gene list to chromosome if gene list is visible */
			ZUI.processing.stroke(ZUI.hexToColor(COLOR.LIGHT_GREY));
			ZUI.processing.strokeWeight(1);
			if (this.annotation.side == "left") {
				ZUI.processing.line(this.annotation.x + this.annotation.width + 24, this.annotation.y, this.annotation.x + this.annotation.width + 19, this.annotation.y);
				ZUI.processing.line(this.annotation.x + this.annotation.width + 19, this.annotation.y, this.annotation.x + this.annotation.width, this.annotation.y + this.annotation.yOffset + 1);
				ZUI.processing.line(this.annotation.x + this.annotation.width + 19, this.annotation.y, this.annotation.x + this.annotation.width, this.annotation.y + this.annotation.yOffset + this.annotation.height + 2);
			}
			else {
				ZUI.processing.line(this.annotation.x - 24, this.annotation.y, this.annotation.x - 19, this.annotation.y);
				ZUI.processing.line(this.annotation.x - 19, this.annotation.y, this.annotation.x, this.annotation.y + this.annotation.yOffset + 1);
				ZUI.processing.line(this.annotation.x - 19, this.annotation.y, this.annotation.x, this.annotation.y + this.annotation.yOffset + this.annotation.height + 2);
			}
		}
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


	/* Left drag behaviour */
	if (leftDown) {
		/* Move camera */
		ZUI.camera.x -= ZUI.camera.unprojectDistance(x - xLast);
		ZUI.camera.y -= ZUI.camera.unprojectDistance(y - yLast);
	}

	/* Default behaviour */
	else {
		/* Check whether to redraw gene list */
		if (!(this.geneList.isActive &&
		      y >= this.geneList.y + this.geneList.yOffset && y <= this.geneList.y + this.geneList.yOffset + this.geneList.height &&
		      ((this.geneList.side == "right" && x >= this.geneList.x - 25 && x <= this.geneList.x) || (this.geneList.side == "left" && x <= this.geneList.x + this.geneList.width + 25 && x >= this.geneList.x + this.geneList.width))) &&
		     !(this.geneList.isActive && this.annotation.isActive && this.annotation.geneListItem != null) &&
		    !this.geneList.isPinned) {
			/* Clear gene list */
			this.geneList.hide();

			/* Check whether mouse is on a chromosome */
			for (var n = 0; n < this.chromosomes.length; n++) {
				var chromosome = this.chromosomes[n];
				if (chromosome.isLoaded &&
				    x > chromosome.viewObjects[1].attributes.screenX - 2 && x < chromosome.viewObjects[1].attributes.screenX + chromosome.viewObjects[1].attributes.screenWidth + 2 &&
				    y >= Math.round(chromosome.viewObjects[0].attributes.screenY) && y < Math.round(chromosome.viewObjects[0].attributes.screenY) + Math.round(chromosome.viewObjects[0].attributes.screenHeight)) {
					/* Translate screen position to chromosome position */
					var bpPerPixel = chromosome.getBpPerPixel();
					start = (y - Math.round(chromosome.viewObjects[0].attributes.screenY)) * bpPerPixel + 1;
					end = start + bpPerPixel;
					if (end > chromosome.length) end = chromosome.length;

					/* Populate gene list */
					this.geneList.populate(chromosome, start, end);

					/* Show gene list */
					this.geneList.show();

					/* Stop searching chromosomes */
					break;
				}
			}
		}

		/* Check whether to clear annotation */
		if (!(this.annotation.isActive &&
		      y >= this.annotation.y + this.annotation.yOffset && y <= this.annotation.y + this.annotation.yOffset + this.annotation.height &&
		      ((this.annotation.side == "right" && x >= this.annotation.x - 25 && x <= this.annotation.x) || (this.annotation.side == "left" && x <= this.annotation.x + this.annotation.width + 25 && x >= this.annotation.x + this.annotation.width))) &&
		    !this.annotation.isPinned) {
			/* Clear annotation */
			this.annotation.hide();
		}
	}
};

/* Override leftClick */
ChromosomeView.prototype.leftClick = function() {
	/* Get mouse status */
	var x = ZUI.mouseStatus.x;
	var y = ZUI.mouseStatus.y;

	/* Pin gene list if it is active and not pinned */
	if (this.geneList.isActive && !this.geneList.isPinned) {
		this.geneList.isPinned = true;
	}
	/* Unpin otherwise */
	else {
		this.geneList.isPinned = false;
		this.annotation.isPinned = false;
	}
};

/* Override leftDoubleClick */
ChromosomeView.prototype.leftDoubleClick = function() {
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

/* GeneList class constructor */
ChromosomeView.GeneList = function(annotation) {
	/* Handle to annotation */
	this.annotation = annotation;;

	this.side = null;

	/* Array of genes */
	this.items = [];

	/* Corresponding chromosome region */
	this.chromosome = null;
	this.start = null;
	this.end = null;

	/* Position */
	this.x = null;
	this.y = null;
	this.yOffset = null;
	this.height = null;
	this.width = 192;

	/* Whether gene list is active */
	this.isActive = false;

	/* Whether gene list is pinned */
	this.isPinned = false;

	/* Create HTML element */
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.left = "0px";
	this.element.style.top = "0px";
	this.element.style.width = "180px";
	this.element.style.padding = "5px";
	this.element.style.borderStyle = "solid";
	this.element.style.borderWidth = "1px";
	this.element.style.borderColor = COLOR.LIGHT_GREY;
	this.element.style.backgroundColor = COLOR.WHITE;
	this.element.style.boxShadow = "0 3px 5px 2px " + COLOR.MED_GREY;
	this.element.style.overflow = "auto";
	this.element.style.visibility = "hidden";
};

	/* Makes gene list visible */
	ChromosomeView.GeneList.prototype.show = function() {
		this.element.style.visibility = "visible";
		this.isActive = true;
	};

	/* Hides gene list and clears content */
	ChromosomeView.GeneList.prototype.hide = function() {
		this.element.style.visibility = "hidden";
		this.element.innerHTML = "";
		this.items = [];
		this.chromosome = null;
		this.start = null;
		this.end = null;
		this.isActive = false;
	};

	/* Populates gene list with genes in the specified chromosome between the specified start and end base pair positions */
	ChromosomeView.GeneList.prototype.populate = function(chromosome, start, end) {
		this.chromosome = chromosome;
		this.start = start;
		this.end = end;

		/* Get genes and add them to list */
		for (var n = 0; n < this.chromosome.genes.length; n++) {
			var gene = this.chromosome.genes[n];
			if (gene.start >= this.start && gene.start < this.end ||
			    gene.end >= this.start && gene.end < this.end ||
			    gene.start < this.start && gene.end >= this.end) {
				this.items.push(new ChromosomeView.GeneList.Item(gene, this));
			}
		}

		/* Set list size */
		this.height = this.items.length * 18 + 10;
		if (this.height > 200) this.height = 200;
		this.element.style.height = (this.height - 10) + "px";

		/* Set list position */
		this.x = this.chromosome.viewObjects[1].attributes.screenX + this.chromosome.viewObjects[1].attributes.screenWidth / 2;
		var xOffset = this.chromosome.viewObjects[1].attributes.screenWidth / 2 + 25;
		if (this.x > ZUI.width / 2) {
			this.x -= xOffset + this.width;
			this.side = "left";
		}
		else {
			this.x += xOffset;
			this.side = "right";
		}
		this.y = (this.start + this.end) / 2 / this.chromosome.length * (chromosome.viewObjects[0].attributes.screenHeight) + this.chromosome.viewObjects[0].attributes.screenY;
		this.yOffset = -this.height * 0.3;
		this.element.style.left = this.x + "px";
		this.element.style.top = (this.y + this.yOffset) + "px";
	};

	/* GeneList Item class constructor */
	ChromosomeView.GeneList.Item = function(gene, geneList) {
		/* Store gene reference */
		this.gene = gene;
		this.geneList = geneList;

		/* Create HTML element */
		this.element = document.createElement("span");
		this.element.style.cursor = "default";
		this.element.style.fontFamily = "Helvetica";
		this.element.style.fontSize = "14px";
		this.element.style.lineHeight = "18px";
		this.element.style.color = COLOR.DARK_GREY;
		this.element.style.display = "block";
		this.element.style.textIndent = "-10px";
		this.element.style.paddingLeft = "10px";
		this.element.style.whiteSpace = "nowrap";
		this.element.style.overflow = "hidden";
		this.element.style.textOverflow = "ellipsis";

		/* Mouse over event handler */
		this.element.onmouseover = $.proxy(function() {
			/* Populate annotation if not pinned */
			if (!geneList.annotation.isPinned) {
				/* Clear annotation if applicable */
				if (geneList.annotation.isActive) {
					geneList.annotation.hide();
				}

				/* Change style */
				this.element.style.backgroundColor = COLOR.DARK_GREY;
				this.element.style.color = COLOR.WHITE;

				/* Populate annotation */
				geneList.annotation.populate(this.gene, this);

				/* Set annotation position */
				geneList.annotation.side = geneList.side;
				if (geneList.annotation.side == "left") {
					geneList.annotation.x = geneList.x - 25 - geneList.annotation.width;
				}
				else {
					geneList.annotation.x = geneList.x + geneList.width + 25;
				}
				geneList.annotation.y = this.element.offsetTop + geneList.element.offsetTop - geneList.element.scrollTop + this.element.offsetHeight / 2;
				geneList.annotation.yOffset = -geneList.annotation.height * 0.3;
				geneList.annotation.element.style.left = geneList.annotation.x + "px";
				geneList.annotation.element.style.top = (geneList.annotation.y + geneList.annotation.yOffset) + "px";

				/* Show annotation */
				geneList.annotation.show();
			}
		}, this);

		/* Mouse out event handler */
		this.element.onmouseout = $.proxy(function() {
			if (!geneList.annotation.isActive) {
				/* Change style */
				this.element.style.backgroundColor = COLOR.WHITE;
				this.element.style.color = COLOR.DARK_GREY;
			}
		}, this);

		/* Mouse click event handler */
		this.element.onclick = $.proxy(function() {
			/* Pin annotation if active and not pinned */
			if (this.geneList.annotation.isActive && !this.geneList.annotation.isPinned) {
				this.geneList.annotation.isPinned = true;
			}
			/* Unpin otherwise */
			else {
				this.geneList.annotation.isPinned = false;
			}
		}, this);

		/* Set AGI and alias as label */
		this.element.textContent = this.gene.agi;
		if (this.gene.aliases.length > 0) {
			this.element.textContent += " / " + this.gene.aliases.join(", ");
		}

		geneList.element.appendChild(this.element);
	};

/* Annotation class constructor */
ChromosomeView.Annotation = function(markedGenes) {
	/* Marked genes */
	this.markedGenes = markedGenes;

	this.side = null;

	/* Gene */
	this.gene = null;

	/* Reference to gene list item associated with the annotation */
	this.geneListItem = null;

	/* Position */
	this.x = null;
	this.y = null;
	this.yOffset = null;
	this.height = 210;
	this.width = 352;

	/* Whether annotation is active */
	this.isActive = false;

	/* Whether annotation is pinned */
	this.isPinned = false;

	/* Create HTML element */
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.left = "0px";
	this.element.style.top = "0px";
	this.element.style.width = "350px";
	this.element.style.height = "210px";
	this.element.style.borderStyle = "solid";
	this.element.style.borderWidth = "1px";
	this.element.style.borderColor = COLOR.LIGHT_GREY;
	this.element.style.backgroundColor = COLOR.WHITE;
	this.element.style.boxShadow = "0 3px 5px 2px " + COLOR.MED_GREY;
	this.element.style.visibility = "hidden";

	/* Create content HTML element for text */
	this.contentElement = document.createElement("div");
	this.contentElement.style.height = "110px";
	this.contentElement.style.padding = "5px";
	this.contentElement.style.backgroundColor = COLOR.WHITE;
	this.contentElement.style.overflow = "auto";
	this.element.appendChild(this.contentElement);

		/* Create span element for identifier */
		this.identifierElement = document.createElement("span");
		this.identifierElement.style.fontFamily = "Helvetica";
		this.identifierElement.style.fontSize = "14px";
		this.identifierElement.style.display = "block";
		this.identifierElement.style.textIndent = "-75px";
		this.identifierElement.style.paddingLeft = "75px";
		this.contentElement.appendChild(this.identifierElement);

		/* Create span element for aliases */
		this.aliasElement = document.createElement("span");
		this.aliasElement.style.fontFamily = "Helvetica";
		this.aliasElement.style.fontSize = "14px";
		this.aliasElement.style.display = "block";
		this.aliasElement.style.textIndent = "-75px";
		this.aliasElement.style.paddingLeft = "75px";
		this.contentElement.appendChild(this.aliasElement);

		/* Create span element for annotation */
		this.annotationElement = document.createElement("span");
		this.annotationElement.style.fontFamily = "Helvetica";
		this.annotationElement.style.fontSize = "14px";
		this.annotationElement.style.display = "block";
		this.annotationElement.style.textIndent = "-75px";
		this.annotationElement.style.paddingLeft = "75px";
		this.contentElement.appendChild(this.annotationElement);

	/* Create controls HTML element for buttons */
	this.controlElement = document.createElement("div");
	this.controlElement.style.padding = "5px";
	this.controlElement.style.backgroundColor = COLOR.WHITE;
	this.element.appendChild(this.controlElement);

		/* Create button for getting data */
		this.getDataElement = document.createElement("input");
		this.getDataElement.type = "button";
		this.getDataElement.className = "button";
		this.getDataElement.value = "Get Data";
		for (var n = 0; n < this.markedGenes.length; n++) {	//Disable button if data already loaded
			if (this.markedGenes[n].gene == this.gene) {
				this.getDataElement.disabled = true;
				break;
			}
		}
		this.getDataElement.onclick = $.proxy(function() {
			/* Add gene to marked genes with default width */
			this.markedGenes.push(new ChromosomeView.MarkedGene(this.gene, 2.0, COLOR.LIGHT_GREY));
		}, this);
		this.controlElement.appendChild(this.getDataElement);

		/* Create button for dropping gene */
		this.dropGeneElement = document.createElement("input");
		this.dropGeneElement.type = "button";
		this.dropGeneElement.className = "button";
		this.dropGeneElement.value = "Drop Gene";
		this.dropGeneElement.onclick = function() {
		};
		this.controlElement.appendChild(this.dropGeneElement);

		/* Create button for top 50 similar */
		this.top50Element = document.createElement("input");
		this.top50Element.type = "button";
		this.top50Element.className = "button";
		this.top50Element.value = "Top 50 Similar";
		this.top50Element.onclick = function() {
		};
		this.controlElement.appendChild(this.top50Element);

	/* Create loading HTML element for loading status */
	this.loadingElement = document.createElement("div");
	this.controlElement.style.backgroundColor = COLOR.WHITE;
	this.element.appendChild(this.loadingElement);
		/* Create loading view elements */
		this.loadingViewElements = [];
		var loadingViewElement;

		/* World EFP */
		loadingViewElement = document.createElement("img");
		loadingViewElement.src = "img/available/worldEFP.png";
		loadingViewElement.style.width = "40px";
		loadingViewElement.style.height = "40px";
		loadingViewElement.style.margin = "5px";
		this.loadingViewElements.push(loadingViewElement);
		this.loadingElement.appendChild(loadingViewElement);

		/* Plant EFP */
		loadingViewElement = document.createElement("img");
		loadingViewElement.src = "img/available/plantEFP.png";
		loadingViewElement.style.width = "40px";
		loadingViewElement.style.height = "40px";
		loadingViewElement.style.margin = "5px";
		this.loadingViewElements.push(loadingViewElement);
		this.loadingElement.appendChild(loadingViewElement);

		/* Cell EFP */
		loadingViewElement = document.createElement("img");
		loadingViewElement.src = "img/available/cellEFP.png";
		loadingViewElement.style.width = "40px";
		loadingViewElement.style.height = "40px";
		loadingViewElement.style.margin = "5px";
		this.loadingViewElements.push(loadingViewElement);
		this.loadingElement.appendChild(loadingViewElement);

		/* Cytoscape */
		loadingViewElement = document.createElement("img");
		loadingViewElement.src = "img/available/cytoscape.png";
		loadingViewElement.style.width = "40px";
		loadingViewElement.style.height = "40px";
		loadingViewElement.style.margin = "5px";
		this.loadingViewElements.push(loadingViewElement);
		this.loadingElement.appendChild(loadingViewElement);

		/* Reactome */
		loadingViewElement = document.createElement("img");
		loadingViewElement.src = "img/available/reactome.png";
		loadingViewElement.style.width = "40px";
		loadingViewElement.style.height = "40px";
		loadingViewElement.style.margin = "5px";
		this.loadingViewElements.push(loadingViewElement);
		this.loadingElement.appendChild(loadingViewElement);

		/* JSmol */
		loadingViewElement = document.createElement("img");
		loadingViewElement.src = "img/available/JSmol.png";
		loadingViewElement.style.width = "40px";
		loadingViewElement.style.height = "40px";
		loadingViewElement.style.margin = "5px";
		this.loadingViewElements.push(loadingViewElement);
		this.loadingElement.appendChild(loadingViewElement);

		/* Tracks */
		loadingViewElement = document.createElement("img");
		loadingViewElement.src = "img/available/tracks.png";
		loadingViewElement.style.width = "40px";
		loadingViewElement.style.height = "40px";
		loadingViewElement.style.margin = "5px";
		this.loadingViewElements.push(loadingViewElement);
		this.loadingElement.appendChild(loadingViewElement);
};

	/* Makes annotation visible */
	ChromosomeView.Annotation.prototype.show = function() {
		this.element.style.visibility = "visible";
		this.isActive = true;
	};

	/* Clear and hide annotation */
	ChromosomeView.Annotation.prototype.hide = function() {
		/* Disable highlight on gene list item, if applicable */
		if (this.geneListItem != null) {
			this.geneListItem.element.style.backgroundColor = COLOR.WHITE;
			this.geneListItem.element.style.color = COLOR.DARK_GREY;
		}

		this.element.style.visibility = "hidden";
		this.identifierElement.innerHTML = "";
		this.aliasElement.innerHTML = "";
		this.annotationElement.innerHTML = "";
		this.gene = null;
		this.geneListItem = null;
		this.isActive = false;
	};

	/* Populate annotation with annotation of the specified gene */
	ChromosomeView.Annotation.prototype.populate = function(gene, geneListItem) {
		this.gene = gene;
		this.geneListItem = geneListItem;

		/* Populate with annotation */
		this.identifierElement.innerHTML = "<label>Identifier:</label> &nbsp&nbsp&nbsp&nbsp" + this.gene.agi + "<br>";
		this.aliasElement.innerHTML = "<label>Aliases:</label> &nbsp&nbsp&nbsp&nbsp&nbsp" + (this.gene.aliases.join(", ") || "Not available") + "<br>";
		if (gene.annotation != null) {
			this.annotationElement.innerHTML = "<label>Annotation:</label> " + (gene.annotation || "Not available");
		}
		else {
			/* Query annotation if not available */
			$.ajax({
				type: "GET",
				url: "http://bar.utoronto.ca/webservices/agiToAnnot.php?request={\"agi\":\"" + this.gene.agi + "\"}",
				dataType: "json"
			}).done($.proxy(function(response) {
				if (this.geneList.annotation.gene != null && this.geneList.annotation.gene.annotation == null) {
					var annotation = response.split("__");
					this.gene.annotation = annotation[1] || annotation[0];
					if (this.geneList.annotation.gene == this.gene) {
						this.geneList.annotation.annotationElement.innerHTML = "<label>Annotation:</label> " + (this.geneList.annotation.gene.annotation || "Not available");
					}
				}
			}, geneListItem));
		}
	};

/* Chromosome class constructor */
ChromosomeView.Chromosome = function(name, length, centromeres, index) {
	/* Name of chromosome */
	this.name = name;

	/* Length of chromosome in base pairs */
	this.length = length;

	/* Centromere position */
	this.centromeres = centromeres;

	/* Parent view */
	this.index = index;

	/* Array of genes */
	this.genes = [];

	/* Whether data are loaded */
	this.isLoaded = false;

	/* View object */
	this.viewObjects = [];
	this.viewObjects.push(new ZUI.ViewObject(		//centromere layer
		ZUI.ViewObject.Type.ROUNDED_RECT,
		{
			x : -298 + index * 120,
			y : -250,
			width : 6,
			height : this.length * 0.000015,
			radius: 3,
		}
	));
	var start = 0;
	for (var n = 0; n < this.centromeres.length; n++) {		//non-centromere layer pieces
		this.viewObjects.push(new ZUI.ViewObject(
			ZUI.ViewObject.Type.ROUNDED_RECT,
			{
				x : -300 + index * 120,
				y : -250 + start * 0.000015,
				width : 10,
				height : (this.centromeres[n].start - start) * 0.000015,
				radius : 5,
			}
		));
		start = this.centromeres[n].end;
	}
	this.viewObjects.push(new ZUI.ViewObject(		//bottom piece
		ZUI.ViewObject.Type.ROUNDED_RECT,
		{
			x : -300 + index * 120,
			y : -250 + start * 0.000015,
			width : 10,
			height : (this.length - start) * 0.000015,
			radius : 5,
		}
	));
};

	/* Calculates and returns the number of base pairs per pixel */
	ChromosomeView.Chromosome.prototype.getBpPerPixel = function() {
		return (this.length - 1) / (this.viewObjects[0].screenHeight);
	};

	/* Centromere class constructor */
	ChromosomeView.Chromosome.Centromere = function(start, end) {
		this.start = start;
		this.end = end;
	};

	/* Gene class constructor */
	ChromosomeView.Chromosome.Gene = function(agi, aliases, start, end, chromosome) {
		/* AGI identifier */
		this.agi = agi;

		/* Alias */
		this.aliases = aliases;

		/* Start base pair position on chromosome */
		this.start = start;

		/* End base pair position on chromosome */
		this.end = end;

		/* Parent chromosome */
		this.chromosome = chromosome;

		/* Gene annotation */
		this.annotation = null;
	};

/* MarkedGene class constructor */
ChromosomeView.MarkedGene = function(gene, markerWidth, markerColor) {
	this.gene = gene;
	this.markerWidth = markerWidth;
	this.markerColor = markerColor;
};
