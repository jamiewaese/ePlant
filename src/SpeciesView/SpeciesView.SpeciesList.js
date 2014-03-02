/**
 * SpeciesView.SpeciesList class
 * UI design by Jamie Waese
 * Code by Hans Yu
 *
 * This is a class for dealing with the interactive species list found in SpeciesView.
 */

SpeciesView.SpeciesList = function(view) {
	/* Properties */
	this.view = view;		// Parent view
	this.items = [];		// Items in the list
	this.element = null;		// HTML container element for the list

	/* Create HTML element */
	this.element = document.createElement("div");
	this.element.className = "selectionList";
	this.element.oncontextmenu = function() {
		return false;
	};

	/* Add title */
	var title = document.createElement("span");
	title.className = "selectionListTitle";
	title.textContent = "Select a plant";
	this.element.appendChild(title);

	/* Load species data */
	$.getJSON("cgi-bin/speciesinfo.cgi", $.proxy(function(response) {
		/* Process data */
		for (var n = 0; n < response.length; n++) {
			/* Create new species */
			var species = new Eplant.Species();
			species.scientificName = response[n].scientificName;
			species.commonName = response[n].commonName;
			this.items.push(new SpeciesView.SpeciesListItem(species, this));
		}
		this.view.isDataLoaded = true;

		/* Select first species item */
		this.items[0].element.onmouseover();
	}, this));
};