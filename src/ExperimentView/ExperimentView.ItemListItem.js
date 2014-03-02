ExperimentView.ItemListItem = function(name, view, itemList, snapshotURL) {
	/* Properties */
	this.name = name;
	this.view = view;			// View that this item is representing
	this.itemList = itemList;		// Parent ItemList
	this.snapshotURL = snapshotURL;
	this.snapshot = null;		// Snapshot view object
	this.container = document.createElement("div");		// DOM container

	/* Set up DOM */
	this.container = document.createElement("span");
	this.container.className = "selectionListItem";
	this.container.textContent = this.name;
	this.container.oncontextmenu = function() {
		return false;
	};
	this.itemList.container.appendChild(this.container);

	/* Handle mouseover event */
	this.container.onmouseover = $.proxy(function() {
		/* Unselect previous selection */
		if (this.itemList.view.selectedItem != null) {
			this.itemList.view.selectedItem.container.style.backgroundColor = "transparent";
		}

		/* Select this item */
		this.container.style.backgroundColor = Eplant.Color.Green;
		this.itemList.view.selectedItem = this;
	}, this);

	/* Handle click event */
	this.container.onclick = $.proxy(function() {
		ZUI.changeActiveView(this.view);
	}, this);

	/* Create snapshot view object */
	this.snapshot = new ZUI.ViewObject({
		shape: "image",
		positionScale: "world",
		sizeScale: "world",
		x: ZUI.width / 6,
		y: 0,
		hscale: 2 / 3,
		vscale: 2 / 3,
		centerAt: "center center",
		url: this.snapshotURL
	});
};