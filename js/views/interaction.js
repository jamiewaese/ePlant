/**
 * Interaction View class
 * UI design by Jamie Waese
 * Code by Hans Yu
 * Uses Cytoscape.js http://cytoscape.github.io/cytoscape.js/
 */

function InteractionView(gene) {
	/* Store gene identifier */
	this.gene = gene;

	/* Create Cytoscape container element */
	this.cytoscapeElement = document.getElementById("Cytoscape_container");

	/* Cytoscape object */
	this.cy = null;

	/* Annotation popup */
	this.nodePopup = null;
	this.edgePopup = null;

	/* Data status */
	this.isDataReady = false;

	this.mouseFramesIdle = 0;							// Number of frames that the mouse stays idle

	/* Configure Cytoscape */
	this.cytoscapeConf = {};
	this.cytoscapeConf.layout = {
		name: "grid",
		fit: false
	};
	this.cytoscapeConf.style = cytoscape.stylesheet()
		.selector("node")
			.css({
				"shape": "circle",
				"width": "mapData(100, 40, 80, 20, 60)",
				"content": "data(id)",
				"color": "data(color)",
				"background-color": "data(color)"
			})
		.selector("edge")
			.css({
				"width": "1",
				"line-color": "data(color)"
			})
		.selector("node:selected")
			.css({
			})
		.selector("node.highlight")
			.css({
				"border-width": "3",
				"border-color": Eplant.Color.DarkGrey
			})
		.selector("edge.highlight")
			.css({
				"width": "2",
				"line-color": Eplant.Color.DarkGrey
			})
	;
	this.cytoscapeConf.elements = {
		nodes: [],
		edges: []
	};
	this.cytoscapeConf.ready = $.proxy(function() {
		/* Save Cytoscape handle */
		this.cy = $(this.cytoscapeElement).cytoscape("get");

		/* Set user input behaviours */
		this.cy.on("mouseover", "node", $.proxy(function(event) {
			ZUI.container.style.cursor = "pointer";
			var node = event.cyTarget;
			node.addClass("highlight");
			if (this.nodePopup == null) {
				this.nodePopup = new InteractionView.NodePopup(this, node.data("id"));
				this.nodePopup.source = node;
				var position = ZUI.camera.projectPoint(node.position().x - ZUI.width / 2, node.position().y - ZUI.height / 2);
				if (position.x > ZUI.width / 2) {
					this.nodePopup.setPosition(position.x, position.y, null, null, null, null, "left");
				}
				else {
					this.nodePopup.setPosition(position.x, position.y, null, null, null, null, "right");
				}
			}
		}, this));
		this.cy.on("mouseout", "node", $.proxy(function(event) {
			ZUI.container.style.cursor = "default";
			var node = event.cyTarget;
			if (!node.selected()) {
				node.removeClass("highlight");
				if (this.nodePopup != null && this.nodePopup.source == node) {
					this.nodePopup.remove();
					this.nodePopup = null;
				}
			}
		}, this));
		this.cy.on("tap", "node", $.proxy(function(event) {
			this.cy.nodes().unselect();
			this.cy.nodes().removeClass("highlight");

			var node = event.cyTarget;
			node.addClass("highlight");
			node.select();
		}, this));
		this.cy.on("mouseover", "edge", $.proxy(function(event){
			ZUI.container.style.cursor = "pointer";
			var edge = event.cyTarget;
			edge.addClass("highlight");
		}, this));
		this.cy.on("mouseout", "edge", $.proxy(function(event){
			ZUI.container.style.cursor = "default";
			var edge = event.cyTarget;
			edge.removeClass("highlight");
		}, this));
		this.cy.on("click", "edge", $.proxy(function(event){
		}, this));
		this.cy.on("tap", $.proxy(function(event) {
			if (event.cyTarget == this.cy) {
				this.cy.nodes().unselect();
				this.cy.nodes().removeClass("highlight");

				if (this.nodePopup != null) {
					this.nodePopup.remove();
					this.nodePopup = null;
				}
			}
		}, this));
	}, this);

	/* Retrieve interactions data */
	$.ajax({
		type: "GET",
		url: "http://bar.utoronto.ca/webservices/aiv/get_interactions.php?request=[{\"agi\":\"" + this.gene.identifier + "\"}]",
//url: "http://bar.utoronto.ca/~mierullo/get_interactions.php?request=[{\"agi\":\"" + this.gene.identifier + "\"}]",
		dataType: "json"
	}).done($.proxy(function(response) {
//TODO if response.length == 0 then NO DATA AVAILABLE
		var nodes = this.cytoscapeConf.elements.nodes;
		var edges = this.cytoscapeConf.elements.edges;
		for (var source in response) {
			var exists = false;
			for (var n = 0; n < nodes.length; n++) {
				if (nodes[n].data.id.toUpperCase() == source.toUpperCase()) {
					exists = true;
					break;
				}
			}
			if (!exists) {
				nodes.push({
					data: {
						id: source.toUpperCase(),
						color: (source == this.gene.identifier) ? Eplant.Color.DarkGrey : Eplant.Color.LightGrey
					}
				});
			}
			var interactors = response[source];
			for (n = 0; n < interactors.length; n++) {
				exists = false;
				for (var m = 0; m < nodes.length; m++) {
					if (nodes[m].data.id.toUpperCase() == interactors[n].protein.toUpperCase()) {
						exists = true;
						break;
					}
				}
				if (!exists) {
					nodes.push({
						data: {
							id: interactors[n].protein.toUpperCase(),
							color: (interactors[n].protein == this.gene.identifier) ? Eplant.Color.DarkGrey : Eplant.Color.LightGrey
						}
					});
				}
				edges.push({
					data: {
						source: this.gene.identifier.toUpperCase(),
						target: interactors[n].protein.toUpperCase(),
						color: Eplant.Color.LightGrey
					}
				});
			}
		}
		if (nodes.length <= 1) {
			this.cytoscapeConf.layout.name = "grid";
		}
		else {
			this.cytoscapeConf.layout.name = "arbor";
		}
		this.isDataReady = true;
		if (ZUI.activeView == this) {
			$(this.cytoscapeElement).cytoscape(this.cytoscapeConf);
		}
	}, this));
}

/* Inherit from View superclass */
InteractionView.prototype = new ZUI.View();
InteractionView.prototype.constructor = InteractionView;

InteractionView.prototype.active = function() {
	if (this.isDataReady) {
		$(this.cytoscapeElement).cytoscape(this.cytoscapeConf);
	}
	ZUI.passInputEvent = $.proxy(function(event) {
		var e = new Event(event.type);
		for (var key in event) {
			e[key] = event[key];
		}
		this.cytoscapeElement.dispatchEvent(e);
	}, this);

	this.mouseFramesIdle = 0;
};

InteractionView.prototype.inactive = function() {
	this.cytoscapeElement.innerHTML = "";
	ZUI.passInputEvent = null;

	if (this.nodePopup != null) {
		this.nodePopup.remove();
		this.nodePopup = null;
	}
	this.cy.remove(this.cy.elements());
};

InteractionView.prototype.mouseMove = function() {
	/* Get mouse status */
	var x = ZUI.mouseStatus.x;
	var y = ZUI.mouseStatus.y;
	var xLast = ZUI.mouseStatus.xLast;
	var yLast = ZUI.mouseStatus.yLast;

	if (xLast != x || yLast != y) {
		this.mouseFramesIdle = 0;
	}

/*	if (this.nodePopup != null) {
		var node = this.nodePopup.source;
		if (!this.nodePopup.isPinned && !node.selected() && !this.nodePopup.isInBound(ZUI.mouseStatus.x, ZUI.mouseStatus.y)) {
			this.nodePopup.remove();
			this.nodePopup = null;
		}
	}*/
};

InteractionView.prototype.draw = function() {
	this.mouseFramesIdle++;

	if (this.cy != null) {
		ZUI.camera.distance = ZUI.width / 2 / this.cy.zoom();
		var pan = this.cy.pan();
		ZUI.camera.x = ZUI.camera.unprojectDistance(ZUI.width / 2) - ZUI.width / 2 - ZUI.camera.unprojectDistance(pan.x);
		ZUI.camera.y = ZUI.camera.unprojectDistance(ZUI.height / 2) - ZUI.height / 2 - ZUI.camera.unprojectDistance(pan.y);
	}
	ZUI.camera.update();

	if (this.nodePopup != null) {
		this.nodePopup.updateIcons();
	}
};

InteractionView.prototype.leftClick = function() {
};

InteractionView.prototype.getLoadProgress = function() {
	return 1;
};

/* Annotation class constructor */
InteractionView.NodePopup = function(view, geneIdentifier) {
	/* Field properties */
	this.view = view;
	this.orientation = "left";			// Side on which the popup is placed
	this.x = 0;
	this.y = 0;
	this.xOffset = 50;
	this.yOffset = -100;
	this.width = 350;
	this.height = 205;
	this.source = null;
	this.isPinned = false;		// Whether the popup is pinned
	this.geneIdentifier = geneIdentifier;
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

	/* Set data */
	this.gene = this.view.gene.chromosome.species.getGeneByIdentifier(this.geneIdentifier);
	if (this.gene == null) {
		$.ajax({
			type: "GET",
			url: "cgi-bin/querygenebyidentifier.cgi?id=" + this.geneIdentifier,
			dataType: "json"
		}).done($.proxy(function(response) {
			var chromosome = null;
			var chromosomes = this.view.gene.chromosome.species.chromosomes;
			for (var n = 0; n < chromosomes.length; n++) {
				if (chromosomes[n].name == response.chromosome) {
					chromosome = chromosomes[n];
				}
			}
			if (chromosome != null) {
				this.gene = new Eplant.Gene(chromosome);
				this.gene.identifier = response.id;
				this.gene.start = response.start;
				this.gene.end = response.end;
				this.gene.strand = response.strand;
				this.gene.aliases = response.aliases;
				chromosome.genes.push(this.gene);

				this.setData(this.gene);
			}
		}, this));
	}
	else {
		this.setData(this.gene);
	}

	/* Append to container */
	ZUI.container.appendChild(this.container);
};

	/* Updates the icons */
	InteractionView.NodePopup.prototype.updateIcons = function() {
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
	InteractionView.NodePopup.prototype.setToGetData = function() {
		this.getDropData.value = "Get Data";
		this.getDropData.onclick = $.proxy(function() {
			this.geneOfInterest = Eplant.getSpeciesOfInterest(this.view.gene.chromosome.species).getGeneOfInterest(this.gene);
			if (this.geneOfInterest == null) {
				this.geneOfInterest = Eplant.getSpeciesOfInterest(this.view.gene.chromosome.species).addGeneOfInterest(this.gene);
			}
			if (this.view.nodePopup != null && this.view.nodePopup.gene == this.gene) {
				this.view.nodePopup.geneOfInterest = this.geneOfInterest;
			}

			this.setToDropData();
		}, this);
	};

	/* Sets the data button to Drop Data */
	InteractionView.NodePopup.prototype.setToDropData = function() {
		this.getDropData.value = "Drop Data";
		this.getDropData.onclick = $.proxy(function() {
			/* Drop GeneOfInterest */
			Eplant.getSpeciesOfInterest(this.view.gene.chromosome.species).removeGeneOfInterest(this.geneOfInterest);
			this.geneOfInterest = null;
			genesOfInterest_onChange();

			this.setToGetData();
		}, this);
		if (this.geneOfInterest == Eplant.speciesOfFocus.geneOfFocus) {
			this.getDropData.disabled = true;
			this.getDropData.value = "Disabled";
		}
	};

	/* Sets position of annotation popup */
	InteractionView.NodePopup.prototype.setPosition = function(x, y, xOffset, yOffset, width, height, orientation) {
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
	InteractionView.NodePopup.prototype.addToContainer = function(container) {
		container.appendChild(this.container);
	};

	/* Returns whether the specified position is within the bounds of the popup */
	InteractionView.NodePopup.prototype.isInBound = function(x, y) {
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
	InteractionView.NodePopup.prototype.setData = function(gene) {
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
		this.geneOfInterest = Eplant.getSpeciesOfInterest(this.view.gene.chromosome.species).getGeneOfInterest(this.gene);
		if (this.geneOfInterest == null) {
			this.setToGetData();
		}
		else {
			this.setToDropData();
		}
	};

	/* Remove annotation popup */
	InteractionView.NodePopup.prototype.remove = function() {
		this.container.parentNode.removeChild(this.container);
	};

	/* Sets identifier text */
	InteractionView.NodePopup.prototype.setIdentifier = function(identifier) {
		this.identifier.innerHTML = "<label>Identifier:</label> &nbsp&nbsp&nbsp&nbsp" + identifier;
	};

	/* Sets aliases text */
	InteractionView.NodePopup.prototype.setAliases = function(aliases) {
		if (aliases.length == 0) {
			this.aliases.innerHTML = "<label>Aliases:</label> &nbsp&nbsp&nbsp&nbsp&nbspNot available";
		}
		else {
			this.aliases.innerHTML = "<label>Aliases:</label> &nbsp&nbsp&nbsp&nbsp&nbsp" + aliases.join(", ");
		}
	};

	/* Sets annotation text */
	InteractionView.NodePopup.prototype.setAnnotation = function(annotation) {
		if (annotation.length == 0) {
			this.annotation.innerHTML = "<label>Annotation:</label> Not available";
		}
		else {
			this.annotation.innerHTML = "<label>Annotation:</label> " + annotation;
		}
	};

