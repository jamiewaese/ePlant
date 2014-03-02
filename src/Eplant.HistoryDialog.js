(function() {

/**
 * Eplant.HistoryDialog class
 * Coded by Hans Yu
 * UI designed by Jamie Waese
 *
 * This class describes a dialog that allows the user to choose history items.
 *
 * @constructor
 */
Eplant.HistoryDialog = function() {
	// Attributes
	this.domContainer = null;

	// Create DOM elements
	this.createDOM();

	// Create and open dialog
	this.createDialog();
};

/**
 * Creates DOM elements for the dialog.
 */
Eplant.HistoryDialog.prototype.createDOM = function() {
	// Container
	this.domContainer = document.createElement("div");

	// History items
	var items = Eplant.history.items;
	for (var n = 0; n < items.length; n++) {
		// Get history item
		var item = items[n];

		// Get view
		var view = item.view;

		// Generate target label string
		var targetLabel;
		if (view.hierarchy == "ePlant") {
			targetLabel = "ePlant";
		}
		else if (view.hierarchy == "species") {
			targetLabel = "<i>" + view.species.scientificName + "</i>";
		}
		else if (view.hierarchy == "genetic element") {
			targetLabel = "<i>" + view.geneticElement.species.scientificName + "</i>"
				 + " - " + view.geneticElement.identifier;
		}

		// DOM
		var domSpan = document.createElement("span");
		$(domSpan).addClass("eplant-historyItem");
		$(domSpan).html(view.name + " (" + targetLabel + ")");
		if (item == Eplant.history.activeItem) {
			$(domSpan).css({"font-weight": "bold"});
		}

		// Bind events
		var wrapper = {
			item: item,
			historyDialog: this
		};
		$(domSpan).click($.proxy(function() {
			Eplant.history.changeActiveItem(this.item);
			this.historyDialog.close();
		}, wrapper));

		// Append item
		$(this.domContainer).append(domSpan);
	}
};

/**
 * Creates the dialog.
 */
Eplant.HistoryDialog.prototype.createDialog = function() {
	$(this.domContainer).dialog({
		title: "View History",
		width: 450,
		minHeight: 0,
		resizable: false,
		modal: true,
		buttons: [
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
Eplant.HistoryDialog.prototype.close = function() {
	/* Close dialog */
	$(this.domContainer).dialog("close");
};

/**
 * Removes the dialog.
 */
Eplant.HistoryDialog.prototype.remove = function() {
	/* Remove DOM elements */
	$(this.domContainer).remove();
};

})();