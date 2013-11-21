/**
 * Molecule View class
 * UI design by Jamie Waese
 * Code by Hans Yu
 * Uses JSmol http://sourceforge.net/projects/jsmol/
 */

function MoleculeView(geneId) {
	this.geneId = geneId;
}

/* Inherit from View superclass */
MoleculeView.prototype = new ZUI.View();
MoleculeView.prototype.constructor = MoleculeView;

MoleculeView.applet = null;
MoleculeView.container = null;
MoleculeView.canvas = null;

MoleculeView.prototype.active = function() {
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
		j2sPath: "lib/j2s",
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

