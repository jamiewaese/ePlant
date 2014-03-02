(function() {

/**
 * Eplant.Tooltip class
 * By Hans Yu
 *
 * Tooltip that overlays on top of the ePlant canvas without needing to attach to a DOM element.
 *
 * @constructor
 * @param {Object} configs Configuration wrapped in an object.
 * @param {String|Element} configs.content Content of the tooltip.
 */
Eplant.Tooltip = function(configs) {
	/* Attributes */
	this.content = (configs.content === undefined) ? "" : configs.content;	// Content of the tooltip
	this.domContainer = null;		// DOM container

	/* Create DOM container */
	this.domContainer = document.createElement("div");
	$(this.domContainer).css({
		"padding": "0",
		"margin": "0",
		"pointer-events": "none"
	});

	/* Append content */
	$(this.domContainer).append(this.content);

	/* Get tooltip orientation */
	var x = ZUI.mouseStatus.x;
	var y = ZUI.mouseStatus.y;
	var my = (x > ZUI.width / 2) ? "right-25" : "left+25";

	/* Create tooltip as jQuery UI Dialog */
	$(this.domContainer).dialog({
		minWidth: 0,
		minHeight: 0,
		width: "auto",
		resizable: false,
		dialogClass: "eplant-tooltip",
		position: {
			my: my + " center",
			at: "left+" + x + " top+" + y,
			of: ZUI.canvas
		},
		closeOnEscape: false,
		close: $.proxy(function(event, ui) {
			this.remove();
		}, this)
	});

	/* Add arrow to tooltip */
	var orientation = (x > ZUI.width / 2) ? "right" : "left";
	var arrow = document.createElement("div");
	$(arrow).addClass("eplant-tooltip-" + orientation + "Arrow");
	var innerArrow = document.createElement("div");
	$(innerArrow).addClass("eplant-tooltip-" + orientation + "Arrow-inner");
	$(arrow).append(innerArrow);
	$(this.domContainer).parent().append(arrow);
};

/**
 * Closes the tooltip.
 */
Eplant.Tooltip.prototype.close = function() {
	$(this.domContainer).dialog("close");
};

/**
 * Removes the tooltip.
 */
Eplant.Tooltip.prototype.remove = function() {
	$(this.domContainer).remove();
};

})();