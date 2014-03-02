(function() {

/**
 * Eplant.GeneticElement class
 * By Hans Yu
 *
 * Describes an ePlant genetic element.
 *
 * @constructor
 * @param {Object} info Information for this genetic element wrapped in an Object.
 * @param {Eplant.Chromosome} info.chromosome Chromosome that contains this genetic element.
 * @param {String} info.identifier Identifier of this genetic element.
 * @param {Array<String>} info.aliases Array of aliases of this genetic element.
 * @param {String} info.annotation Annotation of this genetic element.
 * @param {String} info.type Type of this genetic element.
 * @param {String} info.strand Strand of this genetic element ("+" or "-").
 * @param {Number} info.start Start base-pair position of this genetic element.
 * @param {Number} info.end End base-pair position of this genetic element.
 */
Eplant.GeneticElement = function(info) {
	/* Store information */
	this.chromosome = (info.chromosome === undefined) ? null : info.chromosome;
	this.identifier = (info.identifier === undefined) ? null : info.identifier;
	this.aliases = (info.aliases === undefined) ? null : info.aliases;
	this.annotation = (info.annotation === undefined) ? null : info.annotation;
	this.type = (info.type === undefined) ? null : info.type;
	this.strand = (info.strand === undefined) ? null : info.strand;
	this.start = (info.start === undefined) ? null : info.start;
	this.end = (info.end === undefined) ? null : info.end;
	this.species = (info.chromosome === undefined || info.chromosome.species === undefined) ? null : info.chromosome.species;

	/* Check whether necessary information are provided */
	if (this.chromosome === null) console.log("Warning: No Chromosome is specified for the GeneticElement.");
	if (this.identifier === null) console.log("Warning: No identifier is specified for the GeneticElement.");
	if (this.type === null) console.log("Warning: No type is specified for the GeneticElement.");
	if (this.start === null) console.log("Warning: No start position is specified for the GeneticElement.");
	if (this.end === null) console.log("Warning: No end position is specified for the GeneticElement.");

	/* Other attributes */
	this.views = null;			// Object container for Views
	this.isLoadedViews = false;		// Whether Views are loaded
	this.geneticElementDialog = null;	// GeneticElementDialog associated with this GeneticElement
	this.annotationTags = [];		// Annotation tags

	/* Create AnnotationTags */
	for (var n = 0; n < Eplant.GeneticElement.AnnotationTag.Colors.length; n++) {
		var annotationTag = new Eplant.GeneticElement.AnnotationTag(Eplant.GeneticElement.AnnotationTag.Colors[n], this);
		this.annotationTags.push(annotationTag);
	}
};

/**
 * Loads Views for this GeneticElement.
 */
Eplant.GeneticElement.prototype.loadViews = function() {
	/* Confirm views have not been loaded */
	if (!this.views) {
		/* Set up Object wrapper */
		this.views = {};

		/* Loop through Eplant.Views namespace */
		for (var ViewName in Eplant.Views) {
			/* Get View constructor */
			var View = Eplant.Views[ViewName];

			/* Skip if View hiearchy is not at the level of genetic element */
			if (View.hierarchy != "genetic element") continue;

			/* Create View */
			this.views[ViewName] = new View(this);
		}
	}

	/* Set flag for view loading */
	this.isLoadedViews = true;

	/* Fire event */
	var event = new ZUI.Event("load-views", this, null);
	ZUI.fireEvent(event);
};

/**
 * Drops loaded Views for this GeneticElement.
 */
Eplant.GeneticElement.prototype.dropViews = function() {
	/* Change activeGeneticElement if this is activeGeneticElement */
	if (this.species.activeGeneticElement == this) {
		/* Find the first GeneticElement with views loaded and set it to the activeGeneticElement */
		for (var n = 0; n < this.species.geneticElements.length; n++) {
			var geneticElement = this.species.geneticElements[n];
			if (geneticElement.isLoadedViews && geneticElement != this) {		// Found
				this.species.setActiveGeneticElement(geneticElement);
				break;
			}
		}

		/* Set activeGeneticElement to null if none is found */
		if (this.species.activeGeneticElement == this) {
			this.species.setActiveGeneticElement(null);
		}
	}

	/* Clean up Views */
	for (var ViewName in this.views) {
		var view = this.views[ViewName];
		view.remove();
	}

	/* Clear views */
	this.views = null;

	/* Reset AnnotationTags */
	for (var n = 0; n < this.annotationTags.length; n++) {
		var annotationTag = this.annotationTags[n];
		if (annotationTag.isSelected) {
			annotationTag.unselect();
		}
	}

	/* Set flag for View loading */
	this.isLoadedViews = false;

	/* Fire event */
	var event = new ZUI.Event("drop-views", this, null);
	ZUI.fireEvent(event);
};

/**
 * Gets the AnnotationTag with the specified color.
 *
 * @param {String} color Color HEX of the AnnotationTag.
 * @return {Eplant.GeneticElement.AnnotationTag} Matching AnnotationTag.
 */
Eplant.GeneticElement.prototype.getAnnotationTagByColor = function(color) {
	/* Loop through AnnotationTag objects to find the AnnotationTag with a matching color */
	for (var n = 0; n < this.annotationTags.length; n++) {
		var annotationTag = this.annotationTags[n];
		if (annotationTag.color.toUpperCase() == color.toUpperCase()) {
			return annotationTag;
		}
	}

	/* Not found */
	return null;
};

/**
 * Cleans up this GeneticElement.
 */
Eplant.GeneticElement.prototype.remove = function() {
	/* Clean up Views */
	for (var n = 0; n < this.views; n++) {
		this.views[n].remove();
	}

	/* Clean up GeneticElementDialog */
	this.geneticElementDialog.remove();
};

})();
