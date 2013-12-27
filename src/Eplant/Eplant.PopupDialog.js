/**
 * PopupDialog class for ePlant
 * By Hans Yu
 */

Eplant.PopupDialog = function(attributes) {
	this.x = (attributes.x === undefined) ? 0 : attributes.x;
	this.y = (attributes.y === undefined) ? 0 : attributes.y;
	this.width = (attributes.width === undefined) ? "auto" : attributes.width;
	this.height = (attributes.height === undefined) ? "auto" : attributes.height;
	this.maxHeight = (attributes.maxHeight === undefined) ? 0 : attributes.maxHeight;
	this.orientation = (attributes.orientation === undefined) ? ((this.x < ZUI.width / 2) ? "right" : "left") : attributes.orientation;
	this.xOffset = (attributes.xOffset === undefined) ? 0 : attributes.xOffset;
	this.yOffset = (attributes.yOffset === undefined) ? 0 : attributes.yOffset;
	this.title = (attributes.title === undefined) ? null : attributes.title;
	this.dialogClass = (attributes.dialogClass === undefined) ? "" : attributes.dialogClass;
	this.modal = (attributes.modal === undefined) ? false : attributes.modal;
	this.resizable = (attributes.resizable === undefined) ? false : attributes.resizable;
	this.containerElement = document.createElement("div");
};

Eplant.PopupDialog.prototype.open = function() {
	var parentPosition = $(ZUI.container).position();
	var hPosition = (this.orientation == "left") ? "right" : "left";
	var xOffset = (this.orientation == "left") ? -this.xOffset : this.xOffset;

	$(this.containerElement).dialog({
		title: this.title,
		dialogClass: this.dialogClass,
		position: {
			my: hPosition + " top",
			at: "left+" + (this.x + xOffset) +" top+" + (this.y + this.yOffset),
			of: ZUI.canvas
		},
		width: this.width,
		height: this.height,
		minHeight: 0,
		maxHeight: (this.maxHeight) ? this.maxHeight : "none",
		resizable: this.resizable,
		modal: this.modal,
		close: $.proxy(function(event, ui) {
			$(this.containerElement).remove();
			this.onclose();
		}, this)
	});
};

Eplant.PopupDialog.prototype.close = function() {
	$(this.containerElement).dialog("close");
};

Eplant.PopupDialog.prototype.onclose = function() {};


