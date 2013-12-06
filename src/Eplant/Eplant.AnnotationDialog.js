/**
 * AnnotationDialog class for ePlant
 * By Hans Yu
 */

Eplant.AnnotationDialog = function() {
	this.selectedTags = [];
	this.color = "#000000";

	/* Create element */
	this.containerElement = document.createElement("div");
		/* Table */
		var table = document.createElement("table");
			/* Identifiers */
			var tr = document.createElement("tr");
				/* Label */
				var td = document.createElement("td");
				td.innerHTML = "Identifiers:";
				$(td).width(80);
				tr.appendChild(td);

				/* Text input */
				td = document.createElement("td");
					this.identifiersElement = document.createElement("input");
					this.identifiersElement.type = "text";
					$(this.identifiersElement).width(270);
					td.appendChild(this.identifiersElement);
				tr.appendChild(td);
			table.appendChild(tr);

			/* Size */
			tr = document.createElement("tr");
				/* Label */
				td = document.createElement("td");
				td.innerHTML = "Size:";
				tr.appendChild(td);

				/* Text input */
				td = document.createElement("td");
					this.sizeElement = document.createElement("input");
					td.appendChild(this.sizeElement);
					$(this.sizeElement).spinner({
						spin: function(event, ui) {
							if (ui.value < 0) {
								$(this).spinner("value", 0);
								return false;
							}
						}
					});
				tr.appendChild(td);
			table.appendChild(tr);

			/* Color */
			tr = document.createElement("tr");
				/* Label */
				td = document.createElement("td");
				td.innerHTML = "Color:";
				tr.appendChild(td);

				/* Color input */
				td = document.createElement("td");
					this.colorElement = document.createElement("input");
					this.colorElement.type = "text";
					td.appendChild(this.colorElement);
					$(this.colorElement).spectrum({
						color: this.color,
						showInput: true,
						change: $.proxy(function(color) {
							this.color = color.toHexString();
						}, this)
					});
				tr.appendChild(td);
			table.appendChild(tr);

			/* Tags */
			tr = document.createElement("tr");
				/* Label */
				td = document.createElement("td");
				td.innerHTML = "Tags:";
				tr.appendChild(td);

				/* Tags */
				td = document.createElement("td");
					this.tags = [];

					var tag = new Eplant.AnnotationDialog.Tag("#D21315");
					td.appendChild(tag.containerElement);
					this.tags.push(tag);

					tag = new Eplant.AnnotationDialog.Tag("#CCBB00");
					td.appendChild(tag.containerElement);
					this.tags.push(tag);

					tag = new Eplant.AnnotationDialog.Tag("#99CC00");
					td.appendChild(tag.containerElement);
					this.tags.push(tag);

					tag = new Eplant.AnnotationDialog.Tag("#00CCDD");
					td.appendChild(tag.containerElement);
					this.tags.push(tag);

					tag = new Eplant.AnnotationDialog.Tag("#2C81D3");
					td.appendChild(tag.containerElement);
					this.tags.push(tag);

					tag = new Eplant.AnnotationDialog.Tag("#BB00DD");
					td.appendChild(tag.containerElement);
					this.tags.push(tag);
				tr.appendChild(td);
			table.appendChild(tr);
		this.containerElement.appendChild(table);

	/* Create dialog */
	$(this.containerElement).dialog({
		title: "Create annotation",
		width: 400,
		height: 250,
		resizable: false,
		buttons: [
			{
				text: "Add",
				click: $.proxy(function(event, ui) {
					var identifiers = this.identifiersElement.value.split(" ").join("").split(",");
					this.size = this.sizeElement.value;
					this.selectedTags = [];
					for (var n = 0; n < 6; n++) {
						if (this.tags[n].selected) this.selectedTags.push(this.tags[n].color);
					}
					if (isNaN(this.sizeElement.value)) this.sizeElement.value = 0;
					for (var n = 0; n < identifiers.length; n++) {
						var element = Eplant.speciesOfFocus.species.getElementByIdentifier(identifiers[n]);
						if (element) {
							var elementOfInterest = Eplant.speciesOfFocus.addElementOfInterest(element, {
								size: this.size,
								color: this.color,
								tags: this.selectedTags
							});
							Eplant.speciesOfFocus.setElementOfFocus(elementOfInterest);
						}
						else {
							Eplant.speciesOfFocus.species.loadElement(identifiers[n], $.proxy(function(element) {
								/* Add ElementOfInterest */
								var elementOfInterest = Eplant.speciesOfFocus.addElementOfInterest(element, {
									size: this.size,
									color: this.color,
									tags: this.selectedTags
								});
								Eplant.speciesOfFocus.setElementOfFocus(elementOfInterest);
							}, this));
						}
					}
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

//this.containerElement.parentNode.style.background = "rgba(255,0,0,0.5)";
//this.containerElement.style.background = "rgba(255,0,0,0.5)";
};

/* Close annotation dialog */
Eplant.AnnotationDialog.prototype.close = function() {
	$(this.containerElement).dialog("close");
};