/**
 * Interaction View class
 * UI design by Jamie Waese
 * Code by Hans Yu
 * Uses Cytoscape.js http://cytoscape.github.io/cytoscape.js/
 */

/* Constructor */
function InteractionView(element) {
	/* Properties */
	this.element = element;		// Element object
	this.species = element.chromosome.species;
	this.cytoscapeElement = document.getElementById("Cytoscape_container");	// Cytoscape container
	this.cy = null;			// Cytoscape object
	this.cytoscapeConf = {};		// Cytoscape configuration object
	this.interactionTooltips = [];	// Interaction tooltips array
	this.annotations = [];		// User annotations
	this.isDataReady = false;		// Whether data is ready
	this.elementDialogCountdown = null;	// Countdown object for invoking ElementDialog
	this.interactionTooltipCountdown = null;	// Countdown object for invoking interaction tooltip
	this.filterContainerElement = null;	// Filter UI
	this.linkContainerElement = null;		// Link UI
	this.legendContainerElement = null;	// Legend UI
	this.legend = null;			// Legend

	/* Create view-specific UI elements */
	/* Filter */
	this.filterContainerElement = document.createElement("div");
	this.filterContainerElement.className = "iconSmall hint--top hint--success hint--rounded";
	this.filterContainerElement.setAttribute("data-hint", "Set interactions filter.");
	this.filterContainerElement.setAttribute("data-enabled", Eplant.tooltipSwitch.toString());
	this.filterContainerElement.style.padding = "5px";
	this.filterContainerElement.onclick = $.proxy(function() {
		//TODO
	}, this);
	/* Set icon */
	var img = document.createElement("img");
	img.src = "img/filter.png";
	this.filterContainerElement.appendChild(img);

	/* Link */
	this.linkContainerElement = document.createElement("div");
	this.linkContainerElement.className = "iconSmall hint--top hint--success hint--rounded";
	this.linkContainerElement.setAttribute("data-hint", "Go to Arabidopsis Interaction Viewer on BAR.");
	this.linkContainerElement.setAttribute("data-enabled", Eplant.tooltipSwitch.toString());
	this.linkContainerElement.style.padding = "5px";
	this.linkContainerElement.onclick = $.proxy(function() {
		window.open("http://bar.utoronto.ca/interactions/cgi-bin/arabidopsis_interactions_viewer.cgi?input=" + element.identifier);
	}, this);
	/* Set icon */
	var img = document.createElement("img");
	img.src = "img/link.png";
	this.linkContainerElement.appendChild(img);

	/* Legend */
	this.legendContainerElement = document.createElement("div");
	this.legendContainerElement.className = "iconSmall hint--top hint--success hint--rounded";
	this.legendContainerElement.setAttribute("data-hint", "Legend for nodes and edges.");
	this.legendContainerElement.setAttribute("data-enabled", Eplant.tooltipSwitch.toString());
	this.legendContainerElement.style.padding = "5px";
	this.legendContainerElement.onclick = $.proxy(function() {
		if (this.legend) {
			this.legend.remove();
			this.legend = null;
		}
		else {
			if (this.isDataReady) {
				this.legend = new InteractionView.Legend({
					view: this
				});
				this.legend.add();
			}
		}
	}, this);
	/* Set icon */
	var img = document.createElement("img");
	img.src = "img/legend.png";
	this.legendContainerElement.appendChild(img);

	/* Cytoscape layout configuration */
	this.cytoscapeConf.layout = {
		name: "grid",
		fit: false,
		nodeMass: function(data) {
			return data.mass;
		}
	};

	/* Cytoscape stylesheet configuration */
	this.cytoscapeConf.style = cytoscape.stylesheet()
		.selector("node")
			.css({
				"shape": "circle",
				"width": "30",
				"height": "30",
				"content": "data(id)",
				"color": Eplant.Color.Black,
				"text-outline-width": "data(labelOutlineWidth)",
				"text-outline-color": "#E6F9AF",
				"background-color": "data(innerColor)",
				"border-width": "5",
				"border-color": "data(outerColor)"
			})
		.selector("node.query")
			.css({
				"width": "50",
				"height": "50",
				"border-width": "8"
			})
		.selector("edge")
			.css({
				"width": "data(width)",
				"line-style": "data(lineStyle)",
				"line-color": "data(color)"
			})
		.selector("node:selected")
			.css({
			})
		.selector("edge:selected")
			.css({
			})
		.selector("node.highlight")
			.css({
			})
		.selector("edge.highlight")
			.css({
			})
	;

	/* Initialize elements arrays */
	this.cytoscapeConf.elements = {
		nodes: [],
		edges: []
	};

	/* Event handler for when Cytoscape is ready */
	this.cytoscapeConf.ready = $.proxy(function() {
		/* Save Cytoscape handle */
		this.cy = $(this.cytoscapeElement).cytoscape("get");

		/* Listen for zoom and pan */
		this.cy.on("zoom", $.proxy(function(event) {
			ZUI.camera._distance = ZUI.camera.distance = InteractionView.zoomCytoscapeToZUI(this.cy.zoom());
			this.cy.pan(InteractionView.positionZUIToCytoscape({
				x: ZUI.camera._x,
				y: ZUI.camera._y
			}));
		}, this));
		this.cy.on("pan", $.proxy(function(event) {
			var position = InteractionView.positionCytoscapeToZUI(this.cy.pan());
			ZUI.camera._x = ZUI.camera.x = position.x;
			ZUI.camera._y = ZUI.camera.y = position.y;
		}, this));

		/* Set user input behaviours */
		this.cy.on("mouseover", "node", $.proxy(function(event) {
			ZUI.container.style.cursor = "pointer";
			var node = event.cyTarget;
			if (!node.selected()) {
				node.addClass("highlight");
			}

			var element = this.element.chromosome.species.getElementByIdentifier(node.data("id"));
			if (element) {
				var elementDialog = Eplant.getElementDialog(element);
				if (!elementDialog) {
					var position = ZUI.camera.projectPoint(node.position().x - ZUI.width / 2, node.position().y - ZUI.height / 2);
					this.elementDialogCountdown = {
						finish: ZUI.appStatus.progress + 500,
						element: element,
						orientation: (position.x > ZUI.width / 2) ? "left" : "right",
						x: position.x,
						y: position.y,
						pin: false
					};
				}
			}
			else {
				this.element.chromosome.species.loadElement(node.data("id"), $.proxy(function(element) {
					var node = this.cy.nodes("node#" + element.identifier)[0];
					var elementDialog = Eplant.getElementDialog(element);
					if (node.hasClass("highlight") && !elementDialog) {
						var position = ZUI.camera.projectPoint(node.position().x - ZUI.width / 2, node.position().y - ZUI.height / 2);
						this.elementDialogCountdown = {
							finish: ZUI.appStatus.progress + 500,
							element: element,
							orientation: (position.x > ZUI.width / 2) ? "left" : "right",
							x: position.x,
							y: position.y,
							pin: false
						};
					}
				}, this));
			}
		}, this));
		this.cy.on("mouseout", "node", $.proxy(function(event) {
			ZUI.container.style.cursor = "default";
			var node = event.cyTarget;
			node.removeClass("highlight");
			var element = this.element.chromosome.species.getElementByIdentifier(node.data("id"));
			var elementDialog = Eplant.getElementDialog(element);
			if (elementDialog && !elementDialog.pinned) {
				elementDialog.close();
			}
			else if (this.elementDialogCountdown && this.elementDialogCountdown.element == element && !this.elementDialogCountdown.pin) {
				this.elementDialogCountdown = null;
			}
		}, this));
		this.cy.on("tap", "node", $.proxy(function(event) {
			this.cy.nodes().unselect();

			var node = event.cyTarget;
			node.select();

			var element = this.element.chromosome.species.getElementByIdentifier(node.data("id"));
			if (element) {
				var elementDialog = Eplant.getElementDialog(element);
				if (elementDialog) {
					elementDialog.pinned = true;
				}
				else {
					var position = ZUI.camera.projectPoint(node.position().x - ZUI.width / 2, node.position().y - ZUI.height / 2);
					this.elementDialogCountdown = {
						finish: ZUI.appStatus.progress,
						element: element,
						orientation: (position.x > ZUI.width / 2) ? "left" : "right",
						x: position.x,
						y: position.y,
						pin: true
					};
				}
			}
			else {
				this.element.chromosome.species.loadElement(node.data("id"), $.proxy(function(element) {
					var node = this.cy.nodes("node#" + element.identifier)[0];
					var elementDialog = Eplant.getElementDialog(element);
					if (elementDialog) {
						elementDialog.pinned = true;
					}
					else {
						var position = ZUI.camera.projectPoint(node.position().x - ZUI.width / 2, node.position().y - ZUI.height / 2);
						this.elementDialogCountdown = {
							finish: ZUI.appStatus.progress,
							element: element,
							orientation: (position.x > ZUI.width / 2) ? "left" : "right",
							x: position.x,
							y: position.y,
							pin: true
						};
					}
				}, this));
			}
		}, this));
		this.cy.on("position", "node", $.proxy(function(event) {
			var node = event.cyTarget;
			var position = node.position();
			var annotation = node._private.data.annotation;
			if (annotation) {
				annotation.x = position.x - ZUI.width / 2;
				annotation.y = position.y - ZUI.height / 2 - ZUI.camera.projectDistance(node.width() / 2 + 27);
			}
		}, this));
		this.cy.on("mouseover", "edge", $.proxy(function(event){
			ZUI.container.style.cursor = "pointer";
			var edge = event.cyTarget;
			edge.addClass("highlight");

			var interaction = edge._private.data;
			var node1 = edge.source();
			var node2 = edge.target();
			var interactionTooltip = this.getInteractionTooltip(interaction);
			if (!interactionTooltip) {
				this.interactionTooltipCountdown = {
					finish: ZUI.appStatus.progress + 500,
					interaction: interaction,
				};
			}
		}, this));
		this.cy.on("mouseout", "edge", $.proxy(function(event){
			ZUI.container.style.cursor = "default";
			var edge = event.cyTarget;
			edge.removeClass("highlight");
			var interaction = edge._private.data;
			var interactionTooltip = this.getInteractionTooltip(interaction);
			if (interactionTooltip) {
				interactionTooltip.remove();
				var index = this.interactionTooltips.indexOf(interactionTooltip);
				this.interactionTooltips.splice(index, 1);
			}
			else if (this.interactionTooltipCountdown && this.interactionTooltipCountdown.interaction == interaction) {
				this.interactionTooltipCountdown = null;
			}
		}, this));
		this.cy.on("tap", "edge", $.proxy(function(event){
			this.cy.edges().unselect();

			var edge = event.cyTarget;
			edge.select();

			var interaction = edge._private.data;
			var interactionTooltip = this.getInteractionTooltip(interaction);
			if (interactionTooltip) {
				interactionTooltip.pinned = true;
			}
			if (!interactionTooltip) {
				this.interactionTooltipCountdown = {
					finish: ZUI.appStatus.progress,
					interaction: interaction,
				};
			}
		}, this));
		this.cy.on("tap", $.proxy(function(event) {
			if (event.cyTarget == this.cy) {
				this.cy.nodes().unselect();
			}
		}, this));
	}, this);

	/* Retrieve interactions data */
	$.getJSON("http://bar.utoronto.ca/~mierullo/get_interactions.php?request=[{\"agi\":\"" + this.element.identifier + "\"}]", $.proxy(function(response) {
		var nodes = this.cytoscapeConf.elements.nodes;
		var edges = this.cytoscapeConf.elements.edges;
		for (var query in response) {
			var interactions = response[query];
			var exists = false;
			for (var m = 0; m < nodes.length; m++) {
				if (nodes[m].data.id.toUpperCase() == query.toUpperCase()) {
					exists = true;
				}
			}
			if (!exists) {
				nodes.push(this.makeNodeObject(query));
			}
			for (var n = 0; n < interactions.length; n++) {
				var sourceExists = false;
				var targetExists = false;
				for (m = 0; m < nodes.length; m++) {
					if (nodes[m].data.id.toUpperCase() == interactions[n].source.toUpperCase()) {
						sourceExists = true;
					}
					if (nodes[m].data.id.toUpperCase() == interactions[n].target.toUpperCase()) {
						targetExists = true;
					}
				}
				if (!sourceExists) {
					nodes.push(this.makeNodeObject(interactions[n].source));
				}
				if (!targetExists) {
					nodes.push(this.makeNodeObject(interactions[n].target));
				}
				var lineStyle = "solid";
				var width = 1;
				var greyColor = 150 - interactions[n].correlation_coefficient * 150;
				if (interactions[n].interolog_confidence > 10) width = 4;
				else if (interactions[n].interolog_confidence > 5) width = 2;
				else if (interactions[n].interolog_confidence <= 2) lineStyle = "dashed";
				edges.push({
					data: {
						source: interactions[n].source.toUpperCase(),
						target: interactions[n].target.toUpperCase(),
						color: "rgb("  + greyColor + "," + greyColor + "," + greyColor + ")",
						lineStyle: lineStyle,
						width: width,
						correlation: interactions[n].correlation_coefficient,
						confidence: interactions[n].interolog_confidence
					}
				});
			}
		}
		if (nodes.length <= 1) {
			this.cytoscapeConf.layout.name = "grid";
		}
		else {
			this.cytoscapeConf.layout.name = "arbor";
			var size = Math.sqrt(nodes.length) * 0.1;
			this.cytoscapeConf.layout.simulationBounds = [ZUI.width / 2 - size * ZUI.width, ZUI.height / 2 - size * ZUI.height, ZUI.width / 2 + size * ZUI.width, ZUI.height / 2 + size * ZUI.height];
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

/* active event handler */
InteractionView.prototype.active = function() {
	ZUI.container.style.cursor = "default";

	/* Append to view history */
	if (Eplant.viewHistory[Eplant.viewHistorySelected] != this) {
		Eplant.pushViewHistory(this);
	}

	/* Create layout */
	if (this.isDataReady) {
		$(this.cytoscapeElement).cytoscape(this.cytoscapeConf);
	}

	/* Pass input events to Cytoscape */
	ZUI.passInputEvent = $.proxy(function(event) {
		var e = new Event(event.type);
		for (var key in event) {
			e[key] = event[key];
		}
		this.cytoscapeElement.dispatchEvent(e);
	}, this);

	/* Show legend */
	if (this.legend) {
		this.legend.show();
	}

	/* Append view-specific UI */
	var viewSpecificUI = document.getElementById("viewSpecificUI");
	viewSpecificUI.appendChild(this.filterContainerElement);
	viewSpecificUI.appendChild(this.linkContainerElement);
	viewSpecificUI.appendChild(this.legendContainerElement);
};

/* inactive event handler */
InteractionView.prototype.inactive = function() {
	this.cytoscapeElement.innerHTML = "";
	ZUI.passInputEvent = null;

	/* Save layout */
	if (this.cy) {
		this.cytoscapeConf.layout.name = "preset";
		var nodes = this.cytoscapeConf.elements.nodes;
		for (var n = 0; n < nodes.length; n++) {
			var position = this.cy.$("#" + nodes[n].data.id).position();
			nodes[n].position = {
				x: position.x,
				y: position.y
			};
		}
	}

	/* Clear elements */
	this.cy.remove(this.cy.elements());

	/* Remove interaction tooltips */
	for (n = 0; n < this.interactionTooltips.length; n++) {
		this.interactionTooltips[n].remove();
	}
	this.interactionTooltips = [];

	/* Hide legend */
	if (this.legend) {
		this.legend.hide();
	}

	/* Remove application specific UI */
	document.getElementById("viewSpecificUI").innerHTML = "";
};

/* mouseMove event handler */
InteractionView.prototype.mouseMove = function() {
	/* Get mouse status */
	var x = ZUI.mouseStatus.x;
	var y = ZUI.mouseStatus.y;
	var xLast = ZUI.mouseStatus.xLast;
	var yLast = ZUI.mouseStatus.yLast;
};

/* Takes a subcellular localisation compartment and outputs the associated colour */
InteractionView.localisationToColor = function(localisation) {
	var color = Eplant.Color.MedGrey;
	if (localisation == "cytoskeleton") color = "#FF2200";
	else if (localisation == "cytosol") color = "#E04889";
	else if (localisation == "endoplasmic reticulum") color = "#D0101A";
	else if (localisation == "extracellular") color = "#6D3F1F";
	else if (localisation == "golgi") color = "#A5A417";
	else if (localisation == "mitochondrion") color = "#41ABF9";
	else if (localisation == "nucleus") color = "#0032FF";
	else if (localisation == "peroxisome") color = "#660066";
	else if (localisation == "plasma membrane") color = "#ECA926";
	else if (localisation == "plastid") color = "#179718";
	else if (localisation == "vacuole") color = "#F6EE3C";
	return color;
};

/* Retrieves the subcellular localisation data for a node */
InteractionView.getNodeLocalisation = function(node, interactionView) {
	var obj = {
		node: node,
		interactionView: interactionView
	};
	$.ajax({
		type: "GET",
		url: "http://bar.utoronto.ca/~eplant/cgi-bin/suba3.cgi?id=" + node.data.id,
		dataType: "json"
	}).done($.proxy(function(response) {
		var localisation = "";
		var highestScore = 0;
		for (var location in response) {
			if (response[location] > highestScore) {
				localisation = location;
				highestScore = response[location];
			}
		}
		var color = InteractionView.localisationToColor(localisation)
		if (this.interactionView.cy) {
			this.interactionView.cy.elements("node#" + this.node.data.id).data("outerColor", color);
		}
		else {
			this.node.data.outerColor = color;
		}
	}, obj));
};

/* Converts Cytoscape camera zoom value to ZUI camera distance value */
InteractionView.zoomCytoscapeToZUI = function(zoom) {
	return ZUI.width / 2 / zoom;
};

/* Converts ZUI camera distance value to Cytoscape camera zoom value */
InteractionView.zoomZUIToCytoscape = function(zoom) {
	return ZUI.width / 2 / zoom;
};

/* Converts Cytoscape camera position to ZUI camera position */
InteractionView.positionCytoscapeToZUI = function(position) {
	return {
		x: ZUI.camera.unprojectDistance(ZUI.width / 2) - ZUI.width / 2 - ZUI.camera.unprojectDistance(position.x),
		y: ZUI.camera.unprojectDistance(ZUI.height / 2) - ZUI.height / 2 - ZUI.camera.unprojectDistance(position.y)
	};
};

/* Converts ZUI camera position to Cytoscape camera position */
InteractionView.positionZUIToCytoscape = function(position) {
	return {
		x: ZUI.camera.projectDistance(ZUI.camera.unprojectDistance(ZUI.width / 2) - ZUI.width / 2 - position.x),
		y: ZUI.camera.projectDistance(ZUI.camera.unprojectDistance(ZUI.height / 2) - ZUI.height / 2 - position.y)
	};
};

/* Gets the annotation object corresponding to the elementOfInterest */
InteractionView.prototype.getAnnotation = function(elementOfInterest) {
	for (var n = 0; n < this.annotations.length; n++) {
		if (this.annotations[n].elementOfInterest == elementOfInterest) {
			return this.annotations[n];
		}
	}
	return null;
};

/* Creates a node object for loading to Cytoscape */
InteractionView.prototype.makeNodeObject = function(identifier) {
	var speciesOfInterest = Eplant.getSpeciesOfInterest(this.element.chromosome.species);
	var elementOfInterest = (speciesOfInterest) ? speciesOfInterest.getElementOfInterestByIdentifier(identifier) : undefined;
	var isQuery = (identifier.toUpperCase() == this.element.identifier.toUpperCase()) ? true : false;
	var annotation = (elementOfInterest) ? new InteractionView.Annotation(elementOfInterest, 0, 0, this) : null;
	var obj = {};
		obj.data = {};
			obj.data.id = identifier.toUpperCase();
			obj.data.outerColor = Eplant.Color.White;
			obj.data.innerColor = (elementOfInterest) ? Eplant.Color.DarkGrey : Eplant.Color.LightGrey;
			obj.data.labelOutlineWidth = (isQuery) ? 2 : 0;
			obj.data.mass = (isQuery) ? 25 : 9;
			obj.data.elementOfInterest = elementOfInterest;
			obj.data.annotation = annotation;
		obj.classes = "";
		if (isQuery) obj.classes += "query ";
	InteractionView.getNodeLocalisation(obj, this);
	if (annotation) this.annotations.push(annotation);
	return obj;
};

/* draw event handler */
InteractionView.prototype.draw = function() {
	/* Update camera */
	ZUI.camera.update();

	/* Synchronize ZUI and Cytoscape cameras */
	if (this.cy) {
		this.cy.zoom(InteractionView.zoomZUIToCytoscape(ZUI.camera._distance));
		this.cy.pan(InteractionView.positionZUIToCytoscape({
			x: ZUI.camera._x,
			y: ZUI.camera._y
		}));
	}

	/* Check whether element dialog should be created */
	if (this.elementDialogCountdown && this.elementDialogCountdown.finish <= ZUI.appStatus.progress) {
		var conf = this.elementDialogCountdown;
		var elementDialog = new Eplant.ElementDialog({
			x: conf.x,
			y: conf.y,
			orientation: conf.orientation,
			element: conf.element
		});
		elementDialog.pinned = conf.pin;
		this.elementDialogCountdown = null;
	}

	/* Check whether interaction dialog should be created */
	if (this.interactionTooltipCountdown && this.interactionTooltipCountdown.finish <= ZUI.appStatus.progress) {
		var conf = this.interactionTooltipCountdown;
		var interactionTooltip = new Eplant.Tooltip({
			content: "Correlation coefficient: " + conf.interaction.correlation + "<br>Interolog confidence: " + conf.interaction.confidence,
		});
		interactionTooltip.data.interaction = conf.interaction;
		this.interactionTooltips.push(interactionTooltip);
		this.interactionTooltipCountdown = null;
	}

	/* Draw annotations */
	for (n = 0; n < this.annotations.length; n++) {
		this.annotations[n].draw();
	}
};

/* Returns the animation settings for zoom in entry animation */
InteractionView.prototype.getZoomInEntryAnimationSettings = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.25, 0.1, 0.25, 1],
		sourceX: 0,
		sourceY: 0,
		sourceDistance: 10000,
		targetX: 0,
		targetY: 0,
		targetDistance: 500,
		draw: function(elapsedTime, remainingTime, view) {
			view.draw();
		}
	};
};

/* Returns the animation settings for zoom out exit animation */
InteractionView.prototype.getZoomOutExitAnimationSettings = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.75, 0, 0.75, 0.9],
		targetX: 0,
		targetY: 0,
		targetDistance: 10000,
		draw: function(elapsedTime, remainingTime, view) {
			view.draw();
		}
	};
};

InteractionView.prototype.getZoomOutEntryAnimationSettings = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.75, 0, 0.55, 0.9],
		sourceX: 0,
		sourceY: 0,
		sourceDistance: 0,
		targetX: 0,
		targetY: 0,
		targetDistance: 500,
		draw: function(elapsedTime, remainingTime, view) {
			view.draw();
		}
	};
};

InteractionView.prototype.getZoomInExitAnimationSettings = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.25, 0.1, 0.25, 1],
		targetX: 0,
		targetY: 0,
		targetDistance: 0,
		draw: function(elapsedTime, remainingTime, view) {
			view.draw();
		}
	};
};

/* Returns the animation settings for pan left entry animation */
InteractionView.prototype.getPanLeftEntryAnimationSettings = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.75, 0, 0.75, 0.9],
		sourceX: 900,
		sourceY: 0,
		sourceDistance: 500,
		targetX: 0,
		draw: function(elapsedTime, remainingTime, view) {
			view.draw();
		}
	};
};

/* Returns the animation settings for pan right exit animation */
InteractionView.prototype.getPanRightExitAnimationSettings = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.75, 0, 0.75, 0.9],
		targetX: ZUI.camera._x + 900,
		draw: function(elapsedTime, remainingTime, view) {
			view.draw();
		}
	};
};

/* Returns the loading progress of the view */
InteractionView.prototype.getLoadProgress = function() {
	if (this.isDataReady) return 1;
	else return 0;
};

/* Takes an interaction object and returns the associated tooltip object */
InteractionView.prototype.getInteractionTooltip = function(interaction) {
	for (var n = 0; n < this.interactionTooltips.length; n++) {
		if (this.interactionTooltips[n].data.interaction == interaction) {
			return this.interactionTooltips[n];
		}
	}
	return null;
};
