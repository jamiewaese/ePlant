/**
 * Element class for ePlant
 * By Hans Yu
 */

/* Class constructor */
Eplant.Element = function(chromosome) {
	this.chromosome = chromosome;
	this.identifier = null;
	this.aliases = null;
	this.start = null;
	this.end = null;
	this.strand = null;
	this.annotation = null;
};