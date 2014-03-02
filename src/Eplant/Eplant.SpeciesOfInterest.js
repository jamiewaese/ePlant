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

		/* Update elementsOfInterest panel */
		Eplant.updateElementsOfInterestPanel();

		/* Sync with view-specific annotations */
		this.chromosomeView.addAnnotation(new ChromosomeView.Annotation(elementOfInterest, this.chromosomeView));
	}

	return elementOfInterest;
};

/* Removes the given ElementOfInterest object from the array */
Eplant.SpeciesOfInterest.prototype.removeElementOfInterest = function(elementOfInterest) {
	elementOfInterest.remove();
	var index = this.elementsOfInterest.indexOf(elementOfInterest);
	if (index >= 0) {
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

		/* Sync with drop list list */
		Eplant.updateElementsOfInterestPanel();

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
//			annotation.label.underline = false;
			annotation.label.stroke = false;
		}
		annotation = Eplant.speciesOfFocus.chromosomeView.getAnnotation(elementOfFocus);
		if (annotation) {
			annotation.label.size = 14;
//			annotation.label.underline = true;
			annotation.label.stroke = true;
		}

		/* Change elementOfFocus */
		this.elementOfFocus = elementOfFocus;

		/* Update elementsOfInterest panel */
		Eplant.updateElementsOfInterestPanel();

		if (Eplant.speciesOfFocus == this) {
			/* Select corresponding ElementDialog */
			for (var n = 0; n < Eplant.elementDialogs.length; n++) {
				Eplant.elementDialogs[n].unselect();
			}
			var elementDialog = Eplant.getElementDialog(elementOfFocus.element);
			if (elementDialog) elementDialog.select();

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
