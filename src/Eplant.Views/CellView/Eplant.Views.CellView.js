(function() {

/**
 * Eplant.Views.CellView class
 * Coded by Hans Yu
 * UI designed by Jamie Waese
 *
 * ePlant View for browsing subcellular localization data of gene products as eFP.
 *
 * @constructor
 * @augments Eplant.BaseViews.EFPView
 * @param {Eplant.GeneticElement} geneticElement The GeneticElement associated with this view.
 */
Eplant.Views.CellView = function(geneticElement) {
	// Get constructor
	var constructor = Eplant.Views.CellView;

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

	// Call eFP constructor
	var efpURL = Eplant.ServiceUrl + 'data/cell/' + geneticElement.species.scientificName.replace(" ", "_") + ".json";
	Eplant.BaseViews.EFPView.call(this, geneticElement, efpURL, {
		isRelativeEnabled: false,
		isCompareEnabled: false,
		isMaskEnabled: false
	});
};
ZUI.Util.inheritClass(Eplant.BaseViews.EFPView, Eplant.Views.CellView);	// Inherit parent prototype

Eplant.Views.CellView.viewName = "Cell eFP Viewer";
Eplant.Views.CellView.hierarchy = "genetic element";
Eplant.Views.CellView.magnification = 40;
Eplant.Views.CellView.description = "Cell eFP viewer";
Eplant.Views.CellView.citation = "";
Eplant.Views.CellView.activeIconImageURL = "img/active/cell.png";
Eplant.Views.CellView.availableIconImageURL = "img/available/cell.png";
Eplant.Views.CellView.unavailableIconImageURL = "img/unavailable/cell.png";

})();