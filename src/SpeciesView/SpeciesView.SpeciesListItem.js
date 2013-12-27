/* SpeciesListItem class for dealing with individual items in a SpeciesList */
SpeciesView.SpeciesListItem = function(species, speciesList) {
	/* Properties */
	this.species = species;			// Species that this item is representing
	this.speciesList = speciesList;		// Parent SpeciesList
	this.viewObject = null;			// Plant view object
	this.element = null;				// HTML element of the item

	/* Create HTML element */
	this.element = document.createElement("span");
	this.element.style.cursor = "default";
	this.element.style.fontFamily = "Helvetica";
	this.element.style.fontSize = "20px";
	this.element.style.fontStyle = "italic";
	this.element.style.textIndent = "20px";
	this.element.style.lineHeight = "40px";
	this.element.style.color = Eplant.Color.DarkGrey;
	this.element.style.display = "block";
	this.element.style.cursor = "pointer";
	this.element.textContent = this.species.scientificName;
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