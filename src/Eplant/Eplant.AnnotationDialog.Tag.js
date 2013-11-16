/**
 * AnnotationDialog Tag class for ePlant
 * By Hans Yu
 */

/* Class constructor */
Eplant.AnnotationDialog.Tag = function(color) {
	this.color = color;
	this.selected = false;

	this.containerElement = document.createElement("div");
	this.containerElement.className = "circularTag";
	this.containerElement.style.backgroundColor = color;
	this.containerElement.setAttribute("selected", "false");
	this.containerElement.onclick = $.proxy(function() {
		if (this.selected) {
			this.selected = false;
			this.containerElement.setAttribute("selected", "false");
		}
		else {
			this.selected = true;
			this.containerElement.setAttribute("selected", "true");
		}
	}, this);
};