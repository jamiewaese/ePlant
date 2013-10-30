/**
 * Interaction View class
 * UI design by Jamie Waese
 * Code by Hans Yu
 * Uses Cytoscape.js http://cytoscape.github.io/cytoscape.js/
 */

function InteractionView(geneId) {
	/* Store gene identifier */
	this.geneId = geneId;

	/* Create Cytoscape container element */
	this.cytoscapeElement = document.getElementById("Cytoscape_container");

	/* Cytoscape object */
	this.cy = null;

	/* Data status */
	this.isDataReady = false;

	/* Configure Cytoscape */
	this.cytoscapeConf = {};
	this.cytoscapeConf.layout = {
		name: "grid"
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
				"width": "mapData(100, 70, 100, 2, 6)",
				"line-color": "data(color)"
			})
	;
	this.cytoscapeConf.elements = {
		nodes: [],
		edges: []
	};
	this.cytoscapeConf.ready = $.proxy(function() {
		this.cy = $(this.cytoscapeElement).cytoscape("get");
		this.cy.nodes().bind("mouseover", $.proxy(function(event){
			console.log("node mouseover");
			//TODO create annotation popup
		}, this));
		this.cy.nodes().bind("mouseout", $.proxy(function(event){
			console.log("node mouseout");
			//TODO remove annotation popup if not pinned
		}, this));
		this.cy.nodes().bind("click", $.proxy(function(event){
			console.log("node click");
			//TODO create annotation popup if not created and pin it
		}, this));
		this.cy.edges().bind("mouseover", $.proxy(function(event){
			console.log("edge mouseover");
		}, this));
		this.cy.edges().bind("mouseout", $.proxy(function(event){
			console.log("edge mouseout");
		}, this));
		this.cy.edges().bind("click", $.proxy(function(event){
			console.log("edge click");
		}, this));
	}, this);

	/* Retrieve interactions data */
	$.ajax({
		type: "GET",
		url: "http://bar.utoronto.ca/webservices/aiv/get_interactions.php?request=[{\"agi\":\"" + this.geneId + "\"}]",
		dataType: "json"
	}).done($.proxy(function(response) {
		var nodes = this.cytoscapeConf.elements.nodes;
		var edges = this.cytoscapeConf.elements.edges;
		nodes.push({
			data: {
				id: this.geneId,
				color: Eplant.Color.DarkGrey
			}
		});
		var interactors = response[this.geneId];
		for (var n = 0; n < interactors.length; n++) {
			nodes.push({
				data: {
					id: interactors[n].protein,
					color: Eplant.Color.LightGrey
				}
			});
			edges.push({
				data: {
					source: this.geneId,
					target: interactors[n].protein,
					color: Eplant.Color.LightGrey
				}
			});
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
};

InteractionView.prototype.inactive = function() {
	this.cytoscapeElement.innerHTML = "";
	ZUI.passInputEvent = null;
};

InteractionView.prototype.mouseMove = function() {
};

InteractionView.prototype.getLoadProgress = function() {
	return 1;
};

/* Annotation class constructor */
InteractionView.AnnotationPopup = function(view) {
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
	InteractionView.AnnotationPopup.prototype.updateIcons = function() {
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
	InteractionView.AnnotationPopup.prototype.setToGetData = function() {
		this.getDropData.value = "Get Data";
		this.getDropData.onclick = $.proxy(function() {
			this.setToDropData();
		}, this);
	};

	/* Sets the data button to Drop Data */
	InteractionView.AnnotationPopup.prototype.setToDropData = function() {
		this.getDropData.value = "Drop Data";
		this.getDropData.onclick = $.proxy(function() {
			/* Drop GeneOfInterest */
			Eplant.getSpeciesOfInterest(this.view.species).removeGeneOfInterest(this.geneOfInterest);
			genesOfInterest_onChange();

			this.setToGetData();
		}, this);
	};

	/* Sets position of annotation popup */
	InteractionView.AnnotationPopup.prototype.setPosition = function(x, y, xOffset, yOffset, width, height, orientation) {
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
	InteractionView.AnnotationPopup.prototype.addToContainer = function(container) {
		container.appendChild(this.container);
	};

	/* Returns whether the specified position is within the bounds of the popup */
	InteractionView.AnnotationPopup.prototype.isInBound = function(x, y) {
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
	InteractionView.AnnotationPopup.prototype.setData = function(gene) {
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
	InteractionView.AnnotationPopup.prototype.remove = function() {
		this.container.parentNode.removeChild(this.container);
		if (this.source instanceof InteractionView.GeneListPopupItem) {
			this.source.span.style.backgroundColor = Eplant.Color.White;
			this.source.span.style.color = Eplant.Color.DarkGrey;
		}
	};

	/* Sets identifier text */
	InteractionView.AnnotationPopup.prototype.setIdentifier = function(identifier) {
		this.identifier.innerHTML = "<label>Identifier:</label> &nbsp&nbsp&nbsp&nbsp" + identifier;
	};

	/* Sets aliases text */
	InteractionView.AnnotationPopup.prototype.setAliases = function(aliases) {
		if (aliases.length == 0) {
			this.aliases.innerHTML = "<label>Aliases:</label> &nbsp&nbsp&nbsp&nbsp&nbspNot available";
		}
		else {
			this.aliases.innerHTML = "<label>Aliases:</label> &nbsp&nbsp&nbsp&nbsp&nbsp" + aliases.join(", ");
		}
	};

	/* Sets annotation text */
	InteractionView.AnnotationPopup.prototype.setAnnotation = function(annotation) {
		if (annotation.length == 0) {
			this.annotation.innerHTML = "<label>Annotation:</label> Not available";
		}
		else {
			this.annotation.innerHTML = "<label>Annotation:</label> " + annotation;
		}
	};

