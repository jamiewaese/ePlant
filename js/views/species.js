/**
 * Species View class
 * UI design by Jamie Waese and Hans Yu
 * Code by Hans Yu
 */

function SpeciesView() {
	/* Species shown on the right panel from mouse-over of its name */
	this.speciesShown = null;

	/* Define species list */
	this.speciesList = null;
}

/* Inherit from View superclass */
SpeciesView.prototype = new ZUI.View();
SpeciesView.prototype.constructor = SpeciesView;

SpeciesView.prototype.active = function() {
	/* Create species list */
	if (this.speciesList == null) {
		this.speciesList = new SpeciesView.SpeciesList(this);
	}
	else {
		this.speciesList.show();
	}

	/* Set camera */
	ZUI.camera.reset();
	ZUI.camera.distance = 12000;
};

SpeciesView.prototype.inactive = function() {
	ZUI.container.removeChild(this.speciesList.element);
	this.speciesList.hide();
};

SpeciesView.prototype.draw = function() {
	/* Update camera */
	ZUI.camera.update();

	//TODO change to something more appropriate
	if (this.speciesShown != null && ZUI.camera._distance < 10000) {
		ZUI.drawViewObject(this.speciesShown.viewObject);
	}
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
	this.element.style.backgroundColor = COLOR.WHITE;
	ZUI.container.appendChild(this.element);

	/* Add species */
	this.items.push(new SpeciesView.SpeciesList.Item(this, "Arabidopsis", "Arabidopsis thaliana", "data/species/Arabidopsis.svg", -16.824, -25.598));
	this.items.push(new SpeciesView.SpeciesList.Item(this, "Potato", "Solanum tuberosum", "data/species/Potato.svg", -433.5, -67.5));
	this.items.push(new SpeciesView.SpeciesList.Item(this, "Tomato", "Solanum lycopersicum", "data/species/Tomato.svg", -60.5, 0));
	this.items.push(new SpeciesView.SpeciesList.Item(this, "Poplar", "Populus trichocarpa", "data/species/Poplar.svg", -520.841, -128.409));
};

SpeciesView.SpeciesList.prototype.show = function() {
	this.element.style.visibility = "visible";
};

SpeciesView.SpeciesList.prototype.hide = function() {
	this.element.style.visibility = "hidden";
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
	this.element.style.fontSize = "32px";
	this.element.style.textIndent = "20px";
	this.element.style.lineHeight = "50px";
	this.element.style.color = COLOR.DARK_GREY;
	this.element.style.display = "block";
	this.element.textContent = this.commonName;
	this.element.onmouseover = $.proxy(function() {
		this.element.style.color = COLOR.WHITE;
		this.element.style.backgroundColor = COLOR.DARK_GREY;
		this.speciesList.speciesView.speciesShown = this;
		ZUI.camera.distance = 500;
	}, this);
	this.element.onmouseout = $.proxy(function() {
		if (ZUI.activeView == this.speciesList.speciesView) {
			this.element.style.color = COLOR.DARK_GREY;
			this.element.style.backgroundColor = COLOR.WHITE;
			ZUI.camera.distance = 12000;
		}
	}, this);
	this.element.onclick = $.proxy(function() {
		//TODO change to something more appropriate
		this.element.onmouseout();
		ZUI.changeActiveView(new ChromosomeView(), null, null);
	}, this);
	this.speciesList.element.appendChild(this.element);

	/* Create view object */
	this.viewObject = new ZUI.ViewObject(ZUI.ViewObject.Type.SHAPE);
	this.viewObject.shape = ZUI.processing.loadShape(svg);
	this.viewObject.shape.disableStyle();
	this.viewObject.width = this.viewObject.shape.width;
	this.viewObject.height = this.viewObject.shape.height;
	this.viewObject.x = ZUI.width / 6 - this.viewObject.width / 2;
	this.viewObject.y = -this.viewObject.height / 2;
	this.viewObject.xOffset = this.offsetX;
	this.viewObject.yOffset = this.offsetY;
};
