(function() {

/**
 * Eplant.GeneticElementDialog class
 * Coded by Hans Yu
 * UI designed by Jamie Waese
 *
 * Describes a GeneticElement information dialog.
 *
 * @constructor
 * @param {Eplant.GeneticElement} geneticElement The GeneticElement associated with this dialog.
 * @param {Number} x The x-coordinate position of the dialog.
 * @param {Number} y The y-coordinate position of the dialog.
 */
Eplant.GeneticElementDialog = function(geneticElement, x, y, orientation) {
	/* Attributes */
	this.geneticElement = geneticElement;		// The GeneticElement associated with this dialog
	this.x = x;						// The x-coordinate position of the dialog
	this.y = y;						// The y-coordinate position of the dialog
	this.orientation = (orientation === undefined) ? ((this.x > ZUI.width / 2) ? "left" : "right") : orientation;	// Orientaiton of the dialog
	this.xOffset = 35;
	this.yOffset = -40;
	this.minimized = false;				// Whether this dialog is minimized
	this.domContainer = null;				// DOM container element for the dialog
	this.domIdentifier = null;				// DOM element that shows the identifier
	this.domAliases = null;				// DOM element that shows aliases
	this.domStrand = null;				// DOM element that shows the strand
	this.domAnnotation = null;				// DOM element that shows the annotation
	this.domGetDropData = null;				// DOM element for retrieving or dropping data (toggles)
	this.domViewIcons = null;				// DOM element for view icons
	this.domMinimize = null;				// DOM element for the minimize button
	this.domFocus = null;				// DOM element for the focus button

	/* Reference this GeneticElementDialog in the parent GeneticElement */
	this.geneticElement.geneticElementDialog = this;

	/* Create DOM elements */
	this.createDOM();

	/* Create dialog */
	this.createDialog();

	/* Bind events */
	this.bindEvents();

	/* Fire event for opening dialog */
	var event = new ZUI.Event("update-geneticElementDialog", this.geneticElement, {
		type: "open"
	});
	ZUI.fireEvent(event);
};

/**
 * Binds events.
 */
Eplant.GeneticElementDialog.prototype.bindEvents = function() {
	/* Update view icons when a view under this GeneticElement is loaded */
	var eventListener = new ZUI.EventListener("view-loaded", null, function(event, eventData, listenerData) {
		var view = event.target;
		if (view.hierarchy == "genetic element" && view.geneticElement == listenerData.geneticElementDialog.geneticElement) {
			listenerData.geneticElementDialog.updateViewIcons();
		}
	}, {
		geneticElementDialog: this
	});
	ZUI.addEventListener(eventListener);

	/* Update view icons when a view under this GeneticElement becomes active */
	var eventListener = new ZUI.EventListener("update-activeView", Eplant, function(event, eventData, listenerData) {
		var view = ZUI.activeView;
		listenerData.geneticElementDialog.updateViewIcons();
	}, {
		geneticElementDialog: this
	});
	ZUI.addEventListener(eventListener);
};

/**
 * Creates the DOM elements of this dialog.
 */
Eplant.GeneticElementDialog.prototype.createDOM = function() {
	/* DOM container */
	this.domContainer = document.createElement("div");

	/* DOM data container */
	var container = document.createElement("div");
	$(container).width(350);
	$(container).css({
		"padding": "5px",
		"max-height": 130,
		"overflow": "auto"
	});

	/* Table */
	var table = document.createElement("table");
		/* Identifier */
		var tr = document.createElement("tr");
			/* Label */
			var td = document.createElement("td");
			$(td).css({"vertical-align": "top"});
			$(td).html("<label>Identifier:</label>");
			$(tr).append(td);

			/* Content */
			this.domIdentifier = document.createElement("td");
			$(this.domIdentifier).html(this.geneticElement.identifier);
			$(tr).append(this.domIdentifier);
		$(table).append(tr);

		/* Aliases */
		var tr = document.createElement("tr");
			/* Label */
			var td = document.createElement("td");
			$(td).css({"vertical-align": "top"});
			$(td).html("<label>Aliases:</label>");
			$(tr).append(td);

			/* Content */
			this.domAliases = document.createElement("td");
			if (this.geneticElement.aliases.length && this.geneticElement.aliases[0].length) {
				$(this.domAliases).html(this.geneticElement.aliases.join(", "));
			}
			else {
				$(this.domAliases).html("Not available");
			}
			$(tr).append(this.domAliases);
		$(table).append(tr);

		/* Strand */
		var tr = document.createElement("tr");
			/* Label */
			var td = document.createElement("td");
			$(td).css({"vertical-align": "top"});
			$(td).html("<label>Strand:</label>");
			$(tr).append(td);

			/* Content */
			this.domStrand = document.createElement("td");
			$(this.domStrand).html(this.geneticElement.strand);
			$(tr).append(this.domStrand);
		$(table).append(tr);

		/* Annotation */
		var tr = document.createElement("tr");
			/* Label */
			var td = document.createElement("td");
			$(td).css({"vertical-align": "top"});
			$(td).html("<label>Annotation:</label>");
			$(tr).append(td);

			/* Content */
			this.domAnnotation = document.createElement("td");
			if (this.geneticElement.annotation && this.geneticElement.annotation.length) {
				$(this.domAnnotation).html(this.geneticElement.annotation);
			}
			else {
				$(this.domAnnotation).html("Not available");
			}
			$(tr).append(this.domAnnotation);
		$(table).append(tr);
	$(container).append(table);
	$(this.domContainer).append(container);

	/* Button container */
	var container = document.createElement("div");
	$(container).css({"padding": "5px"});
		/* Get / Drop data */
		this.domGetDropData = document.createElement("input");
		$(this.domGetDropData).attr("type", "button");
		$(this.domGetDropData).addClass("button");
		$(this.domGetDropData).val("");
		$(container).append(this.domGetDropData);
		if (this.geneticElement.isLoadedViews) {
			this.toDropData();
		}
		else {
			this.toGetData();
		}

		/* Tags */
		var tags = document.createElement("div");
		$(tags).css({
			"display": "inline-block",
			"padding": "5px",
			"vertical-align": "middle"
		});
		var tagsLabel = document.createElement("label");
		$(tagsLabel).css({"vertical-align": "middle"});
		$(tagsLabel).html("Tags:");
		$(tags).append(tagsLabel);
		for (var n = 0; n < this.geneticElement.annotationTags.length; n++) {
			var annotationTag = new Eplant.GeneticElementDialog.AnnotationTag(this.geneticElement.annotationTags[n], this);
			$(tags).append(annotationTag.domContainer);
		}
		$(container).append(tags);
	$(this.domContainer).append(container);

	/* Icons container */
	this.domViewIcons = document.createElement("div");
	$(this.domViewIcons).css({"padding": "5px", "text-align": "center"});
	this.updateViewIcons();
	$(this.domContainer).append(this.domViewIcons);
};

/**
 * Creates and opens the dialog.
 */
Eplant.GeneticElementDialog.prototype.createDialog = function() {
	/* Determine dialog position */
	var hPosition = (this.orientation == "left") ? "right" : "left";
	var xOffset = (this.orientation == "left") ? -this.xOffset : this.xOffset;

	/* Create dialog */
	$(this.domContainer).dialog({
		title: this.geneticElement.identifier,
		dialogClass: "eplant-geneticElementDialog",
		position: {
			my: hPosition + " top",
			at: "left+" + (this.x + xOffset) + " top+" + (this.y + this.yOffset),
			of: ZUI.canvas
		},
		width: "auto",
		height: "auto",
		minHeight: 0,
		resizable: false,
		modal: false,
		close: $.proxy(function() {
			this.remove();
		}, this)
	});
	if (this.geneticElement.isLoadedViews) {
		$(this.domContainer.parentNode).addClass("eplant-geneticElementDialog-loaded");
	}
	if (this.geneticElement == Eplant.activeSpecies.activeGeneticElement) {
		$(this.domContainer.parentNode).addClass("eplant-geneticElementDialog-active");
	}

	/* Get title bar */
	var titleBar = $(this.domContainer).parent().children(".ui-dialog-titlebar").get(0);

	/* Create minimize button */
	this.domMinimize = document.createElement("button");
	$(this.domMinimize).attr("title", "minimize");
	$(this.domMinimize).addClass("ui-dialog-titlebar-minimize");
	$(this.domMinimize).button({
		icons: {
			primary: "ui-icon-minus"
		},
		text: false
	});
	$(this.domMinimize).click($.proxy(function() {		// click event handler
		/* Update minimize status */
		this.minimized = !this.minimized;

		/* Minimize or restore */
		if (this.minimized) {	// Minimize
			/* Change button to restore */
			$(this.domMinimize).button({
				icons: {
					primary: "ui-icon-plus"
				},
				text: false
			});
			$(this.domMinimize).attr("title", "restore");

			/* Minimize dialog */
			this._height = $(this.domContainer).height();
			$(this.domContainer).height(this._height);
			$(this.domContainer).hide().show(0);		// Force redraw
			$(this.domContainer).addClass("eplant-geneticElementDialog-minimized");
			$(this.domContainer).height(0);
		}
		else {		// Restore
			/* Change button to minimize */
			$(this.domMinimize).button({
				icons: {
					primary: "ui-icon-minus"
				},
				text: false
			});
			$(this.domMinimize).attr("title", "minimize");

			/* Restore dialog */
			$(this.domContainer).removeClass("eplant-geneticElementDialog-minimized");
			$(this.domContainer).height(this._height);
		}
	}, this));
	$(titleBar).append(this.domMinimize);

	/* Create focus button */
	this.domFocus = document.createElement("button");
	$(this.domFocus).attr("title", "focus");
	$(this.domFocus).addClass("ui-dialog-titlebar-focus");
	$(this.domFocus).button({
		icons: {
			primary: "ui-icon-star"
		},
		text: false
	});
	$(this.domFocus).click($.proxy(function() {	// click event handler
		/* Only focus GeneticElements with views loaded */
		if (this.geneticElement.isLoadedViews) {
			/* Set Species of this GeneticElement to active status, if not already */
			if (this.geneticElement.species != Eplant.activeSpecies) {
				Eplant.setActiveSpecies(this.geneticElement.species);
			}

			/* Set this GeneticElement to active status, if not already */
			if (this.geneticElement != Eplant.activeSpecies.geneticElement) {
				Eplant.activeSpecies.setActiveGeneticElement(this.geneticElement);
			}
		}
	}, this));
	$(titleBar).append(this.domFocus);
};

/**
 * Sets the Get / Drop Data button to Get Data.
 */
Eplant.GeneticElementDialog.prototype.toGetData = function() {
	$(this.domGetDropData).val("Get Data");
	$(this.domContainer.parentNode).removeClass("eplant-geneticElementDialog-loaded");
	this.domGetDropData.onclick = $.proxy(function() {
		/* Unselect previous active GeneticElementDialog */
		if (Eplant.activeSpecies && Eplant.activeSpecies.activeGeneticElement && Eplant.activeSpecies.activeGeneticElement.geneticElementDialog) {
			Eplant.activeSpecies.activeGeneticElement.geneticElementDialog.unselect();
		}

		/* Load Views for this GeneticElement */
		this.geneticElement.loadViews();

		/* Change to Drop Data */
		this.toDropData();

		/* Select this GeneticElementDialog */
		this.select();

		/* Set this GeneticElement to active */
		if (this.geneticElement.species != Eplant.activeSpecies) {
			Eplant.setActiveSpecies(this.geneticElement.species);
		}
		if (this.geneticElement != Eplant.activeSpecies.activeGeneticElement) {
			Eplant.activeSpecies.setActiveGeneticElement(this.geneticElement);
		}

		/* Remove GeneticElementList if current View is ChromosomeView */
		// TODO Consider replacing this code with something more maintainable
		if (ZUI.activeView instanceof Eplant.Views.ChromosomeView) {
			if (ZUI.activeView.geneticElementList) {
				ZUI.activeView.geneticElementList.close();
				ZUI.activeView.geneticElementList = null;
			}
		}
	}, this);
};

/**
 * Sets the Get / Drop Data button to Drop Data.
 */
Eplant.GeneticElementDialog.prototype.toDropData = function() {
	$(this.domGetDropData).val("Drop Data");
	$(this.domContainer.parentNode).addClass("eplant-geneticElementDialog-loaded");
	this.domGetDropData.onclick = $.proxy(function() {
		/* Drop Views for this GeneticElement */
		this.geneticElement.dropViews();

		/* Change to Get Data */
		this.toGetData();

		/*  Unselect this GeneticElementDialog*/
		this.unselect();

		/* Reset tags */
		// TODO

		/* Close this GeneticElementDialog */
		this.close();
	}, this);
};

/**
 * Recreates the view icons.
 */
Eplant.GeneticElementDialog.prototype.updateViewIcons = function() {
	/* Empty view icons container */
	$(this.domViewIcons).empty();

	/* Sort Views by magnification (ascending) */
	var views = [];
	for (var viewName in this.geneticElement.views) {
		views.push(this.geneticElement.views[viewName]);
	}
	views.sort(function(a, b) {
		return (a.magnification - b.magnification);
	});

	/* Create icons */
	for (var n = 0; n < views.length; n++) {
		/* Get View */
		var view = views[n];

		/* Create icon */
		var icon = document.createElement("div");
		$(icon).addClass("iconSmall");
		$(icon).css({"display": "inline-block"});

		/* Create icon image */
		var img = document.createElement("img");
		var imgUrl;
		if (view == ZUI.activeView) {
			imgUrl = view.activeIconImageURL;
		}
		else if (view.isLoadedData) {
			imgUrl = view.availableIconImageURL;
		}
		else {
			imgUrl = view.unavailableIconImageURL;
		}
		$(img).attr("src", imgUrl);
		$(icon).append(img);

		/* Set icon click behaviour */
		$(icon).click($.proxy(function() {
			if (this.isLoadedData) {
				if (ZUI.activeView.hierarchy == "eplant" || ZUI.activeView.hierarchy == "species") {
					if (this.geneticElement.species != Eplant.activeSpecies) {
						Eplant.setActiveSpecies(this.geneticElement.species);
					}
					if (this.geneticElement != this.geneticElement.species.activeGeneticElement) {
						this.geneticElement.species.setActiveGeneticElement(this.geneticElement);
					}
				}
				Eplant.changeActiveView(this);
			}
		}, view));

		/* Append icon */
		$(this.domViewIcons).append(icon);
	}
};

/**
 * Selects this GeneticElementDialog.
 */
Eplant.GeneticElementDialog.prototype.select = function() {
	/* Update CSS style */
	$(this.domContainer.parentNode).addClass("eplant-geneticElementDialog-active");

	/* Fire event for selecting dialog */
	var event = new ZUI.Event("update-geneticElementDialog", this.geneticElement, {
		type: "select"
	});
	ZUI.fireEvent(event);
};

/**
 * Unselects this GeneticElementDialog.
 */
Eplant.GeneticElementDialog.prototype.unselect = function() {
	/* Update CSS style */
	$(this.domContainer.parentNode).removeClass("eplant-geneticElementDialog-active");

	/* Fire event for unselecting dialog */
	var event = new ZUI.Event("update-geneticElementDialog", this.geneticElement, {
		type: "unselect"
	});
	ZUI.fireEvent(event);
};

/**
 * Opens the GeneticElementDialog.
 */
Eplant.GeneticElementDialog.prototype.open = function() {
	$(this.domContainer).dialog("open");
};

/**
 * Closes the GeneticElementDialog.
 */
Eplant.GeneticElementDialog.prototype.close = function() {
	$(this.domContainer).dialog("close");
};

/**
 * Cleans up the GeneticElementDialog.
 */
Eplant.GeneticElementDialog.prototype.remove = function() {
	/* Clean up DOM elements */
	$(this.domContainer).remove();

	/* Remove reference from GeneticElement */
	this.geneticElement.geneticElementDialog = null;

	/* Fire event for removing dialog */
	var event = new ZUI.Event("update-geneticElementDialog", this.geneticElement, {
		type: "remove"
	});
	ZUI.fireEvent(event);
};

})();
