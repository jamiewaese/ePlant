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
		name: "arbor",
		fit: false
	};
	this.cytoscapeConf.style = cytoscape.stylesheet()
		.selector("node")
			.css({
				"shape": "circle",
				"width": "mapData(100, 40, 80, 20, 60)",
				"content": "data(name)",
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
	}, this);

	/* Query data */
	$.ajax({
		type: "GET",
		url: "http://bar.utoronto.ca/~eplant/cgi-bin/pathwaydiagram.cgi?agi=" + this.gene.identifier,
		dataType: "json"
	}).done($.proxy(function(response) {
		var diagram = response.data[0];

		var nodes = this.cytoscapeConf.elements.nodes;
		var edges = this.cytoscapeConf.elements.edges;

		/* Append nodes */
		for (var n = 0; n < diagram.nodes.chemicals.length; n++) {
			var chemical = diagram.nodes.chemicals[n];
			nodes.push({
				data: {
					id: chemical.attributes.id,
					name: chemical.properties.displayName
				}
			});
		}
		for (n = 0; n < diagram.nodes.complexes.length; n++) {
			var complex = diagram.nodes.complexes[n];
			nodes.push({
				data: {
					id: complex.attributes.id,
					name: complex.properties.displayName
				}
			});
		}
		for (n = 0; n < diagram.nodes.entities.length; n++) {
			var entity = diagram.nodes.entities[n];
			nodes.push({
				data: {
					id: entity.attributes.id,
					name: entity.properties.displayName
				}
			});
		}
		for (n = 0; n < diagram.nodes.proteins.length; n++) {
			var protein = diagram.nodes.proteins[n];
			nodes.push({
				data: {
					id: protein.attributes.id,
					name: protein.properties.displayName
				}
			});
		}

		/* Append edges */
		//TODO

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

PathwayView.prototype.inactive = function() {
	this.cytoscapeElement.innerHTML = "";
	ZUI.passInputEvent = null;

	this.cy.remove(this.cy.elements());
};


