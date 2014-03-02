(function() {

/**
 * Eplant.Views.SpeciesView.SelectList class
 * Coded by Hans Yu
 * UI designed by Jamie Waese
 *
 * Describes the SelectList UI in SpeciesView.
 *
 * @constructor
 */
Eplant.Views.SpeciesView.SelectList = function(speciesView) {
	/* Attributes */
	this.speciesView = speciesView;		// SpeciesView that owns this SelectList object
	this.choices = [];				// Array of Choice objects
	this.selected = null;			// Selected Choice
	this.domContainer = null;			// DOM element of the container
	this.domTitle = null;			// DOM element of the title

	/* Create DOM */
	this.createDOM();
};

/**
 * Creates the DOM elements.
 */
Eplant.Views.SpeciesView.SelectList.prototype.createDOM = function() {
	/* Create container DOM element */
	this.domContainer = document.createElement("div");

	/* Set CSS class of container for styling */
	$(this.domContainer).addClass("eplant-selectList");

	/* Disable context menu */
	this.domContainer.oncontextmenu = function() {
		return false;
	};

	/* Create title DOM element */
	this.domTitle = document.createElement("span");

	/* Set CSS class of title for styling */
	$(this.domTitle).addClass("eplant-selectList-title");

	/* Set title content */
	$(this.domTitle).html("Select a plant");

	/* Add title DOM element to the container */
	$(this.domContainer).append(this.domTitle);

	/* Set up event listener for load-species */
	var eventListener = new ZUI.EventListener("load-species", Eplant, function(event, eventData, listenerData) {
		/* Remove this EventListener */
		ZUI.removeEventListener(this);

		/* Create Choice objects for the SelectList */
		for (var n = 0; n < Eplant.species.length; n++) {
			/* Get Species */
			var species = Eplant.species[n];

			/* Create Choice */
			var choice = new Eplant.Views.SpeciesView.SelectList.Choice(species, listenerData.selectList);
			listenerData.selectList.choices.push(choice);
		}

		/* Select first choice */
		if (listenerData.selectList.choices.length) {
			listenerData.selectList.choices[0].select();
		}

		/* Finish loading */
		listenerData.selectList.speciesView.loadFinish();
	}, {
		selectList: this
	});
	ZUI.addEventListener(eventListener);

	/* Load species data */
	Eplant.loadSpecies();
};

/**
 * Gets the Choice object associated with the specified Species.
 *
 * @param {Eplant.Species} species Species associated with the Choice object.
 * @return {Eplant.Views.SpeciesView.SelectList.Choice} Choice associated with the specified Species.
 */
Eplant.Views.SpeciesView.SelectList.prototype.getChoiceBySpecies = function(species) {
	/* Loop through Choices to find the Choice with a matching Species */
	for (var n = 0; n < this.choices; n++) {
		var choice = this.choices[n];
		if (choice.species == species) {
			return choice;
		}
	}

	/* Not found */
	return null;
};

/**
 * Draws the SelectList.
 */
Eplant.Views.SpeciesView.SelectList.prototype.draw = function() {
	/* Draw selected Choice */
	if (this.selected) {
		this.selected.draw();
	}
};

/**
 * Shows the SelectList.
 */
Eplant.Views.SpeciesView.SelectList.prototype.show = function() {
	/* Append to ZUI container */
	$(ZUI.container).append(this.domContainer);
};

/**
 * Hides the SelectList.
 */
Eplant.Views.SpeciesView.SelectList.prototype.hide = function() {
	/* Remove from ZUI container */
	$(this.domContainer).detach();
};

/**
 * Cleans up the Select object for disposal.
 */
Eplant.Views.SpeciesView.SelectList.prototype.remove = function() {
	/* Clean up Choice objects */
	for (var n = 0; n < this.choices.length; n++) {
		this.choices[n].remove();
	}

	/* Remove DOM element */
	$(this.domTitle).remove();
	$(this.domContainer).remove();
};

})();
