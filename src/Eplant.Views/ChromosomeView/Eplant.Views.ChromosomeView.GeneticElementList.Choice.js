(function() {

/**
 * Eplant.Views.ChromosomeView.GeneticElementList.Choice class
 * Coded by Hans Yu
 * UI designed by Jamie Waese
 *
 * Describes a Choice of the GeneticElementList in ChromosomeView
 *
 * @constructor
 */
Eplant.Views.ChromosomeView.GeneticElementList.Choice = function(geneticElement, geneticElementList) {
	/* Attributes */
	this.geneticElement = geneticElement;		// GeneticElement associated with this Choice object
	this.geneticElementList = geneticElementList;	// SelectList object that owns this Choice object
	this.dom = null;			// DOM element of this Choice

	/* Create DOM */
	this.createDOM();

	/* Append DOM to the GeneticElementList container */
	$(this.geneticElementList.domContainer).append(this.dom);
};

/**
 * Creates the DOM element
 */
Eplant.Views.ChromosomeView.GeneticElementList.Choice.prototype.createDOM = function() {
	/* Create DOM element */
	this.dom = document.createElement("span");

	/* Set CSS class for styling */
	$(this.dom).addClass("eplant-geneticElementList-choice");

	/* Set content */
	var content = this.geneticElement.identifier;
	if (this.geneticElement.aliases && this.geneticElement.aliases.length && this.geneticElement.aliases[0]) {
		content += " / " + this.geneticElement.aliases.join(", ");
	}
	$(this.dom).html(content);

	/* Bind event handler to the "mouseover" event */
	$(this.dom).mouseover($.proxy(function() {
		/* Open GeneticElementDialog, if not already open */
		if (!this.geneticElement.geneticElementDialog) {
			var halfWidth = this.geneticElementList.chromosome.getScreenWidth() / 2;
			var outerWidth = $(this.geneticElementList.domContainer).outerWidth();
			var x = (this.geneticElementList.orientation == "left") ? 
				this.geneticElementList.x - halfWidth - this.geneticElementList.xOffset - outerWidth : 
				this.geneticElementList.x + halfWidth + this.geneticElementList.xOffset + outerWidth;
			var y = $(this.dom).offset().top - $(ZUI.canvas).offset().top + $(this.dom).height() / 2;
			this.geneticElement.geneticElementDialog = new Eplant.GeneticElementDialog(this.geneticElement, 
				x, y, this.geneticElementList.orientation);
		}
	}, this));

	/* Bind event handler to the "mouseout" event */
	$(this.dom).mouseout($.proxy(function() {
		/* Close GeneticElementDialog, if open and not pinned */
		if (this.geneticElement.geneticElementDialog && !this.geneticElement.geneticElementDialog.pinned) {
			this.geneticElement.geneticElementDialog.close();
			this.geneticElement.geneticElementDialog = null;
		}
	}, this));

	/* Bind event handler to the "click" event */
	$(this.dom).click($.proxy(function() {
		/* Pin GeneticElementDialog */
		if (this.geneticElement.geneticElementDialog) {
			this.geneticElement.geneticElementDialog.pinned = true;
		}
	}, this));
};

/**
 * Cleans up this Choice object for disposal.
 */
Eplant.Views.ChromosomeView.GeneticElementList.Choice.prototype.remove = function() {
	/* Remove DOM element */
	$(this.dom).remove();
};

})();
