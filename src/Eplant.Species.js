(function() {

/**
 * Eplant.Species class
 * By Hans Yu
 *
 * Describes an ePlant species.
 *
 * @constructor
 * @param {Object} info Information for this species wrapped in an Object.
 * @param {String} info.scientificName The scientific name for this species.
 * @param {String} info.commonName The common name for this species.
 * @param {String} info.exampleQuery Example query for this species.
 */
Eplant.Species = function(info) {
	/* Store information */
	this.scientificName = (info.scientificName === undefined) ? null : info.scientificName;
	this.commonName = (info.commonName === undefined) ? null : info.commonName;
	this.exampleQuery = (info.exampleQuery === undefined) ? null : info.exampleQuery;

	/* Check whether necessary information are provided */
	if (this.scientificName === null) console.log("Warning: No scientific name is specified for the Species.");

	/* Other attributes */
	this.chromosomes = [];			// Chromosomes that belong to this Species
	this.isLoadedChromosomes = false;		// Whether Chromosomes are loaded
	Object.defineProperty(this, "geneticElements", {		// GeneticElements that belong to this Species (read-only)
		get: function() {
			/* Define returned array */
			var geneticElements = [];

			/* Concatenate GeneticElements from each Chromosome with the returned array */
			for (var n = 0; n < this.chromosomes.length; n++) {
				var chromosome = this.chromosomes[n];
				geneticElements = geneticElements.concat(chromosome.geneticElements);
			}

			/* Return array with all GeneticElements of this Species */
			return geneticElements;
		}
	});
	this.activeGeneticElement = null;		// GeneticElement that is under active study
	this.views = null;				// Object container for Views associated with this Species
	this.isLoadedViews = false;			// Whether Views are loaded
};

/**
 * Loads Views for this Species.
 */
Eplant.Species.prototype.loadViews = function() {
	/* Set up Object wrapper */
	this.views = {};

	/* Loop through Eplant.Views namespace */
	for (var ViewName in Eplant.Views) {
		/* Get View constructor */
		var View = Eplant.Views[ViewName];

		/* Skip if View hiearchy is not at the level of genetic element */
		if (View.hierarchy != "species") continue;

		/* Create View */
		this.views[ViewName] = new View(this);
	}

	/* Set flag for view loading */
	this.isLoadedViews = true;
};

/**
 * Adds a Chromosome to this Species.
 *
 * @param {Eplant.Chromosome} chromosome The Chromosome to be added.
 */
Eplant.Species.prototype.addChromosome = function(chromosome) {
	/* Add Chromosome to array */
	this.chromosomes.push(chromosome);

	/* Fire event for updating the Chromosomes array */
	var event = new ZUI.Event("update-chromosomes", this, null);
	ZUI.fireEvent(event);
};

/**
 * Removes a Chromosome from this Species.
 *
 * @param {Eplant.Chromosome} chromosome The Chromosome to be removed.
 */
Eplant.Species.prototype.removeChromosome = function(chromosome) {
	/* Clean up Chromosome */
	chromosome.remove();

	/* Remove Chromosome from array */
	var index = Eplant.chromosomes.indexOf(chromosome);
	if (index > -1) Eplant.chromosomes.splice(index, 1);

	/* Fire event for updating the Chromosomes array */
	var event = new ZUI.Event("update-chromosomes", this, null);
	ZUI.fireEvent(event);
};

/**
 * Loads Chromosomes for this Species.
 */
Eplant.Species.prototype.loadChromosomes = function() {
	if (!this.isLoadedChromosomes) {
		$.getJSON(Eplant.ServiceUrl + 'chromosomeinfo.cgi?species=' + this.scientificName.replace(' ', '_'), $.proxy(function(response) {
			/* Loop through chromosomes */
			for (var n = 0; n < response.chromosomes.length; n++) {
				/* Get data for this chromosome */
				var chromosomeData = response.chromosomes[n];

				/* Create new Chromosome object */
				var chromosome = new Eplant.Chromosome({
					species: this,
					identifier: chromosomeData.id,
					name: chromosomeData.name,
					size: chromosomeData.size
				});

				/* Loop through centromeres */
				for (var m = 0; m < chromosomeData.centromeres.length; m++) {
					/* Get data for this centromere */
					var centromereData = chromosomeData.centromeres[m];

					/* Create new centromere GeneticElement object */
					var centromere = new Eplant.GeneticElement({
						chromosome: chromosome,
						identifier: centromereData.id,
						aliases: centromereData.aliases,
						start: centromereData.start,
						end: centromereData.end,
						type: "centromere"
					});

					/* Add new centromere GeneticElement to Chromosome */
					chromosome.addGeneticElement(centromere);
				}

				/* Add new Chromosome to Species */
				this.addChromosome(chromosome);
			}

			/* Set chromosome load status */
			this.isLoadedChromosomes = true;

			/* Fire event for loading chromosomes */
			var event = new ZUI.Event("load-chromosomes", this, null);
			ZUI.fireEvent(event);
		}, this));
	}
};

/**
 * Gets the Chromosome with the specified identifier.
 *
 * @param {String} identifier Identifier of the Chromosome.
 */
Eplant.Species.prototype.getChromosomeByIdentifier = function(identifier) {
	/* Loop through Chromosome objects to find the Chromosome with a matching identifier */
	for (var n = 0; n < this.chromosomes.length; n++) {
		var chromosome = this.chromosomes[n];
		if (chromosome.identifier.toUpperCase() == identifier.toUpperCase()) {
			return chromosome;
		}
	}

	/* Not found */
	return null;
};

/**
 * Gets the GeneticElement with the specified identifier.
 *
 * @param {String} identifier Identifier of the GeneticElement.
 * @return {Eplant.GeneticElement} Matching GeneticElement.
 */
Eplant.Species.prototype.getGeneticElementByIdentifier = function(identifier) {
	/* Get a copy of the GeneticElements array */
	var geneticElements = this.geneticElements;

	/* Loop through GeneticElement objects to find the GeneticElement with a matching identifier */
	for (var n = 0; n < geneticElements.length; n++) {
		var geneticElement = geneticElements[n];
		if (geneticElement.identifier.toUpperCase() == identifier.toUpperCase()) {
			return geneticElement;
		}
	}

	/* Not found */
	return null;
};

/**
 * Gets the GeneticElements with the specified type.
 *
 * @param (String} type Type of the GeneticElement.
 * @return {Array<Eplant.GeneticElement>} Matching GeneticElements.
 */
Eplant.Species.prototype.getGeneticElementsByType = function(type) {
	/* Prepare returned array */
	var matchingGeneticElements = [];

	/* Get a copy of the GeneticElements array */
	var geneticElements = this.geneticElements;

	/* Loop through GeneticElement objects to find the GeneticElements with a matching type */
	for (var n = 0; n < geneticElements.length; n++) {
		var geneticElement = geneticElements[n];
		if (geneticElement.type.toUpperCase() == type.toUpperCase()) {
			matchingGeneticElements.push(geneticElement);
		}
	}

	/* Return matching GeneticElements */
	return matchingGeneticElements;
};

/**
 * Sets the activeGeneticElement for this Species.
 *
 * @param {Eplant.GeneticElement} geneticElement The new activeGeneticElement.
 */
Eplant.Species.prototype.setActiveGeneticElement = function(geneticElement) {
	/* Unselect GeneticElementDialog of previous GeneticElement */
	if (Eplant.activeSpecies == this && this.activeGeneticElement && this.activeGeneticElement.geneticElementDialog) {
		this.activeGeneticElement.geneticElementDialog.unselect();
	}

	/* Get a reference of the previous active GeneticElement */
	var previousActiveGeneticElement = this.activeGeneticElement;

	/* Set activeGeneticElement */
	this.activeGeneticElement = geneticElement;

	/* Fire event for updating activeGeneticElement */
	var event = new ZUI.Event("update-activeGeneticElement", this, {
		previousActiveGeneticElement: previousActiveGeneticElement
	});
	ZUI.fireEvent(event);

	/* Select GeneticElementDialog of new GeneticElement */
	if (Eplant.activeSpecies == this && this.activeGeneticElement && this.activeGeneticElement.geneticElementDialog) {
		this.activeGeneticElement.geneticElementDialog.select();
	}

	/* Change active view */
	if (ZUI.activeView.hierarchy == "genetic element") {
		/* Get name of the active view */
		var viewName = Eplant.getViewName(ZUI.activeView);

		/* Change active view */
		Eplant.changeActiveView(this.activeGeneticElement.views[viewName]);
	}
};

/**
 * Loads a GeneticElement by identifier.
 */
Eplant.Species.prototype.loadGeneticElementByIdentifier = function(identifier, callback) {
	/* Wrap references for proxy access */
	var wrapper = {};
	wrapper.species = this;
	wrapper.callback = callback;
	wrapper.identifier = identifier;

	/* Query */
	$.getJSON(Eplant.ServiceUrl + 'querygene.cgi?species=' + this.scientificName.split(' ').join('_') + '&term=' + identifier, $.proxy(function(response) {
		/* Get Chromosome */
		var chromosome = this.species.getChromosomeByIdentifier(response.chromosome);

		/* Check if Chromsome is valid */
		if (chromosome) {	// Valid
			/* Confirm GeneticElement is not already created */
			var geneticElement = this.species.getGeneticElementByIdentifier(response.id);
			if (!geneticElement) {
				/* Create GeneticElement */
				geneticElement = new Eplant.GeneticElement({
					chromosome: chromosome,
					identifier: response.id,
					aliases: response.aliases,
					annotation: response.annotation,
					type: "gene",
					strand: response.strand,
					start: response.start,
					end: response.end
				});
				chromosome.addGeneticElement(geneticElement);
			}

			/* Callback */
			this.callback(geneticElement, this.identifier);
		}
		else {		// Invalid
			/* Callback */
			this.callback(null, this.identifier);
		}
	}, wrapper));
};

/**
 * Cleans up this Species
 */
Eplant.Species.prototype.remove = function() {
	/* Clean up Views */
	for (var n = 0; n < this.views; n++) {
		this.views[n].remove();
	}

	/* Clean up Chromosomes */
	for (var n = 0; n < this.chromosomes; n++) {
		this.chromosomes[n].remove();
	}
};

})();
