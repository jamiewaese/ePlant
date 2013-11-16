/**
 * Species class for ePlant
 * By Hans Yu
 */

/* Class constructor */
Eplant.Species = function() {
	this.scientificName = null;
	this.commonName = null;
	this.chromosomes = null;
};

/* Get the Element object associated with the given identifier */
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

/* Get the Chromosome object associated with the given name */
Eplant.Species.prototype.getChromosome = function(name) {
	for (var n = 0; n < this.chromosomes.length; n++) {
		if (this.chromosomes[n].name == name) {
			return this.chromosomes[n];
		}
	}
	return null
};
