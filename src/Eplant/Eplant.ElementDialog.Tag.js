/**
 * ElementDialog Tag class for ePlant
 * By Hans Yu
 */

/* Class constructor */
Eplant.ElementDialog.Tag = function(color, elementDialog) {
	this.color = color;
	this.elementDialog = elementDialog;
	this.containerElement = document.createElement("div");
	this.containerElement.className = "circularTag";
	this.containerElement.style.backgroundColor = color;
	this.selected = false;
	this.containerElement.setAttribute("selected", "false");
	if (this.elementDialog.elementOfInterest) {
		for (var n = 0; n < this.elementDialog.elementOfInterest.tags.length; n++) {
			if (this.elementDialog.elementOfInterest.tags[n].color == this.color) {
				this.selected = true;
				this.containerElement.setAttribute("selected", "true");
			}
		}
	}
	this.containerElement.onclick = $.proxy(function() {
		if (this.elementDialog.elementOfInterest) {
			if (this.selected) {
				this.selected = false;
				this.containerElement.setAttribute("selected", "false");
				for (var n = 0; n < this.elementDialog.elementOfInterest.tags.length; n++) {
					if (this.elementDialog.elementOfInterest.tags[n].color == this.color) {
						this.elementDialog.elementOfInterest.tags.splice(n, 1);
						break;
					}
				}
			}
			else {
				this.selected = true;
				this.containerElement.setAttribute("selected", "true");
				this.elementDialog.elementOfInterest.tags.push(new Eplant.ElementOfInterest.Tag(this.color));
			}
		}
	}, this);
};