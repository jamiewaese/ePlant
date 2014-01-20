/**
 * ElementListDialogItem class
 * Describes itmes in an ElementListDialog
 *
 * UI design by Jamie Waese
 * Code by Hans Yu
 */

/* Constructor */
ChromosomeView.ElementListDialogItem = function(element, elementListDialog) {
	/* Store parameters as attributes */
	this.element = element;
	this.elementListDialog = elementListDialog;

	/* Create element */
	this.containerElement = document.createElement("span");
	this.containerElement.innerHTML = element.identifier;
	if (element.aliases != null && element.aliases.length > 0 && element.aliases[0].length > 0) {
		this.containerElement.innerHTML += " / " + element.aliases.join(", ");
	}
	this.containerElement.className = "elementListDialogItem";
	this.elementListDialog.containerElement.appendChild(this.containerElement);

	/* Mouse over event handler */
	this.containerElement.onmouseover = $.proxy(function() {
		/* Create element dialog */
		if (Eplant.getElementDialog(this.element) == null) {
			var elementDialog = new Eplant.ElementDialog({
				x: (this.elementListDialog.orientation == "left") ? this.elementListDialog.x - this.elementListDialog.xOffset - $(this.elementListDialog.containerElement).outerWidth() : this.elementListDialog.x + this.elementListDialog.xOffset + $(this.elementListDialog.containerElement).outerWidth(),
				y: $(this.containerElement).offset().top - $(ZUI.canvas).offset().top + $(this.containerElement).height() / 2,
				orientation: this.elementListDialog.orientation,
				element: this.element,
			});
		}
	}, this);

	/* Mouse out event handler */
	this.containerElement.onmouseout = $.proxy(function() {
		/* Close element dialog */
		var elementDialog = Eplant.getElementDialog(this.element);
		if (elementDialog != null && !elementDialog.pinned) {
			elementDialog.close();
		}
	}, this);

	/* Click event handler */
	this.containerElement.onclick = $.proxy(function() {
		/* Pin element dialog */
		var elementDialog = Eplant.getElementDialog(this.element);
		if (elementDialog != null) {
			elementDialog.pinned = true;
		}
	}, this);
};