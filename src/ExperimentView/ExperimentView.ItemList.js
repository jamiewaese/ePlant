ExperimentView.ItemList = function(view) {
	/* Properties */
	this.view = view;		// Parent view
	this.items = [];		// Items in the list
	this.container = document.createElement("div");		// DOM container

	/* Set up DOM */
	this.container.className = "selectionList";
	this.container.oncontextmenu = function() {
		return false;
	};

	/* Add title */
	var title = document.createElement("span");
	title.className = "selectionListTitle";
	title.textContent = "Select a data set";
	this.container.appendChild(title);

	/* Get information for each view item and populate itemList */
	$.getJSON("data/experiment/views.json", $.proxy(function(response) {
		/* Process data */
		for (var n = 0; n < response.length; n++) {
			var itemData = response[n];
			var viewClass = ZUI.Util.readClassPath(itemData.class);
			var view = new viewClass(this.view.elementOfInterest, itemData.efp);
			var item = new ExperimentView.ItemListItem(itemData.name, view, this, itemData.snapshot);
			this.items.push(item);
		}
		this.view.isDataReady = true;

		/* Select first item */
		this.items[0].container.onmouseover();
	}, this));
};