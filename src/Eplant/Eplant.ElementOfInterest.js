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
	this.plantView = new PlantView(element);
	this.cellView = new CellView(element);
	this.pathwayView = new PathwayView(element);
	this.moleculeView = new MoleculeView(element);
	this.sequenceView = null;
	this.interactionView = new InteractionView(element);
};