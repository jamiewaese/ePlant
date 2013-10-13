/**
 * Species View class
 * UI design by Jamie Waese and Hans Yu
 * Code by Hans Yu
 */

function SpeciesView() {
	/* Species shown on the right panel from mouse-over of its name */
	this.speciesShown = null;

	/* Create species list */
	this.speciesList = new SpeciesView.SpeciesList(this);

	/* Fade */
	this.fade = 1;
	this.fadeRate = 0;

	/* Animations */
	this.zoomInAnimation = new ZUI.Animation(30, $.proxy(function(currentFrame) {
		ZUI.camera.setDistance(ZUI.camera.distance - 500 / 30);
		ZUI.camera.setX(ZUI.camera.x + ZUI.width / 6 / 400 * 500 / 30);
		this.draw();
	}, this));
	this.zoomOutAnimation = new ZUI.Animation(30, $.proxy(function(currentFrame) {
		if (currentFrame == 0) {
			ZUI.camera.setDistance(0);
			ZUI.camera.setX(ZUI.width / 6);
		}
		ZUI.camera.distance += 500 / 30;
		ZUI.camera.x -= ZUI.width / 6 / 400 * 500 / 30;
		this.draw();
	}, this));
}

/* Inherit from View superclass */
SpeciesView.prototype = new ZUI.View();
SpeciesView.prototype.constructor = SpeciesView;

SpeciesView.prototype.active = function() {
	/* Hide extra UI */
	document.getElementById("navigation_container").style.visibility = "hidden";
	document.getElementById("settings_container").style.visibility = "hidden";

	/* Move ZUI container */
	ZUI.container.style.left = "-150px";

	this.speciesShown = null;

	/* Add species list */
	ZUI.container.appendChild(this.speciesList.element);

	/* Set camera */
	ZUI.camera.reset();
	ZUI.camera.distance = 500;
	ZUI.camera._distance = 500;
	ZUI.camera.x = ZUI.width / 6 / 400 * (400 - 500);
	ZUI.camera._x = ZUI.width / 6 / 400 * (400 - 500);

	/* Fade */
	this.fade = 1;
	this.fadeRate = 0;
};

SpeciesView.prototype.inactive = function() {
	/* Show extra UI */
	document.getElementById("navigation_container").style.visibility = "visible";
	document.getElementById("settings_container").style.visibility = "visible";

	/* Move ZUI container */
	ZUI.container.style.left = "0";

	/* Remove species list */
	ZUI.container.removeChild(this.speciesList.element);
};

SpeciesView.prototype.draw = function() {
	/* Update camera */
	ZUI.camera.update();

	ZUI.processing.stroke(0);
	ZUI.processing.fill(0);
	//TODO change to something more appropriate
	if (this.speciesShown != null && this.fade < 1) {
		ZUI.drawViewObject(this.speciesShown.viewObject);
	}

	/* Fade */
	this.fade += this.fadeRate;
	if (this.fade < 0) this.fade = 0;
	if (this.fade > 1) this.fade = 1;
	ZUI.processing.stroke(255, 255, 255, this.fade * 255);
	ZUI.processing.fill(255, 255, 255, this.fade * 255);
	ZUI.processing.rect(0, 0, ZUI.width, ZUI.height);
};

/* Species list class */
SpeciesView.SpeciesList = function(speciesView) {
	this.speciesView = speciesView;

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
	header.style.color = COLOR.GREEN;
	header.style.display = "block";
	header.textContent = "Select a plant";
	this.element.appendChild(header);

	/* Add species */
	this.items.push(new SpeciesView.SpeciesList.Item(this, "Arabidopsis", "Arabidopsis thaliana", "data/species/Arabidopsis.svg", -16.824, -25.598));
	this.items.push(new SpeciesView.SpeciesList.Item(this, "Potato", "Solanum tuberosum", "data/species/Potato.svg", -433.5, -67.5));
	this.items.push(new SpeciesView.SpeciesList.Item(this, "Tomato", "Solanum lycopersicum", "data/species/Tomato.svg", -60.5, 0));
	this.items.push(new SpeciesView.SpeciesList.Item(this, "Poplar", "Populus trichocarpa", "data/species/Poplar.svg", -520.841, -128.409));
};

/* Species list item class */
SpeciesView.SpeciesList.Item = function(speciesList, commonName, scientificName, svg, offsetX, offsetY) {
	this.speciesList = speciesList;
	this.commonName = commonName;
	this.scientificName = scientificName;
	this.svg = svg;
	this.offsetX = offsetX;
	this.offsetY = offsetY;
	this.viewObject = null;

	/* Create HTML element */
	this.element = document.createElement("span");
	this.element.style.cursor = "default";
	this.element.style.fontFamily = "Helvetica";
	this.element.style.fontSize = "24px";
	this.element.style.textIndent = "20px";
	this.element.style.lineHeight = "46px";
	this.element.style.color = COLOR.DARK_GREY;
	this.element.style.display = "block";
	this.element.textContent = this.commonName;
	this.element.onmouseover = $.proxy(function() {
		this.element.style.backgroundColor = COLOR.GREEN;
		this.speciesList.speciesView.speciesShown = this;
		this.speciesList.speciesView.fadeRate = -0.05;
	}, this);
	this.element.onmouseout = $.proxy(function() {
		this.element.style.backgroundColor = "transparent";
		this.speciesList.speciesView.fadeRate = 0.05;
	}, this);
	this.element.onclick = $.proxy(function() {
		var chromosomeView = new ChromosomeView();
		chromosomeViews.push(chromosomeView);
		ZUI.changeActiveView(chromosomeView, this.speciesList.speciesView.zoomInAnimation, chromosomeView.zoomInAnimation);
	}, this);
	this.speciesList.element.appendChild(this.element);

	/* Create view object */
	this.viewObject = new ZUI.ViewObject(ZUI.ViewObject.Type.SHAPE);
	this.viewObject.shape = ZUI.processing.loadShape(svg);
	this.viewObject.width = this.viewObject.shape.width;
	this.viewObject.height = this.viewObject.shape.height;
	this.viewObject.x = ZUI.width / 6 - this.viewObject.width / 2;
	this.viewObject.y = -this.viewObject.height / 2;
	this.viewObject.xOffset = this.offsetX;
	this.viewObject.yOffset = this.offsetY;
};
