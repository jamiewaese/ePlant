/**
 * Interaction View class
 * UI design by Jamie Waese
 * Code by Hans Yu
 * Uses Cytoscape.js http://cytoscape.github.io/cytoscape.js/
 */

function InteractionView(element) {
	/* Store element identifier */
	this.element = element;

	/* Create Cytoscape container element */
	this.cytoscapeElement = document.getElementById("Cytoscape_container");

	/* Cytoscape object */
	this.cy = null;

	/* Annotation popup */
	this.interactionDialogs = [];

	/* Data status */
	this.isDataReady = false;

	this.elementDialogCountdown = null;
	this.interactionDialogCountdown = null;

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
	}, this);
	/* Set icon */
	var img = document.createElement("img");
	img.src = "img/legend.png";
	this.legendContainerElement.appendChild(img);

	/* Configure Cytoscape */
	this.cytoscapeConf = {};
	this.cytoscapeConf.layout = {
		name: "grid",
		fit: false,
		nodeMass: function(data) {
			return data.size * data.size / 500;
		}
	};
	this.cytoscapeConf.style = cytoscape.stylesheet()
		.selector("node")
			.css({
				"shape": "circle",
				"width": "data(size)",
				"height": "data(size)",
				"content": "data(id)",
				"color": "data(labelColor)",
				"background-color": "data(color)",
				"border-width": "3",
				"border-color": Eplant.Color.DarkGrey
			})
		.selector("edge")
			.css({
				"width": "data(width)",
				"line-style": "data(lineStyle)",
				"line-color": "data(color)"
			})
		.selector("node:selected")
			.css({
				"border-width": "3",
				"border-color": Eplant.Color.Green
			})
		.selector("edge:selected")
			.css({
				"line-color": Eplant.Color.Green
			})
		.selector("node.highlight")
			.css({
				"border-width": "3",
				"border-color": Eplant.Color.Green
			})
		.selector("edge.highlight")
			.css({
				"line-color": Eplant.Color.Green
			})
	;
	this.cytoscapeConf.elements = {
		nodes: [],
		edges: []
	};
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
			else if (this.elementDialogCountdown && this.elementDialogCountdown.element == element) {
				this.elementDialogCountdown = null;
			}
		}, this));
		this.cy.on("tap", "node", $.proxy(function(event) {
			this.cy.nodes().unselect();

			var node = event.cyTarget;
			node.select();

			var element = this.element.chromosome.species.getElementByIdentifier(node.data("id"));
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
		this.cy.on("mouseover", "edge", $.proxy(function(event){
			ZUI.container.style.cursor = "pointer";
			var edge = event.cyTarget;
			edge.addClass("highlight");

			var interaction = edge._private.data;
			var node1 = edge.source();
			var node2 = edge.target();
			var interactionDialog = Eplant.getInteractionDialog(interaction);
			if (!interactionDialog) {
				var position = ZUI.camera.projectPoint((node1.position().x + node2.position().x) / 2 - ZUI.width / 2, (node1.position().y + node2.position().y) / 2 - ZUI.height / 2);
				this.interactionDialogCountdown = {
					finish: ZUI.appStatus.progress + 500,
					interaction: interaction,
					title: node1.data("id") + " and " + node2.data("id"),
					orientation: (position.x > ZUI.width / 2) ? "left" : "right",
					x: position.x,
					y: position.y,
					pin: false
				};
			}
		}, this));
		this.cy.on("mouseout", "edge", $.proxy(function(event){
			ZUI.container.style.cursor = "default";
			var edge = event.cyTarget;
			edge.removeClass("highlight");
			var interaction = edge._private.data;
			var interactionDialog = Eplant.getInteractionDialog(interaction);
			if (interactionDialog && !interactionDialog.pinned) {
				interactionDialog.close();
			}
			else if (this.interactionDialogCountdown && this.interactionDialogCountdown.interaction == interaction) {
				this.interactionDialogCountdown = null;
			}
		}, this));
		this.cy.on("tap", "edge", $.proxy(function(event){
			this.cy.edges().unselect();

			var edge = event.cyTarget;
			edge.select();

			var interaction = edge._private.data;
			var interactionDialog = Eplant.getInteractionDialog(interaction);
			if (interactionDialog) {
				interactionDialog.pinned = true;
			}
			else {
				this.interactionDialogCountdown = {
					finish: ZUI.appStatus.progress,
					interaction: interaction,
					title: node1.data("id") + " and " + node2.data("id"),
					orientation: (position.x > ZUI.width / 2) ? "left" : "right",
					x: position.x,
					y: position.y,
					pin: true
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
	$.ajax({
		type: "GET",
//		url: "http://bar.utoronto.ca/webservices/aiv/get_interactions.php?request=[{\"agi\":\"" + this.element.identifier + "\"}]",
url: "http://bar.utoronto.ca/~mierullo/get_interactions.php?request=[{\"agi\":\"" + this.element.identifier + "\"}]",
		dataType: "json"
	}).done($.proxy(function(response) {
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
				var node = {
					data: {
						id: query.toUpperCase(),
						color: Eplant.Color.White,
						labelColor: (query.toUpperCase() == this.element.identifier.toUpperCase()) ? Eplant.Color.Green : Eplant.Color.DarkGrey,
						size: (query.toUpperCase() == this.element.identifier.toUpperCase()) ? 50 : 30
					}
				};
				InteractionView.getNodeLocalisation(node);
				nodes.push(node);
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
					var node = {
						data: {
							id: interactions[n].source.toUpperCase(),
							color: Eplant.Color.White,
							labelColor: (interactions[n].target.toUpperCase() == this.element.identifier.toUpperCase()) ? Eplant.Color.Green : Eplant.Color.DarkGrey,
							size: (interactions[n].source.toUpperCase() == this.element.identifier.toUpperCase()) ? 50 : 30
						}
					};
					InteractionView.getNodeLocalisation(node);
					nodes.push(node);
				}
				if (!targetExists) {
					var node = {
						data: {
							id: interactions[n].target.toUpperCase(),
							color: Eplant.Color.White,
							labelColor: (interactions[n].target.toUpperCase() == this.element.identifier.toUpperCase()) ? Eplant.Color.Green : Eplant.Color.DarkGrey,
							size: (interactions[n].target.toUpperCase() == this.element.identifier.toUpperCase()) ? 50 : 30
						}
					};
					InteractionView.getNodeLocalisation(node);
					nodes.push(node);
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

InteractionView.prototype.active = function() {
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

	/* Append view-specific UI */
	var viewSpecificUI = document.getElementById("viewSpecificUI");
	viewSpecificUI.appendChild(this.filterContainerElement);
	viewSpecificUI.appendChild(this.linkContainerElement);
	viewSpecificUI.appendChild(this.legendContainerElement);
};

InteractionView.prototype.inactive = function() {
	this.cytoscapeElement.innerHTML = "";
	ZUI.passInputEvent = null;

	/* Save layout */
	this.cytoscapeConf.layout.name = "preset";
	var nodes = this.cytoscapeConf.elements.nodes;
	for (var n = 0; n < nodes.length; n++) {
		var position = this.cy.$("#" + nodes[n].data.id).position();
		nodes[n].position = {
			x: position.x,
			y: position.y
		};
	}

	/* Clear elements */
	this.cy.remove(this.cy.elements());

	/* Remove application specific UI */
	document.getElementById("viewSpecificUI").innerHTML = "";
};

InteractionView.prototype.mouseMove = function() {
	/* Get mouse status */
	var x = ZUI.mouseStatus.x;
	var y = ZUI.mouseStatus.y;
	var xLast = ZUI.mouseStatus.xLast;
	var yLast = ZUI.mouseStatus.yLast;
};

InteractionView.localisationToColor = function(localisation) {
	var color = Eplant.MedGrey;
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

InteractionView.getNodeLocalisation = function(node) {
	$.ajax({
		type: "GET",
		url: "http://bar.utoronto.ca/~eplant/cgi-bin/suba3.cgi?id=" + node.data.id,
		dataType: "json"
	}).done($.proxy(function(response) {
		var localisation = "";
		if (response.location_subloc && response.location_subloc.length > 0) localisation = response.location_subloc[0];
		node.data.color = InteractionView.localisationToColor(localisation);
	}, node));
};

InteractionView.zoomCytoscapeToZUI = function(zoom) {
	return ZUI.width / 2 / zoom;
};

InteractionView.zoomZUIToCytoscape = function(zoom) {
	return ZUI.width / 2 / zoom;
};

InteractionView.positionCytoscapeToZUI = function(position) {
	return {
		x: ZUI.camera.unprojectDistance(ZUI.width / 2) - ZUI.width / 2 - ZUI.camera.unprojectDistance(position.x),
		y: ZUI.camera.unprojectDistance(ZUI.height / 2) - ZUI.height / 2 - ZUI.camera.unprojectDistance(position.y)
	};
};

InteractionView.positionZUIToCytoscape = function(position) {
	return {
		x: ZUI.camera.projectDistance(ZUI.camera.unprojectDistance(ZUI.width / 2) - ZUI.width / 2 - position.x),
		y: ZUI.camera.projectDistance(ZUI.camera.unprojectDistance(ZUI.height / 2) - ZUI.height / 2 - position.y)
	};
};

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
	if (this.interactionDialogCountdown && this.interactionDialogCountdown.finish <= ZUI.appStatus.progress) {
		var conf = this.interactionDialogCountdown;
		var interactionDialog = new Eplant.InteractionDialog({
			title: conf.title,
			x: conf.x,
			y: conf.y,
			orientation: conf.orientation,
			interaction: conf.interaction
		});
		interactionDialog.pinned = conf.pin;
		this.interactionDialogCountdown = null;
	}
};

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

InteractionView.prototype.getLoadProgress = function() {
	if (this.isDataReady) return 1;
	else return 0;
};
