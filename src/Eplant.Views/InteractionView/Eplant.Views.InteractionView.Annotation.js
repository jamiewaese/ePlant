(function() {

/**
 * Eplant.Views.InteractionView.Annotation class
 * Coded by Hans Yu
 * UI designed by Jamie Waese
 *
 * @constructor
 * @param {Eplant.GeneticElement} geneticElement The GeneticElement associated with this annotation.
 * @param {Eplant.Views.InteractionView} interactionView The InteractionView that owns this annotation.
 */
Eplant.Views.InteractionView.Annotation = function(geneticElement, interactionView) {
	/* Attributes */
	this.geneticElement = geneticElement;		// The GeneticElement associated with this annotation
	this.interactionView = interactionView;		// The InteractionView that owns this annotation
	this.tagVOs = [];					// ViewObjects for annotation tags
	this.eventListeners = [];

	/* Create tags */
	this.update();

	/* Bind events */
	this.bindEvents();
};

/**
 * Binds events.
 */
Eplant.Views.InteractionView.Annotation.prototype.bindEvents = function() {
	/* update-annotationTags */
	var eventListener = new ZUI.EventListener("update-annotationTags", this.geneticElement, function(event, eventData, listenerData) {
		/* Get annotation */
		var annotation = listenerData.annotation;

		/* Update */
		annotation.update();
	}, {
		annotation: this
	});
	this.eventListeners.push(eventListener);
	ZUI.addEventListener(eventListener);
};

/**
 * Draws this annotation.
 */
Eplant.Views.InteractionView.Annotation.prototype.draw = function() {
	/* Draw tags */
	for (var n = 0; n < this.tagVOs.length; n++) {
		var tagVO = this.tagVOs[n];
		tagVO.draw();
	}
};

/**
 * Updates the annotation.
 */
Eplant.Views.InteractionView.Annotation.prototype.update = function() {
	/* Escape if Cytoscape is not ready */
	if (!this.interactionView.cy) {
		return;
	}

	/* Get node */
	var node = this.interactionView.cy.$("#" + this.geneticElement.identifier.toUpperCase());

	/* Escape if node cannot be found */
	if (!node) {
		return;
	}

	/* Get node position */
	var position = node.position();
	var x = position.x - ZUI.width / 2;
	var y = position.y - ZUI.height / 2 - node.width() / 2 - 27;

	/* Remove old tags */
	for (var n = 0; n < this.tagVOs.length; n++) {
		var tagVO = this.tagVOs[n];
		tagVO.remove();
	}
	this.tagVOs = [];

	/* Create new tags */
	var index = 0;
	var total = 0;
	for (var n = 0; n < this.geneticElement.annotationTags.length; n++) {
		var annotationTag = this.geneticElement.annotationTags[n];
		if (annotationTag.isSelected) {
			total++;
		}
	}
	for (var n = 0; n < this.geneticElement.annotationTags.length; n++) {
		var annotationTag = this.geneticElement.annotationTags[n];
		if (!annotationTag.isSelected) {
			continue;
		}
		var tagVO = new ZUI.ViewObject({
			shape: "circle",
			positionScale: "world",
			sizeScale: "world",
			x: x,
			y: y,
			offsetX: (-(total - 1) / 2 + index) * 8,
			radius: 3,
			centerAt: "center center",
			strokeColor: annotationTag.color,
			fillColor: annotationTag.color
		});
		this.tagVOs.push(tagVO);
		index++;
	}
};

/**
 * Removes the annotation.
 */
Eplant.Views.InteractionView.Annotation.prototype.remove = function() {
	/* Remove tags */
	for (var n = 0; n < this.tagVOs.length; n++) {
		var tagVO = this.tagVOs[n];
		tagVO.remove();
	}

	/* Remove event listeners */
	for (var n = 0; n < this.eventListeners.length; n++) {
		var eventListener = this.eventListeners[n];
		ZUI.removeEventListener(eventListener);
	}
};

})();