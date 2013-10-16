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
		name: "arbor"
	};
	this.cytoscapeConf.style = cytoscape.stylesheet()
		.selector("node")
			.css({
				"shape": "circle",
				"width": "mapData(100, 40, 80, 20, 60)",
				"content": "data(id)",
				"color": COLOR.LIGHT_GREY
			})
		.selector("edge")
			.css({
				"width": "mapData(100, 70, 100, 2, 6)",
			})
	;
	this.cytoscapeConf.elements = {
		nodes: [],
		edges: []
	};
	this.cytoscapeConf.ready = $.proxy(function() {
		this.cy = $(this.cytoscapeElement).cytoscape("get");
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
				id: this.geneId
			}
		});
		var interactors = response[this.geneId];
		for (var n = 0; n < interactors.length; n++) {
			nodes.push({
				data: {
					id: interactors[n].protein
				}
			});
			edges.push({
				data: {
					source: this.geneId,
					target: interactors[n].protein
				}
			});
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
