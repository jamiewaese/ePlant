/**
 * Chromosome View class
 * UI design by Jamie Waese
 * Code by Hans Yu
 */

/* Constructor */
function ChromosomeView() {
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
	/* Append gene list HTML element to view */
	ZUI.container.appendChild(this.geneList.element);

	/* Append annotation HTML element to view */
	ZUI.container.appendChild(this.annotation.element);
};

/* Override inactive */
ChromosomeView.prototype.inactive = function() {
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
			ZUI.processing.noStroke();
			for (var m = 0; m < chromosome.viewObjects.length; m++) {
				ZUI.drawViewObject(chromosome.viewObjects[m]);
			}

			/* Draw heat map */
/*			var bpPerPixel = chromosome.length / (Math.round(chromosome.viewObjects[0].attributes.screenHeight) - 1);
			var center = chromosome.viewObjects[1].attributes.screenX + chromosome.viewObjects[1].attributes.screenWidth / 2;
			var y = Math.floor(chromosome.viewObjects[0].attributes.screenY) + 1;
			if (y < 0) {
				y = 0;
			}
			for (var m = bpPerPixel + 1; m < chromosome.length; m += bpPerPixel) {
				//check if pixel is in tip or centromere
					//if true then calculate width
					//else use regular width
				var geneCount = 0;
				var _start = m - bpPerPixel;
				for (var i = 0; i < chromosome.genes.length; i++) {
					var gene = chromosome.genes[i];
					if (gene.start > _start && gene.start < m ||
					    gene.end > _start && gene.end < m) {
						geneCount ++;
					}
				}
				ZUI.processing.fill(255 - geneCount * 7);
				ZUI.processing.stroke(255 - geneCount * 7);
				ZUI.processing.rect(center - 3, y, 6, 1);
				y += 1;
			}*/
			//calculate bpPerPixel and use as bin size
			//calculate number of bins and create array of that size
			//for each gene
				//calculate Math.floor(gene.start / binSize) as start, Math.floor(gene.end / binSize) as end
				//loop through bin index start -> end
					//add bin count by one
			//draw heatmap based on bin counts
			var binSize = chromosome.getBpPerPixel();
			var numberOfBins = chromosome.viewObjects[0].screenHeight;
			var centerX1 = chromosome.viewObjects[0].screenX + chromosome.viewObjects[0].screenWidth / 4;
			var centerX2 = chromosome.viewObjects[0].screenX + chromosome.viewObjects[0].screenWidth / 4 * 3;
			//initialize bins
			var bins = [];
			for (var m = 0; m < numberOfBins; m++) {
				bins.push(0);
			}
			for (m = 0; m < chromosome.genes.length; m++) {
				var gene = chromosome.genes[m];
				var startBin = Math.floor(gene.start / binSize);
				var endBin = Math.floor(gene.end / binSize);
				for (var o = startBin; o <= endBin; o++) {
					bins[o]++;
				}
			}
			var startPixel = 0;
			if (chromosome.viewObjects[0].screenY < 0) startPixel -= Math.round(chromosome.viewObjects[0].screenY);
			var endPixel = chromosome.viewObjects[0].screenHeight;
			if (chromosome.viewObjects[0].screenY + chromosome.viewObjects[0].screenHeight > ZUI.height) endPixel -= Math.round(chromosome.viewObjects[0].screenY + chromosome.viewObjects[0].screenHeight - ZUI.height);
			/* Get highest count */
			var maximum = 0;
			for (m = 0; m < bins.length; m++) {
				if (bins[m] > maximum) maximum = bins[m];
			}
			/* Normalize bin counts */
			for (m = 0; m < bins.length; m++) {
				bins[m] = (maximum - bins[m]) / maximum;
			}
			for (m = startPixel; m < endPixel; m++) {
				var y = m + chromosome.viewObjects[0].screenY;
				ZUI.processing.fill(bins[m] * 255);
				ZUI.processing.stroke(bins[m] * 255);
				ZUI.processing.line(centerX1, y, centerX2, y);
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
					ZUI.processing.triangle(topTip.x, 0, topTip.x + halfWidth + 1, 0, topTip.x + halfWidth + 1, halfWidth);
					ZUI.processing.triangle(topTip.x, 0, topTip.x - halfWidth - 1, 0, topTip.x - halfWidth - 1, halfWidth);
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
					ZUI.processing.triangle(bottomTip.x, ZUI.height, bottomTip.x + halfWidth + 1, ZUI.height, bottomTip.x + halfWidth + 1, ZUI.height - halfWidth);
					ZUI.processing.triangle(bottomTip.x, ZUI.height, bottomTip.x - halfWidth - 1, ZUI.height, bottomTip.x - halfWidth - 1, ZUI.height - halfWidth);
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

	/* Draw marked genes */
	for (n = 0; n < this.markedGenes.length; n++) {
		var gene = this.markedGenes[n];
		var pixelsPerBp = gene.chromosome.viewObjects[0].attributes.screenHeight / gene.chromosome.length;
		var lineX = gene.chromosome.viewObjects[1].attributes.screenX - 5;
		var lineY = Math.floor(gene.chromosome.viewObjects[0].attributes.screenY + (Number(gene.start) + Number(gene.end)) / 2 * pixelsPerBp) + 1;
		var lineWidth = gene.chromosome.viewObjects[1].attributes.screenWidth + 10;
		ZUI.processing.stroke(ZUI.hexToColor(COLOR.LIGHT_GREY));
		ZUI.processing.strokeWeight(1);
		ZUI.processing.line(
			lineX,
			lineY,
			lineX + lineWidth,
			lineY
		);

		/* Draw label */
		ZUI.processing.text(gene.agi, lineX - 67, lineY + 5);
		//TODO change this to a ZUI text object, so that its position and size can be tracked to allow for mouse interactions
	}

	/* If gene list is active */
	if (this.geneList.isActive) {
		/* Draw lines connecting gene list to chromosome if gene list is visible */
		ZUI.processing.stroke(ZUI.hexToColor(COLOR.LIGHT_GREY));
		ZUI.processing.strokeWeight(1);
		ZUI.processing.line(this.geneList.x - 19, this.geneList.y, this.geneList.x, this.geneList.y + this.geneList.yOffset + 1);
		ZUI.processing.line(this.geneList.x - 19, this.geneList.y, this.geneList.x, this.geneList.y + this.geneList.yOffset + this.geneList.height + 2);

		/* Draw horizontal marker on chromosome */
		ZUI.processing.stroke(ZUI.hexToColor(COLOR.DARK_GREY));
		ZUI.processing.line(this.geneList.x - 30 - this.geneList.chromosome.viewObjects[1].attributes.screenWidth, this.geneList.y, this.geneList.x - 20, this.geneList.y);

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
			ZUI.processing.line(this.annotation.x - 24, this.annotation.y, this.annotation.x - 19, this.annotation.y);
			ZUI.processing.line(this.annotation.x - 19, this.annotation.y, this.annotation.x, this.annotation.y + this.annotation.yOffset + 1);
			ZUI.processing.line(this.annotation.x - 19, this.annotation.y, this.annotation.x, this.annotation.y + this.annotation.yOffset + this.annotation.height + 2);
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
		      x >= this.geneList.x - 25 && x <= this.geneList.x) &&
		     !(this.geneList.isActive && this.annotation.isActive && this.annotation.geneListItem != null)) {
			/* Clear gene list */
			this.geneList.hide();

			/* Check whether mouse is on a chromosome */
			for (var n = 0; n < this.chromosomes.length; n++) {
				var chromosome = this.chromosomes[n];
				if (chromosome.isLoaded &&
				    x > chromosome.viewObjects[1].attributes.screenX - 2 && x < chromosome.viewObjects[1].attributes.screenX + chromosome.viewObjects[1].attributes.screenWidth + 2 &&
				    y > Math.floor(chromosome.viewObjects[0].attributes.screenY) && y < Math.floor(chromosome.viewObjects[0].attributes.screenY) + Math.round(chromosome.viewObjects[0].attributes.screenHeight)) {
					/* Translate screen position to chromosome position */
					var bpPerPixel = chromosome.length / (Math.round(chromosome.viewObjects[0].attributes.screenHeight) - 1);
					start = (y - Math.floor(chromosome.viewObjects[0].attributes.screenY) - 1) * bpPerPixel;
					if (start < 1) start = 1;
					end = start + bpPerPixel;
					if (start > chromosome.length) start = chromosome.length;

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
		      x >= this.annotation.x - 25 && x <= this.annotation.x)) {
			/* Clear annotation */
			this.annotation.hide();
		}
	}
};

/* Override leftDoubleClick */
ChromosomeView.prototype.leftDoubleClick = function() {
	/* Get mouse status */
	var x = ZUI.mouseStatus.x;
	var y = ZUI.mouseStatus.y;

	/* Move to clicked position */
	var point = ZUI.camera.unprojectPoint(x, y);
	ZUI.camera.x = point.x;
	ZUI.camera.y = point.y;
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

	/* Whether gene list is active */
	this.isActive = false;

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
			if (gene.start >= this.start && gene.start <= this.end ||
			    gene.end >= this.start && gene.end <= this.end ||
			    gene.start <= this.start && gene.end >= this.end) {
				this.items.push(new ChromosomeView.GeneList.Item(gene, this));
			}
		}

		/* Set list size */
		this.height = this.items.length * 18 + 10;
		if (this.height > 200) this.height = 200;
		this.element.style.height = (this.height - 10) + "px";

		/* Set list position */
		this.x = this.chromosome.viewObjects[1].attributes.screenX + this.chromosome.viewObjects[1].attributes.screenWidth + 25;
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
		this.element.style.width = geneList.innerWidth;
		this.element.style.whiteSpace = "nowrap";
		this.element.style.overflow = "hidden";
		this.element.style.textOverflow = "ellipsis";

		/* Mouse over event handler */
		this.element.onmouseover = $.proxy(function() {
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
			geneList.annotation.x = geneList.x + 217;
			geneList.annotation.y = this.element.offsetTop + geneList.element.offsetTop + this.element.offsetHeight / 2;
			geneList.annotation.yOffset = -70 * 0.3;
			geneList.annotation.height = 70;
			geneList.annotation.element.style.left = geneList.annotation.x + "px";
			geneList.annotation.element.style.top = (geneList.annotation.y + geneList.annotation.yOffset) + "px";
			geneList.annotation.contentElement.style.height = geneList.annotation.height + "px";
			geneList.annotation.element.style.height = (geneList.annotation.height + 35) + "px";

			/* Show annotation */
			geneList.annotation.show();
		}, this);

		/* Mouse out event handler */
		this.element.onmouseout = $.proxy(function() {
			if (!geneList.annotation.isActive) {
				/* Change style */
				this.element.style.backgroundColor = COLOR.WHITE;
				this.element.style.color = COLOR.DARK_GREY;
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

	/* Gene */
	this.gene = null;

	/* Reference to gene list item associated with the annotation */
	this.geneListItem = null;

	/* Position */
	this.x = null;
	this.y = null;
	this.yOffset = null;
	this.height = null;

	/* Whether annotation is active */
	this.isActive = false;

	/* Create HTML element */
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.left = "0px";
	this.element.style.top = "0px";
	this.element.style.width = "350px";
	this.element.style.height = "105px";
	this.element.style.borderStyle = "solid";
	this.element.style.borderWidth = "1px";
	this.element.style.borderColor = COLOR.LIGHT_GREY;
	this.element.style.backgroundColor = COLOR.WHITE;
	this.element.style.boxShadow = "0 3px 5px 2px " + COLOR.MED_GREY;
	this.element.style.visibility = "hidden";

	/* Create content HTML element for text */
	this.contentElement = document.createElement("div");
	this.contentElement.style.width = this.element.innerWidth;
	this.contentElement.style.height = "70px";
	this.contentElement.style.padding = "5px";
	this.contentElement.style.backgroundColor = COLOR.WHITE;
	this.contentElement.style.fontFamily = "Helvetica";
	this.contentElement.style.fontSize = "14px";
	this.contentElement.style.overflow = "auto";
	this.element.appendChild(this.contentElement);

	/* Create buttons */
	this.markElement = document.createElement("span");
	this.markElement.style.width = "75px";
	this.markElement.style.padding = "1px";
	this.markElement.style.margin = "4px";
	this.markElement.style.display = "block";
	this.markElement.style.cursor = "default";
	this.markElement.style.fontFamily = "Helvetica";
	this.markElement.style.textAlign = "center";
	this.markElement.style.fontSize = "12px";
	this.markElement.style.borderStyle = "solid";
	this.markElement.style.borderWidth = "1px";
	this.markElement.style.borderRadius = "5px";
	this.markElement.style.borderColor = COLOR.MED_GREY;
	this.markElement.style.color = COLOR.MED_GREY;
	this.markElement.style.backgroundColor = COLOR.LIGHT_GREY;
	this.markElement.textContent = "Mark";
	this.markElement.onmouseover = $.proxy(function() {
		this.markElement.style.backgroundColor = COLOR.MED_GREY;
		this.markElement.style.color = COLOR.LIGHT_GREY;
	}, this);
	this.markElement.onmouseout = $.proxy(function() {
		this.markElement.style.backgroundColor = COLOR.LIGHT_GREY;
		this.markElement.style.color = COLOR.MED_GREY;
	}, this);
	this.markElement.onclick = $.proxy(function() {
		this.markedGenes.push(this.gene);
	}, this);
	this.element.appendChild(this.markElement);
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
		this.contentElement.innerHTML = "";
		this.gene = null;
		this.geneListItem = null;
		this.isActive = false;
	};

	/* Populate annotation with annotation of the specified gene */
	ChromosomeView.Annotation.prototype.populate = function(gene, geneListItem) {
		this.gene = gene;
		this.geneListItem = geneListItem;

		/* Populate with annotation */
		this.contentElement.innerHTML = "<b>Identifier:</b> " + this.gene.agi + "<br><b>Aliases:</b> " + this.gene.aliases.join(", ");
		if (gene.annotation != null) {
			this.contentElement.innerHTML += "<br><b>Annotation</b>: " + gene.annotation;
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
						this.geneList.annotation.contentElement.innerHTML += "<br><b>Annotation</b>: " + this.geneList.annotation.gene.annotation;
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
		ZUI.ViewObject.Shape.ROUNDED_RECT,
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
			ZUI.ViewObject.Shape.ROUNDED_RECT,
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
		ZUI.ViewObject.Shape.ROUNDED_RECT,
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
