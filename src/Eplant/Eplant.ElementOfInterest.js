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
	this.worldView = null;
	this.plantView = null;
	this.cellView = null;
	this.interactionView = new InteractionView(element);
	this.pathwayView = null;
	this.moleculeView = null;
	this.sequenceView = null;
};