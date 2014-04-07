(function() {

/**
 * Eplant.Views.MoleculeView class
 * Coded by Hans Yu
 * UI designed by Jamie Waese
 *
 * ePlant view for browsing protein molecular structures and 3D annotations.
 * Uses JSmol.
 *
 * @constructor
 * @param {Eplant.GeneticElement} The GeneticElement associated with this view.
 */
Eplant.Views.MoleculeView = function(geneticElement) {
	// Get constructor
	var constructor = Eplant.Views.MoleculeView;

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
	this.geneticElement = geneticElement;

	// Finish loading
	this.loadFinish();
};
ZUI.Helper.inheritClass(Eplant.View, Eplant.Views.MoleculeView);	// Inherit parent prototype

Eplant.Views.MoleculeView.viewName = "Molecule Viewer";
Eplant.Views.MoleculeView.hierarchy = "genetic element";
Eplant.Views.MoleculeView.magnification = 70;
Eplant.Views.MoleculeView.description = "Molecule viewer";
Eplant.Views.MoleculeView.citation = "";
Eplant.Views.MoleculeView.activeIconImageURL = "img/active/molecule.png";
Eplant.Views.MoleculeView.availableIconImageURL = "img/available/molecule.png";
Eplant.Views.MoleculeView.unavailableIconImageURL = "img/unavailable/molecule.png";

/* Constants */
Eplant.Views.MoleculeView.domContainer = null;		// DOM container for JSmol
Eplant.Views.MoleculeView.applet = null;			// JSmol applet object
Eplant.Views.MoleculeView.container = null;		// JSmol container (inside the main domContainer)
Eplant.Views.MoleculeView.canvas = null;			// JSmol canvas

/* Static methods */
/**
 * Initializes JSmol
 */
Eplant.Views.MoleculeView.initialize = function() {
	// Get JSmol DOM container
	Eplant.Views.MoleculeView.domContainer = document.getElementById("JSmol_container");

	// Define JSmol initialization info
	var defaultLoadScript =
		'isDssp = false;' +		//Turn off DSSP
		'set defaultVDW babel;' +	//Set default Van der Waals to babel
		'spacefill off;' +		//Turn off space fill
		'wireframe off;' +		//Turn off wire frame
		'cartoons on;' +		//Turn on cartoons
		'color structure;'		//Color structures
	;
	var info = {
		width: ZUI.width,
		height: ZUI.height,
		use: "HTML5",
		j2sPath: "lib/JSmol/j2s",
		script: 'set defaultloadscript "' + defaultLoadScript + '";',
		disableJ2SLoadMonitor: true,
		disableInitialConsole: true
	};

	// Create JSmol applet
	Eplant.Views.MoleculeView.applet = Jmol.getApplet("MoleculeViewJSmolApplet", info);

	// Get JSmol canvas
	Eplant.Views.MoleculeView.canvas = document.getElementById("MoleculeViewJSmolApplet_canvas2d");

	// Get JSmol div container
	Eplant.Views.MoleculeView.container = document.getElementById("MoleculeViewJSmolApplet_appletdiv");

	// Hide JSmol
	$(Eplant.Views.MoleculeView.domContainer).css({"visibility": "hidden"});

	// Move JSmol to its appropriate container
	Eplant.Views.MoleculeView.container.parentNode.removeChild(Eplant.Views.MoleculeView.container);
	document.getElementById("JSmol_container").appendChild(Eplant.Views.MoleculeView.container);

	// Remove applet info table (not sure what this does)
	var domElement = document.getElementById("MoleculeViewJSmolApplet_appletinfotablediv");
	domElement.parentNode.removeChild(domElement);
};

/**
 * Loads a structure from a file URL.
 *
 * @param {String} fileURL The URL of the file containing the structure.
 */
Eplant.Views.MoleculeView.loadStructure = function(fileURL) {
	Jmol.script(Eplant.Views.MoleculeView.applet, "load \"" + fileURL + "\";");
};

/**
 * Runs a Jmol script.
 *
 * @param {String} script The Jmol script to be run.
 */
Eplant.Views.MoleculeView.runScript = function(script) {
	Jmol.script(Eplant.Views.MoleculeView.applet, script);
};

/**
 * Gets the orientation / camera information of JSmol.
 */
Eplant.Views.MoleculeView.getOrientationInfo = function() {
	var orientationInfo = JSON.parse(Jmol.getPropertyAsJSON(Eplant.Views.MoleculeView.applet, "orientationInfo") || "null");
	if (orientationInfo) {
		return orientationInfo.orientationInfo;
	}
	else {
		return null;
	}
};

/**
 * Active callback method.
 *
 * @override
 */
Eplant.Views.MoleculeView.prototype.active = function() {
	// Call parent method
	Eplant.View.prototype.active.call(this);

	// Make JSmol visible
	$(Eplant.Views.MoleculeView.domContainer).css({"visibility": "visible"});

	// Pass input events to JSmol canvas
	ZUI.passInputEvent = $.proxy(function(event) {
		var e = new Event(event.type);
		for (var key in event) {
			e[key] = event[key];
		}
		Eplant.Views.MoleculeView.canvas.dispatchEvent(e);
	}, this);

	// Load structure
	Eplant.Views.MoleculeView.loadStructure("http://bar.utoronto.ca/eplant/java/models/macromolecules/TAIR9-Phyre/TAIR9_Phyre_Oct25_2009/AT3G58450.1_d2gm3a1_phyre.pdb");
};

/**
 * Inactive callback method.
 *
 * @override
 */
Eplant.Views.MoleculeView.prototype.inactive = function() {
	// Call parent method
	Eplant.View.prototype.inactive.call(this);

	// Hide JSmol
	$(Eplant.Views.MoleculeView.domContainer).css({"visibility": "hidden"});

	// Stop passing input events to JSmol
	ZUI.passInputEvent = null;
};

/**
 * Returns The exit-out animation configuration.
 *
 * @override
 * @return {Object} The exit-out animation configuration.
 */
Eplant.Views.MoleculeView.prototype.getExitOutAnimationConfig = function() {
	var config = Eplant.View.prototype.getExitOutAnimationConfig.call(this);
	config.draw = function(elapsedTime, remainingTime, view, data) {
		Eplant.Views.MoleculeView.runScript("zoom " + (400 / ZUI.camera._distance * 100));
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
Eplant.Views.MoleculeView.prototype.getEnterInAnimationConfig = function() {
	var config = Eplant.View.prototype.getEnterInAnimationConfig.call(this);
	config.begin = function() {
		Eplant.Views.MoleculeView.runScript("zoom " + (400 / 10000 * 100));
	};
	config.draw = function(elapsedTime, remainingTime, view, data) {
		Eplant.Views.MoleculeView.runScript("zoom " + (400 / ZUI.camera._distance * 100));
		view.draw();
	};
	return config;
};

})();
