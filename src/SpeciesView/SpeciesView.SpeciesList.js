/* SpeciesList class for dealing with the list of species on the left panel */
SpeciesView.SpeciesList = function(view) {
	/* Properties */
	this.view = view;		// Parent view
	this.items = [];		// Items in the list
	this.element = null;		// HTML container element for the list

	/* Create HTML element */
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.left = "0px";
	this.element.style.top = "0px";
	this.element.style.width = ZUI.width / 3 + "px";
	this.element.style.height = ZUI.height + "px";
	this.element.style.padding = "30px";
	this.element.style.backgroundColor = "transparent";

	/* Add title */
	var title = document.createElement("span");
	title.style.fontFamily = "Helvetica";
	title.style.fontSize = "34px";
	title.style.textIndent = "14px";
	title.style.lineHeight = "56px";
	title.style.color = Eplant.Color.Green;
	title.style.display = "block";
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