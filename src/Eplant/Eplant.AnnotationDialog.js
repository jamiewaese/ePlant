/**
 * AnnotationDialog class for ePlant
 * By Hans Yu
 */

Eplant.AnnotationDialog = function() {
	this.selectedTags = [];

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
					this.sizeElement.type = "number";
					this.sizeElement.min = 0;
					this.sizeElement.value = 0;
					$(this.sizeElement).width(60);
					td.appendChild(this.sizeElement);
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
					this.colorElement.type = "color";
					td.appendChild(this.colorElement);
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
		draggable: false,
		modal: true,
		buttons: [
			{
				text: "Submit",
				click: $.proxy(function(event, ui) {
					var identifiers = this.identifiersElement.value.split(" ").join("").split(",");
					this.size = this.sizeElement.value;
					this.color = this.colorElement.value;
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
							$.ajax({
								type: "GET",
								url: "cgi-bin/querygenebyidentifier.cgi?id=" + identifiers[n],
								dataType: "json"
							}).done($.proxy(function(response) {
								var chromosome = Eplant.speciesOfFocus.species.getChromosome(response.chromosome);
								if (chromosome) {
									/* Create Element */
									var element = new Eplant.Element(chromosome);
									element.identifier = response.id;
									element.start = response.start;
									element.end = response.end;
									element.strand = response.strand;
									element.aliases = response.aliases;
									element.annotation = response.annotation;
									chromosome.elements.push(element);

									/* Add ElementOfInterest */
									var elementOfInterest = Eplant.speciesOfFocus.addElementOfInterest(element, {
										size: this.size,
										color: this.color,
										tags: this.selectedTags
									});
									Eplant.speciesOfFocus.setElementOfFocus(elementOfInterest);
								}
							}, this));
						}
					}
					this.close();
				}, this)
			},
			{
				text: "Cancel",
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

/* Close annotation dialog */
Eplant.AnnotationDialog.prototype.close = function() {
	$(this.containerElement).dialog("close");
};