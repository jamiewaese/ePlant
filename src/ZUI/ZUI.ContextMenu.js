/**
 * ContextMenu class for ZUI framework
 * By Hans Yu
 */

ZUI.ContextMenu = function() {
	/* Properties */
	this.options = null;
	this.x = 0;
	this.y = 0;
	this.active = false;
	this.container = document.createElement("div");

	/* Set up DOM element */
	this.container.className = "zui-contextmenu";
	this.container.style.border = "1px solid #B4B4B4";
	this.container.style.width = "160px";
	this.container.style.height = "auto";
	this.container.style.minHeight = "0";
	this.container.style.position = "relative";
	this.container.style.left = ((this.x > ZUI.width / 2) ? (this.x - 162) : this.x) + "px";
	this.container.style.top = this.y + "px";
	this.container.oncontextmenu = function() {
		return false;
	};
};

ZUI.ContextMenu.prototype.open = function(x, y, options) {
	/* Close context menu if already open */
	if (this.active) {
		this.close();
	}

	/* Set position, if specified */
	if (x === undefined && y === undefined) {
		this.x = ZUI.mouseStatus.x;
		this.y = ZUI.mouseStatus.y;
		this.container.style.left = ((this.x > ZUI.width / 2) ? (this.x - 162) : this.x) + "px";
		this.container.style.top = this.y + "px";
	}
	else {
		this.x = x;
		this.y = y;
		this.container.style.left = ((this.x > ZUI.width / 2) ? (this.x - 162) : this.x) + "px";
		this.container.style.top = this.y + "px";
	}

	/* Add options */
	this.options = options;
	for (var n = 0; n < options.length; n++) {
		this.container.appendChild(options[n].container);
		options[n].contextMenu = this;
	}

	/* Append context menu container to document */
	ZUI.container.appendChild(this.container);

	/* Change status to active */
	this.active = true;
};

ZUI.ContextMenu.prototype.close = function() {
	/* Remove context menu container from document */
	ZUI.container.removeChild(this.container);

	/* Clear options */
	this.options = null;
	this.container.innerHTML = "";

	/* Change status to inactive */
	this.active = false;
};
