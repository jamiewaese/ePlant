/**
 * ViewHistoryDialog class for ePlant
 * By Hans Yu
 */

Eplant.ViewHistoryDialog = function() {
	this.items = [];

	/* Create element */
	this.containerElement = document.createElement("div");
	for (var n = Eplant.viewHistory.length - 1; n >= 0; n--) {
		var item = new Eplant.ViewHistoryDialog.Item(n, this);
		if (n == Eplant.viewHistorySelected) {
			item.spanElement.innerHTML += " (ACTIVE)";
			item.spanElement.style.fontWeight = "bold";
		}
		this.items.push(item);
	}

	/* Create dialog */
	$(this.containerElement).dialog({
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
			$(this.containerElement).remove();
		}, this)
	});

	$(this.containerElement).css("maxHeight", 200);
};

/* Close annotation dialog */
Eplant.ViewHistoryDialog.prototype.close = function() {
	$(this.containerElement).dialog("close");
};