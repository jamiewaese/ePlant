(function() {

/**
 * Eplant.Views.InteractionView class
 * Coded by Hans Yu
 * UI designed by Jamie Waese
 *
 * eFP View for browsing protein-protein interactions data.
 * Uses the Cytoscape.js plugin.
 *
 * @constructor
 * @augments Eplant.View
 * @param {Eplant.GeneticElement} geneticElement The GeneticElement associated with this view.
 */
Eplant.Views.InteractionView = function(geneticElement) {
	// Get constructor
	var constructor = Eplant.Views.InteractionView;

	// Call parent constructor
	Eplant.View.call(this,
		constructor.viewName,				// Name of the View visible to the user
		constructor.hierarchy,			// Hierarchy of the View
		constructor.magnification,			// Magnification level of the View
		constructor.description,			// Description of the View visible to the user
		constructor.citation,			// Citation template of the View
		constructor.activeIconImageURL,		// URL for the active icon image
		constructor.availableIconImageURL,		// URL for the available icon image
		constructor.unavailableIconImageURL	// URL for the unavailable icon image
	);

	/* Attributes */
	this.geneticElement = geneticElement;	// The GeneticElement associated with this view
	this.cy = null;				// Cytoscape object
	this.cyConf = null;				// Cytoscape configuration object
	this.geneticElementDialogInfo = null;	// GeneticElementDialog information
	this.interactionTooltipInfo = null;	// Interaction tooltip information
	this.legend = null;				// Legend
	this.eventListeners = [];			// Event listeners
	this.isFilterOn = false;			// Whether filter is on
	this.filterConfidence = 0;			// Confidence filter threshold
	this.filterCorrelation = 0;			// Correlation filter threshold

	/* Create view-specific UI buttons */
	this.createViewSpecificUIButtons();

	/* Set Cytoscape configurations */
	this.setCyConf();

	/* Load data */
	this.loadData();

	/* Create legend */
	this.legend = new Eplant.Views.InteractionView.Legend(this);

	/* Bind events */
	this.bindEvents();
};
ZUI.Util.inheritClass(Eplant.View, Eplant.Views.InteractionView);	// Inherit parent prototype

Eplant.Views.InteractionView.viewName = "Interaction Viewer";
Eplant.Views.InteractionView.hierarchy = "genetic element";
Eplant.Views.InteractionView.magnification = 60;
Eplant.Views.InteractionView.description = "Interaction viewer";
Eplant.Views.InteractionView.citation = "";
Eplant.Views.InteractionView.activeIconImageURL = "img/active/interaction.png";
Eplant.Views.InteractionView.availableIconImageURL = "img/available/interaction.png";
Eplant.Views.InteractionView.unavailableIconImageURL = "img/unavailable/interaction.png";

/* Constants */
Eplant.Views.InteractionView.domContainer = null;		// DOM container element for Cytoscape
Eplant.Views.InteractionView.interactionsThreshold = 100;	// If the number of interactions exceeds this number, a filter will be applied automatically

/* Static methods */
Eplant.Views.InteractionView.getZUIDistance = function(zoom) {
	return ZUI.width / 2 / zoom;
};
Eplant.Views.InteractionView.getZUIPosition = function(pan) {
	return {
		x: ZUI.camera.unprojectDistance(ZUI.width / 2) - ZUI.width / 2 - ZUI.camera.unprojectDistance(pan.x),
		y: ZUI.camera.unprojectDistance(ZUI.height / 2) - ZUI.height / 2 - ZUI.camera.unprojectDistance(pan.y)
	};
};
Eplant.Views.InteractionView.getCyZoom = function(distance) {
	return ZUI.width / 2 / distance;
};
Eplant.Views.InteractionView.getCyPan = function(position) {
	return {
		x: ZUI.camera.projectDistance(ZUI.camera.unprojectDistance(ZUI.width / 2) - ZUI.width / 2 - position.x),
		y: ZUI.camera.projectDistance(ZUI.camera.unprojectDistance(ZUI.height / 2) - ZUI.height / 2 - position.y)
	};
};

/**
 * Initializes the view's pre-requisites.
 */
Eplant.Views.InteractionView.initialize = function() {
	// Get DOM container
	Eplant.Views.InteractionView.domContainer = document.getElementById("Cytoscape_container");	// DOM container element for Cytoscape
};

/**
 * Active callback method.
 *
 * @override
 */
Eplant.Views.InteractionView.prototype.active = function() {
	/* Call parent method */
	Eplant.View.prototype.active.call(this);

	/* Set initial Cytoscape zoom and pan */
	this.cyConf.zoom = Eplant.Views.InteractionView.getCyZoom(ZUI.camera.distance);
	this.cyConf.pan = Eplant.Views.InteractionView.getCyPan({
		x: ZUI.camera.x,
		y: ZUI.camera.y
	});

	/* Start Cytoscape */
	if (this.isLoadedData) {
		$(Eplant.Views.InteractionView.domContainer).cytoscape(this.cyConf);
	}

	/* Attach legend */
	if (this.legend.isVisible) {
		this.legend.attach();
	}

	/* Pass input events to Cytoscape */
	ZUI.passInputEvent = $.proxy(function(event) {
		var e = new Event(event.type);
		for (var key in event) {
			e[key] = event[key];
		}
		Eplant.Views.InteractionView.domContainer.dispatchEvent(e);
	}, this);
};

/**
 * Inactive callback method.
 *
 * @override
 */
Eplant.Views.InteractionView.prototype.inactive = function() {
	/* Call parent method */
	Eplant.View.prototype.inactive.call(this);

	/* Save layout */
	if (this.cy) {
		this.cyConf.layout.name = "preset";
		var nodes = this.cyConf.elements.nodes;
		for (var n = 0; n < nodes.length; n++) {
			var node = nodes[n];
			var position = this.cy.$("node#" + node.data.id.toUpperCase()).position();
			node.position = {
				x: position.x,
				y: position.y
			};
		}
	}

	/* Remove Cytoscape elements */
	if (this.cy) {
		this.cy.remove(this.cy.elements());
	}

	/* Clear Cytoscape DOM container */
	$(Eplant.Views.InteractionView.domContainer).empty();

	/* Remove interaction tooltips */
	var edges = this.cyConf.elements.edges;
	for (var n = 0; n < edges.length; n++) {
		var edge = edges[n];
		var tooltip = edge.data.tooltip;
		if (tooltip) {
			tooltip.close();
			edge.data.tooltip = null;
		}
	}
	// TODO

	/* Detach legend */
	if (this.legend.isVisible) {
		this.legend.detach();
	}

	/* Remove Cytoscape handle */
	this.cy = null;

	/* Stop passing input events to Cytoscape */
	ZUI.passInputEvent = null;
};

/**
 * Draw callback method.
 *
 * @override
 */
Eplant.Views.InteractionView.prototype.draw = function() {
	/* Call parent method */
	Eplant.View.prototype.draw.call(this);

	/* Draw annotations */
	if (this.cy) {
		var nodes = this.cy.nodes();
		for (var n = 0; n < nodes.length; n++) {
			var node = nodes[n];
			if (node._private.data.annotation && node.visible()) {
				node._private.data.annotation.draw();
			}
		}
	}

	/* Check whether GeneticElementDialog should be created */
	if (this.geneticElementDialogInfo && this.geneticElementDialogInfo.finish <= ZUI.appStatus.progress) {
		/* Get node */
		var node = this.geneticElementDialogInfo.node;

		/* Get GeneticElement */
		var geneticElement = node._private.data.geneticElement;

		/* Check whether GeneticElementDialog exists */
		if (!geneticElement.geneticElementDialog) {		// No
			/* Get node position */
			var position = node.position();
			position = ZUI.camera.projectPoint(position.x - ZUI.width / 2, position.y - ZUI.height / 2);

			/* Get orientation */
			var orientation = (position.x > ZUI.width / 2) ? "left" : "right";

			/* Create GeneticElementDialog */
			var geneticElementDialog = new Eplant.GeneticElementDialog(
				geneticElement,
				position.x,
				position.y,
				orientation
			);
			geneticElementDialog.pinned = this.geneticElementDialogInfo.pin;
			geneticElement.geneticElementDialog = geneticElementDialog;
		}

		/* Clear GeneticElementDialog information */
		this.geneticElementDialogInfo = null;
	}

	// Check whether interaction tooltip should be created
	if (this.interactionTooltipInfo && this.interactionTooltipInfo.finish <= ZUI.appStatus.progress) {
		/* Get interaction */
		var interaction = this.interactionTooltipInfo.interaction;

		// Create tooltip
		var tooltip = new Eplant.Tooltip({
			content: "Correlation coefficient: " + interaction.correlation + 
					"<br>Interolog confidence: " + interaction.confidence
		});
		interaction.tooltip = tooltip;

		// Clear interaction tooltip information
		this.interactionTooltipInfo = null;
	}
};

/**
 * Clean up view.
 *
 * @override
 */
Eplant.Views.InteractionView.prototype.remove = function() {
	/* Call parent method */
	Eplant.View.prototype.remove.call(this);

	/* Remove EventListeners */
	for (var n = 0; n < this.eventListeners.length; n++) {
		var eventListener = this.eventListeners[n];
		ZUI.removeEventListener(eventListener);
	}
};

/**
 * Creates view-specific UI buttons.
 */
Eplant.Views.InteractionView.prototype.createViewSpecificUIButtons = function() {
	/* Filter */
	this.filterButton = new Eplant.ViewSpecificUIButton(
		"img/off/filter.png",		// imageSource
		"Filter interactions.",		// description
		function(data) {		// click
			/* Check whether filter is already on */
			if (data.interactionView.isFilterOn) {		// Yes
				if (data.interactionView.cy) {
					/* Update button */
					this.setImageSource("img/off/filter.png");

					/* Turn off filter */
					data.interactionView.isFilterOn = false;

					/* Restore elements */
					data.interactionView.cy.$(":hidden").show();
				}
			}
			else {		// No
				/* Create filter dialog */
				var filterDialog = new Eplant.Views.InteractionView.FilterDialog(data.interactionView);
			}
		},
		{
			interactionView: this
		}
	);
	this.viewSpecificUIButtons.push(this.filterButton);

	/* Link */
	var viewSpecificUIButton = new Eplant.ViewSpecificUIButton(
		"img/link.png",		// imageSource
		"Go to Arabidopsis Interaction Viewer on BAR.",		// description
		function(data) {		// click
			window.open("http://bar.utoronto.ca/interactions/cgi-bin/arabidopsis_interactions_viewer.cgi?input=" + data.interactionView.geneticElement.identifier);
		},
		{
			interactionView: this
		}
	);
	this.viewSpecificUIButtons.push(viewSpecificUIButton);

	/* Legend */
	var viewSpecificUIButton = new Eplant.ViewSpecificUIButton(
		"img/legend.png",		// imageSource
		"Toggle legend.",			// description
		function(data) {		// click
			/* Check whether legend is showing */
			if (data.interactionView.legend.isVisible) {		// Yes
				/* Hide legend */
				data.interactionView.legend.hide();
			}
			else {		// No
				/* Show legend */
				data.interactionView.legend.show();
			}
		},
		{
			interactionView: this
		}
	);
	this.viewSpecificUIButtons.push(viewSpecificUIButton);
};

/**
 * Sets Cytoscape configurations.
 */
Eplant.Views.InteractionView.prototype.setCyConf = function() {
	this.cyConf = {};

	/* Layout algorithm */
	this.cyConf.layout = {
		name: "grid",		// Will be set to arbor if network is not empty
		fit: false,
		nodeMass: function(data) {
			return data.mass;
		}
	};

	/* Style sheet */
	this.cyConf.style = cytoscape.stylesheet()
		.selector("node")
			.css({
				"shape": "circle",
				"width": "data(size)",
				"height": "data(size)",
				"content": "data(id)",
				"color": "#000000",
				"background-color": "data(backgroundColor)",
				"text-outline-width": "data(textOutlineWidth)",
				"text-outline-color": "#E6F9AF",
				"border-width": "data(borderWidth)",
				"border-color": "data(borderColor)"
			})
		.selector("node.highlight")
			.css({
				"font-weight": "bold"
			})
		.selector("edge")
			.css({
				"width": "data(size)",
				"line-style": "data(lineStyle)",
				"line-color": "data(lineColor)"
			})
	;

	/* Create elements arrays */
	this.cyConf.elements = {
		nodes: [],
		edges: []
	};

	/* Ready event handler */
	this.cyConf.ready = $.proxy(function() {
		/* Save Cytoscape object */
		this.cy = $(Eplant.Views.InteractionView.domContainer).cytoscape("get");

		/* Apply filter if the number of interactions exceeds threshold */
		if (this.cyConf.elements.edges.length > Eplant.Views.InteractionView.interactionsThreshold) {
			this.filterConfidence = 2;
			this.filterCorrelation = 0.5;
			this.applyFilter();
		}

		/* Update annotations */
		for (var n = 0; n < this.cyConf.elements.nodes.length; n++) {
			var node = this.cyConf.elements.nodes[n];
			if (node.data.annotation) {
				node.data.annotation.update();
			}
		}

		/* Listen for zoom and pan events */
		this.cy.on("zoom", $.proxy(function(event) {
			/* Synchronize with ZUI camera distance */
			ZUI.camera.setDistance(Eplant.Views.InteractionView.getZUIDistance(this.cy.zoom()));
		}, this));
		this.cy.on("pan", $.proxy(function(event) {
			/* Synchronize with ZUI camera position */
			var position = Eplant.Views.InteractionView.getZUIPosition(this.cy.pan());
			ZUI.camera.setPosition(
				position.x,
				position.y
			);
		}, this));

		/* Listen for pointer events on nodes */
		this.cy.on("mouseover", "node", $.proxy(function(event) {
			/* Change cursor */
			ZUI.container.style.cursor = "pointer";

			/* Get node */
			var node = event.cyTarget;

			/* Highlight node */
			node.addClass("highlight");

			/* Open GeneticElementDialog */
			var geneticElement = node._private.data.geneticElement;
			if (geneticElement) {		// GeneticElement exists
				/* Make sure GeneticElementDialog is not already open */
				if (!geneticElement.geneticElementDialog) {
					/* Set GeneticElementDialog information */
					this.geneticElementDialogInfo = {
						finish: ZUI.appStatus.progress + 500,
						node: node,
						pin: false
					};
				}
			}
			else {		// GeneticElement doesn't exist, create it
				/* Create GeneticElement */
				this.geneticElement.species.loadGeneticElementByIdentifier(node.data("id"), $.proxy(function(geneticElement) {
					/* Get node */
					var node = this.cy.nodes("node#" + geneticElement.identifier.toUpperCase())[0];

					/* Attach GeneticElement to node */
					node._private.data.geneticElement = geneticElement;

					/* Make sure node is still highlighted and GeneticElementDialog is not already open */
					if (node.hasClass("highlight") && !geneticElement.geneticElementDialog) {
						/* Set GeneticElementDialog information */
						this.geneticElementDialogInfo = {
							finish: ZUI.appStatus.progress + 500,
							node: node,
							pin: false
						};
					}
				}, this));
			}
		}, this));
		this.cy.on("mouseout", "node", $.proxy(function(event) {
			/* Restore cursor */
			ZUI.container.style.cursor = "default";

			/* Get node */
			var node = event.cyTarget;

			/* Remove node highlight */
			node.removeClass("highlight");

			/* Close GeneticElementDialog or remove its information */
			var geneticElement = node._private.data.geneticElement;
			if (geneticElement && geneticElement.geneticElementDialog && !geneticElement.geneticElementDialog.pinned) {
				geneticElement.geneticElementDialog.close();
			}
			else if (this.geneticElementDialogInfo && this.geneticElementDialogInfo.node == node && !this.geneticElementDialogInfo.pin) {
				this.geneticElementDialogInfo = null;
			}
		}, this));
		this.cy.on("tap", "node", $.proxy(function(event) {
			/* Get node */
			var node = event.cyTarget;

			/* Get GeneticElement */
			var geneticElement = node._private.data.geneticElement;

			/* Check whether GeneticElement is created */
			if (geneticElement) {	// Yes
				/* Check whether GeneticElementDialog is created */
				if (geneticElement.geneticElementDialog) {	// Yes
					/* Pin */
					geneticElement.geneticElementDialog.pinned = true;
				}
				else {		// No
					/* Set GeneticElementDialog information*/
					this.geneticElementDialogInfo = {
						finish: ZUI.appStatus.progress,
						node: node,
						pin: true
					};
				}
			}
			else {		// No
				this.geneticElement.species.loadGeneticElementByIdentifier(node.data("id"), $.proxy(function(geneticElement) {
					/* Get node */
					var node = this.cy.nodes("node#" + geneticElement.identifier.toUpperCase())[0];

					/* Attach GeneticElement to node */
					node._private.data.geneticElement = geneticElement;

					/* Check whether GeneticElementDialog is created */
					if (geneticElement.geneticElementDialog) {	// Yes
						/* Pin */
						geneticElement.geneticElementDialog.pinned = true;
					}
					else {		// No
						/* Set GeneticElementDialog information */
						this.geneticElementDialogInfo = {
							finish: ZUI.appStatus.progress,
							node: node,
							pin: true
						};
					}
				}, this));
			}
		}, this));
		this.cy.on("position", "node", $.proxy(function(event) {	// Node is moved
			/* Get node */
			var node = event.cyTarget;

			/* Update annotation position */
			var annotation = node._private.data.annotation;
			if (annotation) {
				annotation.update();
			}
		}, this));

		// Listen for pointer events on edges
		this.cy.on("mouseover", "edge", $.proxy(function(event){
			// Change cursor
			ZUI.container.style.cursor = "pointer";

			// Get edge
			var edge = event.cyTarget;

			// Get interaction data
			var interaction = edge._private.data;

			// Check whether tooltip already exists
			var tooltip = interaction.tooltip;
			if (!tooltip) {
				this.interactionTooltipInfo = {
					finish: ZUI.appStatus.progress + 500,
					interaction: interaction,
				};
			}
		}, this));
		this.cy.on("mouseout", "edge", $.proxy(function(event){
			// Restore cursor
			ZUI.container.style.cursor = "default";

			// Get edge
			var edge = event.cyTarget;

			// Get interaction data
			var interaction = edge._private.data;

			// Remove tooltip or reset interaction tooltip information object
			var tooltip = interaction.tooltip;
			if (tooltip) {
				tooltip.close();
				interaction.tooltip = null;
			}
			else if (this.interactionTooltipInfo && this.interactionTooltipInfo.interaction == interaction) {
				this.interactionTooltipInfo = null;
			}
		}, this));
	}, this);
};

/**
 * Loads data.
 */
Eplant.Views.InteractionView.prototype.loadData = function() {
	var queryParam = [
		{
			agi: this.geneticElement.identifier
		}
	];
	$.getJSON("http://bar.utoronto.ca/~mierullo/get_interactions.php?request=" + JSON.stringify(queryParam), $.proxy(function(response) {
		/* Get element arrays */
		var nodes = this.cyConf.elements.nodes;
		var edges = this.cyConf.elements.edges;

		/* Go through each query (there should only be one) */
		for (var query in response) {
			/* Check whether query node has been created */
			var isCreated = false;
			for (var n = 0; n < nodes.length; n++) {
				if (nodes[n].data.id.toUpperCase() == query.toUpperCase()) {
					isCreated = true;
					break;
				}
			}

			/* If not, create it */
			if (!isCreated) {
				var node = this.createNode(query);
				nodes.push(node);
			}

			/* Get interactions data for this query */
			var interactionsData = response[query];

			/* Process interactions */
			for (var n = 0; n < interactionsData.length; n++) {
				/* Get interaction data */
				var interactionData = interactionsData[n];

				/* Check whether nodes are created, create them if not */
				var isCreated = false;
				for (var m = 0; m < nodes.length; m++) {
					if (nodes[m].data.id.toUpperCase() == interactionData.source.toUpperCase()) {
						isCreated = true;
						break;
					}
				}
				if (!isCreated) {
					var node = this.createNode(interactionData.source);
					nodes.push(node);
				}
				var isCreated = false;
				for (var m = 0; m < nodes.length; m++) {
					if (nodes[m].data.id.toUpperCase() == interactionData.target.toUpperCase()) {
						isCreated = true;
						break;
					}
				}
				if (!isCreated) {
					var node = this.createNode(interactionData.target);
					nodes.push(node);
				}

				/* Create edge */
				var edge = this.createEdge(interactionData);
				edges.push(edge);
			}
		}

		/* Get subcellular localization data */
		/* Generate a list of query identifiers */
		var ids = [];
		for (var n = 0; n < nodes.length; n++) {
			ids.push(nodes[n].data.id);
		}
		/* Get data */
		$.getJSON("http://bar.utoronto.ca/~eplant/cgi-bin/groupsuba3.cgi?ids=" + JSON.stringify(ids), $.proxy(function(response) {
			/* Get nodes */
			var nodes = this.cyConf.elements.nodes;

			/* Go through localizations data */
			for (var n = 0; n < response.length; n++) {
				/* Get localization data */
				var localizationData = response[n];

				/* Get matching node */
				var node;
				for (var m = 0; m < nodes.length; m++) {
					if (localizationData.id.toUpperCase() == nodes[m].data.id.toUpperCase()) {
						node = nodes[m];
						break;
					}
				}

				/* Get localization compartment with the highest score */
				var compartment;
				var maxScore = 0;
				for (var _compartment in localizationData.data) {
					if (localizationData.data[_compartment] > maxScore) {
						compartment = _compartment;
						maxScore = localizationData.data[_compartment];
					}
				}

				/* Get color corresponding to compartment */
				var color = this.getColorByCompartment(compartment);

				/* Set node color */
				if (this.cy) {
					this.cy.elements("node#" + node.data.id).data("borderColor", color);
				}
				else {
					node.data.borderColor = color;
				}
			}
		}, this));

		/* Set layout to arbor if there are multiple nodes */
		if (nodes.length > 1) {
			this.cyConf.layout.name = "arbor";
			var size = Math.sqrt(nodes.length) * 0.1;
			this.cyConf.layout.simulationBounds = [ZUI.width / 2 - size * ZUI.width, ZUI.height / 2 - size * ZUI.height, ZUI.width / 2 + size * ZUI.width, ZUI.height / 2 + size * ZUI.height];
		}
		else {
			this.cyConf.layout.name = "grid";
		}

		/* Finish loading data */
		this.loadFinish();

		/* Start Cytoscape if this is the active view */
		if (ZUI.activeView == this) {
			$(Eplant.Views.InteractionView.domContainer).cytoscape(this.cyConf);
		}
	}, this));
};

/**
 * Binds events.
 */
Eplant.Views.InteractionView.prototype.bindEvents = function() {
	/* load-views */
	var eventListener = new ZUI.EventListener("load-views", null, function(event, eventData, listenerData) {
		/* Check whether the target GeneticElement's parent Species is associated with this InteractionView */
		if (listenerData.interactionView.geneticElement.species == event.target.species) {	// Yes
			if (listenerData.interactionView.cy) {	// Cytoscape is ready, access node via Cytoscape
				/* Check whether the GeneticElement is part of the interaction network */
				var node = listenerData.interactionView.cy.$("node#" + event.target.identifier.toUpperCase())[0];
				if (node) {		// Yes
					/* Change node style */
					node.data("backgroundColor", "#3C3C3C");

					/* Create annotation */
					annotation = new Eplant.Views.InteractionView.Annotation(event.target, listenerData.interactionView);
					node._private.data.annotation = annotation;
				}
			}
			else {		// Cytoscape is not ready, access node via Cytoscape configurations
				/* Check whether the GeneticElement is part of the interaction network */
				var nodes = listenerData.interactionView.cyConf.elements.nodes;
				var node;
				for (var n = 0; n < nodes.length; n++) {
					if (nodes[n].data.id.toUpperCase() == event.target.identifier.toUpperCase()) {
						node = nodes[n];
					}
				}
				if (node) {		// Yes
					/* Change node style */
					node.data.backgroundColor = "#3C3C3C";

					/* Create annotation */
					annotation = new Eplant.Views.InteractionView.Annotation(event.target, listenerData.interactionView);
					node.data.annotation = annotation;
				}
			}
		}
	}, {
		interactionView: this
	});
	this.eventListeners.push(eventListener);
	ZUI.addEventListener(eventListener);

	/* drop-views */
	var eventListener = new ZUI.EventListener("drop-views", null, function(event, eventData, listenerData) {
		/* Check whether the target GeneticElement's parent Species is associated with this InteractionView */
		if (listenerData.interactionView.geneticElement.species == event.target.species) {	// Yes
			if (listenerData.interactionView.cy) {	// Cytoscape is ready, access node via Cytoscape
				/* Check whether the GeneticElement is part of the interaction network */
				var node = listenerData.interactionView.cy.$("node#" + event.target.identifier.toUpperCase())[0];
				if (node) {		// Yes
					/* Change node style */
					node.data("backgroundColor", "#B4B4B4");

					/* Remove annotation */
					if (node._private.data.annotation) {
						node._private.data.annotation.remove();
						node._private.data.annotation = null;
					}
				}
			else {		// Cytoscape is not ready, access node via Cytoscape configurations
				/* Check whether the GeneticElement is part of the interaction network */
				var nodes = listenerData.interactionView.cyConf.elements.nodes;
				var node;
				for (var n = 0; n < nodes.length; n++) {
					if (nodes[n].data.id.toUpperCase() == event.target.identifier.toUpperCase()) {
						node = nodes[n];
					}
				}
				if (node) {		// Yes
					/* Change node style */
					node.data.backgroundColor = "#B4B4B4";

					/* Remove annotation */
					if (node.data.annotation) {
						node.data.annotation.remove();
						node.data.annotation = null;
					}
				}
			}
			}
		}
	}, {
		interactionView: this
	});
	this.eventListeners.push(eventListener);
	ZUI.addEventListener(eventListener);

	/* mouseover-geneticElementPanel-item */
	var eventListener = new ZUI.EventListener("mouseover-geneticElementPanel-item", null, function(event, eventData, listenerData) {
		/* Check whether the target GeneticElement's parent Species is associated with this InteractionView */
		if (listenerData.interactionView.geneticElement.species == event.target.species) {	// Yes
			if (listenerData.interactionView.cy) {
				/* Highlight node */
				listenerData.interactionView.cy.$("node#" + event.target.identifier.toUpperCase()).addClass("highlight");
			}
		}
	}, {
		interactionView: this
	});
	this.eventListeners.push(eventListener);
	ZUI.addEventListener(eventListener);

	/* mouseout-geneticElementPanel-item */
	var eventListener = new ZUI.EventListener("mouseout-geneticElementPanel-item", null, function(event, eventData, listenerData) {
		/* Check whether the target GeneticElement's parent Species is associated with this InteractionView */
		if (listenerData.interactionView.geneticElement.species == event.target.species) {	// Yes
			if (listenerData.interactionView.cy) {
				/* Remove node highlight */
				listenerData.interactionView.cy.$("node#" + event.target.identifier.toUpperCase()).removeClass("highlight");
			}
		}
	}, {
		interactionView: this
	});
	this.eventListeners.push(eventListener);
	ZUI.addEventListener(eventListener);
};

/**
 * Creates a node object for feeding to Cytoscape.
 *
 * @param {String} identifier Identifier of the node.
 * @return {Object} Node object that can be fed to Cytoscape.
 */
Eplant.Views.InteractionView.prototype.createNode = function(identifier) {
	/* Check whether this is the query node */
	var isQueryNode;
	if (identifier.toUpperCase() == this.geneticElement.identifier.toUpperCase()) {
		isQueryNode = true;
	}
	else {
		isQueryNode = false;
	}

	/* Create annotation if the GeneticElement associated with this identifier has been created and its views have been loaded */
	var geneticElement = this.geneticElement.species.getGeneticElementByIdentifier(identifier);
	var annotation = null;
	if (geneticElement && geneticElement.isLoadedViews) {
		annotation = new Eplant.Views.InteractionView.Annotation(geneticElement, this);
	}

	/* Create node object */
	var node = {
		data: {
			id: identifier.toUpperCase(),
			borderColor: "#FFFFFF",
			geneticElement: geneticElement,
			annotation: annotation
		}
	};
	if (geneticElement && geneticElement.isLoadedViews) {
		node.data.backgroundColor = "#3C3C3C";
	}
	else {
		node.data.backgroundColor = "#B4B4B4";
	}
	if (isQueryNode) {
		node.data.size = 50;
		node.data.borderWidth = 8;
		node.data.textOutlineWidth = 2;
		node.data.mass = 25;
	}
	else {
		node.data.size = 30;
		node.data.borderWidth = 5;
		node.data.textOutlineWidth = 0;
		node.data.mass = 9;
	}

	/* Return node object */
	return node;
};

/**
 * Creates an edge object for feeding to Cytoscape.
 *
 * @param {Object} interactionData Data for the interaction that is to be represented by the edge.
 * @return {Object} Edge object that can be fed to Cytoscape.
 */
Eplant.Views.InteractionView.prototype.createEdge = function(interactionData) {
	/* Create edge object */
	var edge = {
		data: {
			source: interactionData.source.toUpperCase(),
			target: interactionData.target.toUpperCase(),
			correlation: interactionData.correlation_coefficient,
			confidence: interactionData.interolog_confidence,
			tooltip: null
		}
	};

	/* Set edge style and size based on confidence */
	if (interactionData.interolog_confidence > 10) {
		edge.data.lineStyle = "solid";
		edge.data.size = 4;
	}
	else if (interactionData.interolog_confidence > 5) {
		edge.data.lineStyle = "solid";
		edge.data.size = 2;
	}
	else if (interactionData.interolog_confidence > 2) {
		edge.data.lineStyle = "solid";
		edge.data.size = 1;
	}
	else {
		edge.data.lineStyle = "dashed";
		edge.data.size = 1;
	}

	/* Set edge color based on correlation */
	if (interactionData.correlation_coefficient > 0.8) {
		edge.data.lineColor = "#B1171D";
	}
	else if (interactionData.correlation_coefficient > 0.7) {
		edge.data.lineColor = "#D32E09";
	}
	else if (interactionData.correlation_coefficient > 0.6) {
		edge.data.lineColor = "#E97911";
	}
	else if (interactionData.correlation_coefficient > 0.5) {
		edge.data.lineColor = "#EEB807";
	}
	else {
		edge.data.lineColor = "#A0A0A0";
	}

	/* Return edge object */
	return edge;
};

/**
 * Applies filter with the threshold values set for the view.
 */
Eplant.Views.InteractionView.prototype.applyFilter = function() {
	/* Hide elements */
	this.cy.elements().hide();

	/* Show elements that pass filter, by recursion */
	var filterInteractions = $.proxy(function(node) {
		/* Avoid nodes that are already filtered */
		if (node.visible()) {
			return;
		}

		/* Show node */
		node.show();

		/* Get connected edges */
		var edges = node.connectedEdges();

		/* For each edge, check whether it passes filter */
		for (var n = 0; n < edges.length; n++) {
			var edge = edges[n];
			if (edge.data("confidence") >= this.filterConfidence && edge.data("correlation") >= this.filterCorrelation) {
				/* Show edge */
				edge.show();

				/* Filter interactions for the interacting node */
				if (edge.source().data("id") == node.data("id")) {
					filterInteractions(edge.target());
				}
				else {
					filterInteractions(edge.source());
				}
			}
		}
	}, this);
	var queryNode = this.cy.nodes("#" + this.geneticElement.identifier.toUpperCase());
	filterInteractions(queryNode);

	/* Set filter status */
	this.isFilterOn = true;

	/* Update icon image */
	this.filterButton.setImageSource("img/on/filter.png");
};

/**
 * Returns the color corresponding to a subcellular compartment.
 *
 * @param {String} compartment A subcellular compartment.
 * @return {String} The color corresponding to the subcellular compartment.
 */
Eplant.Views.InteractionView.prototype.getColorByCompartment = function(compartment) {
	/* Define color map */
	var map = {
		"cytoskeleton": "#FF2200",
		"cytosol": "#E04889",
		"endoplasmic reticulum": "#D0101A",
		"extracellular": "#6D3F1F",
		"golgi": "#A5A417",
		"mitochondrion": "#41ABF9",
		"nucleus": "#0032FF",
		"peroxisome": "#660066",
		"plasma membrane": "#ECA926",
		"plastid": "#179718",
		"vacuole": "#F6EE3C"
	};

	/* Get color */
	var color = map[compartment];
	if (!color) {
		color = "#787878";
	}

	/* Return color */
	return color;
};

/**
 * Grabs the View's screen.
 *
 * @override
 * @return {DOMString}
 */
Eplant.Views.InteractionView.prototype.getViewScreen = function() {
	/* Get Cytoscape canvases */
	var canvases = Eplant.Views.InteractionView.domContainer.getElementsByTagName("canvas");

	/* Sort canvases by z-index */
	Array(canvases).sort(function(a, b) {
		return a.style.zIndex - b.style.zIndex;
	});

	/* Create temporary canvas for drawing the combined image */
	var canvas = document.createElement("canvas");
	canvas.width = ZUI.width;
	canvas.height = ZUI.height;
	var context = canvas.getContext("2d");

	/* Combine Cytoscape canvases */
	for (var n = 0; n < canvases.length; n++) {
		context.drawImage(canvases[n], 0, 0);
	}

	/* Return data URL */
	return canvas.toDataURL();
};

/**
 * Returns The exit-out animation configuration.
 *
 * @override
 * @return {Object} The exit-out animation configuration.
 */
Eplant.Views.InteractionView.prototype.getExitOutAnimationConfig = function() {
	var config = Eplant.View.prototype.getExitOutAnimationConfig.call(this);
	config.draw = function(elapsedTime, remainingTime, view, data) {
		if (view.cy) {
			var pan = Eplant.Views.InteractionView.getCyPan({
				x: ZUI.camera._x,
				y: ZUI.camera._y
			})
			var zoom = Eplant.Views.InteractionView.getCyZoom(ZUI.camera._distance)
			view.cy.pan(pan);
			view.cy.zoom(zoom);
		}
		view.draw();
	};
	return config;
};

/**
 * Returns The enter-out animation configuration.
 *
 * @override
 * @return {Object} The enter-out animation configuration.
 */
Eplant.Views.InteractionView.prototype.getEnterOutAnimationConfig = function() {
	var config = Eplant.View.prototype.getEnterOutAnimationConfig.call(this);
	config.draw = function(elapsedTime, remainingTime, view, data) {
		if (view.cy) {
			var pan = Eplant.Views.InteractionView.getCyPan({
				x: ZUI.camera._x,
				y: ZUI.camera._y
			})
			var zoom = Eplant.Views.InteractionView.getCyZoom(ZUI.camera._distance)
			view.cy.pan(pan);
			view.cy.zoom(zoom);
		}
		view.draw();
	};
	return config;
};

/**
 * Returns The exit-in animation configuration.
 *
 * @override
 * @return {Object} The exit-in animation configuration.
 */
Eplant.Views.InteractionView.prototype.getExitInAnimationConfig = function() {
	var config = Eplant.View.prototype.getExitInAnimationConfig.call(this);
	config.draw = function(elapsedTime, remainingTime, view, data) {
		if (view.cy) {
			var pan = Eplant.Views.InteractionView.getCyPan({
				x: ZUI.camera._x,
				y: ZUI.camera._y
			})
			var zoom = Eplant.Views.InteractionView.getCyZoom(ZUI.camera._distance)
			view.cy.pan(pan);
			view.cy.zoom(zoom);
		}
		view.draw();
	};
	return config;
};

/**
 * Returns The enter-in animation configuration.
 *
 * @override
 * @return {Object} The enter-in animation configuration.
 */
Eplant.Views.InteractionView.prototype.getEnterInAnimationConfig = function() {
	var config = Eplant.View.prototype.getEnterInAnimationConfig.call(this);
	config.draw = function(elapsedTime, remainingTime, view, data) {
		if (view.cy) {
			var pan = Eplant.Views.InteractionView.getCyPan({
				x: ZUI.camera._x,
				y: ZUI.camera._y
			})
			var zoom = Eplant.Views.InteractionView.getCyZoom(ZUI.camera._distance)
			view.cy.pan(pan);
			view.cy.zoom(zoom);
		}
		view.draw();
	};
	return config;
};

/**
 * Returns The exit-right animation configuration.
 *
 * @override
 * @return {Object} The exit-right animation configuration.
 */
Eplant.Views.InteractionView.prototype.getExitRightAnimationConfig = function() {
	var config = Eplant.View.prototype.getExitRightAnimationConfig.call(this);
	config.draw = function(elapsedTime, remainingTime, view, data) {
		if (view.cy) {
			var pan = Eplant.Views.InteractionView.getCyPan({
				x: ZUI.camera._x,
				y: ZUI.camera._y
			})
			var zoom = Eplant.Views.InteractionView.getCyZoom(ZUI.camera._distance)
			view.cy.pan(pan);
			view.cy.zoom(zoom);
		}
		view.draw();
	};
	return config;
};

/**
 * Returns The enter-right animation configuration.
 *
 * @override
 * @return {Object} The enter-right animation configuration.
 */
Eplant.Views.InteractionView.prototype.getEnterRightAnimationConfig = function() {
	var config = Eplant.View.prototype.getEnterRightAnimationConfig.call(this);
	config.draw = function(elapsedTime, remainingTime, view, data) {
		if (view.cy) {
			var pan = Eplant.Views.InteractionView.getCyPan({
				x: ZUI.camera._x,
				y: ZUI.camera._y
			})
			var zoom = Eplant.Views.InteractionView.getCyZoom(ZUI.camera._distance)
			view.cy.pan(pan);
			view.cy.zoom(zoom);
		}
		view.draw();
	};
	return config;
};

/**
 * Returns The exit-left animation configuration.
 *
 * @override
 * @return {Object} The exit-left animation configuration.
 */
Eplant.Views.InteractionView.prototype.getExitLeftAnimationConfig = function() {
	var config = Eplant.View.prototype.getExitLeftAnimationConfig.call(this);
	config.draw = function(elapsedTime, remainingTime, view, data) {
		if (view.cy) {
			var pan = Eplant.Views.InteractionView.getCyPan({
				x: ZUI.camera._x,
				y: ZUI.camera._y
			})
			var zoom = Eplant.Views.InteractionView.getCyZoom(ZUI.camera._distance)
			view.cy.pan(pan);
			view.cy.zoom(zoom);
		}
		view.draw();
	};
	return config;
};

/**
 * Returns The enter-left animation configuration.
 *
 * @override
 * @return {Object} The enter-left animation configuration.
 */
Eplant.Views.InteractionView.prototype.getEnterLeftAnimationConfig = function() {
	var config = Eplant.View.prototype.getEnterLeftAnimationConfig.call(this);
	config.draw = function(elapsedTime, remainingTime, view, data) {
		if (view.cy) {
			var pan = Eplant.Views.InteractionView.getCyPan({
				x: ZUI.camera._x,
				y: ZUI.camera._y
			})
			var zoom = Eplant.Views.InteractionView.getCyZoom(ZUI.camera._distance)
			view.cy.pan(pan);
			view.cy.zoom(zoom);
		}
		view.draw();
	};
	return config;
};

})();