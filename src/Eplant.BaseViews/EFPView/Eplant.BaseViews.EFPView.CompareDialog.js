(function() {

/**
 * Eplant.BaseViews.EFPView.CompareDialog class
 * Coded by Hans Yu
 * UI designed by Jamie Waese
 *
 * Dialog for user to choose which GeneticElement to compare to in an eFP view.
 *
 * @constructor
 * @param {Eplant.BaseViews.EFPView} eFPView The EFPView that owns this dialog.
 */
Eplant.BaseViews.EFPView.CompareDialog = function(eFPView) {
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
Eplant.BaseViews.EFPView.CompareDialog.prototype.createDOM = function() {
	/* Container */
	this.domContainer = document.createElement("div");

	/* Get GeneticElements of the parent Species */
	var geneticElements = this.eFPView.geneticElement.species.geneticElements;

	/* Select */
	this.domSelect = document.createElement("select");
	$(this.domSelect).width(220);
	$(this.domSelect).attr("size", 6);
	for (var n = 0; n < geneticElements.length; n++) {
		/* Get GeneticElement */
		var geneticElement = geneticElements[n];

		/* Skip if views of this GeneticElement are not loaded or this is the GeneticElement that is to be compared */
		if (!geneticElement.isLoadedViews || geneticElement == this.eFPView.geneticElement) {
			continue;
		}

		/* Create option */
		var option = document.createElement("option");
		$(option).val(geneticElement.identifier);
		var text = geneticElement.identifier;
		if (geneticElement.aliases && geneticElement.aliases.length && geneticElement.aliases[0].length) {
			text += " / " + geneticElement.aliases.join(", ");
		}
		$(option).html(text);
		$(this.domSelect).append(option);
	}

	/* Select first option by default */
	var options = $(this.domSelect).children("option");
	if (options.length) {
		$(this.domSelect).prop("selectedIndex", 0);
	}
	$(this.domContainer).append(this.domSelect);
};

/**
 * Creates and opens the dialog.
 */
Eplant.BaseViews.EFPView.CompareDialog.prototype.createDialog = function() {
	$(this.domContainer).dialog({
		title: "Compare " + this.eFPView.geneticElement.identifier + " to...",
		width: 250,
		height: "auto",
		minHeight: 0,
		resizable: false,
		modal: true,
		buttons: [
			{
				text: "Compare",
				click: $.proxy(function(event, ui) {
					/* Check whether something is selected */
					if ($(this.domSelect).prop("selectedIndex") < 0) {	// No
						alert("Please select a gene! If you don't see the gene you want, please load the data for the gene and try again.");
					}
					else {		// Yes
						var identifier = $(this.domSelect).children("option:selected").val();
						var geneticElement = this.eFPView.geneticElement.species.getGeneticElementByIdentifier(identifier);
						this.eFPView.compare(geneticElement);
					}
					this.close();
				}, this)
			},
			{
				text: "Close",
				click: $.proxy(function(event, ui) {
					this.close();
				}, this)
			}
		],
		close: $.proxy(function(event, ui) {
			this.remove();
		}, this)
	});
};

/**
 * Closes the dialog.
 */
Eplant.BaseViews.EFPView.CompareDialog.prototype.close = function() {
	/* Close dialog */
	$(this.domContainer).dialog("close");
};

/**
 * Removes the dialog.
 */
Eplant.BaseViews.EFPView.CompareDialog.prototype.remove = function() {
	/* Remove DOM elements */
	$(this.domContainer).remove();
};

})();