/**
 * EFP View class
 * UI design by Jamie Waese
 * Code by Hans Yu
 */

function EFPView(element, diagram) {
	this.element = element;
	this.diagram = diagram;

	this.width = null;
	this.height = null;
	this.webService = null;
	this.labels = [];
	this.control = null;
	this.outline = null;
	this.groups = [];
	this.viewObjects = [];

	/* Retrieve diagram JSON */
	$.ajax({
		type: "GET",
		url: diagram,
		dataType: "json"
	}).done($.proxy(function(response) {
		this.width = response.width;
		this.height = response.height;

		this.webService = response.webService;

		this.control = {
			name: response.control,
			level: null
		};

		this.outline = new ZUI.ViewObject({
			shape: "advshape",
			x: -400,
			y: -300,
			paths: response.outline.paths,
			fill: false,
			strokeColor: response.outline.color || Eplant.Color.Black
		});
		for (n = 0; n < response.groups.length; n++) {
			var group = response.groups[n];
			var _group = {};
			_group.id = group.id;
			_group.shape = new ZUI.ViewObject({
				shape: "advshape",
				x: -this.width / 2,
				y: -this.height / 2,
				paths: group.paths,
				strokeColor: Eplant.Color.White,
				fillColor: Eplant.Color.White,
				mouseOver: $.proxy(function() {
					this.shape.strokeWidth = 2;
					this.shape.strokeColor = Eplant.Color.DarkGrey;
				}, _group),
				mouseOut: $.proxy(function() {
					this.shape.strokeWidth = 1;
					this.shape.strokeColor = this.color;
				}, _group)
			});
			_group.color = Eplant.Color.White;
			_group.source = group.source;
			_group.samples = [];
			for (var m = 0; m < group.samples.length; m++) {
				var sample = {
					name: group.samples[m],
					level: null
				};
				_group.samples.push(sample);
				_group.samples[sample.name] = sample;
			}
			_group.average = null;
			_group.stdev = null;
			_group.n = null;
			this.viewObjects.push(_group.shape);
			this.groups.push(_group);
			this.groups[group.id] = group;
		}

		this.labels = response.labels;
		for (n = 0; n < this.labels.length; n++) {
			var label = this.labels[n];
			label.text = new ZUI.ViewObject({
				shape: "text",
				positionScale: "world",
				sizeScale: "world",
				x: label.x,
				y: label.y,
				content: label.content,
				size: label.size,
				font: label.font,
				bold: label.bold,
				italic: label.italic,
				underline: label.underline,
				strokeColor: label.color,
				fillColor: label.color,
				leftClick: $.proxy(function() {
					if (label.link) window.open(label.link);
				}, this),
				mouseOver: $.proxy(function() {
					if (label.link) ZUI.container.style.cursor = "pointer";
				}, this),
				mouseOut: $.proxy(function() {
					if (label.link) ZUI.container.style.cursor = "default";
				}, this)
			});
			this.viewObjects.push(label.text);
		}

		/* Retrieve data */
		$.getJSON(this.webService + "id=" + element.identifier, $.proxy(function(response) {
			this.control.level = response.control;

			for (var n = 0; n < response.groups.length; n++) {
				var group = response.groups[n];

				/* Store samples data */
				var values = [];
				for (var m = 0; m < group.samples.length; m++) {
					var sample = group.samples[m];
					this.groups[group.id].samples[sample.name].level = sample.level;
					values.push(sample.level);
				}
				group.mean = ZUI.Statistics.mean(values);
				group.stdev = ZUI.Statistics.stdev(values);
				group.n = values.length;

				/* Update eFP */
//				group.color = 
				//TODO continue here
			}
		}, this));
	}, this));
}

/* Inherit from View superclass */
EFPView.prototype = new ZUI.View();
EFPView.prototype.constructor = EFPView;

EFPView.prototype.draw = function() {
	/* Update camera */
	ZUI.camera.update();

	/* Draw group shapes */
	for (n = 0; n < this.groups.length; n++) {
		this.groups[n].shape.draw();
	}

	/* Draw outline */
	if (this.outline) this.outline.draw();

	/* Draw labels */
	for (var n = 0; n < this.labels.length; n++) {
		this.labels[n].text.draw();
	}
};

