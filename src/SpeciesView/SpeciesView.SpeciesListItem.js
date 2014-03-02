/**
 * SpeciesView.SpeciesListItem class
 * UI design by Jamie Waese
 * Code by Hans Yu
 *
 * This is a class for dealing with the items of the interactive species list found in SpeciesView.
 */

SpeciesView.SpeciesListItem = function(species, speciesList) {
	/* Properties */
	this.species = species;			// Species that this item is representing
	this.speciesList = speciesList;		// Parent SpeciesList
	this.viewObject = null;			// Plant view object
	this.element = null;				// HTML element of the item

	/* Create HTML element */
	this.element = document.createElement("span");
	this.element.className = "selectionListItem";
	this.element.textContent = this.species.scientificName;
	this.element.oncontextmenu = function() {
		return false;
	};
	this.speciesList.element.appendChild(this.element);

	/* Mouse hover event handler */
	this.element.onmouseover = $.proxy(function() {
		/* Unselect previous selection */
		if (this.speciesList.view.selectedSpecies != null) {
			this.speciesList.view.selectedSpecies.element.style.backgroundColor = "transparent";
		}

		/* Select this item */
		this.element.style.backgroundColor = Eplant.Color.Green;
		this.speciesList.view.selectedSpecies = this;
	}, this);

	/* Click event handler */
	this.element.onclick = $.proxy(function() {
		/* Check whether this species is already in the SpeciesOfInterest list */
		var speciesOfInterest = null;
		var speciessOfInterest = Eplant.speciessOfInterest;
		for (var n = 0; n < speciessOfInterest.length; n++) {
			if (speciessOfInterest[n].species.scientificName == this.species.scientificName) {
				speciesOfInterest = speciessOfInterest[n];
				break;
			}
		}

		/* If not, add to list */
		if (speciesOfInterest == null) {
			speciesOfInterest = Eplant.addSpeciesOfInterest(this.species);
		}

		/* Set this corresponding SpeciesOfInterest object to focus */
		Eplant.setSpeciesOfFocus(speciesOfInterest);

		/* Switch to chromosome view */
		Eplant.toChromosomeView();
	}, this);

	/* Create plant view object */
	this.viewObject = new ZUI.ViewObject({
		shape: "svg",
		positionScale: "world",
		sizeScale: "world",
		x: ZUI.width / 6,
		y: 0,
		url: "data/species/" + this.species.scientificName.replace(" ", "_") + ".svg"
	});
};