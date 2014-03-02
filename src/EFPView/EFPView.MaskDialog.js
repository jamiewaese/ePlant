EFPView.MaskDialog = function(view) {
	this.view = view;

	/* Create dialog content */
	this.containerElement = document.createElement("div");
	var label = document.createElement("label");
	label.innerHTML = "Set threshold RSE (%): ";
	this.containerElement.appendChild(label);
	this.inputElement = document.createElement("input");
	this.inputElement.style.width = "35px";
	this.inputElement.value = 50;
	this.containerElement.appendChild(this.inputElement);

	/* Create dialog */
	$(this.containerElement).dialog({
		title: "Masking",
		width: 270,
		height: "auto",
		minHeight: 0,
		resizable: false,
		modal: true,
		buttons: [
			{
				text: "OK",
				click: $.proxy(function(event, ui) {
					var value = Number($(this.inputElement).val());
					if (value < 0) value = 0;
					else if (value > 100) value = 100;
					this.view.maskThreshold = value / 100;
					this.view.maskOn = true;
					this.view.maskContainerElement.getElementsByTagName("img")[0].src = "img/on/filter.png";
					this.view.updateEFP();
					this.close();
				}, this)
			},
			{
				text: "Close",
				click: $.proxy(function(event, ui) {
					this.close();
				}, this)
			}
		],
		close: $.proxy(function(event, ui) {
			$(this.containerElement).remove();
		}, this)
	});

	$(this.inputElement).spinner({
		spin: function(event, ui) {
			if (ui.value > 100) {
				$(this).spinner("value", 100);
				return false;
			}
			else if (ui.value < 0) {
				$(this).spinner("value", 0);
				return false;
			}
		}
	});
};

/* Close dialog */
EFPView.MaskDialog.prototype.close = function() {
	$(this.containerElement).dialog("close");
};
