(function() {

/**
 * Eplant namespace
 * By Hans Yu
 *
 * This namespace is for the ePlant core.
 * 
 * @namespace
 */
Eplant = {};

/* Constants */
Eplant.ServiceUrl = '../cgi-bin/';		// Base services url

/* Attributes */
Eplant.species = [];				// Array of Species objects
Eplant.activeSpecies = null;		// Species that is under active study
Eplant.views = null;				// Object container for Views associated with ePlant
Eplant.isLoadedViews = false;		// Whether Views are loaded
Eplant.isLoadedSpecies = false;		// Whether Species are loaded
Eplant.isAnimateActiveViewChange = true;		// Whether activeView changes are animated
Eplant.viewSpecificUIButtonsContainer = null;	// DOM container for ViewSpecificUIButtons
Eplant.isTooltipOn = true;			// Whether tooltips are enabled
Eplant.history = null;			// Keeps track of history

/**
 * Initializes ePlant
 */
Eplant.initialize = function() {
	/* Initialize ZUI */
	ZUI.initialize({
		canvas: document.getElementById("ZUI_canvas"),
		background: "#ffffff",
		backgroundAlpha: 0,
		frameRate: 60,
	});
	ZUI.camera.followRate = 0.25;

	/* Initialize View modules */
	for (var ViewName in Eplant.Views) {
		/* Get View constructor */
		var View = Eplant.Views[ViewName];

		/* Initialize */
		if (View.initialize) {
			View.initialize();
		}
	}

	/* Set up View icon dock */
	/* Sort Views by magnification (ascending) */
	var sortedViewNames = [];
	for (var ViewName in Eplant.Views) {
		sortedViewNames.push(ViewName);
	}
	sortedViewNames.sort(function(a, b) {
		return (Eplant.Views[a].magnification - Eplant.Views[b].magnification);
	});
	/* Add View icons to the dock */
	var lastMagnification = Eplant.Views[sortedViewNames[0]].magnification;
	for (var n = 0; n < sortedViewNames.length; n++) {
		/* Get View constructor */
		var ViewName = sortedViewNames[n];
		var View = Eplant.Views[sortedViewNames[n]];

		/* Append line break if magnification level is higher */
		if (Math.floor(View.magnification) > Math.floor(lastMagnification)) {
			var br = document.createElement("br");
			$("#navigationContainer").append(br);
		}
		lastMagnification = View.magnification;

		/* Create and append icon */
		var icon = document.createElement("div");
		icon.id = ViewName + "Icon";
		icon.className = "icon hint-right hint--success hint-rounded";
		icon.setAttribute("data-hint", View.description);
		icon.setAttribute("data-enabled", "true");
		icon.onclick = function() {
			/* Get icon id */
			var id = this.id;

			/* Get View name */
			var ViewName = id.substring(0, id.length - 4);

			/* Get View */
			var view = null;
			if (Eplant.Views[ViewName].hierarchy == "ePlant") {
				view = Eplant.views[ViewName];
			}
			else if (Eplant.Views[ViewName].hierarchy == "species") {
				view = Eplant.activeSpecies.views[ViewName];
			}
			else if (Eplant.Views[ViewName].hierarchy == "genetic element") {
				view = Eplant.activeSpecies.activeGeneticElement.views[ViewName];
			}

			/* Set View to activeView */
			if (view && view.isLoadedData) {
				Eplant.changeActiveView(view);
			}
		};
		var img = document.createElement("img");
		img.src = View.unavailableIconImageURL;
		$(icon).append(img);
		$("#navigationContainer").append(icon);
	}

	/* Get ViewSpecificUIButtons container */
	Eplant.viewSpecificUIButtonsContainer = document.getElementById("viewSpecificUI");

	// Initialize history tracker
	this.history = new Eplant.History();

	/* Load Views */
	Eplant.loadViews();

	/* Bind Events */
	Eplant.bindUIEvents();
	Eplant.bindEvents();

	/* Find and set the entry View */
	for (var ViewName in Eplant.views) {
		var view = Eplant.views[ViewName];
		if (view.isEntryView) {		// Found
			/* Set active view */
			ZUI.changeActiveView(view);

			/* End search */
			break;
		}
	}
};

/**
 * Bind events for ePlant DOM UI elements.
 */
Eplant.bindUIEvents = function() {
	/* Genetic element identifier auto-complete */
	$("#enterIdentifier").autocomplete({
		source: function(request, response) {
			$.ajax({
				type: "GET",
				url: "cgi-bin/idautocomplete.cgi?species=" + Eplant.activeSpecies.scientificName.split(" ").join("_") + "&term=" + request.term,
				dataType: "json"
			}).done(function(data) {
				response(data);
			});
		}
	});

	/* Query genetic element identifier */
	$("#queryIdentifier").click(function() {
		Eplant.queryIdentifier();
	});
	$("#enterIdentifier").keyup(function (event) {
		if (event.keyCode == "13") {
			Eplant.queryIdentifier();
		}
	});

	/* Example genetic element identifier query */
	$("#getExample").click(function() {
		$("#enterIdentifier").val(Eplant.activeSpecies.exampleQuery);
	});

	/* Save session button */
	$("#saveSession").click(function() {
		// TODO
	});

	/* Load session button */
	$("#loadSession").click(function() {
		// TODO
	});

	// History dialog button
	$("#historyIcon").click(function() {
		var historyDialog = new Eplant.HistoryDialog();
	});

	// History back button
	$("#historyBackIcon").click(function() {
		// Go back if possible
		if (Eplant.history.isBackPossible()) {
			Eplant.history.goBack();
		}
	});

	// History forward button
	$("#historyForwardIcon").click(function() {
		// Go forward if possible
		if (Eplant.history.isForwardPossible()) {
			Eplant.history.goForward();
		}
	});

	/* Toggle view change animation button */
	$("#viewChangeAnimationIcon").click(function() {
		Eplant.isAnimateActiveViewChange = !Eplant.isAnimateActiveViewChange;
		if (Eplant.isAnimateActiveViewChange) {
			$("#viewChangeAnimationIcon img").attr("src", "img/on/zoom.png");
		}
		else {
			$("#viewChangeAnimationIcon img").attr("src", "img/off/zoom.png");
		}
	});

	/* Toggle tooltip button */
	$("#tooltipIcon").click(function() {
		Eplant.isTooltipOn = !Eplant.isTooltipOn;
		var domElements = document.getElementsByClassName("hint--rounded");
		if (Eplant.isTooltipOn) {
			for (var n = 0; n < domElements.length; n++) {
				var domElement = domElements[n];
				$(domElement).attr("data-enabled", "true");
			}
			$("#tooltipIcon img").attr("src", "img/on/tooltip.png");
		}
		else {
			for (var n = 0; n < domElements.length; n++) {
				var domElement = domElements[n];
				$(domElement).attr("data-enabled", "false");
			}
			$("#tooltipIcon img").attr("src", "img/off/tooltip.png");
		}
	});

	/* Get image button */
	$("#getImageIcon").click(function() {
		var dataURL = ZUI.activeView.getViewScreen();
		if (dataURL) {
			window.open(dataURL);
		}
		else {
			alert("Sorry! Screen capture is not available for this view.");
		}
	});

	/* Remove dialogs button */
	$("#removeDialogsIcon").click(function() {
		for (var n = 0; n < Eplant.species.length; n++) {
			var species = Eplant.species[n];
			for (var m = 0; m < species.geneticElements.length; m++) {
				var geneticElement = species.geneticElements[m];
				if (geneticElement.geneticElementDialog) {
					geneticElement.geneticElementDialog.remove();
					geneticElement.geneticElementDialog = null;
				}
			}
		}
	});
};

/**
 * Bind events for ePlant.
 */
Eplant.bindEvents = function() {
	/* Update speciesLabel when the activeSpecies changes */
	var eventListener = new ZUI.EventListener("update-activeSpecies", Eplant, function(event, eventData, listenerData) {
		$("#speciesLabel").html(Eplant.activeSpecies.scientificName);
	}, {
	});
	ZUI.addEventListener(eventListener);

	/* Update View icon when the View finishes loading */
	var eventListener = new ZUI.EventListener("view-loaded", null, function(event, eventData, listenerData) {
		/* Get View */
		var view = event.target;

		/* Determine whether the View is represented in the icon dock */
		var isInIconDock = false;
		if (view.hierarchy == "ePlant") {
			isInIconDock = true;
		}
		else if (view.hierarchy == "species") {
			if (view.species == Eplant.activeSpecies) {
				isInIconDock = true;
			}
		}
		else if (view.hierarchy == "genetic element") {
			if (view.geneticElement.species == Eplant.activeSpecies && view.geneticElement == Eplant.activeSpecies.activeGeneticElement) {
				isInIconDock = true;
			}
		}

		/* Update icon if applicable */
		if (isInIconDock) {
			Eplant.updateIconDock();
		}
	}, {
	});
	ZUI.addEventListener(eventListener);

	/* Update View icon dock when activeSpecies changes */
	var eventListener = new ZUI.EventListener("update-activeSpecies", Eplant, function(event, eventData, listenerData) {
		Eplant.updateIconDock();
	}, {
	});
	ZUI.addEventListener(eventListener);

	/* Update View icon dock when the activeGeneticElement of activeSpecies changes */
	var eventListener = new ZUI.EventListener("update-activeGeneticElement", null, function(event, eventData, listenerData) {
		/* Get Species */
		var species = event.target;

		/* Check if Species is the activeSpecies */
		if (species == Eplant.activeSpecies) {
			Eplant.updateIconDock();
		}
	}, {
	});
	ZUI.addEventListener(eventListener);

	/* Update View icon dock when the activeView changes */
	var eventListener = new ZUI.EventListener("update-activeView", Eplant, function(event, eventData, listenerData) {
		Eplant.updateIconDock();
		Eplant.updateHistoryIcons();
	}, {
	});
	ZUI.addEventListener(eventListener);

	// Update history icons when the activeItem of the history changes
	var eventListener = new ZUI.EventListener("update-history-activeItem", Eplant.history, function(event, eventData, listenerData) {	
		if (Eplant.history.isBackPossible()) {
			$("#historyBackIcon img").attr("src", "img/available/history-back.png");
		}
		else {
			$("#historyBackIcon img").attr("src", "img/unavailable/history-back.png");
		}
		if (Eplant.history.isForwardPossible()) {
			$("#historyForwardIcon img").attr("src", "img/available/history-forward.png");
		}
		else {
			$("#historyForwardIcon img").attr("src", "img/unavailable/history-forward.png");
		}
	}, {
	});
	ZUI.addEventListener(eventListener);

	/* Update GeneticElement panel when the activeSpecies changes */
	var eventListener = new ZUI.EventListener("update-activeSpecies", Eplant, function(event, eventData, listenerData) {
		Eplant.updateGeneticElementPanel();
	}, {
	});
	ZUI.addEventListener(eventListener);

	/* Update GeneticElement panel when the activeGeneticElement of activeSpecies changes */
	var eventListener = new ZUI.EventListener("update-activeGeneticElement", null, function(event, eventData, listenerData) {
		/* Get Species */
		var species = event.target;

		/* Check if Species is the activeSpecies */
		if (species == Eplant.activeSpecies) {
			Eplant.updateGeneticElementPanel();
		}
	}, {
	});
	ZUI.addEventListener(eventListener);

	/* Update GeneticElement panel when views of a GeneticElement of the activeSpecies are loaded */
	var eventListener = new ZUI.EventListener("load-views", null, function(event, eventData, listenerData) {
		/* Get Species */
		var species = event.target.species;

		/* Check if Species is the activeSpecies */
		if (species == Eplant.activeSpecies) {
			Eplant.updateGeneticElementPanel();
		}
	}, {
	});
	ZUI.addEventListener(eventListener);

	/* Update GeneticElement panel when the GeneticElementDialog of a GeneticElement of the activeSpecies is updated */
	var eventListener = new ZUI.EventListener("update-geneticElementDialog", null, function(event, eventData, listenerData) {
		/* Get Species */
		var species = event.target.species;

		/* Check if Species is the activeSpecies */
		if (species == Eplant.activeSpecies) {
			Eplant.updateGeneticElementPanel();
		}
	}, {
	});
	ZUI.addEventListener(eventListener);

	/* Update GeneticElement panel when tags change */
	var eventListener = new ZUI.EventListener("update-annotationTags", null, function(event, eventData, listenerData) {
		/* Get GeneticElement */
		var geneticElement = event.target;

		/* Update if Species is the activeSpecies */
		if (geneticElement.species == Eplant.activeSpecies) {
			Eplant.updateGeneticElementPanel();
		}
	}, {
	});
	ZUI.addEventListener(eventListener);
};

/**
 * Queries the identifier in the input box.
 */
Eplant.queryIdentifier = function() {
	var terms = $("#enterIdentifier").val().split(",");
	for (var n = 0; n < terms.length; n++) {
		var term = terms[n].trim();
		Eplant.activeSpecies.loadGeneticElementByIdentifier(term, function(geneticElement, identifier) {
			if (geneticElement) {
				/* Load views for GeneticElement */
				geneticElement.loadViews();

				/* Set GeneticElement to active */
				geneticElement.species.setActiveGeneticElement(geneticElement);
			}
			else {
				alert("Sorry, we could not find " + identifier + ".");
			}
		});
	}
};

/**
 * Load Views at the hierarchy level of ePlant.
 */
Eplant.loadViews = function() {
	/* Set up Object wrapper */
	Eplant.views = {};

	/* Loop through Eplant.Views namespace */
	for (var ViewName in Eplant.Views) {
		/* Get View constructor */
		var View = Eplant.Views[ViewName];

		/* Skip if View hierarchy is not at the level of genetic element */
		if (View.hierarchy != "ePlant") continue;

		/* Create View */
		Eplant.views[ViewName] = new View(this);
	}

	/* Set flag for view loading */
	this.isLoadedViews = true;
};

/**
 * Loads all Species for ePlant
 */
Eplant.loadSpecies = function() {
	if (!this.isLoadedSpecies) {
		$.getJSON(Eplant.ServiceUrl + 'speciesinfo.cgi', $.proxy(function(response) {
			/* Loop through species */
			for (var n = 0; n < response.length; n++) {
				/* Get data for this species */
				var speciesData = response[n];

				/* Create Species */
				var species = new Eplant.Species({
					scientificName: speciesData.scientificName,
					commonName: speciesData.commonName,
					exampleQuery: speciesData.exampleQuery
				});
				species.loadViews();

				/* Add Species to ePlant */
				Eplant.addSpecies(species);
			}

			/* Set Species load status */
			Eplant.isLoadedSpecies = true;

			/* Fire event for loading chromosomes */
			var event = new ZUI.Event("load-species", Eplant, null);
			ZUI.fireEvent(event);
		}, this));
	}
};

/**
 * Adds a Species to ePlant
 *
 * @param {Eplant.Species} species The Species to be added.
 */
Eplant.addSpecies = function(species) {
	/* Add Species to array */
	Eplant.species.push(species);

	/* Fire event for updating the Species array */
	var event = new ZUI.Event("update-species", Eplant, null);
	ZUI.fireEvent(event);
};

/**
 * Removes a Species from ePlant
 *
 * @param {Eplant.Species} species The Species to be removed.
 */
Eplant.removeSpecies = function(species) {
	/* Clean up Species */
	species.remove();

	/* Remove Species from array */
	var index = Eplant.species.indexOf(species);
	if (index > -1) Eplant.species.splice(index, 1);

	/* Fire event for updating the Species array */
	var event = new ZUI.Event("update-species", Eplant, null);
	ZUI.fireEvent(event);
};

/**
 * Gets the Species with the specified scientific name.
 *
 * @param {String} scientificName Scientific name of the Species.
 * @return {Eplant.Species} Matching Species.
 */
Eplant.getSpeciesByScientificName = function(scientificName) {
	/* Loop through Species objects to find the Species with a matching scientificName */
	for (var n = 0; n < Eplant.species.length; n++) {
		var species = Eplant.species[n];
		if (species.scientificName.toUpperCase() == scientificName.toUpperCase()) {
			return species;
		}
	}

	/* Not found */
	return null;
};

/**
 * Sets ePlant's activeSpecies.
 *
 * @param {Eplant.Species} species The new activeSpecies.
 */
Eplant.setActiveSpecies = function(species) {
	/* Unselect GeneticElementDialog of previous activeSpecies' activeGeneticElement */
	if (Eplant.activeSpecies && Eplant.activeSpecies.activeGeneticElement && Eplant.activeSpecies.activeGeneticElement.geneticElementDialog) {
		Eplant.activeSpecies.activeGeneticElement.geneticElementDialog.unselect();
	}

	/* Set activeSpecies */
	Eplant.activeSpecies = species;

	/* Fire event for updating activeSpecies */
	var event = new ZUI.Event("update-activeSpecies", Eplant, null);
	ZUI.fireEvent(event);

	/* Select GeneticElementDialog of new active Species' activeGeneticElement */
	if (Eplant.activeSpecies.activeGeneticElement && Eplant.activeSpecies.activeGeneticElement.geneticElementDialog) {
		Eplant.activeSpecies.activeGeneticElement.geneticElementDialog.select();
	}
};

/**
 * Changes the active View of ePlant.
 *
 * @param {Eplant.View} activeView The new activeView.
 */
Eplant.changeActiveView = function(activeView) {
	/* Check whether activeView change should be animated */
	if (Eplant.isAnimateActiveViewChange) {		// Yes
		/* Determine direction of animation */
		var direction = null;
		var integerMagnification1 = Math.floor(ZUI.activeView.magnification);
		var integerMagnification2 = Math.floor(activeView.magnification);
		if (integerMagnification1 < integerMagnification2) {
			direction = "In";
		}
		else if (integerMagnification1 > integerMagnification2) {
			direction = "Out";
		}
		else if (ZUI.activeView.magnification - integerMagnification1 < activeView.magnification - integerMagnification2) {
			direction = "Right";
		}
		else if (ZUI.activeView.magnification - integerMagnification1 > activeView.magnification - integerMagnification2) {
			direction = "Left";
		}

		/* Get animation configuration */
		var exitAnimationConfig, enterAnimationConfig;
		if (direction) {
			exitAnimationConfig = ZUI.activeView["getExit" + direction + "AnimationConfig"]();
			enterAnimationConfig = activeView["getEnter" + direction + "AnimationConfig"]();
		}
		else {
			exitAnimationConfig = {};
			enterAnimationConfig = {};
		}

		/* Modify animation configurations to set up view change between the animations and create Animation objects */
		var enterAnimation = new ZUI.Animation(enterAnimationConfig);
		var wrapper = {
			activeView: activeView,
			enterAnimation: enterAnimation
		};
		exitAnimationConfig.end = $.proxy(function() {
			/* Call inactive for the old activeView */
			ZUI.activeView.inactive();

			/* Change activeView */
			ZUI.activeView = this.activeView;

			/* Fire event for updating activeView */
			var event = new ZUI.Event("update-activeView", Eplant, null);
			ZUI.fireEvent(event);

			/* Synchronize activeView with activeSpecies and activeGeneticElement */
			if (ZUI.activeView.geneticElement) {
				if (Eplant.activeSpecies != ZUI.activeView.geneticElement.species) {
					Eplant.setActiveSpecies(ZUI.activeView.geneticElement.species);
				}
				if (Eplant.activeSpecies.activeGeneticElement != ZUI.activeView.geneticElement) {
					Eplant.activeSpecies.setActiveGeneticElement(ZUI.activeView.geneticElement);
				}
			}
			else if (ZUI.activeView.species) {
				if (Eplant.activeSpecies != ZUI.activeView.species) {
					Eplant.setActiveSpecies(ZUI.activeView.species);
				}
			}

			/* Call active for the new activeView */
			ZUI.activeView.active();

			/* Start the enter animation */
			wrapper.activeView.animate(this.enterAnimation);
		}, wrapper);
		var exitAnimation = new ZUI.Animation(exitAnimationConfig);

		/* Start the exit animation */
		ZUI.activeView.animate(exitAnimation)
	}
	else {							// No
		/* Call inactive for the old activeView */
		ZUI.activeView.inactive();

		/* Change activeView */
		ZUI.activeView = activeView;

		/* Fire event for updating activeView */
		var event = new ZUI.Event("update-activeView", Eplant, null);
		ZUI.fireEvent(event);

		/* Synchronize activeView with activeSpecies and activeGeneticElement */
		if (ZUI.activeView.geneticElement) {
			if (Eplant.activeSpecies != ZUI.activeView.geneticElement.species) {
				Eplant.setActiveSpecies(ZUI.activeView.geneticElement.species);
			}
			if (Eplant.activeSpecies.activeGeneticElement != ZUI.activeView.geneticElement) {
				Eplant.activeSpecies.setActiveGeneticElement(ZUI.activeView.geneticElement);
			}
		}
		else if (ZUI.activeView.species) {
			if (Eplant.activeSpecies != ZUI.activeView.species) {
				Eplant.setActiveSpecies(ZUI.activeView.species);
			}
		}

		/* Call active for the new activeView */
		ZUI.activeView.active();
	}
};

/**
 * Updates the View icon dock.
 */
Eplant.updateIconDock = function() {
	for (var ViewName in Eplant.Views) {
		/* Get constructor */
		var View = Eplant.Views[ViewName];

		/* Get the active view instance */
		var view = null;
		if (View.hierarchy == "ePlant") {
			view = Eplant.views[ViewName];
			if (ZUI.activeView == view) {
				$("#" + ViewName + "Icon").children("img").attr("src", View.activeIconImageURL);
			}
			else {
				$("#" + ViewName + "Icon").children("img").attr("src", View.availableIconImageURL);
			}
		}
		else if (View.hierarchy == "species") {
			if (Eplant.activeSpecies) {
				view = Eplant.activeSpecies.views[ViewName];
			}
		}
		else if (View.hierarchy == "genetic element") {
			if (Eplant.activeSpecies && Eplant.activeSpecies.activeGeneticElement) {
				view = Eplant.activeSpecies.activeGeneticElement.views[ViewName];
			}
		}

		/* Set icon image */
		if (view) {
			if (ZUI.activeView == view) {
				$("#" + ViewName + "Icon").children("img").attr("src", View.activeIconImageURL);
			}
			else if (view.isLoadedData) {
				$("#" + ViewName + "Icon").children("img").attr("src", View.availableIconImageURL);
			}
			else {
				$("#" + ViewName + "Icon").children("img").attr("src", View.unavailableIconImageURL);
			}
		}
		else {
			$("#" + ViewName + "Icon").children("img").attr("src", View.unavailableIconImageURL);
		}
	}
};

/**
 * Updates the GeneticElement panel
 */
Eplant.updateGeneticElementPanel = function() {
	/* Return if activeSpecies does not exist */
	if (!Eplant.activeSpecies) {
		return;
	}

	/* Get panel DOM container */
	var domPanel = document.getElementById("genePanel_content");

	/* Clear old panel content */
	$(domPanel).empty();

	/* Populate panel */
	for (var n = 0; n < Eplant.activeSpecies.geneticElements.length; n++) {
		/* Get GeneticElement */
		var geneticElement = Eplant.activeSpecies.geneticElements[n];

		/* Pass if views not loaded */
		if (!geneticElement.isLoadedViews) {
			continue;
		}

		/* Create DOM element for GeneticElement item */
		var domItem = document.createElement("div");
		$(domItem).addClass("eplant-geneticElementPanel-item");
		if (geneticElement == Eplant.activeSpecies.activeGeneticElement) {
			$(domItem).addClass("eplant-geneticElementPanel-item-focus");
		}

		/* Create icon for summoning GeneticElementDialog */
		var domIcon = document.createElement("img");
		/* Set image */
		if (geneticElement.geneticElementDialog) {
			if (geneticElement == Eplant.activeSpecies.activeGeneticElement) {
				$(domIcon).attr("src", "img/expand-focus");
			}
			else {
				$(domIcon).attr("src", "img/expand-open");
			}
		}
		else {
			$(domIcon).attr("src", "img/expand");
		}
		/* Click event handler */
		$(domIcon).click($.proxy(function() {
			/* Check whether GeneticElementDialog is already open */
			if (this.geneticElementDialog) {		// Yes
				/* Close */
				this.geneticElementDialog.close();
			}
			else {		// No
				/* Find the index of this GeneticElement among the GeneticElements of the parent Species with loaded Views */
				var index = 0;
				for (var n = 0; n < this.species.geneticElements.length; n++) {
					var geneticElement = this.species.geneticElements[n];
					if (geneticElement == this) {
						break;
					}
					if (geneticElement.isLoadedViews) {
						index++;
					}
				}

				/* Create new GeneticElementDialog */
				var x = ZUI.width;
				var y = index * 24 + 85 - $("#genePanel_content").scrollTop();
				this.geneticElementDialog = new Eplant.GeneticElementDialog(this, x, y, "left");
				this.geneticElementDialog.pinned = true;
			}
		}, geneticElement));
		/* Append icon to item container */
		$(domItem).append(domIcon);

		/* Create label */
		var domLabel = document.createElement("span");
		var labelText = geneticElement.identifier;
		if (geneticElement.aliases && geneticElement.aliases.length && geneticElement.aliases[0].length) {
			labelText += " / " + geneticElement.aliases.join(", ");
		}
		$(domLabel).html(labelText);
		$(domLabel).attr("title", labelText);
		$(domLabel).click($.proxy(function() {
			this.species.setActiveGeneticElement(this);
		}, geneticElement));
		$(domLabel).mouseover($.proxy(function() {
			/* Fire ZUI event */
			var event = new ZUI.Event("mouseover-geneticElementPanel-item", this, null);
			ZUI.fireEvent(event);
		}, geneticElement));
		$(domLabel).mouseout($.proxy(function() {
			/* Fire ZUI event */
			var event = new ZUI.Event("mouseout-geneticElementPanel-item", this, null);
			ZUI.fireEvent(event);
		}, geneticElement));
		$(domItem).append(domLabel);

		/* Create tags */
		var domTags = document.createElement("div");
		$(domTags).css({"display": "inline"});
		for (var m = 0; m < geneticElement.annotationTags.length; m++) {
			/* Get AnnotationTag */
			var annotationTag = geneticElement.annotationTags[m];

			/* Pass if AnnotationTag is not selected */
			if (!annotationTag.isSelected) {
				continue;
			}

			/* Create tag */
			var domTag = document.createElement("div");
			$(domTag).addClass("eplant-geneticElementPanel-item-annotationTag");
			$(domTag).css({"background-color": annotationTag.color});
			$(domTags).append(domTag);
		}
		$(domItem).append(domTags);

		/* Append item to panel */
		$(domPanel).append(domItem);
	}
};

/**
 * Updates history icons.
 */
Eplant.updateHistoryIcons = function() {
	if (Eplant.history.isBackPossible()) {
		$("#historyBackIcon img").attr("src", "img/available/history-back.png");
	}
	else {
		$("#historyBackIcon img").attr("src", "img/unavailable/history-back.png");
	}
	if (Eplant.history.isForwardPossible()) {
		$("#historyForwardIcon img").attr("src", "img/available/history-forward.png");
	}
	else {
		$("#historyForwardIcon img").attr("src", "img/unavailable/history-forward.png");
	}
};

/**
 * Gets the constructor name of a View.
 *
 * @param {Eplant.View} view A View.
 * @return {String} Constructor name of the View.
 */
Eplant.getViewName = function(view) {
	for (var ViewName in Eplant.Views) {
		var View = Eplant.Views[ViewName];
		if (view instanceof View) {
			return ViewName;
		}
	}
	return null;
};

})();
