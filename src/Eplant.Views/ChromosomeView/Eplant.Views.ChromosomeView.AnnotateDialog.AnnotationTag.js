(function() {

/**
 * Eplant.Views.ChromosomeView.AnnotateDialog.AnnotationTag class
 * By Hans Yu
 *
 * Describes an AnnotationTag in a AnnotateDialog.
 *
 * @constructor
 * @param {String} color Color of the AnnotationTag.
 * @param {Eplant.Views.ChromosomeView.AnnotateDialog} annotateDialog The AnnotateDialog that owns this AnnotationTag.
 */
Eplant.Views.ChromosomeView.AnnotateDialog.AnnotationTag = function(color, annotateDialog) {
	/* Attributes */
	this.color = color;						// Color of the AnnotationTag
	this.annotateDialog = annotateDialog;			// The AnnotateDialog that owns this AnnotationTag
	this.isSelected = false;					// Whether this AnnotationTag is selected
	this.domContainer = null;					// The DOM container.

	/* Create DOM elements */
	this.createDOM();
};

/**
 * Creates DOM elements.
 */
Eplant.Views.ChromosomeView.AnnotateDialog.AnnotationTag.prototype.createDOM = function() {
	this.domContainer = document.createElement("div");
	$(this.domContainer).addClass("eplant-chromosomeView-annotateDialog-annotationTag");
	$(this.domContainer).css({"background-color": this.color});
	$(this.domContainer).attr("data-selected", this.isSelected.toString());
	$(this.domContainer).click($.proxy(function() {
		this.isSelected = !this.isSelected;
		$(this.domContainer).attr("data-selected", this.isSelected.toString());
	}, this));
};

/**
 * Cleans up this AnnotationTag.
 */
Eplant.Views.ChromosomeView.AnnotateDialog.AnnotationTag.prototype.remove = function() {
	/* Remove DOM elements */
	$(this.domContainer).remove();
};

})();

