/**
 * JavaScript Namespace for Protein Structure View
 *
 * Requires JSmol.min.js
 * Requires j2s folder at the active file path
 *
 * By Hans Yu
 */

/* Define namespace */
function ProteinStructure() {}

////////////////////////////////////////////////

///////////////
// Variables //
///////////////

/** Jmol applet handle */
ProteinStructure.applet = null;

/** Jmol applet canvas */
ProteinStructure.canvas = null;

/** Jmol applet div container */
ProteinStructure.divContainer = null;

////////////////////////////////////////////////

///////////////
// Functions //
///////////////

/**
 * Initializes Jmol by creating the applet and retrieving relevant handles
 */
ProteinStructure.initialize = function() {
	/* Define Jmol setup info */
	var defaultLoadScript =
		'isDssp = false;' +		//Turn off DSSP
		'set defaultVDW babel;' +	//Set default Van der Waals to babel
		'spacefill off;' +		//Turn off space fill
		'wireframe off;' +		//Turn off wire frame
		'cartoons on;' +		//Turn on cartoons
		'color structure;'		//Color structures
	;
	var Info = {
		width: 800,
		height: 600,
		use: "HTML5",
		script: 'set defaultloadscript "' + defaultLoadScript + '";',
		readyFunction: ProteinStructure.ready,
		disableJ2SLoadMonitor: true,
		disableInitialConsole: true
	};
	/* Create Jmol applet */
	ProteinStructure.applet = Jmol.getApplet("ProteinStructureJSmolApplet", Info);
	/* Get Jmol canvas */
	ProteinStructure.canvas = Jmol._getElement(ProteinStructure.applet, "canvas2d");

	/* Get Jmol div container */
	ProteinStructure.divContainer = Jmol._getElement(ProteinStructure.applet, "appletdiv");

	/* Configure Jmol canvas */
	ProteinStructure.canvas.style.visibility = "hidden";

	/* Configure Jmol div container */
	ProteinStructure.divContainer.style.width = "800px";
	ProteinStructure.divContainer.style.height = "600px";
	ProteinStructure.divContainer.style.position = "absolute";
	ProteinStructure.divContainer.style.left = "50%";
	ProteinStructure.divContainer.style.marginLeft = "-400px";
	ProteinStructure.divContainer.style.top = 0;
};

/**
 * Loads a protein structure
 * @param {String} filePath Path to the PDB file that contains the protein structure.
 */
ProteinStructure.loadStructure = function(filePath) {
	Jmol.script(ProteinStructure.applet, 'load "' + filePath + '";');
};

/**
 * Callback function fired when Jmol applet is ready
 * @param {Applet} applet The Jmol applet associated with this event.
 */
ProteinStructure.ready = function(applet) {
};

/**
 * Callback function fired when Protein Structure view becomes active
 */
ProteinStructure.active = function() {
	/* Make Jmol visible */
	ProteinStructure.canvas.style.visibility = "visible";

	/* Add mouse event listeners that pass mouse events to Jmol canvas */
	var eplant2_canvas = document.getElementById("eplant2_canvas");
	eplant2_canvas.addEventListener("mousemove", ProteinStructure.eventPasser);
	eplant2_canvas.addEventListener("mousedown", ProteinStructure.eventPasser);
	eplant2_canvas.addEventListener("mouseup", ProteinStructure.eventPasser);
	eplant2_canvas.addEventListener("click", ProteinStructure.eventPasser);
	eplant2_canvas.addEventListener("dblclick", ProteinStructure.eventPasser);
	eplant2_canvas.addEventListener("mousewheel", ProteinStructure.eventPasser);
	eplant2_canvas.addEventListener("contextmenu", ProteinStructure.eventPasser);
};

/**
 * Callback function fired when Protein Structure view becomes inactive
 */
ProteinStructure.inactive = function() {
	ProteinStructure.canvas.style.visibility = "hidden";

	/* Remove mouse event listeners that pass mouse events to Jmol canvas */
	var eplant2_canvas = document.getElementById("eplant2_canvas");
	eplant2_canvas.removeEventListener("mousemove", ProteinStructure.eventPasser);
	eplant2_canvas.removeEventListener("mousedown", ProteinStructure.eventPasser);
	eplant2_canvas.removeEventListener("mouseup", ProteinStructure.eventPasser);
	eplant2_canvas.removeEventListener("click", ProteinStructure.eventPasser);
	eplant2_canvas.removeEventListener("dblclick", ProteinStructure.eventPasser);
	eplant2_canvas.removeEventListener("mousewheel", ProteinStructure.eventPasser);
	eplant2_canvas.removeEventListener("contextmenu", ProteinStructure.eventPasser);
};

/**
 * Retrieves the camera orientation information of the Jmol applet
 */
ProteinStructure.getOrientationInfo = function() {
	var orientationInfo = JSON.parse(Jmol.getPropertyAsJSON(ProteinStructure.applet, "orientationInfo") || "null");
	if (orientationInfo) {
		return orientationInfo.orientationInfo;
	}
	else {
		return null;
	}
};

/**
 * Executes a Jmol script
 * @param {String} script Jmol script
 */
ProteinStructure.executeJmolScript = function(script) {
	Jmol.script(ProteinStructure.applet, script);
};

/**
 * Event handler for passing events to Jmol canvas
 */
ProteinStructure.eventPasser = function(event) {
	event.preventDefault();
	var e = new Event(event.type);
	for (var key in event) {
		e[key] = event[key];
	}
	ProteinStructure.canvas.dispatchEvent(e);
};
