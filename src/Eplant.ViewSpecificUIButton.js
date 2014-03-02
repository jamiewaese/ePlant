(function() {

/**
 * Eplant.ViewSpecificUIButton class
 * By Hans Yu
 *
 * @constructor
 * @param {String} image Source of the button's icon image.
 * @param {String} description Descrition of the button visible to the user.
 * @param {Function} click Click callback function for this button.
 * @param {Object} data Additional data supplied.
 */
Eplant.ViewSpecificUIButton = function(imageSource, description, click, data) {
	/* Attributes */
	this.imageSource = imageSource;		// Source of the button's icon image
	this.description = description;		// Descrition of the button visible to the user
	this.click = click;				// Click callback function for this button
	this.data = data;				// Additional data supplied
	this.domContainer = null;			// Container DOM element for this button
	this.domImage = null;			// Image DOM element for this button
	this.updateIsTooltipOnListener = null;	// EventListener for update-isToolTipOn

	/* Create button */
	this.domContainer = document.createElement("div");
	this.domContainer.className = "iconSmall hint--top hint--success hint--rounded";
	this.domContainer.setAttribute("data-enabled", Eplant.isTooltipOn.toString());
	this.domContainer.setAttribute("data-hint", this.description);
	this.domContainer.style.padding = "5px";
	this.domContainer.onclick = $.proxy(function() {
		this.click(this.data);
	}, this);
	this.domImage = document.createElement("img");
	this.domImage.src = this.imageSource;
	this.domContainer.appendChild(this.domImage);

	/* Bind events */
	this.bindEvents();
};

/**
 * Binds events.
 */
Eplant.ViewSpecificUIButton.prototype.bindEvents = function() {
	/* Update enabled status of this button when isTooltipOn changes */
	this.updateIsTooltipOnListener = new ZUI.EventListener("update-isToolTipOn", Eplant, function(event, eventData, listenerData) {
		listenerData.viewSpecificUIButton.domContainer.setAttribute("data-enabled", Eplant.isTooltipOn.toString());
	}, {
		viewSpecificUIButton: this
	});
	ZUI.addEventListener(this.updateIsTooltipOnListener);
};

/**
 * Sets the button's image.
 */
Eplant.ViewSpecificUIButton.prototype.setImageSource = function(imageSource) {
	this.imageSource = imageSource;
	this.domImage.src = imageSource;
};

/**
 * Sets the button's description.
 */
Eplant.ViewSpecificUIButton.prototype.setDescription = function(description) {
	this.description = description;
	this.domContainer.setAttribute("data-hint", this.description);
};

/**
 * Attachess this Button to the view-specific container.
 */
Eplant.ViewSpecificUIButton.prototype.attach = function() {
	$(Eplant.viewSpecificUIButtonsContainer).append(this.domContainer);
};

/**
 * Detaches this Button to the view-specific container.
 */
Eplant.ViewSpecificUIButton.prototype.detach = function() {
	$(this.domContainer).detach();
};

/**
 * Removes this button.
 */
Eplant.ViewSpecificUIButton.prototype.remove = function() {
	/* Remove DOM elements */
	$(this.domContainer).remove();

	/* Remove EventListeners */
	ZUI.removeEventListener(this.updateIsTooltipOnListener);
};

})();
