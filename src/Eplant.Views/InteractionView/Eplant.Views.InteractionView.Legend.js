(function() {

/**
 * Eplant.Views.InteractionView.Legend class
 * Coded by Hans Yu
 * UI designed by Jamie Waese
 *
 * @constructor
 * @param {Eplant.Views.InteractionView} interactionView The InteractionView that owns this legend.
 */
Eplant.Views.InteractionView.Legend = function(interactionView) {
	/* Attributes */
	this.interactionView = interactionView;		// The InteractionView that owns this legend
	this.domContainer = null;				// DOM container for the legend
	this.isVisible = false;				// Whether this legend is visible
};

/**
 * Attaches the legend to the view.
 */
Eplant.Views.InteractionView.Legend.prototype.attach = function() {
	$(ZUI.container).append(this.domContainer);
};

/**
 * Detaches the legend to the view.
 */
Eplant.Views.InteractionView.Legend.prototype.detach = function() {
	$(this.domContainer).detach();
};

/**
 * Makes the legend visible.
 */
Eplant.Views.InteractionView.Legend.prototype.show = function() {
	this.isVisible = true;
	if (ZUI.activeView == this.interactionView) {
		this.attach();
	}
};

/**
 * Hides the legend.
 */
Eplant.Views.InteractionView.Legend.prototype.hide = function() {
	this.isVisible = false;
	if (ZUI.activeView == this.interactionView) {
		this.detach();
	}
};

/**
 * Removes the legend.
 */
Eplant.Views.InteractionView.Legend.prototype.remove = function() {
	/* Remove DOM elements */
	$(this.domContainer).remove();
};

})();