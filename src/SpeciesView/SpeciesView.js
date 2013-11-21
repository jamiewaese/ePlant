/**
 * Species View class
 * UI design by Jamie Waese
 * Code by Hans Yu
 */

function SpeciesView() {
	ZUI.View.call(this);

	/* Species shown on the right panel from mouse-over of its name */
	this.speciesShown = null;

	this.loadProgress = 0.0;

	/* Create species list */
	this.speciesList = new SpeciesView.SpeciesList(this);

	/* Fade */
	this.fade = 1;
	this.fadeRate = 0;

	/* Animations */
	this.zoomInExitAnimation = new ZUI.Animation(30, $.proxy(function(currentFrame) {
		ZUI.camera.distance = 400 * Math.pow(0.85, currentFrame);
		ZUI.camera.x = ZUI.width / 6 * (400 - ZUI.camera.distance) / 400;
		this.draw();
	}, this));
	this.zoomOutEntryAnimation = new ZUI.Animation(30, $.proxy(function(currentFrame) {
		ZUI.camera.distance = 400 * Math.pow(0.85, 29 - currentFrame);
		ZUI.camera.x = ZUI.width / 6 * (400 - ZUI.camera.distance) / 400;
		this.draw();
	}, this));
/*this.viewObjects.push(new ZUI.ViewObject({
	shape: "text",
	positionScale: "world",
	sizeScale: "screen",
	x: ZUI.width / 6,
	y: 50,
	centerAt: "center top",
	content: "Chr 1",
	autoDraw: true,
	size: 100,
	font: "Ariel",
	mouseOver: function(){console.log("MOUSEOVER");},
	mouseOut: function(){console.log("MOUSEOUT");}
}));
this.viewObjects.push(new ZUI.ViewObject({
	shape: "rect",
	positionScale: "world",
	sizeScale: "world",
	x: ZUI.width / 6,
	y: 0,
	width: 50,
	height: 0,
	centerAt: "left bottom",
	autoDraw: true,
	mouseOver: function(){console.log("MOUSEOVER");},
	mouseOut: function(){console.log("MOUSEOUT");}
}));
this.viewObjects.push(new ZUI.ViewObject({
	shape: "polygon",
	positionScale: "world",
	sizeScale: "world",
	x: 0,
	y: 0,
	vertices: [
		{
			x: 0,
			y: 0
		},
		{
			x: 0,
			y: 100
		},
		{
			x: 100,
			y: 100
		},
		{
			x: 100,
			y: 0
		},
		{
			x: 75,
			y: 0
		},
		{
			x: 75,
			y: 50
		},
		{
			x: 25,
			y: 50
		},
		{
			x: 25,
			y: 0
		}
	],
	fill: false,
	autoDraw: true,
	mouseOver: function(){console.log("MOUSEOVER");},
	mouseOut: function(){console.log("MOUSEOUT");}
}));*/
}

/* Inherit from View superclass */
SpeciesView.prototype = new ZUI.View();
SpeciesView.prototype.constructor = SpeciesView;

SpeciesView.prototype.active = function() {
	/* Hide extra UI */
	document.getElementById("navigation_container").style.opacity = "0";
	document.getElementById("settings_container").style.opacity = "0";

	/* Move ZUI container */
	ZUI.container.style.left = "-100px";

	this.speciesShown = null;

	/* Add species list */
	ZUI.container.appendChild(this.speciesList.element);

	/* Set camera */
	ZUI.camera.reset();
	ZUI.camera.distance = 400;
	ZUI.camera._distance = 400;

	/* Fade */
	this.fade = 1;
	this.fadeRate = 0;

	/* Show focused species of interest */
	if (Eplant.speciesOfFocus != null) {
		for (var n = 0; n < this.speciesList.items.length; n++) {
			if (this.speciesList.items[n].species == Eplant.speciesOfFocus.species) {
				this.fade = 0;
				this.speciesList.items[n].element.onmouseover();
				break;
			}
		}
	}
};

SpeciesView.prototype.inactive = function() {
	/* Show extra UI */
	document.getElementById("navigation_container").style.opacity = "1";
	document.getElementById("settings_container").style.opacity = "1";

	/* Remove species list */
	ZUI.container.removeChild(this.speciesList.element);
};

SpeciesView.prototype.draw = function() {
	/* Update camera */
	ZUI.camera.update();

	//TODO change to something more appropriate
	if (this.speciesShown != null && this.fade < 1) {
		this.speciesShown.viewObject.draw();
	}

	/* Fade */
	this.fade += this.fadeRate;
	if (this.fade < 0) this.fade = 0;
	if (this.fade > 1) this.fade = 1;
	ZUI.context.save();
	ZUI.context.strokeStyle = "#ffffff";
	ZUI.context.fillStyle = "#ffffff";
	ZUI.context.globalAlpha = this.fade;
	ZUI.context.fillRect(0, 0, ZUI.width, ZUI.height);
	ZUI.context.restore();
};

/* Species list class */
SpeciesView.SpeciesList = function(view) {
	this.view = view;

	/* Array of species */
	this.items = [];

	/* Create HTML element */
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.left = "0px";
	this.element.style.top = "0px";
	this.element.style.width = ZUI.width / 3 + "px";
	this.element.style.height = ZUI.height + "px";
	this.element.style.padding = "30px";
	this.element.style.backgroundColor = "transparent";

	/* Add header */
	var header = document.createElement("span");
	header.style.fontFamily = "Helvetica";
	header.style.fontSize = "34px";
	header.style.textIndent = "14px";
	header.style.lineHeight = "56px";
	header.style.color = Eplant.Color.Green;
	header.style.display = "block";
	header.textContent = "Select a plant";
	this.element.appendChild(header);

	/* Load species data */
	$.ajax({
		type: "GET",
		url: "cgi-bin/speciesinfo.cgi",
			dataType: "json"
	}).done($.proxy(function(response) {
		for (var n = 0; n < response.length; n++) {
			var species = new Eplant.Species();
			species.scientificName = response[n].scientificName;
			species.commonName = response[n].commonName;
			this.items.push(new SpeciesView.SpeciesListItem(species, this));
		}
		this.loadProgress += 1.0;
	}, this));
};

/* Species list item class */
SpeciesView.SpeciesListItem = function(species, speciesList) {
	this.species = species;
	this.speciesList = speciesList;
	this.viewObject = null;

	/* Create HTML element */
	this.element = document.createElement("span");
	this.element.style.cursor = "default";
	this.element.style.fontFamily = "Helvetica";
	this.element.style.fontSize = "20px";
	this.element.style.fontStyle = "italic";
	this.element.style.textIndent = "20px";
	this.element.style.lineHeight = "40px";
	this.element.style.color = Eplant.Color.DarkGrey;
	this.element.style.display = "block";
	this.element.style.cursor = "pointer";
	this.element.textContent = this.species.scientificName;
	this.element.onmouseover = $.proxy(function() {
		if (this.speciesList.view.speciesShown != null) {
			this.speciesList.view.speciesShown.element.style.backgroundColor = "transparent";
		}
		this.element.style.backgroundColor = Eplant.Color.Green;
		this.speciesList.view.speciesShown = this;
		this.speciesList.view.fadeRate = -0.05;
	}, this);
	this.element.onmouseout = $.proxy(function() {
		this.element.style.backgroundColor = "transparent";
		this.speciesList.view.fadeRate = 0.05;
	}, this);
	this.element.onclick = $.proxy(function() {
		/* Add to species of interest */
		var speciesOfInterest = null;
		var speciessOfInterest = Eplant.speciessOfInterest;
		for (var n = 0; n < speciessOfInterest.length; n++) {
			if (speciessOfInterest[n].species.scientificName == this.species.scientificName) {
				speciesOfInterest = speciessOfInterest[n];
				break;
			}
		}
		if (speciesOfInterest == null) {
			speciesOfInterest = Eplant.addSpeciesOfInterest(this.species);
		}
		Eplant.setSpeciesOfFocus(speciesOfInterest);
		if (Eplant.speciesOfFocus.chromosomeView == null) {
			Eplant.speciesOfFocus.chromosomeView = new ChromosomeView(this.species);
		}

		/* change to chromosome view */
		ZUI.container.style.left = "0";
		ZUI.changeActiveView(Eplant.speciesOfFocus.chromosomeView, this.speciesList.view.zoomInExitAnimation, Eplant.speciesOfFocus.chromosomeView.zoomInEntryAnimation);
	}, this);
	this.speciesList.element.appendChild(this.element);

	/* Create view object */
	this.viewObject = new ZUI.ViewObject({
		shape: "svg",
		positionScale: "world",
		sizeScale: "world",
		x: ZUI.width / 6,
		y: 0,
		url: "data/species/" + this.species.scientificName.replace(" ", "_") + ".svg"
	});
};
