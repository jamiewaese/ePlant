/**
 * ElementDialog class for ePlant
 * By Hans Yu
 */

/* Class constructor */
Eplant.ElementDialog = function(attributes) {
	if (attributes.xOffset === undefined) attributes.xOffset = 35;
	if (attributes.yOffset === undefined) attributes.yOffset = -40;
	if (attributes.title === undefined) attributes.title = (attributes.element === undefined) ? "" : attributes.element.identifier;

	this.minimized = false;

	/* Call superclass constructor */
	Eplant.PopupDialog.call(this, attributes);

	/* Set class-specific attributes */
	this.element = (attributes.element === undefined) ? null : attributes.element;

	/* Set up dialog content */
		/* Data container */
		var container = document.createElement("div");
		container.style.padding = "5px";
		$(container).css("maxHeight", 130);
		$(container).width(350);
		container.style.overflow = "auto";
			/* Data table */
			var table = document.createElement("table");
				/* Identifier row */
				var tr = document.createElement("tr");
					/* Label */
					var td = document.createElement("td");
					td.style.verticalAlign = "top";
					td.innerHTML = "<label>Identifier:</label>";
					tr.appendChild(td);

					/* Content */
					this.identifierElement = document.createElement("td");
					this.identifierElement.innerHTML = this.element.identifier;
					tr.appendChild(this.identifierElement);
				table.appendChild(tr);

				/* Aliases row */
				tr = document.createElement("tr");
					/* Label */
					var td = document.createElement("td");
					td.style.verticalAlign = "top";
					td.innerHTML = "<label>Aliases:</label>";
					tr.appendChild(td);

					/* Content */
					this.aliasesElement = document.createElement("td");
					if (this.element.aliases.length > 0) {
						this.aliasesElement.innerHTML = this.element.aliases.join(", ");
					}
					else {
						this.aliasesElement.innerHTML = "Not available";
					}
					tr.appendChild(this.aliasesElement);
				table.appendChild(tr);

				/* Strand row */
				tr = document.createElement("tr");
					/* Label */
					var td = document.createElement("td");
					td.style.verticalAlign = "top";
					td.innerHTML = "<label>Strand:</label>";
					tr.appendChild(td);

					/* Content */
					this.strandElement = document.createElement("td");
					this.strandElement.innerHTML = this.element.strand;
					tr.appendChild(this.strandElement);
				table.appendChild(tr);

				/* Annotation row */
				tr = document.createElement("tr");
					/* Label */
					var td = document.createElement("td");
					td.style.verticalAlign = "top";
					td.innerHTML = "<label>Annotation:</label>";
					tr.appendChild(td);

					/* Content */
					this.annotationElement = document.createElement("td");
					if (this.element.annotation && this.element.annotation.length > 0) {
						this.annotationElement.innerHTML = this.element.annotation;
					}
					else {
						this.annotationElement.innerHTML = "Not available";
					}
					tr.appendChild(this.annotationElement);
				table.appendChild(tr);
			container.appendChild(table);
		this.containerElement.appendChild(container);

		/* Buttons container */
		container = document.createElement("div");
		container.style.padding = "5px";
			/* Get Data / Drop Data */
			this.getDropDataElement = document.createElement("input");
			this.getDropDataElement.type = "button";
			this.getDropDataElement.className = "button";
			this.getDropDataElement.value = "";
			this.getDropDataElement.onclick = null;
			container.appendChild(this.getDropDataElement);

			/* Tags */
			var tagsElement = document.createElement("div");
			tagsElement.style.display = "inline-block";
			tagsElement.style.padding = "5px";
			tagsElement.style.verticalAlign = "middle";
				var label = document.createElement("label");
				label.innerHTML = "Tags: ";
				label.style.verticalAlign = "middle";
				tagsElement.appendChild(label);

				this.tags = [];
				var tag = new Eplant.ElementDialog.Tag("#D21315", this);
				tagsElement.appendChild(tag.containerElement);
				this.tags.push(tag);

				tag = new Eplant.ElementDialog.Tag("#CCBB00", this);
				tagsElement.appendChild(tag.containerElement);
				this.tags.push(tag);

				tag = new Eplant.ElementDialog.Tag("#99CC00", this);
				tagsElement.appendChild(tag.containerElement);
				this.tags.push(tag);

				tag = new Eplant.ElementDialog.Tag("#00CCDD", this);
				tagsElement.appendChild(tag.containerElement);
				this.tags.push(tag);

				tag = new Eplant.ElementDialog.Tag("#2C81D3", this);
				tagsElement.appendChild(tag.containerElement);
				this.tags.push(tag);

				tag = new Eplant.ElementDialog.Tag("#BB00DD", this);
				tagsElement.appendChild(tag.containerElement);
				this.tags.push(tag);
			container.appendChild(tagsElement);

			/* Top 50 Similar */
			this.top50SimilarElement = document.createElement("input");
			this.top50SimilarElement.type = "button";
			this.top50SimilarElement.className = "button";
			this.top50SimilarElement.value = "Top 50 Similar";
			this.top50SimilarElement.onclick = $.proxy(function() {
				//TODO
			}, this);
			container.appendChild(this.top50SimilarElement);
		this.containerElement.appendChild(container);

		/* View icons container */
		container = document.createElement("div");
		container.style.textAlign = "center";
		container.style.padding = "5px";
			/* World */
			this.worldViewElement = document.createElement("div");
			this.worldViewElement.className = "iconSmall";
			this.worldViewElement.style.display = "inline-block";
				var img = document.createElement("img");
				img.src = "img/unavailable/world.png";
				this.worldViewElement.appendChild(img);
			container.appendChild(this.worldViewElement);

			/* Plant */
			this.plantViewElement = document.createElement("div");
			this.plantViewElement.className = "iconSmall";
			this.plantViewElement.style.display = "inline-block";
				var img = document.createElement("img");
				img.src = "img/unavailable/plant.png";
				this.plantViewElement.appendChild(img);
			container.appendChild(this.plantViewElement);

			/* Cell */
			this.cellViewElement = document.createElement("div");
			this.cellViewElement.className = "iconSmall";
			this.cellViewElement.style.display = "inline-block";
				var img = document.createElement("img");
				img.src = "img/unavailable/cell.png";
				this.cellViewElement.appendChild(img);
			container.appendChild(this.cellViewElement);

			/* Interaction */
			this.interactionViewElement = document.createElement("div");
			this.interactionViewElement.className = "iconSmall";
			this.interactionViewElement.style.display = "inline-block";
				var img = document.createElement("img");
				img.src = "img/unavailable/interaction.png";
				this.interactionViewElement.appendChild(img);
			container.appendChild(this.interactionViewElement);

			/* Pathway */
			this.pathwayViewElement = document.createElement("div");
			this.pathwayViewElement.className = "iconSmall";
			this.pathwayViewElement.style.display = "inline-block";
				var img = document.createElement("img");
				img.src = "img/unavailable/pathway.png";
				this.pathwayViewElement.appendChild(img);
			container.appendChild(this.pathwayViewElement);

			/* Molecule */
			this.moleculeViewElement = document.createElement("div");
			this.moleculeViewElement.className = "iconSmall";
			this.moleculeViewElement.style.display = "inline-block";
				var img = document.createElement("img");
				img.src = "img/unavailable/molecule.png";
				this.moleculeViewElement.appendChild(img);
			container.appendChild(this.moleculeViewElement);

			/* Sequence */
			this.sequenceViewElement = document.createElement("div");
			this.sequenceViewElement.className = "iconSmall";
			this.sequenceViewElement.style.display = "inline-block";
				var img = document.createElement("img");
				img.src = "img/unavailable/sequence.png";
				this.sequenceViewElement.appendChild(img);
			container.appendChild(this.sequenceViewElement);
		this.containerElement.appendChild(container);

	/* Get ElementOfInterest */
	this.elementOfInterest = Eplant.getSpeciesOfInterest(this.element.chromosome.species).getElementOfInterest(this.element);

	/* Open dialog */
	this.open();
	$(this.containerElement.parentNode).addClass("popupDialog");

	var titlebar = this.containerElement.parentNode.getElementsByClassName("ui-dialog-titlebar")[0];

	/* Create minimize button */
	this.minimizeButtonElement = document.createElement("button");
	this.minimizeButtonElement.title = "minimize";
	$(this.minimizeButtonElement).button({
		icons: {
			primary: "ui-icon-minus"
		},
		text: false
	});
	$(this.minimizeButtonElement).addClass("ui-dialog-titlebar-minimize");
	this.minimizeButtonElement.onclick = $.proxy(function() {
		this.minimized = !this.minimized;
		if (this.minimized) {
			$(this.minimizeButtonElement).button({
				icons: {
					primary: "ui-icon-plus"
				},
				text: false
			});
			this._height = $(this.containerElement).height();
			$(this.containerElement).height(this._height);
			$(this.containerElement).hide().show(0);		// Hack to force redraw
			$(this.containerElement).addClass("minimized");
			$(this.containerElement).height(0);
			this.minimizeButtonElement.title = "restore";
		}
		else {
			$(this.minimizeButtonElement).button({
				icons: {
					primary: "ui-icon-minus"
				},
				text: false
			});
			$(this.containerElement).removeClass("minimized");
			$(this.containerElement).height(this._height);
			this.minimizeButtonElement.title = "minimize";
		}
	}, this);
	titlebar.appendChild(this.minimizeButtonElement);

	this.focusButtonElement = document.createElement("button");
	this.focusButtonElement.title = "focus";
	$(this.focusButtonElement).button({
		icons: {
			primary: "ui-icon-star"
		},
		text: false
	});
	$(this.focusButtonElement).addClass("ui-dialog-titlebar-focus");
	this.focusButtonElement.onclick = $.proxy(function() {
		if (this.elementOfInterest) {
			var speciesOfInterest = Eplant.getSpeciesOfInterest(this.element.chromosome.species);
			if (speciesOfInterest != Eplant.speciesOfFocus) Eplant.setSpeciesOfFocus(speciesOfInterest);
			Eplant.speciesOfFocus.setElementOfFocus(this.elementOfInterest);
		}
	}, this);
	titlebar.appendChild(this.focusButtonElement);

	/* Set data button */
	if (this.elementOfInterest) {
		this.toDropData();
	}
	else {
		this.toGetData();
	}

	/* Select dialog if appropriate */
	if (this.elementOfInterest && this.elementOfInterest == Eplant.getSpeciesOfInterest(this.element.chromosome.species).elementOfFocus) {
		var elementOfFocus = Eplant.speciesOfFocus.elementOfFocus;
		var elementDialog = (elementOfFocus) ? Eplant.getElementDialog(elementOfFocus.element) : null;
		if (elementDialog) elementDialog.unselect();
		this.select();
	};

	/* Add self to array */
	Eplant.elementDialogs.push(this);
};

Eplant.ElementDialog.prototype = Object.create(Eplant.PopupDialog.prototype);
Eplant.ElementDialog.prototype.constructor = Eplant.ElementDialog;

Eplant.ElementDialog.prototype.onclose = function() {
	var index = Eplant.elementDialogs.indexOf(this);
	if (index >= 0) Eplant.elementDialogs.splice(index, 1);
};

Eplant.ElementDialog.prototype.select = function() {
	$(this.containerElement.parentNode).addClass("activeDialog");
};

Eplant.ElementDialog.prototype.unselect = function() {
	$(this.containerElement.parentNode).removeClass("activeDialog");
};

Eplant.ElementDialog.prototype.toGetData = function() {
	this.getDropDataElement.value = "Get Data";
	$(this.containerElement.parentNode).removeClass("loadedDialog");
	this.getDropDataElement.onclick = $.proxy(function() {
		var elementOfFocus = Eplant.getSpeciesOfInterest(this.element.chromosome.species).elementOfFocus;
		var elementDialog = (elementOfFocus) ? Eplant.getElementDialog(elementOfFocus.element) : null;
		if (elementDialog) elementDialog.unselect();
		this.elementOfInterest = Eplant.getSpeciesOfInterest(this.element.chromosome.species).addElementOfInterest(this.element, {});
		Eplant.getSpeciesOfInterest(this.element.chromosome.species).setElementOfFocus(this.elementOfInterest);
		this.select();
		this.toDropData();

		/* Remove element list dialog if current view is ChromosomeView */
		if (ZUI.activeView instanceof ChromosomeView) {
			if (ZUI.activeView.elementListDialog) {
				ZUI.activeView.elementListDialog.close();
				ZUI.activeView.elementListDialog = null;
			}
		}
	}, this);
};

Eplant.ElementDialog.prototype.toDropData = function() {
	this.getDropDataElement.value = "Drop Data";
	$(this.containerElement.parentNode).addClass("loadedDialog");
	this.getDropDataElement.onclick = $.proxy(function() {
		Eplant.getSpeciesOfInterest(this.element.chromosome.species).removeElementOfInterest(this.elementOfInterest);
		this.elementOfInterest = null;
		this.unselect();
		this.toGetData();
		for (var n = 0; n < this.tags.length; n++) {
			this.tags[n].selected = false
			this.tags[n].containerElement.setAttribute("selected", "false");
		}
		this.close();
	}, this);
};

Eplant.ElementDialog.prototype.updateIcons = function() {
	/* WorldView */
	if (this.elementOfInterest == null || this.elementOfInterest.worldView == null || this.elementOfInterest.worldView.getLoadProgress() < 1) {
		this.worldViewElement.getElementsByTagName("img")[0].src = "img/unavailable/world.png";
	}
	else if (this.elementOfInterest.worldView == ZUI.activeView) {
		this.worldViewElement.getElementsByTagName("img")[0].src = "img/active/world.png";
	}
	else {
		this.worldViewElement.getElementsByTagName("img")[0].src = "img/available/world.png";
	}

	/* PlantView */
	if (this.elementOfInterest == null || this.elementOfInterest.plantView == null || this.elementOfInterest.plantView.getLoadProgress() < 1) {
		this.plantViewElement.getElementsByTagName("img")[0].src = "img/unavailable/plant.png";
	}
	else if (this.elementOfInterest.plantView == ZUI.activeView) {
		this.plantViewElement.getElementsByTagName("img")[0].src = "img/active/plant.png";
	}
	else {
		this.plantViewElement.getElementsByTagName("img")[0].src = "img/available/plant.png";
	}

	/* CellView */
	if (this.elementOfInterest == null || this.elementOfInterest.cellView == null || this.elementOfInterest.cellView.getLoadProgress() < 1) {
		this.cellViewElement.getElementsByTagName("img")[0].src = "img/unavailable/cell.png";
	}
	else if (this.elementOfInterest.cellView == ZUI.activeView) {
		this.cellViewElement.getElementsByTagName("img")[0].src = "img/active/cell.png";
	}
	else {
		this.cellViewElement.getElementsByTagName("img")[0].src = "img/available/cell.png";
	}

	/* InteractionView */
	if (this.elementOfInterest == null || this.elementOfInterest.interactionView == null || this.elementOfInterest.interactionView.getLoadProgress() < 1) {
		this.interactionViewElement.getElementsByTagName("img")[0].src = "img/unavailable/interaction.png";
	}
	else if (this.elementOfInterest.interactionView == ZUI.activeView) {
		this.interactionViewElement.getElementsByTagName("img")[0].src = "img/active/interaction.png";
	}
	else {
		this.interactionViewElement.getElementsByTagName("img")[0].src = "img/available/interaction.png";
	}

	/* PathwayView */
	if (this.elementOfInterest == null || this.elementOfInterest.pathwayView == null || this.elementOfInterest.pathwayView.getLoadProgress() < 1) {
		this.pathwayViewElement.getElementsByTagName("img")[0].src = "img/unavailable/pathway.png";
	}
	else if (this.elementOfInterest.pathwayView == ZUI.activeView) {
		this.pathwayViewElement.getElementsByTagName("img")[0].src = "img/active/pathway.png";
	}
	else {
		this.pathwayViewElement.getElementsByTagName("img")[0].src = "img/available/pathway.png";
	}

	/* MoleculeView */
	if (this.elementOfInterest == null || this.elementOfInterest.moleculeView == null || this.elementOfInterest.moleculeView.getLoadProgress() < 1) {
		this.moleculeViewElement.getElementsByTagName("img")[0].src = "img/unavailable/molecule.png";
	}
	else if (this.elementOfInterest.moleculeView == ZUI.activeView) {
		this.moleculeViewElement.getElementsByTagName("img")[0].src = "img/active/molecule.png";
	}
	else {
		this.moleculeViewElement.getElementsByTagName("img")[0].src = "img/available/molecule.png";
	}

	/* SequenceView */
	if (this.elementOfInterest == null || this.elementOfInterest.sequenceView == null || this.elementOfInterest.sequenceView.getLoadProgress() < 1) {
		this.sequenceViewElement.getElementsByTagName("img")[0].src = "img/unavailable/sequence.png";
	}
	else if (this.elementOfInterest.sequenceView == ZUI.activeView) {
		this.sequenceViewElement.getElementsByTagName("img")[0].src = "img/active/sequence.png";
	}
	else {
		this.sequenceViewElement.getElementsByTagName("img")[0].src = "img/available/sequence.png";
	}
};
