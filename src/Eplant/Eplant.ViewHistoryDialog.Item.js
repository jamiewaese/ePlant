Eplant.ViewHistoryDialog.Item = function(index, viewHistoryDialog) {
	this.index = index;
	this.view = Eplant.viewHistory[index];
	this.viewHistoryDialog = viewHistoryDialog;
	this.spanElement = document.createElement("span");
	this.spanElement.className = "viewHistoryDialogItem";
	var viewName;
	var target;
	if (this.view instanceof SpeciesView) {
		viewName = "species";
		target = "ePlant";
	}
	else if (this.view instanceof ChromosomeView) {
		viewName = "chromosome";
		target = this.view.species.scientificName;
	}
	else if (this.view instanceof InteractionView) {
		viewName = "interactions";
		target = this.view.element.identifier;
	}
	else if (this.view instanceof PlantView) {
		viewName = "plant";
		target = this.view.element.identifier;
	}
	else if (this.view instanceof WorldView) {
		viewName = "world";
		target = this.view.element.identifier;
	}

	this.spanElement.innerHTML = target + ": " + viewName + " viewer";
	this.spanElement.onclick = $.proxy(function() {
		this.viewHistoryDialog.close();
		Eplant.viewHistorySelected = this.index;
		Eplant.setView(this.view);
	}, this);
	viewHistoryDialog.containerElement.appendChild(this.spanElement);
};