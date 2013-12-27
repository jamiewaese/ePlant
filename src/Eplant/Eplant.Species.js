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

/* Load data for an element with the given identifier and execute the given callback function when loading is complete */
Eplant.Species.prototype.loadElement = function(term, callback) {
	var obj = {};
	obj.context = this;
	obj.callback = callback;
	obj.term = term;
	$.ajax({
		type: "GET",
		url: "cgi-bin/querygene.cgi?species=" + this.scientificName.split(" ").join("_") + "&term=" + term,
		dataType: "json"
	}).done($.proxy(function(response) {
		var chromosome = this.context.getChromosome(response.chromosome);
		if (chromosome) {
			var element = this.context.getElementByIdentifier(response.id);
			if (!element) {
				/* Create Element */
				element = new Eplant.Element(chromosome);
				element.identifier = response.id;
				element.start = response.start;
				element.end = response.end;
				element.strand = response.strand;
				element.aliases = response.aliases;
				element.annotation = response.annotation;
				chromosome.elements.push(element);
			}
			this.callback(element, this.term);
		}
		else {
			this.callback(null, this.term);
		}
	}, obj));
};
