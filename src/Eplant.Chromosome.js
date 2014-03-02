(function() {

/**
 * Eplant.Chromosome class
 * By Hans Yu
 *
 * Describes an ePlant chromosome.
 *
 * @constructor
 * @param {Object} info Information for this chromosome wrapped in an Object.
 * @param {Eplant.Species} info.species The species that contains this chromosome.
 * @param {String} info.identifier The identifier of this chromosome.
 * @param {String} info.name The name of this chromosome visible to the user.
 * @param {Number} info.size The size of this chromosome.
 */
Eplant.Chromosome = function(info) {
	/* Store information */
	this.species = (info.species === undefined) ? null : info.species;
	this.identifier = (info.identifier === undefined) ? null : info.identifier;
	this.name = (info.name === undefined) ? null : info.name;
	this.size = (info.size === undefined) ? null : info.size;

	/* Check whether necessary information are provided */
	if (this.species === null) console.log("Warning: No Species is specified for the Chromosome.");
	if (this.identifier === null) console.log("Warning: No identifier is specified for the Chromosome.");
	if (this.size === null) console.log("Warning: No size is specified for the Chromosome.");

	/* Other attributes */
	this.geneticElements = [];		// GeneticElements that belong to this Chromosome
};

/**
 * Adds a GeneticElement to the Chromosome
 *
 * @param {Eplant.GeneticElement} species The GeneticElement to be added.
 */
Eplant.Chromosome.prototype.addGeneticElement = function(geneticElement) {
	/* Add GeneticElement to array */
	this.geneticElements.push(geneticElement);

	/* Fire event for updating the GeneticElements array */
	var event = new ZUI.Event("update-geneticElements", this, null);
	ZUI.fireEvent(event);
};

/**
 * Removes a GeneticElement from the Chromosome
 *
 * @param {Eplant.GeneticElement} species The GeneticElement to be removed.
 */
Eplant.Chromosome.prototype.removeGeneticElement = function(geneticElement) {
	/* Clean up GeneticElement */
	geneticElement.remove();

	/* Remove GeneticElement from array */
	var index = this.geneticElements.indexOf(geneticElement);
	if (index > -1) this.geneticElements.splice(index, 1);

	/* Fire event for updating the Species array */
	var event = new ZUI.Event("update-geneticElements", this, null);
	ZUI.fireEvent(event);
};

/**
 * Gets the GeneticElement with the specified identifier.
 *
 * @param {String} identifier Identifier of the GeneticElement.
 * @return {Eplant.GeneticElement} Matching GeneticElement.
 */
Eplant.Chromosome.prototype.getGeneticElementByIdentifier = function(identifier) {
	/* Loop through GeneticElement objects to find the GeneticElement with a matching identifier */
	for (var n = 0; n < this.geneticElements.length; n++) {
		var geneticElement = this.geneticElements[n];
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
Eplant.Chromosome.prototype.getGeneticElementsByType = function(type) {
	/* Prepare returned array */
	var matchingGeneticElements = [];

	/* Loop through GeneticElement objects to find the GeneticElements with a matching type */
	for (var n = 0; n < this.geneticElements.length; n++) {
		var geneticElement = this.geneticElements[n];
		if (geneticElement.type.toUpperCase() == type.toUpperCase()) {
			matchingGeneticElements.push(geneticElement);
		}
	}

	/* Return matching GeneticElements */
	return matchingGeneticElements;
};

/**
 * Cleans up the Chromosome
 */
Eplant.Chromosome.prototype.remove = function() {
	/* Clean up GeneticElements */
	for (var n = 0; n < this.geneticElements; n++) {
		this.geneticElements[n].remove();
	}
};

})();
