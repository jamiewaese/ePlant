/**
 * Sequence View class
 * UI design by Jamie Waese
 * Code by Hans Yu
 */

function SequenceView(elementOfInterest) {
	ZUI.View.call(this);		// Call parent constructor

	this.elementOfInterest = elementOfInterest;
	this.element = elementOfInterest.element;
}
ZUI.Util.inheritClass(ZUI.View, SequenceView);		//Inherit parent prototype

SequenceView.prototype.active = function() {
	ZUI.container.style.cursor = "default";
	SequenceView.dallianceContainer.style.visibility = "visible";
	ZUI.disablePointerEvents();

	this.setDalliance();
};

SequenceView.prototype.inactive = function() {
	SequenceView.dallianceContainer.style.visibility = "hidden";
	ZUI.restorePointerEvents();
};

SequenceView.prototype.setDalliance = function() {
	SequenceView.dalliance.setLocation(this.element.chromosome.name.substring(4), this.element.start, this.element.end);
};

SequenceView.initDalliance = function() {
	SequenceView.dallianceContainer = document.getElementById("dalliance_container");

	/* Disable context menu */
	SequenceView.dallianceContainer.oncontextmenu = function(event) {
		return false;
	};

	SequenceView.dalliance = new Browser({
		chr: "1",
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
/*		searchEndpoint: new DASSource('http://www.derkholm.net:8080/das/hsa_54_36p/'),
		browserLinks: {
			Ensembl: 'http://ncbi36.ensembl.org/Homo_sapiens/Location/View?r=${chr}:${start}-${end}',
			UCSC: 'http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg18&position=chr${chr}:${start}-${end}',
		},*/
		cookieKey: 'eplant-sequence-view',
		disablePoweredBy: true,
		noTitle: true
	});
};

SequenceView.prototype.getLoadProgress = function() {
	return 1;
};
