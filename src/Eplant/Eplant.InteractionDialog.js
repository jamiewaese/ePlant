/**
 * InteractionDialog class for ePlant
 * By Hans Yu
 */

/* Class constructor */
Eplant.InteractionDialog = function(attributes) {
	if (attributes.xOffset === undefined) attributes.xOffset = 35;
	if (attributes.yOffset === undefined) attributes.yOffset = -50;
	if (attributes.title === undefined) attributes.title = "";

	/* Call superclass constructor */
	Eplant.PopupDialog.call(this, attributes);

	/* Set class-specific attributes */
	this.interaction = (attributes.interaction === undefined) ? null : attributes.interaction;

	/* Set up dialog content */
		/* Data container */
		var container = document.createElement("div");
		container.style.padding = "0";
		$(container).height(50);
		container.style.overflow = "auto";
			/* Data table */
			var table = document.createElement("table");
				/* Correlation coefficient row */
				var tr = document.createElement("tr");
					/* Label */
					var td = document.createElement("td");
					td.style.verticalAlign = "top";
					$(td).width(200);
					td.innerHTML = "<label>Correlation coefficient:</label>";
					tr.appendChild(td);

					/* Content */
					this.correlationElement = document.createElement("td");
					this.correlationElement.innerHTML = this.interaction.correlation;
					tr.appendChild(this.correlationElement);
				table.appendChild(tr);

				/* Confidence row */
				tr = document.createElement("tr");
					/* Label */
					var td = document.createElement("td");
					td.style.verticalAlign = "top";
					td.innerHTML = "<label>Interolog confidence:</label>";
					tr.appendChild(td);

					/* Content */
					this.confidenceElement = document.createElement("td");
					this.confidenceElement.innerHTML = this.interaction.confidence;
					tr.appendChild(this.confidenceElement);
				table.appendChild(tr);
			container.appendChild(table);
		this.containerElement.appendChild(container);

	/* Open dialog */
	this.open();

	/* Add self to array */
	Eplant.interactionDialogs.push(this);
};

Eplant.InteractionDialog.prototype = Object.create(Eplant.PopupDialog.prototype);
Eplant.InteractionDialog.prototype.constructor = Eplant.InteractionDialog;

Eplant.InteractionDialog.prototype.onclose = function() {
	var index = Eplant.interactionDialogs.indexOf(this);
	if (index >= 0) Eplant.interactionDialogs.splice(index, 1);
};

Eplant.InteractionDialog.prototype.select = function() {
	$(this.containerElement.parentNode).addClass("activeDialog");
};

Eplant.InteractionDialog.prototype.unselect = function() {
	$(this.containerElement.parentNode).removeClass("activeDialog");
};
