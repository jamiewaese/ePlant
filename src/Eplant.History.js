(function() {

/**
 * Eplant.History class
 * By Hans Yu
 * 
 * This class manages the history system for ePlant.
 *
 * @constructor
 */
Eplant.History = function() {
	// Attributes
	this.items = [];		// Array of history items
	this.activeItem = null;	// Active item
};

/**
 * Adds an item to the history list and makes it active.
 */
Eplant.History.prototype.addItem = function(item) {
	// Remove history items with index higher than the current active item
	var index = this.getItemIndex(this.activeItem);
	if (index < this.items.length - 1) {
		this.items.splice(index + 1, this.items.length - index - 1);
	}

	// Add item to array
	this.items.push(item);

	// Make item active
	this.changeActiveItem(item);
};

/**
 * Removes an item from the history list.
 */
Eplant.History.prototype.removeItem = function(item) {
	// Get item index
	var index = this.getItemIndex(item);

	// Check whether the removed item is the active item
	if (this.activeItem == item) {	// Yes
		// Update active item
		if (index > 0) {
			this.changeActiveItem(this.items[index - 1]);
		}
		else if (index < this.items.length - 1) {
			this.changeActiveItem(this.items[index + 1]);
		}
		else {
			this.changeActiveItem(null);
		}
	}

	// Remove item
	this.items.splice(index, 1);
};

/**
 * Changes the active history item.
 */
Eplant.History.prototype.changeActiveItem = function(item) {
	// Change active item and view
	this.activeItem = item;
	if (this.activeItem && this.activeItem.view != ZUI.activeView) {
		Eplant.changeActiveView(this.activeItem.view);
	}

	// Fire event
	var event = new ZUI.Event("update-history-activeItem", this, null);
	ZUI.fireEvent(event);
};

/**
 * Change active item to the previous item.
 */
Eplant.History.prototype.goBack = function() {
	// Get index of currently active item
	var index = this.getItemIndex(this.activeItem);

	// Go back
	if (this.isBackPossible(this.activeItem)) {
		this.changeActiveItem(this.items[index - 1]);
	}
};

/**
 * Change active item to the next item.
 */
Eplant.History.prototype.goForward = function() {
	// Get index of currently active item
	var index = this.getItemIndex(this.activeItem);

	// Go forward
	if (this.isForwardPossible(this.activeItem)) {
		this.changeActiveItem(this.items[index + 1]);
	}
};

/**
 * Returns whether it is possible to go back (i.e. is there an item before the active item in the array)
 */
Eplant.History.prototype.isBackPossible = function() {
	// Get index of currently active item
	var index = this.getItemIndex(this.activeItem);

	// Check
	if (index > 0) {
		return true;
	}
	else {
		return false;
	}
};

/**
 * Returns whether it is possible to go forward (i.e. is there an item after the active item in the array)
 */
Eplant.History.prototype.isForwardPossible = function() {
	// Get index of currently active item
	var index = this.getItemIndex(this.activeItem);

	// Check
	if (index < this.items.length - 1) {
		return true;
	}
	else {
		return false;
	}
};

/**
 * Returns the index of an item.
 */
Eplant.History.prototype.getItemIndex = function(item) {
	return this.items.indexOf(item);
};

})();