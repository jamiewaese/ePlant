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
Eplant._updatePanelTagsEventListeners = [];	// Event listeners that listen to tag update for updating elements of interest panel

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
	SequenceView.initDalliance();
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

	/* Override Eplant.elementsDialogs push method to detect new items */
	Eplant.elementDialogs.push = function(item) {
		Array.prototype.push.call(Eplant.elementDialogs, item);
		Eplant.updateElementsOfInterestPanel();
	}

	/* Override Eplant.elementsDialogs splice method to detect new items */
	Eplant.elementDialogs.splice = function(index, length) {
		Array.prototype.splice.call(Eplant.elementDialogs, index, length);
		Eplant.updateElementsOfInterestPanel();
	}

	/* Allow Enter key for submitting gene query */
	$("#enterIdentifier").keypress(function(event) {
		if (event.keyCode == 13) {
			Eplant.getElement();
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
		if (!ZUI.Util.endsWith(img.src, "img/active/species.png")) img.src = "img/active/species.png";
	}
	else if (Eplant.speciesView) {
		if (!ZUI.Util.endsWith(img.src, "img/available/species.png")) img.src = "img/available/species.png";
	}
	else {
		if (!ZUI.Util.endsWith(img.src, "img/unavailable/species.png")) img.src = "img/unavailable/species.png";
	}

	/* ChromosomeView */
	img = document.getElementById("chromosomeViewIcon").getElementsByTagName("img")[0];
	if (Eplant.speciesOfFocus && Eplant.speciesOfFocus.chromosomeView == ZUI.activeView) {
		if (!ZUI.Util.endsWith(img.src, "img/active/chromosome.png")) img.src = "img/active/chromosome.png";
	}
	else if (Eplant.speciesOfFocus) {
		if (!ZUI.Util.endsWith(img.src, "img/available/chromosome.png")) img.src = "img/available/chromosome.png";
	}
	else {
		if (!ZUI.Util.endsWith(img.src, "img/unavailable/chromosome.png")) img.src = "img/unavailable/chromosome.png";
	}

	/* WorldView */
	img = document.getElementById("worldViewIcon").getElementsByTagName("img")[0];
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.worldView || Eplant.speciesOfFocus.elementOfFocus.worldView.getLoadProgress() < 1) {
		if (!ZUI.Util.endsWith(img.src, "img/unavailable/world.png")) img.src = "img/unavailable/world.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.worldView == ZUI.activeView) {
		if (!ZUI.Util.endsWith(img.src, "img/active/world.png")) img.src = "img/active/world.png";
	}
	else {
		if (!ZUI.Util.endsWith(img.src, "img/available/world.png")) img.src = "img/available/world.png";
	}

	/* PlantView */
	img = document.getElementById("plantViewIcon").getElementsByTagName("img")[0];
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.plantView || Eplant.speciesOfFocus.elementOfFocus.plantView.getLoadProgress() < 1) {
		if (!ZUI.Util.endsWith(img.src, "img/unavailable/plant.png")) img.src = "img/unavailable/plant.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.plantView == ZUI.activeView) {
		if (!ZUI.Util.endsWith(img.src, "img/active/plant.png")) img.src = "img/active/plant.png";
	}
	else {
		if (!ZUI.Util.endsWith(img.src, "img/available/plant.png")) img.src = "img/available/plant.png";
	}

	/* ExperimentView */
	img = document.getElementById("experimentViewIcon").getElementsByTagName("img")[0];
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.experimentView || Eplant.speciesOfFocus.elementOfFocus.experimentView.getLoadProgress() < 1) {
		if (!ZUI.Util.endsWith(img.src, "img/unavailable/experiment.png")) img.src = "img/unavailable/experiment.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.experimentView == ZUI.activeView) {
		if (!ZUI.Util.endsWith(img.src, "img/active/experiment.png")) img.src = "img/active/experiment.png";
	}
	else {
		if (!ZUI.Util.endsWith(img.src, "img/available/experiment.png")) img.src = "img/available/experiment.png";
	}

	/* CellView */
	img = document.getElementById("cellViewIcon").getElementsByTagName("img")[0]
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.cellView || Eplant.speciesOfFocus.elementOfFocus.cellView.getLoadProgress() < 1) {
		if (!ZUI.Util.endsWith(img.src, "img/unavailable/cell.png")) img.src = "img/unavailable/cell.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.cellView == ZUI.activeView) {
		if (!ZUI.Util.endsWith(img.src, "img/active/cell.png")) img.src = "img/active/cell.png";
	}
	else {
		if (!ZUI.Util.endsWith(img.src, "img/available/cell.png")) img.src = "img/available/cell.png";
	}

	/* InteractionView */
	img = document.getElementById("interactionViewIcon").getElementsByTagName("img")[0];
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.interactionView || Eplant.speciesOfFocus.elementOfFocus.interactionView.getLoadProgress() < 1) {
		if (!ZUI.Util.endsWith(img.src, "img/unavailable/interaction.png")) img.src = "img/unavailable/interaction.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.interactionView == ZUI.activeView) {
		if (!ZUI.Util.endsWith(img.src, "img/active/interaction.png")) img.src = "img/active/interaction.png";
	}
	else {
		if (!ZUI.Util.endsWith(img.src, "img/available/interaction.png")) img.src = "img/available/interaction.png";
	}

	/* PathwayView */
	img = document.getElementById("pathwayViewIcon").getElementsByTagName("img")[0];
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.pathwayView || Eplant.speciesOfFocus.elementOfFocus.pathwayView.getLoadProgress() < 1) {
		if (!ZUI.Util.endsWith(img.src, "img/unavailable/pathway.png")) img.src = "img/unavailable/pathway.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.pathwayView == ZUI.activeView) {
		if (!ZUI.Util.endsWith(img.src, "img/active/pathway.png")) img.src = "img/active/pathway.png";
	}
	else {
		if (!ZUI.Util.endsWith(img.src, "img/available/pathway.png")) img.src = "img/available/pathway.png";
	}

	/* MoleculeView */
	img = document.getElementById("moleculeViewIcon").getElementsByTagName("img")[0];
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.moleculeView || Eplant.speciesOfFocus.elementOfFocus.moleculeView.getLoadProgress() < 1) {
		if (!ZUI.Util.endsWith(img.src, "img/unavailable/molecule.png")) img.src = "img/unavailable/molecule.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.moleculeView == ZUI.activeView) {
		if (!ZUI.Util.endsWith(img.src, "img/active/molecule.png")) img.src = "img/active/molecule.png";
	}
	else {
		if (!ZUI.Util.endsWith(img.src, "img/available/molecule.png")) img.src = "img/available/molecule.png";
	}

	/* SequenceView */
	img = document.getElementById("sequenceViewIcon").getElementsByTagName("img")[0];
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.sequenceView || Eplant.speciesOfFocus.elementOfFocus.sequenceView.getLoadProgress() < 1) {
		if (!ZUI.Util.endsWith(img.src, "img/unavailable/sequence.png")) img.src = "img/unavailable/sequence.png";
	}
	else if (Eplant.speciesOfFocus.elementOfFocus.sequenceView == ZUI.activeView) {
		if (!ZUI.Util.endsWith(img.src, "img/active/sequence.png")) img.src = "img/active/sequence.png";
	}
	else {
		if (!ZUI.Util.endsWith(img.src, "img/available/sequence.png")) img.src = "img/available/sequence.png";
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
		if (!ZUI.Util.endsWith(img.src, "img/available/history-back.png")) img.src = "img/available/history-back.png";
	}
	else {
		if (!ZUI.Util.endsWith(img.src, "img/unavailable/history-back.png")) img.src = "img/unavailable/history-back.png";
	}

	img = document.getElementById("historyForwardIcon").getElementsByTagName("img")[0];
	if (Eplant.viewHistorySelected < Eplant.viewHistory.length - 1) {
		if (!ZUI.Util.endsWith(img.src, "img/available/history-forward.png")) img.src = "img/available/history-forward.png";
	}
	else {
		if (!ZUI.Util.endsWith(img.src, "img/unavailable/history-forward.png")) img.src = "img/unavailable/history-forward.png";
	}
};

Eplant.toImageInWindow = function() {
	if (ZUI.activeView instanceof WorldView) {
		alert("We cannot convert Google Maps output to an image, please use another method. We apologize for the inconvenience.");
		return;
	}

	var canvas = document.createElement("canvas");
	canvas.width = ZUI.width;
	canvas.height = ZUI.height;
	var context = canvas.getContext("2d");

	/* Draw background */
	context.save();
	context.fillStyle = "#FFFFFF";
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.restore();

	/* Copy JSmol interface */
	if (MoleculeView.canvas.style.visibility == "visible") {
		context.drawImage(MoleculeView.canvas, 0, 0);
	}

	/* Copy Cytoscape interface */
	var cytoscapeCanvases = document.getElementById("Cytoscape_container").getElementsByTagName("canvas");
	Array(cytoscapeCanvases).sort(function(a, b) {
		return a.style.zIndex - b.style.zIndex;
	});
	for (var n = cytoscapeCanvases.length - 1; n >= 0; n--) {
		context.drawImage(cytoscapeCanvases[n], 0, 0);
	}

	/* Copy ZUI interface */
	context.drawImage(ZUI.canvas, 0, 0);

	window.open(canvas.toDataURL());
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

	/* Update elementsOfInterest panel */
	Eplant.updateElementsOfInterestPanel();
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
	else if (view instanceof WorldView) {
		Eplant.setSpeciesOfFocus(Eplant.getSpeciesOfInterest(view.element.chromosome.species));
		Eplant.speciesOfFocus.setElementOfFocus(Eplant.speciesOfFocus.getElementOfInterest(view.element));
		ZUI.activeView = activeView;
		Eplant.toWorldView();
	}
	else if (view instanceof PlantView) {
		Eplant.setSpeciesOfFocus(Eplant.getSpeciesOfInterest(view.element.chromosome.species));
		Eplant.speciesOfFocus.setElementOfFocus(Eplant.speciesOfFocus.getElementOfInterest(view.element));
		ZUI.activeView = activeView;
		Eplant.toPlantView();
	}
	else if (view instanceof CellView) {
		Eplant.setSpeciesOfFocus(Eplant.getSpeciesOfInterest(view.element.chromosome.species));
		Eplant.speciesOfFocus.setElementOfFocus(Eplant.speciesOfFocus.getElementOfInterest(view.element));
		ZUI.activeView = activeView;
		Eplant.toCellView();
	}
	else if (view instanceof ExperimentView) {
		Eplant.setSpeciesOfFocus(Eplant.getSpeciesOfInterest(view.element.chromosome.species));
		Eplant.speciesOfFocus.setElementOfFocus(Eplant.speciesOfFocus.getElementOfInterest(view.element));
		ZUI.activeView = activeView;
		Eplant.toExperimentView();
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
	else if (view instanceof PathwayView) {
		Eplant.setSpeciesOfFocus(Eplant.getSpeciesOfInterest(view.element.chromosome.species));
		Eplant.speciesOfFocus.setElementOfFocus(Eplant.speciesOfFocus.getElementOfInterest(view.element));
		ZUI.activeView = activeView;
		Eplant.toPathwayView();
	}
	else if (view instanceof MoleculeView) {
		Eplant.setSpeciesOfFocus(Eplant.getSpeciesOfInterest(view.element.chromosome.species));
		Eplant.speciesOfFocus.setElementOfFocus(Eplant.speciesOfFocus.getElementOfInterest(view.element));
		ZUI.activeView = activeView;
		Eplant.toMoleculeView();
	}
	else if (view instanceof SequenceView) {
		Eplant.setSpeciesOfFocus(Eplant.getSpeciesOfInterest(view.element.chromosome.species));
		Eplant.speciesOfFocus.setElementOfFocus(Eplant.speciesOfFocus.getElementOfInterest(view.element));
		ZUI.activeView = activeView;
		Eplant.toSequenceView();
	}
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
		elementDialog.close();
		n--;
	}
};

/* Updates the elementsOfInterest panel to reflect the elementsOfInterest of the current speciesOfFocus */
Eplant.updateElementsOfInterestPanel = function() {
	/* Confirm speciesOfFocus is set */
	if (!Eplant.speciesOfFocus) return;

	/* Empty panel */
	var container = document.getElementById("genePanel_content");
	container.innerHTML = "";

	/* Remove old panel tags update event listeners */
	for (var n = 0; n < Eplant._updatePanelTagsEventListeners.length; n++) {
		ZUI.removeEventListener(Eplant._updatePanelTagsEventListeners[n]);
	}
	Eplant._updatePanelTagsEventListeners = [];

	/* Add items to panel */
	var elementsOfInterest = Eplant.speciesOfFocus.elementsOfInterest;
	for (n = 0; n < elementsOfInterest.length; n++) {
		var elementOfInterest = elementsOfInterest[n];
		var element = elementOfInterest.element;

		/* Container */
		var item = document.createElement("div");
		item.className = "elementsOfInterestPanelItem";
		if (elementOfInterest == Eplant.speciesOfFocus.elementOfFocus) {
			item.className += " elementsOfInterestPanelItem_focus";
		}

		/* Icon */
		var img = document.createElement("img");
		if (Eplant.getElementDialog(elementOfInterest.element)) {
			if (elementOfInterest == Eplant.speciesOfFocus.elementOfFocus) {
				img.src = "img/expand-focus";
			}
			else {
				img.src = "img/expand-open.png";
			}
		}
		else {
			img.src = "img/expand.png";
		}
		img.onclick = $.proxy(function() {
			var elementDialog = Eplant.getElementDialog(this.element);
			if (elementDialog) {
				elementDialog.close();
			}
			else {
				var xPos = ZUI.width;
				var yPos = this.speciesOfInterest.elementsOfInterest.indexOf(this) * 24 + 85 - $("#genePanel_content").scrollTop();
				elementDialog = new Eplant.ElementDialog({
					x: xPos,
					y: yPos,
					orientation: "left",
					element: this.element
				});
			}
		}, elementOfInterest);
		item.appendChild(img);

		/* Label */
		var span = document.createElement("span");
		span.innerHTML = element.identifier;
		if (element.aliases != null && element.aliases.length > 0 && element.aliases[0].length > 0) {
			span.innerHTML += " / " + element.aliases.join(", ");
		}
		span.title = span.innerHTML;
		span.onclick = $.proxy(function() {
			this.speciesOfInterest.setElementOfFocus(this);
		}, elementOfInterest);
		item.appendChild(span);

		/* Tags */
		var tagsContainer = document.createElement("div");
		tagsContainer.style.display = "inline";
		for (var m = 0; m < elementOfInterest.tags.length; m++) {
			var tag = elementOfInterest.tags[m];
			var tagElement = document.createElement("div");
			tagElement.style.borderRadius = "999px";
			tagElement.style.width = "7px";
			tagElement.style.height = "7px";
			tagElement.style.margin = "1px";
			tagElement.style.display = "inline-block";
			tagElement.style.backgroundColor = tag.color;
			tagsContainer.appendChild(tagElement);
		}
		var eventListener = new ZUI.EventListener("update-tags", elementOfInterest, function(event, eventData, listenerData) {
			var elementOfInterest = event.target;
			var tagsContainer = listenerData.tagsContainer;
			tagsContainer.innerHTML = "";
			for (var m = 0; m < elementOfInterest.tags.length; m++) {
				var tag = elementOfInterest.tags[m];
				var tagElement = document.createElement("div");
				tagElement.style.borderRadius = "999px";
				tagElement.style.width = "7px";
				tagElement.style.height = "7px";
				tagElement.style.margin = "1px";
				tagElement.style.display = "inline-block";
				tagElement.style.backgroundColor = tag.color;
				tagsContainer.appendChild(tagElement);
			}
		}, {
			tagsContainer: tagsContainer
		});
		Eplant._updatePanelTagsEventListeners.push(eventListener);
		ZUI.addEventListener(eventListener);
		item.appendChild(tagsContainer);
		
		container.appendChild(item);
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
	if (ZUI.activeView instanceof WorldView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PlantView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof CellView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof ExperimentView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof ChromosomeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof InteractionView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PathwayView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof MoleculeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof SequenceView) {
		Eplant.changeActiveView(view, null, view.getZoomOutEntryAnimationSettings());
	}
};

/* Change to WorldView */
Eplant.toWorldView = function() {
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.worldView) return;
	var view = Eplant.speciesOfFocus.elementOfFocus.worldView;
	if (ZUI.activeView instanceof WorldView) {
		Eplant.changeActiveView(view, null, null);
	}
	else if (ZUI.activeView instanceof PlantView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof CellView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof ExperimentView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof ChromosomeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof InteractionView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PathwayView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof MoleculeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof SequenceView) {
		Eplant.changeActiveView(view, null, view.getZoomOutEntryAnimationSettings());
	}
};

/* Change to PlantView */
Eplant.toPlantView = function() {
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.plantView) return;
	var view = Eplant.speciesOfFocus.elementOfFocus.plantView;
	if (ZUI.activeView instanceof WorldView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PlantView) {
		Eplant.changeActiveView(view, null, null);
	}
	else if (ZUI.activeView instanceof CellView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof ExperimentView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof ChromosomeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof InteractionView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PathwayView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof MoleculeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof SequenceView) {
		Eplant.changeActiveView(view, null, view.getZoomOutEntryAnimationSettings());
	}
};

/* Change to CellView */
Eplant.toCellView = function() {
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.cellView) return;
	var view = Eplant.speciesOfFocus.elementOfFocus.cellView;
	if (ZUI.activeView instanceof WorldView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PlantView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof CellView) {
		Eplant.changeActiveView(view, null, null);
	}
	else if (ZUI.activeView instanceof ExperimentView) {
		Eplant.changeActiveView(view, ZUI.activeView.getPanLeftExitAnimationSettings(), view.getPanLeftEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof ChromosomeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof InteractionView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PathwayView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof MoleculeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof SequenceView) {
		Eplant.changeActiveView(view, null, view.getZoomOutEntryAnimationSettings());
	}
};

/* Change to ExperimentView */
Eplant.toExperimentView = function() {
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.experimentView) return;
	var view = Eplant.speciesOfFocus.elementOfFocus.experimentView;
	if (ZUI.activeView instanceof WorldView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PlantView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof CellView) {
		Eplant.changeActiveView(view, ZUI.activeView.getPanRightExitAnimationSettings(), view.getPanRightEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof ExperimentView) {
		Eplant.changeActiveView(view, null, null);
	}
	else if (ZUI.activeView instanceof ChromosomeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof InteractionView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PathwayView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof MoleculeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof SequenceView) {
		Eplant.changeActiveView(view, null, view.getZoomOutEntryAnimationSettings());
	}
};

/* Change to ChromosomeView */
Eplant.toChromosomeView = function() {
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.chromosomeView) return;
	var view = Eplant.speciesOfFocus.chromosomeView;
	if (ZUI.activeView instanceof SpeciesView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof WorldView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PlantView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof CellView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof ExperimentView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof ChromosomeView) {
		Eplant.changeActiveView(view, null, null);
	}
	else if (ZUI.activeView instanceof InteractionView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PathwayView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof MoleculeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof SequenceView) {
		Eplant.changeActiveView(view, null, view.getZoomOutEntryAnimationSettings());
	}
};

/* Change to InteractionView */
Eplant.toInteractionView = function() {
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.interactionView) return;
	var view = Eplant.speciesOfFocus.elementOfFocus.interactionView;
	if (ZUI.activeView instanceof WorldView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PlantView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof CellView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof ExperimentView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof ChromosomeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof InteractionView) {
		Eplant.changeActiveView(view, null, null);
	}
	else if (ZUI.activeView instanceof PathwayView) {
		Eplant.changeActiveView(view, ZUI.activeView.getPanLeftExitAnimationSettings(), view.getPanLeftEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof MoleculeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof SequenceView) {
		Eplant.changeActiveView(view, null, view.getZoomOutEntryAnimationSettings());
	}
};

/* Change to PathwayView */
Eplant.toPathwayView = function() {
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.pathwayView) return;
	var view = Eplant.speciesOfFocus.elementOfFocus.pathwayView;
	if (ZUI.activeView instanceof WorldView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PlantView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof CellView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof ExperimentView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof ChromosomeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof InteractionView) {
		Eplant.changeActiveView(view, ZUI.activeView.getPanRightExitAnimationSettings(), view.getPanRightEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PathwayView) {
		Eplant.changeActiveView(view, null, null);
	}
	else if (ZUI.activeView instanceof MoleculeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomOutExitAnimationSettings(), view.getZoomOutEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof SequenceView) {
		Eplant.changeActiveView(view, null, null);
	}
};

/* Change to MoleculeView */
Eplant.toMoleculeView = function() {
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.moleculeView) return;
	var view = Eplant.speciesOfFocus.elementOfFocus.moleculeView;
	if (ZUI.activeView instanceof WorldView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PlantView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof CellView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof ExperimentView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof ChromosomeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof InteractionView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof PathwayView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), view.getZoomInEntryAnimationSettings());
	}
	else if (ZUI.activeView instanceof MoleculeView) {
		Eplant.changeActiveView(view, null, null);
	}
	else if (ZUI.activeView instanceof SequenceView) {
		Eplant.changeActiveView(view, null, view.getZoomOutEntryAnimationSettings());
	}
};

/* Change to SequenceView */
Eplant.toSequenceView = function() {
	if (!Eplant.speciesOfFocus || !Eplant.speciesOfFocus.elementOfFocus || !Eplant.speciesOfFocus.elementOfFocus.sequenceView) return;
	var view = Eplant.speciesOfFocus.elementOfFocus.sequenceView;
	if (ZUI.activeView instanceof WorldView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), null);
	}
	else if (ZUI.activeView instanceof PlantView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), null);
	}
	else if (ZUI.activeView instanceof CellView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), null);
	}
	else if (ZUI.activeView instanceof ExperimentView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), null);
	}
	else if (ZUI.activeView instanceof ChromosomeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), null);
	}
	else if (ZUI.activeView instanceof InteractionView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), null);
	}
	else if (ZUI.activeView instanceof PathwayView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), null);
	}
	else if (ZUI.activeView instanceof MoleculeView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), null);
	}
	else if (ZUI.activeView instanceof SequenceView) {
		Eplant.changeActiveView(view, ZUI.activeView.getZoomInExitAnimationSettings(), null);
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
