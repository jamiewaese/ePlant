(function() {

/**
 * Eplant.GeneticElement.AnnotationTag class
 * By Hans Yu
 *
 * Describes an AnnotationTag of a GeneticElement.
 *
 * @constructor
 * @param {String} color Color HEX of the AnnotationTag.
 * @param {Eplant.GeneticElement} geneticElement The GeneticElement that owns this AnnotationTag.
 */
Eplant.GeneticElement.AnnotationTag = function(color, geneticElement) {
	/* Attributes */
	this.color = color;				// Color HEX of the AnnotationTag
	this.geneticElement = geneticElement;	// The GeneticElement that owns this AnnotationTag
	this.isSelected = false;			// Whether this AnnotationTag is selected
};

/**
 * Selects this AnnotationTag.
 */
Eplant.GeneticElement.AnnotationTag.prototype.select = function() {
	/* Update select status */
	this.isSelected = true;

	/* Fire event for updating AnnotationTags */
	var event = new ZUI.Event("update-annotationTags", this.geneticElement, null);
	ZUI.fireEvent(event);
};

/**
 * Unselects this AnnotationTag.
 */
Eplant.GeneticElement.AnnotationTag.prototype.unselect = function() {
	/* Update select status */
	this.isSelected = false;

	/* Fire event for updating AnnotationTags */
	var event = new ZUI.Event("update-annotationTags", this.geneticElement, null);
	ZUI.fireEvent(event);
};

/**
 * Define AnnotationTag colors.
 */
Eplant.GeneticElement.AnnotationTag.Colors = [
	"#D21315",
	"#CCBB00",
	"#99CC00",
	"#00CCDD",
	"#2C81D3",
	"#BB00DD"
];

})();
