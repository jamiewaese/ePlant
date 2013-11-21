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

	this.mouseFramesIdle = 0;							// Number of frames that the mouse stays idle

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
				"color": "data(color)",
				"background-color": "data(color)"
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
				"width": "2",
				"line-color": Eplant.Color.Green
			})
		.selector("node.highlight")
			.css({
				"border-width": "3",
				"border-color": Eplant.Color.Green
			})
		.selector("edge.highlight")
			.css({
				"width": "2",
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

		/* Set user input behaviours */
		this.cy.on("mouseover", "node", $.proxy(function(event) {
			ZUI.container.style.cursor = "pointer";
			var node = event.cyTarget;
			node.addClass("highlight");

			var element = this.element.chromosome.species.getElementByIdentifier(node.data("id"));
			if (element) {
				var elementDialog = Eplant.getElementDialog(element);
				if (!elementDialog) {
					var position = ZUI.camera.projectPoint(node.position().x - ZUI.width / 2, node.position().y - ZUI.height / 2);
					elementDialog = new Eplant.ElementDialog({
						x: position.x,
						y: position.y,
						orientation: (position.x > ZUI.width / 2) ? "left" : "right",
						element: element
					});
				}
			}
			else {
				this.element.chromosome.species.loadElement(node.data("id"), $.proxy(function(element) {
					var node = this.cy.nodes("node#" + element.identifier)[0];
					var elementDialog = Eplant.getElementDialog(element);
					if (node.hasClass("highlight") && !elementDialog) {
						var position = ZUI.camera.projectPoint(node.position().x - ZUI.width / 2, node.position().y - ZUI.height / 2);
						elementDialog = new Eplant.ElementDialog({
							x: position.x,
							y: position.y,
							orientation: (position.x > ZUI.width / 2) ? "left" : "right",
							element: element
						});
						if (node.selected()) {
							elementDialog.pinned = true;
						}
					}
				}, this));
			}
		}, this));
		this.cy.on("mouseout", "node", $.proxy(function(event) {
			ZUI.container.style.cursor = "default";
			var node = event.cyTarget;
			if (!node.selected()) {
				node.removeClass("highlight");
				var element = this.element.chromosome.species.getElementByIdentifier(node.data("id"));
				var elementDialog = Eplant.getElementDialog(element);
				if (elementDialog && !elementDialog.pinned) {
					elementDialog.close();
				}
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
				interactionDialog = new Eplant.InteractionDialog({
					title: node1.data("id") + " and " + node2.data("id"),
					x: position.x,
					y: position.y,
					orientation: (position.x > ZUI.width / 2) ? "left" : "right",
					interaction: interaction
				});
			}
		}, this));
		this.cy.on("mouseout", "edge", $.proxy(function(event){
			ZUI.container.style.cursor = "default";
			var edge = event.cyTarget;
			if (!edge.selected()) {
				edge.removeClass("highlight");
				var interaction = edge._private.data;
				var interactionDialog = Eplant.getInteractionDialog(interaction);
				if (interactionDialog && !interactionDialog.pinned) {
					interactionDialog.close();
				}
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
		}, this));
		this.cy.on("tap", $.proxy(function(event) {
			if (event.cyTarget == this.cy) {
				this.cy.nodes().unselect();
				this.cy.nodes().removeClass("highlight");
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
				nodes.push({
					data: {
						id: query.toUpperCase(),
						color: (query.toUpperCase() == this.element.identifier.toUpperCase()) ? Eplant.Color.DarkGrey : Eplant.Color.LightGrey,
						size: (query.toUpperCase() == this.element.identifier.toUpperCase()) ? 50 : 30
					}
				});
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
					nodes.push({
						data: {
							id: interactions[n].source.toUpperCase(),
							color: (interactions[n].source.toUpperCase() == this.element.identifier.toUpperCase()) ? Eplant.Color.DarkGrey : Eplant.Color.LightGrey,
							size: (interactions[n].source.toUpperCase() == this.element.identifier.toUpperCase()) ? 50 : 30
						}
					});
				}
				if (!targetExists) {
					nodes.push({
						data: {
							id: interactions[n].target.toUpperCase(),
							color: (interactions[n].target.toUpperCase() == this.element.identifier.toUpperCase()) ? Eplant.Color.DarkGrey : Eplant.Color.LightGrey,
							size: (interactions[n].target.toUpperCase() == this.element.identifier.toUpperCase()) ? 50 : 30
						}
					});
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

	this.zoomInEntryAnimation = new ZUI.Animation(30, $.proxy(function(currentFrame) {
		this.setDistance(10000 * Math.pow(0.85, currentFrame) + 400);
	}, this));
	this.zoomOutExitAnimation = new ZUI.Animation(30, $.proxy(function(currentFrame) {
		this.setDistance(10000 * Math.pow(0.85, 29 - currentFrame) + 400);
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
};

InteractionView.prototype.draw = function() {
	this.mouseFramesIdle++;

	if (this.cy) {
		ZUI.camera.distance = ZUI.width / 2 / this.cy.zoom();
		var pan = this.cy.pan();
		ZUI.camera.x = ZUI.camera.unprojectDistance(ZUI.width / 2) - ZUI.width / 2 - ZUI.camera.unprojectDistance(pan.x);
		ZUI.camera.y = ZUI.camera.unprojectDistance(ZUI.height / 2) - ZUI.height / 2 - ZUI.camera.unprojectDistance(pan.y);
	}
	ZUI.camera.update();
};

InteractionView.prototype.leftClick = function() {
};

InteractionView.prototype.getLoadProgress = function() {
	return 1;
};

InteractionView.prototype.setDistance = function(distance) {
	ZUI.camera._distance = ZUI.camera.distance = distance;
	if (this.cy) {
		this.cy.zoom(ZUI.width / 2 / distance);
		var x = ZUI.camera.projectDistance(ZUI.camera.unprojectDistance(ZUI.width / 2) - ZUI.width / 2 - ZUI.camera.x);
		var y = ZUI.camera.projectDistance(ZUI.camera.unprojectDistance(ZUI.height / 2) - ZUI.height / 2 - ZUI.camera.y);
		this.cy.pan({
			x: x,
			y: y
		});
	}
};
