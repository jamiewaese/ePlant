/**
 * ElementOfInterest class for ePlant
 * By Hans Yu
 */

/* Class constructor */
Eplant.ElementOfInterest = function(element, speciesOfInterest) {
	/**
	 * The parent SpeciesOfInterest object.
	 */
	this.speciesOfInterest = speciesOfInterest;

	/**
	 * The associated element object.
	 */
	this.element = element;

	/**
	 * Annotation tags
	 */
	this.tags = [];

	/* Preload views */
	this.worldView = new WorldView(element);
	this.plantView = new PlantView(this);
	this.cellView = new CellView(this);
	this.pathwayView = new PathwayView(element);
	this.moleculeView = new MoleculeView(element);
	this.sequenceView = null;
	this.interactionView = new InteractionView(element);
};

Eplant.ElementOfInterest.prototype.setTagByColor = function(color, onState) {
	/* Set tag */
	var index = -1;
	for (var n = 0; n < this.tags.length; n++) {
		if (this.tags[n].color.toUpperCase() == color.toUpperCase()) {
			index = n;
			break;
		}
	}
	if (onState && index < 0) {
		var tag = new Eplant.ElementOfInterest.Tag(color);
		this.tags.push(tag);
	}
	else if (!onState && index >= 0) {
		this.tags.splice(index, 1);
	}

	/* Fire event */
	var event = new ZUI.Event("update-tags", this, null);
	ZUI.fireEvent(event);
};
