/**
 * Pathway View class
 * UI design by Jamie Waese
 * Code by Hans Yu
 */

function PathwayView(gene) {
	/* Store gene object */
	this.gene = gene;

	/* Get Cytoscape container */
	this.cytoscapeElement = document.getElementById("Cytoscape_container");

	/* Cytoscape object */
	this.cy = null;

	/* Data status */
	this.isDataReady = false;

	/* Configure Cytoscape */
	this.cytoscapeConf = {};
	this.cytoscapeConf.layout = {
		name: "preset",
		fit: false
	};
	this.cytoscapeConf.style = cytoscape.stylesheet()
		.selector("node")
			.css({
				"shape": "data(shape)",
				"width": "data(width)",
				"height": "data(height)",
				"content": "",
				"text-valign": "center",
				"color": Eplant.Color.Black,
				"background-color": Eplant.Color.White,
				"border-color": Eplant.Color.Black,
				"border-width": "2"
			})
		.selector("node.reaction")
			.css({
				"shape": "circle",
				"width": "20",
				"height": "20"
			})
		.selector("node.pseudo")
			.css({
				"shape": "circle",
				"width": "0.1",
				"height": "0.1",
				"border-width": "0",
				"background-color": Eplant.Color.Black,
			})
		.selector("edge")
			.css({
				"width": "1",
				"line-color": Eplant.Color.Black
			})
		.selector("edge.output")
			.css({
				"target-arrow-shape": "triangle",
				"target-arrow-color": Eplant.Color.Black
			})
		.selector("edge.catalyst")
			.css({
				"target-arrow-shape": "circle",
				"target-arrow-color": Eplant.Color.Black
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
	}, this);

	/* Query data */
	$.ajax({
		type: "GET",
		url: "http://bar.utoronto.ca/~eplant/cgi-bin/pathwaydiagram.cgi?agi=" + this.gene.identifier,
		dataType: "json"
	}).done($.proxy(function(response) {
		var nodes = this.cytoscapeConf.elements.nodes;
		var edges = this.cytoscapeConf.elements.edges;

		if (!response.data) {
			nodes.push({
				data: {
					name: this.gene.identifier,
					shape: "circle",
					width: 50,
					height: 50
				},
				position: {
					x: 0,
					y: 0
				}
			});
		}
		else {
			var diagram = response.data[0];

			/* Append nodes */
			for (var n = 0; n < diagram.nodes.chemicals.length; n++) {
				var chemical = diagram.nodes.chemicals[n];
				var position = chemical.attributes.position.split(" ");
				var index = chemical.properties.displayName.indexOf("(");
				var name = chemical.properties.displayName.substring(0, (index == -1) ? chemical.properties.displayName.length : index);
				nodes.push({
					data: {
						id: chemical.attributes.id,
						name: name,
						shape: "triangle",
						width: chemical.attributes.bounds.split(" ")[2],
						height: chemical.attributes.bounds.split(" ")[3]
					},
					position: {
						x: Number(position[0]),
						y: Number(position[1])
					}
				});
			}
			for (n = 0; n < diagram.nodes.complexes.length; n++) {
				var complex = diagram.nodes.complexes[n];
				var position = complex.attributes.position.split(" ");
				var index = complex.properties.displayName.indexOf("(");
				var name = complex.properties.displayName.substring(0, (index == -1) ? complex.properties.displayName.length : index);
				nodes.push({
					data: {
						id: complex.attributes.id,
						name: name,
						shape: "hexagon",
						width: complex.attributes.bounds.split(" ")[2],
						height: complex.attributes.bounds.split(" ")[3]
					},
					position: {
						x: Number(position[0]),
						y: Number(position[1])
					}
				});
			}
			for (n = 0; n < diagram.nodes.entities.length; n++) {
				var entity = diagram.nodes.entities[n];
				var position = entity.attributes.position.split(" ");
				var index = entity.properties.displayName.indexOf("(");
				var name = entity.properties.displayName.substring(0, (index == -1) ? complex.properties.displayName.length : index);
				nodes.push({
					data: {
						id: entity.attributes.id,
						name: name,
						shape: "rectangle",
						width: entity.attributes.bounds.split(" ")[2],
						height: entity.attributes.bounds.split(" ")[3]
					},
					position: {
						x: Number(position[0]),
						y: Number(position[1])
					}
				});
			}
			for (n = 0; n < diagram.nodes.proteins.length; n++) {
				var protein = diagram.nodes.proteins[n];
				var position = protein.attributes.position.split(" ");
				var index = protein.properties.displayName.indexOf("(");
				var name = protein.properties.displayName.substring(0, (index == -1) ? complex.properties.displayName.length : index);
				nodes.push({
					data: {
						id: protein.attributes.id,
						name: name,
						shape: "circle",
						width: protein.attributes.bounds.split(" ")[2],
						height: protein.attributes.bounds.split(" ")[3]
					},
					position: {
						x: Number(position[0]),
						y: Number(position[1])
					}
				});
			}
	
			/* Append reactions */
			var pointCounter = 0;
			for (n = 0; n < diagram.edges.reactions.length; n++) {
				var reaction = diagram.edges.reactions[n];
	
				/* Append reaction node */
				var position = reaction.attributes.position.split(" ");
				nodes.push({
					data: {
						id: reaction.attributes.id,
						name: reaction.properties.displayName
					},
					position: {
						x: Number(position[0]),
						y: Number(position[1])
					},
					classes: "reaction"
				});
	
				/* Append edges */
				/* Catalysts */
				if (reaction.catalysts) {
					for (var m = 0; m < reaction.catalysts.length; m++) {
						var connector = reaction.catalysts[m].id;
						if (reaction.catalysts[m].points) {
							var points = reaction.catalysts[m].points.split(",");
							for (var i = 1; i < points.length; i++) {
								points[i] = points[i].trim();
								var position = points[i].split(" ");
								nodes.push({
									data: {
										name: "",
										id: "point" + pointCounter
									},
									position: {
										x: Number(position[0]),
										y: Number(position[1])
									},
									classes: "pseudo"
								});
								edges.push({
									data: {
										source: connector,
										target: "point" + pointCounter
									},
								});
								connector = "point" + pointCounter;
								pointCounter++;
							}
						}
						edges.push({
							data: {
								source: connector,
								target: reaction.attributes.id
							},
							classes: "catalyst"
						});
					}
				}
				/* Outputs */
				if (reaction.outputs) {
					for (m = 0; m < reaction.outputs.length; m++) {
						var connector = reaction.attributes.id;
						if (reaction.outputs[m].points) {
							var points = reaction.outputs[m].points.split(",");
							for (var i = points.length - 1; i >= 1; i--) {
								points[i] = points[i].trim();
								var position = points[i].split(" ");
								nodes.push({
									data: {
										name: "",
										id: "point" + pointCounter
									},
									position: {
										x: Number(position[0]),
										y: Number(position[1])
									},
									classes: "pseudo"
								});
								edges.push({
									data: {
										source: connector,
										target: "point" + pointCounter
									}
								});
								connector = "point" + pointCounter;
								pointCounter++;
							}
						}
						edges.push({
							data: {
								source: connector,
								target: reaction.outputs[m].id
							},
							classes: "output"
						});
					}
				}
				/* Inputs */
				if (reaction.inputs) {
					for (m = 0; m < reaction.inputs.length; m++) {
						var connector = reaction.inputs[m].id;
						if (reaction.inputs[m].points) {
							var points = reaction.inputs[m].points.split(",");
							for (var i = 1; i < points.length; i++) {
								points[i] = points[i].trim();
								var position = points[i].split(" ");
								nodes.push({
									data: {
										name: "",
										id: "point" + pointCounter
									},
									position: {
										x: Number(position[0]),
										y: Number(position[1])
									},
									classes: "pseudo"
								});
								edges.push({
									data: {
										source: connector,
										target: "point" + pointCounter
									}
								});
								connector = "point" + pointCounter;
								pointCounter++;
							}
						}
						edges.push({
							data: {
								source: connector,
								target: reaction.attributes.id
							}
						});
					}
				}
			}
		}

		/* Center layout */
		var minxX, minY, maxX, maxY;
		if (nodes.length > 0) {
			minX = nodes[0].position.x;
			minY = nodes[0].position.y;
			maxX = nodes[0].position.x;
			maxY = nodes[0].position.y;
		}
		for (n = 1; n < nodes.length; n++) {
			var position = nodes[n].position;
			if (position.x < minX) minX = position.x;
			if (position.x > maxX) maxX = position.x;
			if (position.y < minY) minY = position.y;
			if (position.y > maxY) maxY = position.y;
		}
		var xOffset = (maxX - minX) / 2 + minX - ZUI.width / 2;
		var yOffset = (maxY - minY) / 2 + minY - ZUI.height / 2;
		for (n = 0; n < nodes.length; n++) {
			nodes[n].position.x -= xOffset;
			nodes[n].position.y -= yOffset;
		}

		/* Create label view objects */
		for (n = 0; n < nodes.length; n++) {
			if (!nodes[n].data.name || nodes[n].data.name.length == 0 || (nodes[n].classes && (nodes[n].classes.indexOf("pseudo") > -1 || nodes[n].classes.indexOf("reaction") > -1))) continue;
			var label = nodes[n].data.name;
			var start = 0;
			var index = 0;
			var end = label.indexOf(" ", index);
			while (end > -1) {
				if ((end - start) * 8 > nodes[n].data.width) {
					if ((end - index) * 8 > nodes[n].data.width) {
						label = label.substring(0, index - 1) + "\n" + label.substring(index);
					}
					label = label.substring(0, end) + "\n" + label.substring(end + 1);
					start = end + 1;
				}
				index = end + 1;
				end = label.indexOf(" ", index);
			}
			nodes[n].data.labelViewObject = new ZUI.ViewObject({
				shape: "multilinetext",
				size: 8,
				content: label,
				positionScale: "world",
				sizeScale: "world",
				x: nodes[n].position.x - ZUI.width / 2,
				y: nodes[n].position.y - ZUI.height / 2,
				centerAt: "center center"
			});
		}

		this.isDataReady = true;
		if (ZUI.activeView == this) {
			$(this.cytoscapeElement).cytoscape(this.cytoscapeConf);
		}
	}, this));
}

/* Inherit from View superclass */
PathwayView.prototype = new ZUI.View();
PathwayView.prototype.constructor = PathwayView;

PathwayView.prototype.active = function() {
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
};

PathwayView.prototype.inactive = function() {
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

PathwayView.zoomCytoscapeToZUI = function(zoom) {
	return ZUI.width / 2 / zoom;
};

PathwayView.zoomZUIToCytoscape = function(zoom) {
	return ZUI.width / 2 / zoom;
};

PathwayView.positionCytoscapeToZUI = function(position) {
	return {
		x: ZUI.camera.unprojectDistance(ZUI.width / 2) - ZUI.width / 2 - ZUI.camera.unprojectDistance(position.x),
		y: ZUI.camera.unprojectDistance(ZUI.height / 2) - ZUI.height / 2 - ZUI.camera.unprojectDistance(position.y)
	};
};

PathwayView.positionZUIToCytoscape = function(position) {
	return {
		x: ZUI.camera.projectDistance(ZUI.camera.unprojectDistance(ZUI.width / 2) - ZUI.width / 2 - position.x),
		y: ZUI.camera.projectDistance(ZUI.camera.unprojectDistance(ZUI.height / 2) - ZUI.height / 2 - position.y)
	};
};

PathwayView.prototype.draw = function() {
	/* Update camera */
	ZUI.camera.update();

	/* Synchronize ZUI and Cytoscape cameras */
	if (this.cy) {
		this.cy.zoom(PathwayView.zoomZUIToCytoscape(ZUI.camera._distance));
		this.cy.pan(PathwayView.positionZUIToCytoscape({
			x: ZUI.camera._x,
			y: ZUI.camera._y
		}));

		/* Draw node labels */
		var nodes = this.cy.nodes();
		for (var n = 0; n < nodes.length; n++) {
			if (nodes[n].data("labelViewObject")) nodes[n].data("labelViewObject").draw();
		}
	}
};

PathwayView.prototype.getZoomInEntryAnimationSettings = function() {
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

PathwayView.prototype.getZoomOutExitAnimationSettings = function() {
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

PathwayView.prototype.getLoadProgress = function() {
	if (this.isDataReady) return 1;
	else return 0;
};
