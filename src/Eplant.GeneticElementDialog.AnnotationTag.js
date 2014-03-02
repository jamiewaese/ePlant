(function() {

/**
 * Eplant.GeneticElementDialog.AnnotationTag class
 * By Hans Yu
 *
 * Describes an AnnotationTag in a GeneticElementDialog.
 *
 * @constructor
 * @param {Eplant.GeneticElement.AnnotationTag} annotationTag GeneticElement AnnotationTag corresponding to this GeneticElementDialog AnnotationTag.
 * @param {Eplant.GeneticElementDialog} geneticElementDialog The GeneticElementDialog that owns this AnnotationTag.
 */
Eplant.GeneticElementDialog.AnnotationTag = function(annotationTag, geneticElementDialog) {
	/* Attributes */
	this.annotationTag = annotationTag;			// GeneticElement AnnotationTag corresponding to this GeneticElementDialog AnnotationTag
	this.geneticElementDialog = geneticElementDialog;	// The GeneticElementDialog that owns this AnnotationTag
	this.domContainer = null;					// The DOM container.
	this.updateEventListener = null;

	/* Set up eventListener for update-annotationTags */
	var eventListener = new ZUI.EventListener("update-annotationTags", this.annotationTag.geneticElement, $.proxy(function() {
		$(this.domContainer).attr("data-selected", this.annotationTag.isSelected.toString());
	}, this), {
	});
	ZUI.addEventListener(eventListener);

	/* Create DOM elements */
	this.createDOM();
};

/**
 * Creates DOM elements.
 */
Eplant.GeneticElementDialog.AnnotationTag.prototype.createDOM = function() {
	this.domContainer = document.createElement("div");
	$(this.domContainer).addClass("eplant-geneticElementDialog-annotationTag");
	$(this.domContainer).css({"background-color": this.annotationTag.color});
	$(this.domContainer).attr("data-selected", this.annotationTag.isSelected.toString());
	$(this.domContainer).click($.proxy(function() {
		if (this.geneticElementDialog.geneticElement.isLoadedViews) {
			if (this.annotationTag.isSelected) {
				this.annotationTag.unselect();
			}
			else {
				this.annotationTag.select();
			}
		}
	}, this));
};

/**
 * Cleans up this AnnotationTag.
 */
Eplant.GeneticElementDialog.AnnotationTag.prototype.remove = function() {
	/* Remove DOM elements */
	$(this.domContainer).remove();

	/* Remove EventListeners */
	ZUI.removeEventListener(eventListener);
};

})();

