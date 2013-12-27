/**
 * Eplant namespace
 * By Hans Yu
 */

/* Define namespace */
function Eplant() {}

/* Attributes */
Eplant.speciessOfInterest = [];		// Array of SpeciesOfInterest objects
Eplant.speciesOfFocus = null;		// The SpeciesOfInterest object in focus
Eplant.speciesView = null;			// SpeciesView object
Eplant.tooltipSwitch = true;		// Tooltip toggle switch
Eplant.elementDialogs = [];			// Element dialogs
Eplant.viewHistory = [];			// View history stack
Eplant.viewHistorySelected = null;		// Selected index of view history
Eplant.animateViewChange = true;		// Toggle view change animation

Eplant.initialize = function() {
	ZUI.initialize({
		canvas: document.getElementById("ZUI_canvas"),
		background: "#ffffff",
		backgroundAlpha: 0,
		frameRate: 60,
		cameraMoveRate: 0.25
	});
	ZUI.update = Eplant.update;
	MoleculeView.initJMol();
	WorldView.initGoogleMaps();
	Eplant.speciesView = new SpeciesView();
	ZUI.changeActiveView(Eplant.speciesView);

	/* Set up autocomplete for identifier input */
	$("#enterIdentifier").autocomplete({
		source: function(request, response) {
			$.ajax({
				type: "GET",
				url: "http://bar.utoronto.ca/~eplant/cgi-bin/idautocomplete.cgi?species=" + Eplant.speciesOfFocus.species.scientificName.split(" ").join("_") + "&term=" + request.term,
				dataType: "json"
			}).done(function(data) {
				response(data);
			});
		}
	});
};

/* Update function for ePlant called at each frame */
Eplant.update = function() {
	/////////////////////////////////////////////////////////////////
	/* Sync icons dock with views of elementOfFocus of speciesOfFocus */
	/////////////////////////////////////////////////////////////////

	/* SpeciesView */
	var img = document.getElementById("speciesViewIcon").getElementsByTagName("img")[0];
	if (Eplant.speciesView && Eplant.speciesView == ZUI.activeView) {
		if (!ZUI.endsWith(img.src, "img/active/species.png")) img.src = "img/active/species.png";
	}
	else if (Eplant.speciesView) {
		if (!ZUI.endsWith(img.src, "img/available/species.png")) img.src = "img/available/species.png";
	}
	else {
		if (!ZUI.endsWith(img.src, "img/unavailable/species.png")) img.src = "img/unavailable/species.png";
	}

	/* ChromosomeView */
	img = document.getElementById("chromosomeViewIcon").getElementsByTagName("img")[0];
	if (Eplant.speciesOfFocus && Eplant.speciesOfFocus.chromosomeView == ZUI.activeView) {
		if (!ZUI.endsWith(img.src, "img/active/chromosome.png")) img.src = "img/active/chromosome.png";
	}
	else if (Eplant.speciesOfFocus) {
		if (!ZUI.endsWith(img.src, "img/available/chromosome.png")) img.src = "img/available/chromosome.png";
	}
	else {
		if (!ZUI.endsWith(img.src, "img/unavailable/chromosome.png")) img.src = "img/unavailable/chromosome.png";
	}

	/* WorldView */
	img = document.getElementById("worldViewIcon").getElementsByTagName("img")[0];
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.worldView || Eplant.speciesOfFocus.elementOfFocus.worldView.getLoadProgress() < 1) {
		if (!ZUI.endsWith(img.src, "img/unavailable/world.png")) img.src = "img/unavailable/world.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.worldView == ZUI.activeView) {
		if (!ZUI.endsWith(img.src, "img/active/world.png")) img.src = "img/active/world.png";
	}
	else {
		if (!ZUI.endsWith(img.src, "img/available/world.png")) img.src = "img/available/world.png";
	}

	/* PlantView */
	img = document.getElementById("plantViewIcon").getElementsByTagName("img")[0];
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.plantView || Eplant.speciesOfFocus.elementOfFocus.plantView.getLoadProgress() < 1) {
		if (!ZUI.endsWith(img.src, "img/unavailable/plant.png")) img.src = "img/unavailable/plant.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.plantView == ZUI.activeView) {
		if (!ZUI.endsWith(img.src, "img/active/plant.png")) img.src = "img/active/plant.png";
	}
	else {
		if (!ZUI.endsWith(img.src, "img/available/plant.png")) img.src = "img/available/plant.png";
	}

	/* CellView */
	img = document.getElementById("cellViewIcon").getElementsByTagName("img")[0]
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.cellView || Eplant.speciesOfFocus.elementOfFocus.cellView.getLoadProgress() < 1) {
		if (!ZUI.endsWith(img.src, "img/unavailable/cell.png")) img.src = "img/unavailable/cell.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.cellView == ZUI.activeView) {
		if (!ZUI.endsWith(img.src, "img/active/cell.png")) img.src = "img/active/cell.png";
	}
	else {
		if (!ZUI.endsWith(img.src, "img/available/cell.png")) img.src = "img/available/cell.png";
	}

	/* InteractionView */
	img = document.getElementById("interactionViewIcon").getElementsByTagName("img")[0];
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.interactionView || Eplant.speciesOfFocus.elementOfFocus.interactionView.getLoadProgress() < 1) {
		if (!ZUI.endsWith(img.src, "img/unavailable/interaction.png")) img.src = "img/unavailable/interaction.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.interactionView == ZUI.activeView) {
		if (!ZUI.endsWith(img.src, "img/active/interaction.png")) img.src = "img/active/interaction.png";
	}
	else {
		if (!ZUI.endsWith(img.src, "img/available/interaction.png")) img.src = "img/available/interaction.png";
	}

	/* PathwayView */
	img = document.getElementById("pathwayViewIcon").getElementsByTagName("img")[0];
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.pathwayView || Eplant.speciesOfFocus.elementOfFocus.pathwayView.getLoadProgress() < 1) {
		if (!ZUI.endsWith(img.src, "img/unavailable/pathway.png")) img.src = "img/unavailable/pathway.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.pathwayView == ZUI.activeView) {
		if (!ZUI.endsWith(img.src, "img/active/pathway.png")) img.src = "img/active/pathway.png";
	}
	else {
		if (!ZUI.endsWith(img.src, "img/available/pathway.png")) img.src = "img/available/pathway.png";
	}

	/* MoleculeView */
	img = document.getElementById("moleculeViewIcon").getElementsByTagName("img")[0];
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.moleculeView || Eplant.speciesOfFocus.elementOfFocus.moleculeView.getLoadProgress() < 1) {
		if (!ZUI.endsWith(img.src, "img/unavailable/molecule.png")) img.src = "img/unavailable/molecule.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.moleculeView == ZUI.activeView) {
		if (!ZUI.endsWith(img.src, "img/active/molecule.png")) img.src = "img/active/molecule.png";
	}
	else {
		if (!ZUI.endsWith(img.src, "img/available/molecule.png")) img.src = "img/available/molecule.png";
	}

	/* SequenceView */
	img = document.getElementById("sequenceViewIcon").getElementsByTagName("img")[0];
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.sequenceView || Eplant.speciesOfFocus.elementOfFocus.sequenceView.getLoadProgress() < 1) {
		if (!ZUI.endsWith(img.src, "img/unavailable/sequence.png")) img.src = "img/unavailable/sequence.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.sequenceView == ZUI.activeView) {
		if (!ZUI.endsWith(img.src, "img/active/sequence.png")) img.src = "img/active/sequence.png";
	}
	else {
		if (!ZUI.endsWith(img.src, "img/available/sequence.png")) img.src = "img/available/sequence.png";
	}



	///////////////////////////////
	// Sync element dialog icons //
	///////////////////////////////
	for (var n = 0; n < Eplant.elementDialogs.length; n++) {
		Eplant.elementDialogs[n].updateIcons();
	}

	/* Sync view history icons */
	img = document.getElementById("historyBackIcon").getElementsByTagName("img")[0];
	if (Eplant.viewHistorySelected > 0) {
		if (!ZUI.endsWith(img.src, "img/available/history-back.png")) img.src = "img/available/history-back.png";
	}
	else {
		if (!ZUI.endsWith(img.src, "img/unavailable/history-back.png")) img.src = "img/unavailable/history-back.png";
	}

	img = document.getElementById("historyForwardIcon").getElementsByTagName("img")[0];
	if (Eplant.viewHistorySelected < Eplant.viewHistory.length - 1) {
		if (!ZUI.endsWith(img.src, "img/available/history-forward.png")) img.src = "img/available/history-forward.png";
	}
	else {
		if (!ZUI.endsWith(img.src, "img/unavailable/history-forward.png")) img.src = "img/unavailable/history-forward.png";
	}
};

/* Get the SpeciesOfInterest object corresponding to the Species object */
Eplant.getSpeciesOfInterest = function(species) {
	for (var n = 0; n < Eplant.speciessOfInterest.length; n++) {
		if (Eplant.speciessOfInterest[n].species == species) {
			return Eplant.speciessOfInterest[n];
		}
	}
	return null;
};

/* Add a new SpeciesOfInterest object to the array and returns the object */
Eplant.addSpeciesOfInterest = function(species) {
	var speciesOfInterest = Eplant.getSpeciesOfInterest(species);
	if (speciesOfInterest == null) {
		speciesOfInterest = new Eplant.SpeciesOfInterest(species);
		Eplant.speciessOfInterest.push(speciesOfInterest);
	}
	return speciesOfInterest;
};

/* Remove the given SpeciesOfInterest object from the array */
Eplant.removeSpeciesOfInterest = function(speciesOfInterest) {
	var index = Eplant.speciessOfInterest.indexOf(speciesOfInterest);
	if (index >= 0) {
		//TODO sync

		Eplant.speciessOfInterest.splice(index, 1);
		return true;
	}
	return false;
};

/* Set speciesOfFocus */
Eplant.setSpeciesOfFocus = function(speciesOfFocus) {
	Eplant.speciesOfFocus = speciesOfFocus;

	/* Sync species title display */
	document.getElementById("speciesLabel").innerHTML = speciesOfFocus.species.scientificName;

	/* Sync element drop down list */
	//TODO sync with drop down menu and plant title
	var elementsOfInterest = document.getElementById("elementsOfInterest");
	var options = elementsOfInterest.getElementsByTagName("option");
	for (var n = 1; n < options.length;) {
		elementsOfInterest.removeChild(options[n]);
	}
	for (n = 0; n < speciesOfFocus.elementsOfInterest.length; n++) {
		var elementOfInterest = speciesOfFocus.elementsOfInterest[n];
		var option = document.createElement("option");
		option.value = elementOfInterest.element.identifier;
		option.innerHTML = elementOfInterest.element.identifier;
		document.getElementById("elementsOfInterest").appendChild(option);
	}
};

/* Get the ElementDialog object associated with the given element */
Eplant.getElementDialog = function(element) {
	for (var n = 0; n < Eplant.elementDialogs.length; n++) {
		if (Eplant.elementDialogs[n].element == element) {
			return Eplant.elementDialogs[n];
		}
	}
	return null;
};

Eplant.setView = function(view) {
	var activeView = ZUI.activeView;
	ZUI.activeView = null;
	if (view instanceof SpeciesView) {
		ZUI.activeView = activeView;
		Eplant.toSpeciesView();
	}
	else if (view instanceof ChromosomeView) {
		Eplant.setSpeciesOfFocus(Eplant.getSpeciesOfInterest(view.species));
		ZUI.activeView = activeView;
		Eplant.toChromosomeView();
	}
	else if (view instanceof InteractionView) {
		Eplant.setSpeciesOfFocus(Eplant.getSpeciesOfInterest(view.element.chromosome.species));
		Eplant.speciesOfFocus.setElementOfFocus(Eplant.speciesOfFocus.getElementOfInterest(view.element));
		ZUI.activeView = activeView;
		Eplant.toInteractionView();
	}
	else if (view instanceof PlantView) {
		Eplant.setSpeciesOfFocus(Eplant.getSpeciesOfInterest(view.element.chromosome.species));
		Eplant.speciesOfFocus.setElementOfFocus(Eplant.speciesOfFocus.getElementOfInterest(view.element));
		ZUI.activeView = activeView;
		Eplant.toPlantView();
	}
	else if (view instanceof WorldView) {
		Eplant.setSpeciesOfFocus(Eplant.getSpeciesOfInterest(view.element.chromosome.species));
		Eplant.speciesOfFocus.setElementOfFocus(Eplant.speciesOfFocus.getElementOfInterest(view.element));
		ZUI.activeView = activeView;
		Eplant.toWorldView();
	}
	//TODO other views
};

Eplant.getElement = function() {
	var terms = document.getElementById("enterIdentifier").value.split(",");
	for (var n = 0; n < terms.length; n++) {
		var term = terms[n].trim();
		Eplant.speciesOfFocus.species.loadElement(term, $.proxy(function(element, term) {
			if (element) {
				/* Add ElementOfInterest */
				var elementOfInterest = Eplant.speciesOfFocus.addElementOfInterest(element, {});
				Eplant.speciesOfFocus.setElementOfFocus(elementOfInterest);
			}
			else {
				alert("Sorry, we could not find " + term + ".");
			}
		}, this));
	}
};

Eplant.backViewHistory = function() {
	if (Eplant.viewHistorySelected > 0) {
		Eplant.viewHistorySelected--;
		Eplant.setView(Eplant.viewHistory[Eplant.viewHistorySelected]);
	}
};

Eplant.forwardViewHistory = function() {
	if (Eplant.viewHistorySelected < Eplant.viewHistory.length - 1) {
		Eplant.viewHistorySelected++;
		Eplant.setView(Eplant.viewHistory[Eplant.viewHistorySelected]);
	}
};

/* Toggle tooltip */
Eplant.toggleTooltip = function() {
	var elements = document.getElementsByClassName("hint--rounded");
	if (Eplant.tooltipSwitch) {
		for (var n = 0; n < elements.length; n++) {
			elements[n].setAttribute("data-enabled", "false");
		}
		document.getElementById("tooltipIcon").getElementsByTagName("img")[0].src = "img/off/tooltip.png";
		Eplant.tooltipSwitch = false;
	}
	else {
		for (var n = 0; n < elements.length; n++) {
			elements[n].setAttribute("data-enabled", "true");
		}
		document.getElementById("tooltipIcon").getElementsByTagName("img")[0].src = "img/on/tooltip.png";
		Eplant.tooltipSwitch = true;
	}
};

/* Toggle view change animation */
Eplant.toggleChangeViewAnimation = function() {
	if (Eplant.animateViewChange) {
		document.getElementById("changeViewAnimationIcon").getElementsByTagName("img")[0].src = "img/off/zoom.png";
		Eplant.animateViewChange = false;
	}
	else {
		document.getElementById("changeViewAnimationIcon").getElementsByTagName("img")[0].src = "img/on/zoom.png";
		Eplant.animateViewChange = true;
	}
};

/* Show citation via popup */
Eplant.showCitation = function() {
	var containerElement = document.createElement("div");
	containerElement.style.textAlign = "center";
	containerElement.innerHTML = "Loading citation...";
	$(containerElement).dialog({
		title: "Citation",
		width: 600,
		minHeight: 0,
		resizable: false,
		draggable: false,
		modal: true,
		buttons: [
			{
				text: "Close",
				click: $.proxy(function(event, ui) {
					$(this).dialog("close");
				}, containerElement)
			}
		],
		close: $.proxy(function() {
			$(this).remove();
		}, containerElement)
	});
	var obj = {
		containerElement: containerElement,
	};
	if (ZUI.activeView instanceof ChromosomeView) {
		obj.view = "chromosome";
	}
	else if (ZUI.activeView instanceof InteractionView) {
		obj.view = "interaction";
	}
	$.ajax({
		type: "GET",
		url: "cgi-bin/citation.cgi?view=" + obj.view,
		dataType: "json"
	}).done($.proxy(function(response) {
		obj.containerElement.innerHTML = "This image for <i>" + Eplant.speciesOfFocus.species.scientificName +"</i> was generated using the " + obj.view + " viewer of ePlant at bar.utoronto.ca by Waese, Yu & Provart 2014. The data comes from " + response.source + ".";
	}, obj));
};

Eplant.onchangeElementOfFocus = function() {
	/* Get selected identifier */
	var listElement = document.getElementById("elementsOfInterest");
	var identifier = listElement.options[elementsOfInterest.selectedIndex].value;
	var elementOfInterest = Eplant.speciesOfFocus.getElementOfInterestByIdentifier(identifier);
	Eplant.speciesOfFocus.setElementOfFocus(elementOfInterest);
};

Eplant.showViewHistory = function() {
	var viewHistoryDialog = new Eplant.ViewHistoryDialog();
};

/* Pushed a view onto the viewHistory stack */
Eplant.pushViewHistory = function(view) {
	Eplant.viewHistory.push(view);
	if (Eplant.viewHistory.length > 50) {
		Eplant.popViewHistory();
	}
	Eplant.viewHistorySelected = Eplant.viewHistory.length - 1;
};

/* Removes the first item from the viewHistory stack and returns it */
Eplant.popViewHistory = function() {
	var view = Eplant.viewHistory[0];
	Eplant.viewHistory.splice(0, 1);
	return view;
};

Eplant.collapseElementDialogs = function() {
	for (var n = 0; n < Eplant.elementDialogs.length; n++) {
		var elementDialog = Eplant.elementDialogs[n];
		if (!elementDialog.minimized) {
			$(elementDialog.minimizeButtonElement).button({
				icons: {
					primary: "ui-icon-plus"
				},
				text: false
			});
			elementDialog.minimized = true;
			elementDialog._height = $(elementDialog.containerElement).height();
			$(elementDialog.containerElement).height(elementDialog._height);
			$(elementDialog.containerElement).hide().show(0);		// Hack to force redraw
			$(elementDialog.containerElement).addClass("minimized");
			$(elementDialog.containerElement).height(0);
		}
		$(elementDialog.containerElement.parentNode).animate({
			top: $(window).height() - 50
		}, 200);
	}
};

Eplant.changeActiveView = function(view, exitAnimationSettings, entryAnimationSettings) {
	if (!exitAnimationSettings) exitAnimationSettings = {};
	if (!entryAnimationSettings) entryAnimationSettings = {};
	if (!Eplant.animateViewChange) {
		exitAnimationSettings = {};
		entryAnimationSettings = {};
	}
	var entryAnimation = new ZUI.Animation(entryAnimationSettings);
	var obj = {
		nextView: view,
		entryAnimation: entryAnimation
	};
	exitAnimationSettings.end = $.proxy(function() {
		ZUI.changeActiveView(this.nextView);
		this.entryAnimation.begin();
	}, obj);
	var exitAnimation = new ZUI.Animation(exitAnimationSettings);
	exitAnimation.begin();
};

/* Change to SpeciesView */
Eplant.toSpeciesView = function() {
	if (!Eplant.speciesView) return;
	var view = Eplant.speciesView;
	if (ZUI.activeView instanceof ChromosomeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof InteractionView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PathwayView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof MoleculeView) {
		Eplant.changeActiveView(view, null, null);
	}
	else if (ZUI.activeView instanceof CellView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PlantView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof WorldView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
};

/* Change to ChromosomeView */
Eplant.toChromosomeView = function() {
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.chromosomeView) return;
	var view = Eplant.speciesOfFocus.chromosomeView;
	if (ZUI.activeView instanceof ChromosomeView) {
		Eplant.changeActiveView(view, null, null);
	}
	else if (ZUI.activeView instanceof SpeciesView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof InteractionView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PathwayView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof MoleculeView) {
		Eplant.changeActiveView(view, null, view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof CellView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PlantView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof WorldView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
};

/* Change to InteractionView */
Eplant.toInteractionView = function() {
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.interactionView) return;
	var view = Eplant.speciesOfFocus.elementOfFocus.interactionView;
	if (ZUI.activeView instanceof ChromosomeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof InteractionView) {
		Eplant.changeActiveView(view, null, null);
	}
	else if (ZUI.activeView instanceof PathwayView) {
		Eplant.changeActiveView(view, null, null);
	}
	else if (ZUI.activeView instanceof MoleculeView) {
		Eplant.changeActiveView(view, null, null);
	}
	else if (ZUI.activeView instanceof CellView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PlantView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof WorldView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
};

/* Change to MoleculeView */
Eplant.toMoleculeView = function() {
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.moleculeView) return;
	if (ZUI.activeView instanceof ChromosomeView) {
		Eplant.changeActiveView(new MoleculeView("At2g41460"), null, null);
	}
	else if (ZUI.activeView instanceof InteractionView) {
	}
	else if (ZUI.activeView instanceof WorldView) {
	}
};

/* Change to PathwayView */
Eplant.toPathwayView = function() {
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.pathwayView) return;
	var view = Eplant.speciesOfFocus.elementOfFocus.pathwayView;
	if (ZUI.activeView instanceof ChromosomeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof InteractionView) {
		Eplant.changeActiveView(view, null, null);
	}
	else if (ZUI.activeView instanceof PathwayView) {
		Eplant.changeActiveView(view, null, null);
	}
	else if (ZUI.activeView instanceof MoleculeView) {
		Eplant.changeActiveView(view, null, null);
	}
	else if (ZUI.activeView instanceof CellView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PlantView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof WorldView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
};

/* Change to PlantView */
Eplant.toPlantView = function() {
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.plantView) return;
	var view = Eplant.speciesOfFocus.elementOfFocus.plantView;
	if (ZUI.activeView instanceof ChromosomeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof InteractionView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PathwayView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof WorldView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof CellView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PlantView) {
		Eplant.changeActiveView(view, null, null);
	}
};

/* Change to CellView */
Eplant.toCellView = function() {
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.cellView) return;
	var view = Eplant.speciesOfFocus.elementOfFocus.cellView;
	if (ZUI.activeView instanceof ChromosomeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof InteractionView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PathwayView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof WorldView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PlantView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof CellView) {
		Eplant.changeActiveView(view, null, null);
	}
};

Eplant.toWorldView = function() {
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.worldView) return;
	var view = Eplant.speciesOfFocus.elementOfFocus.worldView;
	if (ZUI.activeView instanceof ChromosomeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof InteractionView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PathwayView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof CellView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PlantView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof WorldView) {
		Eplant.changeActiveView(view, null, null);
	}
};

Eplant.preventBubbling = function(element) {
	element.addEventListener("mousedown", ZUI.Util.stopBubble, false);
	element.addEventListener("mouseup", ZUI.Util.stopBubble, false);
	element.addEventListener("mousemove", ZUI.Util.stopBubble, false);
	element.addEventListener("click", ZUI.Util.stopBubble, false);
	element.addEventListener("dblclick", ZUI.Util.stopBubble, false);
	element.addEventListener("mousewheel", ZUI.Util.stopBubble, false);
	element.addEventListener("DOMMouseScroll", ZUI.Util.stopBubble, false);
	element.addEventListener("contextmenu", ZUI.Util.stopBubble, false);
};
