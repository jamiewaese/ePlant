(function() {

/**
 * Eplant.BaseViews.EFPView.PaletteDialog class
 * Coded by Hans Yu
 * UI designed by Jamie Waese
 *
 * Dialog for user to choose colors for an eFP view.
 *
 * @constructor
 * @param {Eplant.BaseViews.EFPView} eFPView The EFPView that owns this dialog.
 */
Eplant.BaseViews.EFPView.PaletteDialog = function(eFPView) {
	/* Attributes */
	this.eFPView = eFPView;		// Parent EFPView
	this.domContainer = null;		// DOM container element

	/* Create DOM elements */
	this.createDOM();

	/* Create and open dialog */
	this.createDialog();
};

/**
 * Creates DOM elements.
 */
Eplant.BaseViews.EFPView.PaletteDialog.prototype.createDOM = function() {
	/* Container */
	this.domContainer = document.createElement("div");
};

/**
 * Creates and opens the dialog.
 */
Eplant.BaseViews.EFPView.PaletteDialog.prototype.createDialog = function() {
};

/**
 * Closes the dialog.
 */
Eplant.BaseViews.EFPView.PaletteDialog.prototype.close = function() {
	/* Close dialog */
	$(this.domContainer).dialog("close");
};

/**
 * Removes the dialog.
 */
Eplant.BaseViews.EFPView.PaletteDialog.prototype.remove = function() {
	/* Remove DOM elements */
	$(this.domContainer).remove();
};

})();