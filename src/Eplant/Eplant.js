/**
 * Eplant namespace
 * By Hans Yu
 */

/* Define namespace */
function Eplant() {}

/* Attributes */
Eplant.speciessOfInterest = [];		// Array of SpeciesOfInterest objects
Eplant.speciesOfFocus = null;		// The SpeciesOfInterest object in focus
Eplant.speciesView = null;			// SpeciesView object
Eplant.tooltipSwitch = true;		// Tooltip toggle switch

/* Update function for ePlant called at each frame */
Eplant.update = function() {
	/////////////////////////////////////////////////////////////////
	/* Sync icons dock with views of elementOfFocus of speciesOfFocus */
	/////////////////////////////////////////////////////////////////

	/* SpeciesView */
	var img = document.getElementById("speciesViewIcon").getElementsByTagName("img")[0];
	if (Eplant.speciesView && Eplant.speciesView == ZUI.activeView) {
		if (!ZUI.endsWith(img.src, "img/active/species.png")) img.src = "img/active/species.png";
	}
	else if (Eplant.speciesView) {
		if (!ZUI.endsWith(img.src, "img/available/species.png")) img.src = "img/available/species.png";
	}
	else {
		if (!ZUI.endsWith(img.src, "img/unavailable/species.png")) img.src = "img/unavailable/species.png";
	}

	/* ChromosomeView */
	img = document.getElementById("chromosomeViewIcon").getElementsByTagName("img")[0];
	if (Eplant.speciesOfFocus && Eplant.speciesOfFocus.chromosomeView == ZUI.activeView) {
		if (!ZUI.endsWith(img.src, "img/active/chromosome.png")) img.src = "img/active/chromosome.png";
	}
	else if (Eplant.speciesOfFocus) {
		if (!ZUI.endsWith(img.src, "img/available/chromosome.png")) img.src = "img/available/chromosome.png";
	}
	else {
		if (!ZUI.endsWith(img.src, "img/unavailable/chromosome.png")) img.src = "img/unavailable/chromosome.png";
	}

	/* WorldView */
	img = document.getElementById("worldViewIcon").getElementsByTagName("img")[0];
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.worldView || Eplant.speciesOfFocus.elementOfFocus.worldView.getLoadProgress() < 1) {
		if (!ZUI.endsWith(img.src, "img/unavailable/world.png")) img.src = "img/unavailable/world.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.worldView == ZUI.activeView) {
		if (!ZUI.endsWith(img.src, "img/active/world.png")) img.src = "img/active/world.png";
	}
	else {
		if (!ZUI.endsWith(img.src, "img/available/world.png")) img.src = "img/available/world.png";
	}

	/* PlantView */
	img = document.getElementById("plantViewIcon").getElementsByTagName("img")[0];
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.plantView || Eplant.speciesOfFocus.elementOfFocus.plantView.getLoadProgress() < 1) {
		if (!ZUI.endsWith(img.src, "img/unavailable/plant.png")) img.src = "img/unavailable/plant.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.plantView == ZUI.activeView) {
		if (!ZUI.endsWith(img.src, "img/active/plant.png")) img.src = "img/active/plant.png";
	}
	else {
		if (!ZUI.endsWith(img.src, "img/available/plant.png")) img.src = "img/available/plant.png";
	}

	/* CellView */
	img = document.getElementById("cellViewIcon").getElementsByTagName("img")[0]
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.cellView || Eplant.speciesOfFocus.elementOfFocus.cellView.getLoadProgress() < 1) {
		if (!ZUI.endsWith(img.src, "img/unavailable/cell.png")) img.src = "img/unavailable/cell.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.cellView == ZUI.activeView) {
		if (!ZUI.endsWith(img.src, "img/active/cell.png")) img.src = "img/active/cell.png";
	}
	else {
		if (!ZUI.endsWith(img.src, "img/available/cell.png")) img.src = "img/available/cell.png";
	}

	/* InteractionView */
	img = document.getElementById("interactionViewIcon").getElementsByTagName("img")[0];
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.interactionView || Eplant.speciesOfFocus.elementOfFocus.interactionView.getLoadProgress() < 1) {
		if (!ZUI.endsWith(img.src, "img/unavailable/interaction.png")) img.src = "img/unavailable/interaction.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.interactionView == ZUI.activeView) {
		if (!ZUI.endsWith(img.src, "img/active/interaction.png")) img.src = "img/active/interaction.png";
	}
	else {
		if (!ZUI.endsWith(img.src, "img/available/interaction.png")) img.src = "img/available/interaction.png";
	}

	/* PathwayView */
	img = document.getElementById("pathwayViewIcon").getElementsByTagName("img")[0];
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus == || !Eplant.speciesOfFocus.elementOfFocus.pathwayView || Eplant.speciesOfFocus.elementOfFocus.pathwayView.getLoadProgress() < 1) {
		if (!ZUI.endsWith(img.src, "img/unavailable/pathway.png")) img.src = "img/unavailable/pathway.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.pathwayView == ZUI.activeView) {
		if (!ZUI.endsWith(img.src, "img/active/pathway.png")) img.src = "img/active/pathway.png";
	}
	else {
		if (!ZUI.endsWith(img.src, "img/available/pathway.png")) img.src = "img/available/pathway.png";
	}

	/* MoleculeView */
	img = document.getElementById("moleculeViewIcon").getElementsByTagName("img")[0];
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.moleculeView || Eplant.speciesOfFocus.elementOfFocus.moleculeView.getLoadProgress() < 1) {
		if (!ZUI.endsWith(img.src, "img/unavailable/molecule.png")) img.src = "img/unavailable/molecule.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.moleculeView == ZUI.activeView) {
		if (!ZUI.endsWith(img.src, "img/active/molecule.png")) img.src = "img/active/molecule.png";
	}
	else {
		if (!ZUI.endsWith(img.src, "img/available/molecule.png")) img.src = "img/available/molecule.png";
	}

	/* SequenceView */
	img = document.getElementById("sequenceViewIcon").getElementsByTagName("img")[0];
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.sequenceView || Eplant.speciesOfFocus.elementOfFocus.sequenceView.getLoadProgress() < 1) {
		if (!ZUI.endsWith(img.src, "img/unavailable/sequence.png")) img.src = "img/unavailable/sequence.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.sequenceView == ZUI.activeView) {
		if (!ZUI.endsWith(img.src, "img/active/sequence.png")) img.src = "img/active/sequence.png";
	}
	else {
		if (!ZUI.endsWith(img.src, "img/available/sequence.png")) img.src = "img/available/sequence.png";
	}
};

/* Get the SpeciesOfInterest object corresponding to the Species object */
Eplant.getSpeciesOfInterest = function(species) {
	for (var n = 0; n < Eplant.speciessOfInterest.length; n++) {
		if (Eplant.speciessOfInterest[n].species == species) {
			return Eplant.speciessOfInterest[n];
		}
	}
	return null;
};

/* Add a new SpeciesOfInterest object to the array and returns the object */
Eplant.addSpeciesOfInterest = function(species) {
	var speciesOfInterest = Eplant.getSpeciesOfInterest(species);
	if (speciesOfInterest == null) {
		speciesOfInterest = new Eplant.SpeciesOfInterest(species);
		Eplant.speciessOfInterest.push(speciesOfInterest);
	}
	return speciesOfInterest;
};

/* Remove the given SpeciesOfInterest object from the array */
Eplant.removeSpeciesOfInterest = function(speciesOfInterest) {
	var index = Eplant.speciessOfInterest.indexOf(speciesOfInterest);
	if (index >= 0) {
		//TODO sync

		Eplant.speciessOfInterest.splice(index, 1);
		return true;
	}
	return false;
};

/* Set speciesOfFocus */
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

/* Toggle tooltip */
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

/* Toggle view change animation */
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

/* Change to SpeciesView */
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

/* Change to ChromosomeView */
Eplant.toChromosomeView = function() {
	if (ZUI.activeView instanceof InteractionView) {
		ZUI.changeActiveView(Eplant.speciesOfFocus.chromosomeView, null, Eplant.speciesOfFocus.chromosomeView.zoomInEntryAnimation);
	}
	else if (ZUI.activeView instanceof MoleculeView) {
		ZUI.changeActiveView(Eplant.speciesOfFocus.chromosomeView, null, Eplant.speciesOfFocus.chromosomeView.zoomInEntryAnimation);
	}
};

/* Change to InteractionView */
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

/* Change to MoleculeView */
Eplant.toMoleculeView = function() {
	if (ZUI.activeView instanceof ChromosomeView) {
		ZUI.changeActiveView(new MoleculeView("At2g41460"), null, null);
	}
	else if (ZUI.activeView instanceof InteractionView) {
		ZUI.changeActiveView(new MoleculeView("At2g41460"), null, null);
	}
};

/* Change to PathwayView */
Eplant.toPathwayView = function() {
	if (ZUI.activeView instanceof ChromosomeView) {
		ZUI.changeActiveView(new PathwayView({identifier:"At2g41460"}), null, null);
	}
};
