EFPView.CompareDialog = function(element, view) {
	this.element = element;
	this.view = view;
	this.speciesOfInterest = Eplant.getSpeciesOfInterest(element.chromosome.species);

	var elementsOfInterest = this.speciesOfInterest.elementsOfInterest;

	/* Create dialog content */
	this.containerElement = document.createElement("div");
	this.selectElement = document.createElement("select");
	this.selectElement.style.width = "220px";
	this.selectElement.size = 6;
	for (var n = 0; n < elementsOfInterest.length; n++) {
		var _element = elementsOfInterest[n].element;
		if (_element == element) continue;
		var option = document.createElement("option");
		option.value = _element.identifier;
		option.innerHTML = _element.identifier;
		if (_element.aliases != null && _element.aliases.length > 0 && _element.aliases[0].length > 0) {
			option.innerHTML += " / " + _element.aliases.join(", ");
		}
		this.selectElement.appendChild(option);
	}
	var options = this.selectElement.getElementsByTagName("option");
	if (options.length > 0) options[0].selected = true;
	this.containerElement.appendChild(this.selectElement);

	/* Create dialog */
	$(this.containerElement).dialog({
		title: "Compare " + element.identifier + " to...",
		width: 250,
		height: "auto",
		minHeight: 0,
		resizable: false,
		modal: true,
		buttons: [
			{
				text: "Compare",
				click: $.proxy(function(event, ui) {
					if (this.selectElement.selectedIndex < 0) {
						alert("Please select a gene! If you don't see the gene you want, please close this dialog and load the gene you wish to compare.");
					}
					var identifier = this.selectElement.options[this.selectElement.selectedIndex].value;
					var elementOfInterest = this.speciesOfInterest.getElementOfInterestByIdentifier(identifier);
					if (elementOfInterest) {
						this.view.toCompareMode(elementOfInterest);
					}
					else {
						alert("The gene you selected is not loaded!");
					}
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
};

/* Close dialog */
EFPView.CompareDialog.prototype.close = function() {
	$(this.containerElement).dialog("close");
};
