/**
 * ContextMenuOption class for ZUI framework
 * By Hans Yu
 */

/* Constructor, must specify label and callback function */
ZUI.ContextMenuOption = function(label, callback, data, enabled, autoClose) {
	/* Properties */
	this.label = label;
	this.callback = callback;
	this.data = data;
	this.enabled = (enabled === undefined) ? true : enabled;
	this.autoClose = (autoClose === undefined) ? true : autoClose;
	this.contextMenu = null;
	this.container = document.createElement("span");

	/* Set up DOM element */
	this.container.className = "zui-contextmenu-option";
	this.container.style.padding = "3px 20px";
	this.container.style.display = "block";
	this.container.style.width = "120px";
	if (this.enabled) {
		this.container.style.backgroundColor = "#FFFFFF";
		this.container.style.color = "#3C3C3C";
	}
	else {
		this.container.style.backgroundColor = "#FFFFFF";
		this.container.style.color = "#B4B4B4";
	}
	this.container.innerHTML = label;
	this.container.onmouseover = (function() {
		if (this.enabled) {
			this.container.style.backgroundColor = "#787878";
			this.container.style.color = "#FFFFFF";
		}
		else {
			this.container.style.backgroundColor = "#FFFFFF";
			this.container.style.color = "#B4B4B4";
		}
	}).bind(this);
	this.container.onmouseout = (function() {
		if (this.enabled) {
			this.container.style.backgroundColor = "#FFFFFF";
			this.container.style.color = "#3C3C3C";
		}
		else {
			this.container.style.backgroundColor = "#FFFFFF";
			this.container.style.color = "#B4B4B4";
		}
	}).bind(this);
	this.container.onclick = (function(){
		this.callback(this.data);
		if (this.autoClose && this.contextMenu.active) {
			this.contextMenu.close();
		}
	}).bind(this);
};
