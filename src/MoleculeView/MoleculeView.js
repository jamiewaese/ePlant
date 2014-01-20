/**
 * Molecule View class
 * UI design by Jamie Waese
 * Code by Hans Yu
 * Uses JSmol http://sourceforge.net/projects/jsmol/
 */

function MoleculeView(element) {
	this.element = element;

	this.isDataReady = true;
}

/* Inherit from View superclass */
MoleculeView.prototype = new ZUI.View();
MoleculeView.prototype.constructor = MoleculeView;

MoleculeView.applet = null;
MoleculeView.container = null;
MoleculeView.canvas = null;

MoleculeView.prototype.active = function() {
	ZUI.container.style.cursor = "default";

	/* Append to view history */
	if (Eplant.viewHistory[Eplant.viewHistorySelected] != this) {
		Eplant.pushViewHistory(this);
	}

	MoleculeView.canvas.style.visibility = "visible";
	ZUI.passInputEvent = $.proxy(function(event) {
		var e = new Event(event.type);
		for (var key in event) {
			e[key] = event[key];
		}
		MoleculeView.canvas.dispatchEvent(e);
	}, this);
	MoleculeView.loadStructure("http://bar.utoronto.ca/eplant/java/models/macromolecules/TAIR9-Phyre/TAIR9_Phyre_Oct25_2009/AT3G58450.1_d2gm3a1_phyre.pdb");
};

MoleculeView.prototype.inactive = function() {
	MoleculeView.canvas.style.visibility = "hidden";
	ZUI.passInputEvent = null;
};

MoleculeView.loadStructure = function(filePath) {
	Jmol.script(MoleculeView.applet, 'load "' + filePath + '";');
};

MoleculeView.getOrientationInfo = function() {
	var orientationInfo = JSON.parse(Jmol.getPropertyAsJSON(MoleculeView.applet, "orientationInfo") || "null");
	if (orientationInfo != null) {
		return orientationInfo.orientationInfo;
	}
	else {
		return null;
	}
};

MoleculeView.executeJmolScript = function(script) {
	Jmol.script(MoleculeView.applet, script);
};

MoleculeView.initJMol = function() {
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
		width: ZUI.width,
		height: ZUI.height,
		use: "HTML5",
		j2sPath: "lib/JSmol/j2s",
		script: 'set defaultloadscript "' + defaultLoadScript + '";',
		disableJ2SLoadMonitor: true,
		disableInitialConsole: true
	};

	/* Create Jmol applet */
	MoleculeView.applet = Jmol.getApplet("MoleculeViewJSmolApplet", Info);

	/* Get Jmol canvas */
	MoleculeView.canvas = document.getElementById("MoleculeViewJSmolApplet_canvas2d");

	/* Get Jmol div container */
	MoleculeView.container = document.getElementById("MoleculeViewJSmolApplet_appletdiv");

	/* Configure Jmol canvas */
	MoleculeView.canvas.style.visibility = "hidden";

	/* Move Jmol to its container */
	MoleculeView.container.parentNode.removeChild(MoleculeView.container);
	document.getElementById("JSmol_container").appendChild(MoleculeView.container);
	var element = document.getElementById("MoleculeViewJSmolApplet_appletinfotablediv");
	element.parentNode.removeChild(element);
};

/* Returns the animation settings for zoom in entry animation */
MoleculeView.prototype.getZoomInEntryAnimationSettings = function() {
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
		begin: function() {
			MoleculeView.executeJmolScript("zoom " + (400 / 10000 * 100));
		},
		draw: function(elapsedTime, remainingTime, view) {
			MoleculeView.executeJmolScript("zoom " + (400 / ZUI.camera._distance * 100));
		}
	};
};

/* Returns the animation settings for zoom out exit animation */
MoleculeView.prototype.getZoomOutExitAnimationSettings = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.75, 0, 0.75, 0.9],
		sourceDistance: 400 / MoleculeView.getOrientationInfo().zoom * 100,
		targetX: 0,
		targetY: 0,
		targetDistance: 10000,
		draw: function(elapsedTime, remainingTime, view) {
			MoleculeView.executeJmolScript("zoom " + (400 / ZUI.camera._distance * 100));
		}
	};
};

MoleculeView.prototype.getLoadProgress = function() {
	if (this.isDataReady) return 1;
	else return 0;
};
