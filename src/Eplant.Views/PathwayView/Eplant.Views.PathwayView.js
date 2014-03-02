(function() {

/**
 * Eplant.Views.PathwayView class
 * Coded by Hans Yu
 * UI designed by Jamie Waese
 *
 * ePlant view for browsing metabolic pathways.
 * Uses the Cytoscape.js plugin.
 *
 * @constructor
 * @param {Eplant.GeneticElement} The GeneticElement associated with this view.
 */
Eplant.Views.PathwayView = function(geneticElement) {
	// Get constructor
	var constructor = Eplant.Views.PathwayView;

	// Call parent constructor
	Eplant.View.call(this,
		constructor.viewName,			// Name of the View visible to the user
		constructor.hierarchy,			// Hierarchy of the View
		constructor.magnification,			// Magnification level of the View
		constructor.description,			// Description of the View visible to the user
		constructor.citation,			// Citation template of the View
		constructor.activeIconImageURL,		// URL for the active icon image
		constructor.availableIconImageURL,		// URL for the available icon image
		constructor.unavailableIconImageURL	// URL for the unavailable icon image
	);

	// Attributes
	this.geneticElement = geneticElement;	// The GeneticElement associated with this view
	this.cy = null;				// Cytoscape object
	this.cyConf = null;				// Cytoscape configuration object
	this.legend = null;				// Legend
	this.eventListeners = [];			// Event listeners

	/* Create view-specific UI buttons */
	this.createViewSpecificUIButtons();

	/* Set Cytoscape configurations */
	this.setCyConf();

	/* Load data */
	this.loadData();

	/* Bind events */
	this.bindEvents();
};
ZUI.Util.inheritClass(Eplant.View, Eplant.Views.PathwayView);	// Inherit parent prototype

Eplant.Views.PathwayView.viewName = "Pathway Viewer";
Eplant.Views.PathwayView.hierarchy = "genetic element";
Eplant.Views.PathwayView.magnification = 60;
Eplant.Views.PathwayView.description = "Pathway viewer";
Eplant.Views.PathwayView.citation = "";
Eplant.Views.PathwayView.activeIconImageURL = "img/active/pathway.png";
Eplant.Views.PathwayView.availableIconImageURL = "img/available/pathway.png";
Eplant.Views.PathwayView.unavailableIconImageURL = "img/unavailable/pathway.png";

/* Constants */
Eplant.Views.PathwayView.domContainer = null;		// DOM container element for Cytoscape

/* Static methods */
Eplant.Views.PathwayView.getZUIDistance = function(zoom) {
	return ZUI.width / 2 / zoom;
};
Eplant.Views.PathwayView.getZUIPosition = function(pan) {
	return {
		x: ZUI.camera.unprojectDistance(ZUI.width / 2) - ZUI.width / 2 - ZUI.camera.unprojectDistance(pan.x),
		y: ZUI.camera.unprojectDistance(ZUI.height / 2) - ZUI.height / 2 - ZUI.camera.unprojectDistance(pan.y)
	};
};
Eplant.Views.PathwayView.getCyZoom = function(distance) {
	return ZUI.width / 2 / distance;
};
Eplant.Views.PathwayView.getCyPan = function(position) {
	return {
		x: ZUI.camera.projectDistance(ZUI.camera.unprojectDistance(ZUI.width / 2) - ZUI.width / 2 - position.x),
		y: ZUI.camera.projectDistance(ZUI.camera.unprojectDistance(ZUI.height / 2) - ZUI.height / 2 - position.y)
	};
};

/**
 * Initializes the view's pre-requisites.
 */
Eplant.Views.PathwayView.initialize = function() {
	// Get DOM container
	Eplant.Views.PathwayView.domContainer = document.getElementById("Cytoscape_container");	// DOM container element for Cytoscape
};

/**
 * Active callback method.
 *
 * @override
 */
Eplant.Views.PathwayView.prototype.active = function() {
	/* Call parent method */
	Eplant.View.prototype.active.call(this);

	/* Set initial Cytoscape zoom and pan */
	this.cyConf.zoom = Eplant.Views.PathwayView.getCyZoom(ZUI.camera.distance);
	this.cyConf.pan = Eplant.Views.PathwayView.getCyPan({
		x: ZUI.camera.x,
		y: ZUI.camera.y
	});

	/* Start Cytoscape */
	if (this.isLoadedData) {
		$(Eplant.Views.PathwayView.domContainer).cytoscape(this.cyConf);
	}

	/* Pass input events to Cytoscape */
	ZUI.passInputEvent = $.proxy(function(event) {
		var e = new Event(event.type);
		for (var key in event) {
			e[key] = event[key];
		}
		Eplant.Views.PathwayView.domContainer.dispatchEvent(e);
	}, this);
};

/**
 * Inactive callback method.
 *
 * @override
 */
Eplant.Views.PathwayView.prototype.inactive = function() {
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
	$(Eplant.Views.PathwayView.domContainer).empty();

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
Eplant.Views.PathwayView.prototype.draw = function() {
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
};

/**
 * Clean up view.
 *
 * @override
 */
Eplant.Views.PathwayView.prototype.remove = function() {
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
Eplant.Views.PathwayView.prototype.createViewSpecificUIButtons = function() {
};

/**
 * Sets Cytoscape configurations.
 */
Eplant.Views.PathwayView.prototype.setCyConf = function() {
	this.cyConf = {};

	/* Layout algorithm */
	this.cyConf.layout = {
		name: "preset",
		fit: false
	};

	/* Style sheet */
	this.cyConf.style = cytoscape.stylesheet()
		// TODO
	;

	/* Create elements arrays */
	this.cyConf.elements = {
		nodes: [],
		edges: []
	};

	/* Ready event handler */
	this.cyConf.ready = $.proxy(function() {
		/* Save Cytoscape object */
		this.cy = $(Eplant.Views.PathwayView.domContainer).cytoscape("get");
	}, this);
};

/**
 * Loads data.
 */
Eplant.Views.PathwayView.prototype.loadData = function() {
	$.getJSON("http://bar.utoronto.ca/~eplant/cgi-bin/pathwaydiagram.cgi?agi=" + this.geneticElement.identifier, $.proxy(function(response) {
		// Get element arrays
		var nodes = this.cytoscapeConf.elements.nodes;
		var edges = this.cytoscapeConf.elements.edges;

		// Check whether any pathways have been found
		if (response.data && response.data.length) {	// Has networks
			// TODO load networks to Cytoscape
		}
		else {		// No network
			// TODO create node for query
		}
	}, this));
};

/**
 * Binds events.
 */
Eplant.Views.PathwayView.prototype.bindEvents = function() {
};

})();
