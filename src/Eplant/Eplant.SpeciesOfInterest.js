/**
 * SpeciesOfInterest class for ePlant
 * By Hans Yu
 */

/* Class constructor */
Eplant.SpeciesOfInterest = function(species) {
	/**
	 * The associated species object.
	 */
	this.species = species;

	/**
	 * Array of ElementOfInterest objects.
	 */
	this.elementsOfInterest = [];

	/**
	 * The ElementOfInterest object that is in focus.
	 */
	Eplant.elementOfFocus = null;

	this.chromosomeView = new ChromosomeView(this.species);
};

/* Gets elementsOfInterest */
Eplant.SpeciesOfInterest.prototype.getElementsOfInterest = function() {
	return this.elementsOfInterest;
};

/* Adds a new ElementOfInterest object to the array and returns the object */
Eplant.SpeciesOfInterest.prototype.addElementOfInterest = function(element, attributes) {
	var elementOfInterest = this.getElementOfInterest(element);
	if (elementOfInterest == null) {
		elementOfInterest = new Eplant.ElementOfInterest(element, this);
		this.elementsOfInterest.push(elementOfInterest);

		/* Store attributes */
		if (attributes.size !== undefined) elementOfInterest.size = attributes.size;
		if (attributes.color !== undefined) elementOfInterest.color = attributes.color;
		if (attributes.tags !== undefined) {
			for (var n = 0; n < attributes.tags.length; n++) {
				elementOfInterest.tags.push(new Eplant.ElementOfInterest.Tag(attributes.tags[n], elementOfInterest));
			}
		}

		/* Sync with drop down list */
		var option = document.createElement("option");
		option.value = elementOfInterest.element.identifier;
		option.innerHTML = elementOfInterest.element.identifier;
		document.getElementById("elementsOfInterest").appendChild(option);

		/* Sync with view-specific annotations */
		this.chromosomeView.addAnnotation(new ChromosomeView.Annotation(elementOfInterest, this.chromosomeView));
	}

	return elementOfInterest;
};

/* Removes the given ElementOfInterest object from the array */
Eplant.SpeciesOfInterest.prototype.removeElementOfInterest = function(elementOfInterest) {
	var index = this.elementsOfInterest.indexOf(elementOfInterest);
	if (index >= 0) {
		/* Sync with drop list list */
		var options = document.getElementById("elementsOfInterest").getElementsByTagName("option");
		for (var n = 0; n < options.length; n++) {
			if (options[n].value == elementOfInterest.element.identifier) {
				document.getElementById("elementsOfInterest").removeChild(options[n]);
				break;
			}
		}
		this.elementsOfInterest.splice(index, 1);
		if (this.elementOfFocus == elementOfInterest) {
			if (this.elementsOfInterest.length > 0) {
				this.setElementOfFocus(this.elementsOfInterest[0]);
			}
			else {
				this.elementOfFocus = null;
			}
			this.elementOfFocus = (this.elementsOfInterest.length > 0) ? this.elementsOfInterest[0] : null;
		}

		/* Sync with view-specific annotations */
		var annotation = this.chromosomeView.getAnnotation(elementOfInterest);
		if (annotation) annotation.remove();

		/* Sync with view history */
		for (n = 0; n < Eplant.viewHistory.length; n++) {
			if (Eplant.viewHistory[n].element && Eplant.viewHistory[n].element == elementOfInterest.element) {
				Eplant.viewHistory.splice(n, 1);
				if (Eplant.viewHistorySelected > n) Eplant.viewHistorySelected--;
			}
		}
	}
};

/* Returns the ElementOfInterest object associated with the given Element object */
Eplant.SpeciesOfInterest.prototype.getElementOfInterest = function(element) {
	for (var n = 0; n < this.elementsOfInterest.length; n++) {
		if (this.elementsOfInterest[n].element == element) {
			return this.elementsOfInterest[n];
		}
	}
	return null;
};

/* Returns the ElementOfInterest object associated with the given element identifier */
Eplant.SpeciesOfInterest.prototype.getElementOfInterestByIdentifier = function(identifier) {
	for (var n = 0; n < this.elementsOfInterest.length; n++) {
		if (this.elementsOfInterest[n].element.identifier.toUpperCase() == identifier.toUpperCase()) {
			return this.elementsOfInterest[n];
		}
	}
	return null;
};

/* Set elementOfFocus */
Eplant.SpeciesOfInterest.prototype.setElementOfFocus = function(elementOfFocus) {
	if (this.elementOfFocus != elementOfFocus) {
		/* Sync with views */
		var annotation = Eplant.speciesOfFocus.chromosomeView.getAnnotation(this.elementOfFocus);
		if (annotation) {
			annotation.label.size = 12;
			annotation.label.underline = false;
		}
		annotation = Eplant.speciesOfFocus.chromosomeView.getAnnotation(elementOfFocus);
		if (annotation) {
			annotation.label.size = 14;
			annotation.label.underline = true;
		}

		/* Change elementOfFocus */
		this.elementOfFocus = elementOfFocus;

		if (Eplant.speciesOfFocus == this) {
			/* Select corresponding ElementDialog */
			for (var n = 0; n < Eplant.elementDialogs.length; n++) {
				Eplant.elementDialogs[n].unselect();
			}
			var elementDialog = Eplant.getElementDialog(elementOfFocus.element);
			if (elementDialog) elementDialog.select();

			/* Sync with drop down menu */
			if (elementOfFocus != null) {
				var elementsOfInterest = document.getElementById("elementsOfInterest");
				if (elementsOfInterest.options[elementsOfInterest.selectedIndex].value != elementOfFocus.element.identifier) {
					for (var n = 1; n < elementsOfInterest.options.length; n++) {
						if (elementsOfInterest.options[n].value == elementOfFocus.element.identifier) {
							elementsOfInterest.selectedIndex = n;
							break;
						}
					}
				}
			}

			/* Update current view */
			if (ZUI.activeView instanceof InteractionView) {
				ZUI.changeActiveView(elementOfFocus.interactionView, null, null);
			}
			else if (ZUI.activeView instanceof PlantView) {
				ZUI.changeActiveView(elementOfFocus.plantView, null, null);
			}
			else if (ZUI.activeView instanceof WorldView) {
				ZUI.changeActiveView(elementOfFocus.worldView, null, null);
			}
			else if (ZUI.activeView instanceof ExperimentView) {
				ZUI.changeActiveView(elementOfFocus.experimentView, null, null);
			}
			else if (ZUI.activeView instanceof CellView) {
				ZUI.changeActiveView(elementOfFocus.cellView, null, null);
			}
			else if (ZUI.activeView instanceof PathwayView) {
				ZUI.changeActiveView(elementOfFocus.pathwayView, null, null);
			}
			else if (ZUI.activeView instanceof MoleculeView) {
				ZUI.changeActiveView(elementOfFocus.moleculeView, null, null);
			}
			else if (ZUI.activeView instanceof SequenceView) {
				ZUI.changeActiveView(elementOfFocus.sequenceView, null, null);
			}
		}
	}
};
