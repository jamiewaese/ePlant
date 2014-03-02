(function() {

/**
 * Eplant.Views.SequenceView class
 * Coded by Hans Yu
 * UI designed by Jamie Waese
 *
 * ePlant view for browsing sequence data.
 * Uses the Dalliance genome browser.
 *
 * @constructor
 * @param {Eplant.GeneticElement} The GeneticElement associated with this view.
 */
Eplant.Views.SequenceView = function(geneticElement) {
	// Get constructor
	var constructor = Eplant.Views.SequenceView;

	// Call parent constructor
	Eplant.View.call(this,
		constructor.viewName,				// Name of the View visible to the user
		constructor.hierarchy,			// Hierarchy of the View
		constructor.magnification,			// Magnification level of the View
		constructor.description,			// Description of the View visible to the user
		constructor.citation,			// Citation template of the View
		constructor.activeIconImageURL,		// URL for the active icon image
		constructor.availableIconImageURL,		// URL for the available icon image
		constructor.unavailableIconImageURL	// URL for the unavailable icon image
	);

	// Attributes
	this.geneticElement = geneticElement;

	// Finish loading
	this.loadFinish();
};
ZUI.Util.inheritClass(Eplant.View, Eplant.Views.SequenceView);	// Inherit parent prototype

Eplant.Views.SequenceView.viewName = "Sequence Viewer";
Eplant.Views.SequenceView.hierarchy = "genetic element";
Eplant.Views.SequenceView.magnification = 80;
Eplant.Views.SequenceView.description = "Sequence viewer";
Eplant.Views.SequenceView.citation = "";
Eplant.Views.SequenceView.activeIconImageURL = "img/active/sequence.png";
Eplant.Views.SequenceView.availableIconImageURL = "img/available/sequence.png";
Eplant.Views.SequenceView.unavailableIconImageURL = "img/unavailable/sequence.png";

/* Constants */
Eplant.Views.SequenceView.domContainer = null;		// DOM container for Dalliance
Eplant.Views.SequenceView.dalliance = null;		// Dalliance object

/* Static methods */
/**
 * Initializes Dalliance
 */
// TODO this does not work for multiple species, species must somehow change in dalliance appropriately
Eplant.Views.SequenceView.initialize = function() {
	// Get Dalliance DOM container
	Eplant.Views.SequenceView.domContainer = document.getElementById("dalliance_container");

	// Disable context menu on Dalliance
	Eplant.Views.SequenceView.domContainer.oncontextmenu = function(event) {
		return false;
	};

	// Start Dalliance
	Eplant.Views.SequenceView.dalliance = new Browser({
		chr: "chr1",
		viewStart: 1,
		viewEnd: 10001,
		sources: [
			{
				name: 'Genome (AtGDB)',
				uri: 'http://bar.utoronto.ca/~eplant/cgi-bin/relay.cgi?source=http://www.plantgdb.org/AtGDB/cgi-bin/das/atgdb/&args=',
				tier_type: 'sequence',
				provides_entrypoints: true
			},
			{
				name: "TAIR gene models",
				uri: 'http://bar.utoronto.ca/~eplant/cgi-bin/relay.cgi?source=http://www.plantgdb.org/AtGDB/cgi-bin/das/atgdb-gene_models/&args=',
				tier_type: 'features'
			},
			{
				name: "GeneSeqer cDNA alignments",
				uri: 'http://bar.utoronto.ca/~eplant/cgi-bin/relay.cgi?source=http://www.plantgdb.org/AtGDB/cgi-bin/das/atgdb-cdna/&args=',
				tier_type: 'features'
			},
			{
				name: "GeneSeqer EST alignments",
				uri: 'http://bar.utoronto.ca/~eplant/cgi-bin/relay.cgi?source=http://www.plantgdb.org/AtGDB/cgi-bin/das/atgdb-est/&args=',
				tier_type: 'features'
			}
		],
		cookieKey: "eplant-views-sequenceView",
		disablePoweredBy: true,
		noTitle: true
	});
};

/**
 * Active callback method.
 *
 * @override
 */
Eplant.Views.SequenceView.prototype.active = function() {
	// Call parent method
	Eplant.View.prototype.active.call(this);

	// Make Dalliance visible
	$(Eplant.Views.SequenceView.domContainer).css({"visibility": "visible"});

	// Disable ZUI pointer events
	ZUI.disablePointerEvents();

	// Update Dalliance
	this.update();
};

/**
 * Inactive callback method.
 *
 * @override
 */
Eplant.Views.SequenceView.prototype.inactive = function() {
	// Call parent method
	Eplant.View.prototype.inactive.call(this);

	// Hide Dalliance
	$(Eplant.Views.SequenceView.domContainer).css({"visibility": "hidden"});

	/* Restore ZUI pointer events */
	ZUI.restorePointerEvents();
};

/**
 * Updates Dalliance with data from this view.
 */
Eplant.Views.SequenceView.prototype.update = function() {
	Eplant.Views.SequenceView.dalliance.setLocation(this.geneticElement.chromosome.identifier.toLowerCase(), this.geneticElement.start, this.geneticElement.end);
};

})();
