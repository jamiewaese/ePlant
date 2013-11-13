//////////////////////
/* ePlant namespace */
//////////////////////
function Eplant() {}



////////////
/* Update */
////////////

/**
 * Updates the ePlant application regardless of view.
 */
Eplant.update = function() {
	/////////////////////////////////////////////////////////////////
	/* Sync icons dock with views of elementOfFocus of speciesOfFocus */
	/////////////////////////////////////////////////////////////////

	/* SpeciesView */
	if (Eplant.getSpeciesView() != null && Eplant.getSpeciesView() == ZUI.activeView) {
		document.getElementById("speciesViewIcon").getElementsByTagName("img")[0].src = "img/active/species.png";
	}
	else {
		document.getElementById("speciesViewIcon").getElementsByTagName("img")[0].src = "img/available/species.png";
	}

	/* ChromosomeView */
	if (Eplant.speciesOfFocus != null && Eplant.speciesOfFocus.chromosomeView == ZUI.activeView) {
		document.getElementById("chromosomeViewIcon").getElementsByTagName("img")[0].src = "img/active/chromosome.png";
	}
	else {
		document.getElementById("chromosomeViewIcon").getElementsByTagName("img")[0].src = "img/available/chromosome.png";
	}

	/* WorldView */
	if (Eplant.speciesOfFocus == null || Eplant.speciesOfFocus.elementOfFocus == null || Eplant.speciesOfFocus.elementOfFocus.worldView == null || Eplant.speciesOfFocus.elementOfFocus.worldView.getLoadProgress() < 1) {
		document.getElementById("worldViewIcon").getElementsByTagName("img")[0].src = "img/unavailable/world.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.worldView == ZUI.activeView) {
		document.getElementById("worldViewIcon").getElementsByTagName("img")[0].src = "img/active/world.png";
	}
	else {
		document.getElementById("worldViewIcon").getElementsByTagName("img")[0].src = "img/available/world.png";
	}

	/* PlantView */
	if (Eplant.speciesOfFocus == null || Eplant.speciesOfFocus.elementOfFocus == null || Eplant.speciesOfFocus.elementOfFocus.plantView == null || Eplant.speciesOfFocus.elementOfFocus.plantView.getLoadProgress() < 1) {
		document.getElementById("plantViewIcon").getElementsByTagName("img")[0].src = "img/unavailable/plant.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.plantView == ZUI.activeView) {
		document.getElementById("plantViewIcon").getElementsByTagName("img")[0].src = "img/active/plant.png";
	}
	else {
		document.getElementById("plantViewIcon").getElementsByTagName("img")[0].src = "img/available/plant.png";
	}

	/* CellView */
	if (Eplant.speciesOfFocus == null || Eplant.speciesOfFocus.elementOfFocus == null || Eplant.speciesOfFocus.elementOfFocus.cellView == null || Eplant.speciesOfFocus.elementOfFocus.cellView.getLoadProgress() < 1) {
		document.getElementById("cellViewIcon").getElementsByTagName("img")[0].src = "img/unavailable/cell.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.cellView == ZUI.activeView) {
		document.getElementById("cellViewIcon").getElementsByTagName("img")[0].src = "img/active/cell.png";
	}
	else {
		document.getElementById("cellViewIcon").getElementsByTagName("img")[0].src = "img/available/cell.png";
	}

	/* InteractionView */
	if (Eplant.speciesOfFocus == null || Eplant.speciesOfFocus.elementOfFocus == null || Eplant.speciesOfFocus.elementOfFocus.interactionView == null || Eplant.speciesOfFocus.elementOfFocus.interactionView.getLoadProgress() < 1) {
		document.getElementById("interactionViewIcon").getElementsByTagName("img")[0].src = "img/unavailable/interaction.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.interactionView == ZUI.activeView) {
		document.getElementById("interactionViewIcon").getElementsByTagName("img")[0].src = "img/active/interaction.png";
	}
	else {
		document.getElementById("interactionViewIcon").getElementsByTagName("img")[0].src = "img/available/interaction.png";
	}

	/* PathwayView */
	if (Eplant.speciesOfFocus == null || Eplant.speciesOfFocus.elementOfFocus == null || Eplant.speciesOfFocus.elementOfFocus.pathwayView == null || Eplant.speciesOfFocus.elementOfFocus.pathwayView.getLoadProgress() < 1) {
		document.getElementById("pathwayViewIcon").getElementsByTagName("img")[0].src = "img/unavailable/pathway.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.pathwayView == ZUI.activeView) {
		document.getElementById("pathwayViewIcon").getElementsByTagName("img")[0].src = "img/active/pathway.png";
	}
	else {
		document.getElementById("pathwayViewIcon").getElementsByTagName("img")[0].src = "img/available/pathway.png";
	}

	/* MoleculeView */
	if (Eplant.speciesOfFocus == null || Eplant.speciesOfFocus.elementOfFocus == null || Eplant.speciesOfFocus.elementOfFocus.moleculeView == null || Eplant.speciesOfFocus.elementOfFocus.moleculeView.getLoadProgress() < 1) {
		document.getElementById("moleculeViewIcon").getElementsByTagName("img")[0].src = "img/unavailable/molecule.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.moleculeView == ZUI.activeView) {
		document.getElementById("moleculeViewIcon").getElementsByTagName("img")[0].src = "img/active/molecule.png";
	}
	else {
		document.getElementById("moleculeViewIcon").getElementsByTagName("img")[0].src = "img/available/molecule.png";
	}

	/* SequenceView */
	if (Eplant.speciesOfFocus == null || Eplant.speciesOfFocus.elementOfFocus == null || Eplant.speciesOfFocus.elementOfFocus.sequenceView == null || Eplant.speciesOfFocus.elementOfFocus.sequenceView.getLoadProgress() < 1) {
		document.getElementById("sequenceViewIcon").getElementsByTagName("img")[0].src = "img/unavailable/sequence.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.sequenceView == ZUI.activeView) {
		document.getElementById("sequenceViewIcon").getElementsByTagName("img")[0].src = "img/active/sequence.png";
	}
	else {
		document.getElementById("sequenceViewIcon").getElementsByTagName("img")[0].src = "img/available/sequence.png";
	}
};



//////////////////
/* Species view */
//////////////////

/**
 * The SpeciesView object.
 */
Eplant.speciesView = null;

/**
 * Returns the SpeciesView object.
 */
Eplant.getSpeciesView = function() {
	return Eplant.speciesView;
};

/**
 * Sets the SpeciesView object.
 */
Eplant.setSpeciesView = function(speciesView) {
	Eplant.speciesView = speciesView;
	//TODO sync with drop down list
};



//////////////////////
/* Data of interest */
//////////////////////

/**
 * Array of SpeciesOfInterest objects.
 */
Eplant.speciessOfInterest = [];

/**
 * The SpeciesOfInterest object that is in focus.
 */
Eplant.speciesOfFocus = null;

/**
 * SpeciesOfInterest class.
 * Provides additional attributes to a Species object that are relevant for Eplant features.
 */
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

	/**
	 * WorldView.
	 */
	Eplant.worldView = null;

	/**
	 * PlantView.
	 */
	Eplant.plantView = null;

	/**
	 * CellView.
	 */
	Eplant.cellView = null;

	/**
	 * InteractionView.
	 */
	Eplant.interactionView = null;

	/**
	 * PathwayView.
	 */
	Eplant.pathwayView = null;

	/**
	 * MoleculeView.
	 */
	Eplant.moleculeView = null;

	/**
	 * SequenceView.
	 */
	Eplant.sequenceView = null;
};

	/**
	 * Returns the array of ElementOfInterest objects of this SpeciesOfInterest object.
	 */
	Eplant.SpeciesOfInterest.prototype.getElementsOfInterest = function() {
		return this.elementsOfInterest;
	};

	/**
	 * Adds a new ElementOfInterest object with the provided Element object.
	 * Returns the new ElementOfInterest object. If a ElementOfInterest object is already associated with the Element, that ElementOfInterest object gets returned.
	 */
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

	/**
	 * Removes the provided ElementOfInterest object from this SpeciesOfInterest object.
	 */
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

			/* Sync with view-specific annotations */
			var annotation = this.chromosomeView.getAnnotation(elementOfInterest);
			if (annotation) annotation.remove();
		}
	};

	/**
	 * Returns the ElementOfInterest object associated with the provided Element object, or null if it cannot be found.
	 */
	Eplant.SpeciesOfInterest.prototype.getElementOfInterest = function(element) {
		for (var n = 0; n < this.elementsOfInterest.length; n++) {
			if (this.elementsOfInterest[n].element == element) {
				return this.elementsOfInterest[n];
			}
		}
		return null;
	};

	/**
	 * Returns the ElementOfInterest object associated with the provided element identifier, or null if it cannot be found.
	 */
	Eplant.SpeciesOfInterest.prototype.getElementOfInterestByIdentifier = function(identifier) {
		for (var n = 0; n < this.elementsOfInterest.length; n++) {
			if (this.elementsOfInterest[n].element.identifier == identifier) {
				return this.elementsOfInterest[n];
			}
		}
		return null;
	};

	Eplant.SpeciesOfInterest.prototype.setElementOfFocus = function(elementOfFocus) {
		/* Change elementOfFocus */
		this.elementOfFocus = elementOfFocus;

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
	};

/**
 * Adds a new SpeciesOfInterest object with the provided Species object.
 * Returns the new SpeciesOfInterest object. If a SpeciesOfInterest object is already associated with the Species, that SpeciesOfInterest object gets returned.
 */
Eplant.addSpeciesOfInterest = function(species) {
	var speciesOfInterest = Eplant.getSpeciesOfInterest(species);
	if (speciesOfInterest == null) {
		speciesOfInterest = new Eplant.SpeciesOfInterest(species);
		Eplant.speciessOfInterest.push(speciesOfInterest);
	}
	return speciesOfInterest;
};

Eplant.removeSpeciesOfInterest = function(speciesOfInterest) {
	var index = Eplant.speciessOfInterest.indexOf(speciesOfInterest);
	if (index >= 0) {
		//TODO sync

		Eplant.speciessOfInterest.splice(index, 1);
		return true;
	}
	return false;
};

/**
 * Returns the SpeciesOfInterest object associated with the provided Species object, or null if it cannot be found.
 */
Eplant.getSpeciesOfInterest = function(species) {
	for (var n = 0; n < Eplant.speciessOfInterest.length; n++) {
		if (Eplant.speciessOfInterest[n].species == species) {
			return Eplant.speciessOfInterest[n];
		}
	}
	return null;
};

/**
 * Sets the SpeciesOfInterest object that is in focus.
 * Syncs with the species label on the navigation panel.
 */
Eplant.setSpeciesOfFocus = function(speciesOfFocus) {
	Eplant.speciesOfFocus = speciesOfFocus;

	/* Sync species title display */
	document.getElementById("speciesLabel").innerHTML = speciesOfFocus.species.scientificName;

	/* Sync element drop down list */
	//TODO sync with drop down menu and plant title
	var elementsOfInterest = document.getElementById("elementsOfInterest");
	var options = elementsOfInterest.getElementsByTagName("option");
	for (var n = 1; n < options.length;) {
		elementsOfInterest.removeChild(options[n]);
	}
	for (n = 0; n < speciesOfFocus.elementsOfInterest.length; n++) {
		var elementOfInterest = speciesOfFocus.elementsOfInterest[n];
		var option = document.createElement("option");
		option.value = elementOfInterest.element.identifier;
		option.innerHTML = elementOfInterest.element.identifier;
		document.getElementById("elementsOfInterest").appendChild(option);
	}
};

/**
 * ElementOfInterest class.
 * Provides additional attributes to a Element object that are relevant for Eplant features.
 */
Eplant.ElementOfInterest = function(element, speciesOfInterest) {
	/**
	 * The parent SpeciesOfInterest object.
	 */
	this.speciesOfInterest = speciesOfInterest;

	/**
	 * The associated element object.
	 */
	this.element = element;

	/**
	 * Annotation tags
	 */
	this.tags = [];

	/* Preload views */
	this.worldView = null;
	this.plantView = null;
	this.cellView = null;
	this.interactionView = new InteractionView(element);
	this.pathwayView = null;
	this.moleculeView = null;
	this.sequenceView = null;
};

	/**
	 * Class for element tags.
	 */
	Eplant.ElementOfInterest.Tag = function(color, elementOfInterest) {
		this.color = color;
	};



////////
/* UI */
////////

/* Annotation dialog */
Eplant.AnnotationDialog = function() {
	this.selectedTags = [];

	/* Create element */
	this.containerElement = document.createElement("div");
		/* Table */
		var table = document.createElement("table");
			/* Identifiers */
			var tr = document.createElement("tr");
				/* Label */
				var td = document.createElement("td");
				td.innerHTML = "Identifiers:";
				$(td).width(80);
				tr.appendChild(td);

				/* Text input */
				td = document.createElement("td");
					this.identifiersElement = document.createElement("input");
					this.identifiersElement.type = "text";
					$(this.identifiersElement).width(270);
					td.appendChild(this.identifiersElement);
				tr.appendChild(td);
			table.appendChild(tr);

			/* Size */
			tr = document.createElement("tr");
				/* Label */
				td = document.createElement("td");
				td.innerHTML = "Size:";
				tr.appendChild(td);

				/* Text input */
				td = document.createElement("td");
					this.sizeElement = document.createElement("input");
					this.sizeElement.type = "number";
					this.sizeElement.min = 0;
					this.sizeElement.value = 0;
					$(this.sizeElement).width(60);
					td.appendChild(this.sizeElement);
				tr.appendChild(td);
			table.appendChild(tr);

			/* Color */
			tr = document.createElement("tr");
				/* Label */
				td = document.createElement("td");
				td.innerHTML = "Color:";
				tr.appendChild(td);

				/* Color input */
				td = document.createElement("td");
					this.colorElement = document.createElement("input");
					this.colorElement.type = "color";
					td.appendChild(this.colorElement);
				tr.appendChild(td);
			table.appendChild(tr);

			/* Tags */
			tr = document.createElement("tr");
				/* Label */
				td = document.createElement("td");
				td.innerHTML = "Tags:";
				tr.appendChild(td);

				/* Tags */
				td = document.createElement("td");
					this.tags = [];

					var tag = new Eplant.AnnotationDialog.Tag("#FF0000");
					td.appendChild(tag.containerElement);
					this.tags.push(tag);

					tag = new Eplant.AnnotationDialog.Tag("#FFFF00");
					td.appendChild(tag.containerElement);
					this.tags.push(tag);

					tag = new Eplant.AnnotationDialog.Tag("#00FF00");
					td.appendChild(tag.containerElement);
					this.tags.push(tag);

					tag = new Eplant.AnnotationDialog.Tag("#00FFFF");
					td.appendChild(tag.containerElement);
					this.tags.push(tag);

					tag = new Eplant.AnnotationDialog.Tag("#0000FF");
					td.appendChild(tag.containerElement);
					this.tags.push(tag);

					tag = new Eplant.AnnotationDialog.Tag("#FF00FF");
					td.appendChild(tag.containerElement);
					this.tags.push(tag);
				tr.appendChild(td);
			table.appendChild(tr);
		this.containerElement.appendChild(table);

	/* Create dialog */
	$(this.containerElement).dialog({
		title: "Create annotation",
		width: 400,
		height: 250,
		resizable: false,
		draggable: false,
		modal: true,
		buttons: [
			{
				text: "Submit",
				click: $.proxy(function(event, ui) {
					var identifiers = this.identifiersElement.value.split(" ").join("").split(",");
					this.size = this.sizeElement.value;
					this.color = this.colorElement.value;
					this.selectedTags = [];
					for (var n = 0; n < 6; n++) {
						if (this.tags[n].selected) this.selectedTags.push(this.tags[n].color);
					}
					if (isNaN(this.sizeElement.value)) this.sizeElement.value = 0;
					for (var n = 0; n < identifiers.length; n++) {
						var element = Eplant.speciesOfFocus.species.getElementByIdentifier(identifiers[n]);
						if (element) {
							Eplant.speciesOfFocus.addElementOfInterest(element, {
								size: this.size,
								color: this.color,
								tags: this.selectedTags
							});
						}
						else {
							$.ajax({
								type: "GET",
								url: "cgi-bin/querygenebyidentifier.cgi?id=" + identifiers[n],
								dataType: "json"
							}).done($.proxy(function(response) {
								var chromosome = Eplant.speciesOfFocus.species.getChromosome(response.chromosome);
								if (chromosome) {
									/* Create Element */
									var element = new Eplant.Element(chromosome);
									element.identifier = response.id;
									element.start = response.start;
									element.end = response.end;
									element.strand = response.strand;
									element.aliases = response.aliases;
									element.annotation = response.annotation;
									chromosome.elements.push(element);

									/* Add ElementOfInterest */
									Eplant.speciesOfFocus.addElementOfInterest(element, {
										size: this.size,
										color: this.color,
										tags: this.selectedTags
									});
								}
							}, this));
						}
					}
					this.close();
				}, this)
			},
			{
				text: "Cancel",
				click: $.proxy(function(event, ui) {
					this.close();
				}, this)
			}
		],
		close: $.proxy(function(event, ui) {
			$(this.containerElement).remove();
		}, this)
	});
};

	Eplant.AnnotationDialog.prototype.close = function() {
		$(this.containerElement).dialog("close");
	};

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



///////////////
/* Constants */
///////////////

/* Color constants */
Eplant.Color = {
	LightGrey: "#B4B4B4",
	MedGrey: "#787878",
	DarkGrey: "#3C3C3C",
	White: "#FFFFFF",
	Green: "#99CC00",
	Black: "#000000",
};



/////////////////////
/* Biology classes */
/////////////////////

/* Species class */
Eplant.Species = function() {
	this.scientificName = null;
	this.commonName = null;
	this.chromosomes = null;
};

	/* Returns the element object associated with the given identifier, or null */
	Eplant.Species.prototype.getElementByIdentifier = function(identifier) {
		for (var n = 0; n < this.chromosomes.length; n++) {
			var chromosome = this.chromosomes[n];
			for (var m = 0; m < chromosome.elements.length; m++) {
				if (chromosome.elements[m].identifier.toUpperCase() == identifier.toUpperCase()) {
					return chromosome.elements[m];
				}
			}
		}
		return null;
	};

	Eplant.Species.prototype.getChromosome = function(name) {
		for (var n = 0; n < this.chromosomes.length; n++) {
			if (this.chromosomes[n].name == name) {
				return this.chromosomes[n];
			}
		}
		return null
	};

/* Chromosome class */
Eplant.Chromosome = function(species) {
	this.species = species;
	this.name = null;
	this.length = null;
	this.centromeres = null;
	this.elements = null;
};

/* Centromere class */
Eplant.Centromere = function(chromosome) {
	this.chromosome = chromosome;
	this.start = null;
	this.end = null;
};

/* Element class */
Eplant.Element = function(chromosome) {
	this.chromosome = chromosome;
	this.identifier = null;
	this.aliases = null;
	this.start = null;
	this.end = null;
	this.strand = null;
	this.annotation = null;
};



/////////////
/* Utility */
/////////////



/////////////////
/* Change view */
/////////////////

Eplant.toSpeciesView = function() {
	if (ZUI.activeView instanceof ChromosomeView) {
		ZUI.changeActiveView(Eplant.speciesView, ZUI.activeView.zoomOutExitAnimation, Eplant.speciesView.zoomOutEntryAnimation);
	}
	else if (ZUI.activeView instanceof InteractionView) {
		ZUI.changeActiveView(Eplant.speciesView, null, null);
	}
	else if (ZUI.activeView instanceof MoleculeView) {
		ZUI.changeActiveView(Eplant.speciesView, null, null);
	}
};

Eplant.toChromosomeView = function() {
	if (ZUI.activeView instanceof InteractionView) {
		ZUI.changeActiveView(Eplant.speciesOfFocus.chromosomeView, null, Eplant.speciesOfFocus.chromosomeView.zoomInEntryAnimation);
	}
	else if (ZUI.activeView instanceof MoleculeView) {
		ZUI.changeActiveView(Eplant.speciesOfFocus.chromosomeView, null, Eplant.speciesOfFocus.chromosomeView.zoomInEntryAnimation);
	}
};

Eplant.toInteractionView = function() {
	if (ZUI.activeView instanceof ChromosomeView) {
		ZUI.changeActiveView(Eplant.speciesOfFocus.elementOfFocus.interactionView, ZUI.activeView.zoomOutExitAnimation, null);
	}
	else if (ZUI.activeView instanceof InteractionView) {
		if (ZUI.activeView != Eplant.speciesOfFocus.elementOfFocus.interactionView) {
			ZUI.changeActiveView(Eplant.speciesOfFocus.elementOfFocus.interactionView, null, null);
		}
	}
	else if (ZUI.activeView instanceof MoleculeView) {
		ZUI.changeActiveView(Eplant.speciesOfFocus.elementOfFocus.interactionView, null, null);
	}
};

Eplant.toMoleculeView = function() {
	if (ZUI.activeView instanceof ChromosomeView) {
		ZUI.changeActiveView(new MoleculeView("At2g41460"), null, null);
	}
	else if (ZUI.activeView instanceof InteractionView) {
		ZUI.changeActiveView(new MoleculeView("At2g41460"), null, null);
	}
};

Eplant.toPathwayView = function() {
	if (ZUI.activeView instanceof ChromosomeView) {
		ZUI.changeActiveView(new PathwayView({identifier:"At2g41460"}), null, null);
	}
};



///////////////////////////
/* Miscellaneous options */
///////////////////////////

/**
 * Tooltip switch
 */
Eplant.tooltipSwitch = true;

/**
 * Toggles tooltip on or off
 */
Eplant.toggleTooltip = function() {
	var elements = document.getElementsByClassName("hint--rounded");
	if (Eplant.tooltipSwitch) {
		for (var n = 0; n < elements.length; n++) {
			elements[n].setAttribute("data-enabled", "false");
		}
		document.getElementById("tooltipIcon").getElementsByTagName("img")[0].src = "img/off/tooltip.png";
		Eplant.tooltipSwitch = false;
	}
	else {
		for (var n = 0; n < elements.length; n++) {
			elements[n].setAttribute("data-enabled", "true");
		}
		document.getElementById("tooltipIcon").getElementsByTagName("img")[0].src = "img/on/tooltip.png";
		Eplant.tooltipSwitch = true;
	}
};

/**
 * Toggle view change animation on or off
 */
Eplant.toggleChangeViewAnimation = function() {
	if (ZUI.isAnimateChangeView) {
		document.getElementById("changeViewAnimationIcon").getElementsByTagName("img")[0].src = "img/off/zoom.png";
		ZUI.isAnimateChangeView = false;
	}
	else {
		document.getElementById("changeViewAnimationIcon").getElementsByTagName("img")[0].src = "img/on/zoom.png";
		ZUI.isAnimateChangeView = true;
	}
};

