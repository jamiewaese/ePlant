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
	/* Sync icons dock with views of geneOfFocus of speciesOfFocus */
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
	if (Eplant.speciesOfFocus == null || Eplant.speciesOfFocus.geneOfFocus == null || Eplant.speciesOfFocus.geneOfFocus.worldView == null || Eplant.speciesOfFocus.geneOfFocus.worldView.getLoadProgress() < 1) {
		document.getElementById("worldViewIcon").getElementsByTagName("img")[0].src = "img/unavailable/world.png";
	}
	else if (Eplant.speciesOfFocus.geneOfFocus.worldView == ZUI.activeView) {
		document.getElementById("worldViewIcon").getElementsByTagName("img")[0].src = "img/active/world.png";
	}
	else {
		document.getElementById("worldViewIcon").getElementsByTagName("img")[0].src = "img/available/world.png";
	}

	/* PlantView */
	if (Eplant.speciesOfFocus == null || Eplant.speciesOfFocus.geneOfFocus == null || Eplant.speciesOfFocus.geneOfFocus.plantView == null || Eplant.speciesOfFocus.geneOfFocus.plantView.getLoadProgress() < 1) {
		document.getElementById("plantViewIcon").getElementsByTagName("img")[0].src = "img/unavailable/plant.png";
	}
	else if (Eplant.speciesOfFocus.geneOfFocus.plantView == ZUI.activeView) {
		document.getElementById("plantViewIcon").getElementsByTagName("img")[0].src = "img/active/plant.png";
	}
	else {
		document.getElementById("plantViewIcon").getElementsByTagName("img")[0].src = "img/available/plant.png";
	}

	/* CellView */
	if (Eplant.speciesOfFocus == null || Eplant.speciesOfFocus.geneOfFocus == null || Eplant.speciesOfFocus.geneOfFocus.cellView == null || Eplant.speciesOfFocus.geneOfFocus.cellView.getLoadProgress() < 1) {
		document.getElementById("cellViewIcon").getElementsByTagName("img")[0].src = "img/unavailable/cell.png";
	}
	else if (Eplant.speciesOfFocus.geneOfFocus.cellView == ZUI.activeView) {
		document.getElementById("cellViewIcon").getElementsByTagName("img")[0].src = "img/active/cell.png";
	}
	else {
		document.getElementById("cellViewIcon").getElementsByTagName("img")[0].src = "img/available/cell.png";
	}

	/* InteractionView */
	if (Eplant.speciesOfFocus == null || Eplant.speciesOfFocus.geneOfFocus == null || Eplant.speciesOfFocus.geneOfFocus.interactionView == null || Eplant.speciesOfFocus.geneOfFocus.interactionView.getLoadProgress() < 1) {
		document.getElementById("interactionViewIcon").getElementsByTagName("img")[0].src = "img/unavailable/interaction.png";
	}
	else if (Eplant.speciesOfFocus.geneOfFocus.interactionView == ZUI.activeView) {
		document.getElementById("interactionViewIcon").getElementsByTagName("img")[0].src = "img/active/interaction.png";
	}
	else {
		document.getElementById("interactionViewIcon").getElementsByTagName("img")[0].src = "img/available/interaction.png";
	}

	/* PathwayView */
	if (Eplant.speciesOfFocus == null || Eplant.speciesOfFocus.geneOfFocus == null || Eplant.speciesOfFocus.geneOfFocus.pathwayView == null || Eplant.speciesOfFocus.geneOfFocus.pathwayView.getLoadProgress() < 1) {
		document.getElementById("pathwayViewIcon").getElementsByTagName("img")[0].src = "img/unavailable/pathway.png";
	}
	else if (Eplant.speciesOfFocus.geneOfFocus.pathwayView == ZUI.activeView) {
		document.getElementById("pathwayViewIcon").getElementsByTagName("img")[0].src = "img/active/pathway.png";
	}
	else {
		document.getElementById("pathwayViewIcon").getElementsByTagName("img")[0].src = "img/available/pathway.png";
	}

	/* MoleculeView */
	if (Eplant.speciesOfFocus == null || Eplant.speciesOfFocus.geneOfFocus == null || Eplant.speciesOfFocus.geneOfFocus.moleculeView == null || Eplant.speciesOfFocus.geneOfFocus.moleculeView.getLoadProgress() < 1) {
		document.getElementById("moleculeViewIcon").getElementsByTagName("img")[0].src = "img/unavailable/molecule.png";
	}
	else if (Eplant.speciesOfFocus.geneOfFocus.moleculeView == ZUI.activeView) {
		document.getElementById("moleculeViewIcon").getElementsByTagName("img")[0].src = "img/active/molecule.png";
	}
	else {
		document.getElementById("moleculeViewIcon").getElementsByTagName("img")[0].src = "img/available/molecule.png";
	}

	/* SequenceView */
	if (Eplant.speciesOfFocus == null || Eplant.speciesOfFocus.geneOfFocus == null || Eplant.speciesOfFocus.geneOfFocus.sequenceView == null || Eplant.speciesOfFocus.geneOfFocus.sequenceView.getLoadProgress() < 1) {
		document.getElementById("sequenceViewIcon").getElementsByTagName("img")[0].src = "img/unavailable/sequence.png";
	}
	else if (Eplant.speciesOfFocus.geneOfFocus.sequenceView == ZUI.activeView) {
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
	 * Array of GeneOfInterest objects.
	 */
	this.genesOfInterest = [];

	/**
	 * The GeneOfInterest object that is in focus.
	 */
	Eplant.geneOfFocus = null;

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
	 * Returns the array of GeneOfInterest objects of this SpeciesOfInterest object.
	 */
	Eplant.SpeciesOfInterest.prototype.getGenesOfInterest = function() {
		return this.genesOfInterest;
	};

	/**
	 * Adds a new GeneOfInterest object with the provided Gene object.
	 * Returns the new GeneOfInterest object. If a GeneOfInterest object is already associated with the Gene, that GeneOfInterest object gets returned.
	 */
	Eplant.SpeciesOfInterest.prototype.addGeneOfInterest = function(gene) {
		var geneOfInterest = this.getGeneOfInterest(gene);
		if (geneOfInterest == null) {
			geneOfInterest = new Eplant.GeneOfInterest(gene, this);
			this.genesOfInterest.push(geneOfInterest);

			/* Sync with drop down list */
			var option = document.createElement("option");
			option.value = geneOfInterest.gene.identifier;
			option.innerHTML = geneOfInterest.gene.identifier;
			document.getElementById("genesOfInterest").appendChild(option);
		}

		return geneOfInterest;
	};

	/**
	 * Removes the provided GeneOfInterest object from this SpeciesOfInterest object.
	 * Returns true if successful, false if the GeneOfInterest object cannot be found.
	 */
	Eplant.SpeciesOfInterest.prototype.removeGeneOfInterest = function(geneOfInterest) {
		var index = this.genesOfInterest.indexOf(geneOfInterest);
		if (index >= 0) {
			/* Sync with drop list list */
			var options = document.getElementById("genesOfInterest").getElementsByTagName("option");
			for (var n = 0; n < options.length; n++) {
				if (options[n].value == geneOfInterest.gene.identifier) {
					document.getElementById("genesOfInterest").removeChild(options[n]);
					break;
				}
			}
			this.genesOfInterest.splice(index, 1);
			return true;
		}
		return false;
	};

	/**
	 * Returns the GeneOfInterest object associated with the provided Gene object, or null if it cannot be found.
	 */
	Eplant.SpeciesOfInterest.prototype.getGeneOfInterest = function(gene) {
		for (var n = 0; n < this.genesOfInterest.length; n++) {
			if (this.genesOfInterest[n].gene == gene) {
				return this.genesOfInterest[n];
			}
		}
		return null;
	};

	/**
	 * Returns the GeneOfInterest object associated with the provided gene identifier, or null if it cannot be found.
	 */
	Eplant.SpeciesOfInterest.prototype.getGeneOfInterestByIdentifier = function(identifier) {
		for (var n = 0; n < this.genesOfInterest.length; n++) {
			if (this.genesOfInterest[n].gene.identifier == identifier) {
				return this.genesOfInterest[n];
			}
		}
		return null;
	};

	Eplant.SpeciesOfInterest.prototype.setGeneOfFocus = function(geneOfFocus) {
		/* Change geneOfFocus */
		this.geneOfFocus = geneOfFocus;

		/* Sync with drop down menu */
		if (geneOfFocus != null) {
			var genesOfInterest = document.getElementById("genesOfInterest");
			if (genesOfInterest.options[genesOfInterest.selectedIndex].value != geneOfFocus.gene.identifier) {
				for (var n = 1; n < genesOfInterest.options.length; n++) {
					if (genesOfInterest.options[n].value == geneOfFocus.gene.identifier) {
						genesOfInterest.selectedIndex = n;
						break;
					}
				}
			}
		}

		/* Sync with icon dock */
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
 * Returns the SpeciesOfInterest object that is in focus.
 */
Eplant.getSpeciesOfFocus = function(speciesOfFocus) {
	return Eplant.speciesOfFocus;
};

/**
 * Sets the SpeciesOfInterest object that is in focus.
 * Syncs with the species label on the navigation panel.
 */
Eplant.setSpeciesOfFocus = function(speciesOfFocus) {
	Eplant.speciesOfFocus = speciesOfFocus;
	//TODO sync with drop down menu and plant title
};

/**
 * GeneOfInterest class.
 * Provides additional attributes to a Gene object that are relevant for Eplant features.
 */
Eplant.GeneOfInterest = function(gene, speciesOfInterest) {
	/**
	 * The parent SpeciesOfInterest object.
	 */
	this.speciesOfInterest = speciesOfInterest;

	/**
	 * The associated gene object.
	 */
	this.gene = gene;

	//TODO preload views
	this.worldView = null;
	this.plantView = null;
	this.cellView = null;
	this.interactionView = new InteractionView(gene.identifier);
	this.pathwayView = null;
	this.moleculeView = null;
	this.sequenceView = null;
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

/* Chromosome class */
Eplant.Chromosome = function(species) {
	this.species = species;
	this.name = null;
	this.length = null;
	this.centromeres = null;
	this.genes = null;
};

/* Centromere class */
Eplant.Centromere = function(chromosome) {
	this.chromosome = chromosome;
	this.start = null;
	this.end = null;
};

/* Gene class */
Eplant.Gene = function(chromosome) {
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

Eplant.createButton = function(label, onclick) {
	var button = document.createElement("input");
	button.type = "button";
	button.value = label;
	button.onclick = onclick;
	button.className = "button";
	return button;
};

Eplant.createTextInput = function() {
	var textInput = document.createElement("input");
	textInput.type = "text";
	return textInput;
};

Eplant.createLabel = function(text) {
	var label = document.createElement("label");
	label.innerHTML = text;
	return label;
};

Eplant.createImage = function(src) {
	var img = document.createElement("img");
	img.src = src;
	return img;
};



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
		ZUI.changeActiveView(Eplant.speciesOfFocus.geneOfFocus.interactionView, ZUI.activeView.zoomOutExitAnimation, null);
	}
	else if (ZUI.activeView instanceof MoleculeView) {
		ZUI.changeActiveView(Eplant.speciesOfFocus.geneOfFocus.interactionView, null, null);
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

