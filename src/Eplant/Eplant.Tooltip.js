Eplant.Tooltip = function(attributes) {
	this.data = {};

	this.containerElement = document.createElement("div");
	this.containerElement.style.padding = "0";
	this.containerElement.style.margin = "0";
	if (attributes.content) {
		if (attributes.content.nodeName) {
			this.containerElement.appendChild(attributes.content);
		}
		else {
			this.containerElement.innerHTML = attributes.content;
		}
	}

	this.containerElement.addEventListener("mousemove", function(event) {
		var e = new Event(event.type);
		for (var key in event) {
			e[key] = event[key];
		}
		ZUI.canvas.dispatchEvent(e);
	});

	var x = ZUI.mouseStatus.x, y = ZUI.mouseStatus.y;
	var my = (x > ZUI.width / 2) ? "right-25" : "left+25";

	$(this.containerElement).dialog({
		minWidth: 0,
		minHeight: 0,
		width: "auto",
		resizable: false,
		dialogClass: "tooltip",
		position: {
			my: my + " center",
			at: "left+" + x + " top+" + y,
			of: ZUI.canvas
		},
		closeOnEscape: false
	});

	/* Add arrow to tooltip */
	var orientation = (x > ZUI.width / 2) ? "right" : "left";
	var arrow = document.createElement("div");
	arrow.className = "tooltip-" + orientation + "-arrow";
	var arrow_inside = document.createElement("div");
	arrow_inside.className = "tooltip-" + orientation + "-arrow-inside";
	arrow.appendChild(arrow_inside);
	this.containerElement.parentNode.appendChild(arrow);
};

Eplant.Tooltip.prototype.remove = function() {
	$(this.containerElement).remove();
};
