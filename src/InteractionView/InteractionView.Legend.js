InteractionView.Legend = function(attributes) {
	/* Properties */
	this.view = (attributes.view === undefined) ? null : attributes.view;
	this.width = 260;
	this.height = 238;
	this.x = (attributes.x === undefined) ? 10 : attributes.x;
	this.y = (attributes.y === undefined) ? ZUI.height - this.height - 10 : attributes.y;
	this.container = document.createElement("div");
	this.isDrag = false;
	this.lastMousePoint = {
		x: 0,
		y: 0
	};

	/* Set up container */
	this.container.style.position = "absolute";
	this.container.style.width = this.width + "px";
	this.container.style.height = this.height + "px";
	this.container.addEventListener("mousedown", $.proxy(function(event) {
		if (event.button == 0) {
			this.lastMousePoint = ZUI.getMousePosition(event);
			this.isDrag = true;
		}
	}, this), false);
	document.addEventListener("mouseup", $.proxy(function(event) {
		if (event.button == 0) {
			this.isDrag = false;
		}
	}, this), false);
	document.addEventListener("mousemove", $.proxy(function(event) {
		if (this.isDrag) {
			var mousePoint = ZUI.getMousePosition(event);
			var dx = mousePoint.x - this.lastMousePoint.x;
			var dy = mousePoint.y - this.lastMousePoint.y;
			this.container.style.left = ($(this.container).position().left + dx) + "px";
			this.container.style.top = ($(this.container).position().top + dy) + "px";
			this.lastMousePoint = mousePoint;
		}
	}, this), false);
	this.container.onmouseover = function() {
		this.style.cursor = "move";
	};
	this.container.onmouseout = function() {
		this.style.cursor = "default";
	};
	this.container.ondragstart = function() {
		return false;
	};

	/* Set up canvas */
	this.canvas = document.createElement("canvas");
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	this.context = this.canvas.getContext("2d");

	/* Append image */
	this.container.appendChild(this.canvas);

	/* Create image */
	this.update();
};

InteractionView.Legend.prototype.update = function() {
	/* Clear canvas */
	this.context.clearRect(0, 0, this.width, this.height);

	/* Create image with canvas */
	this.context.save();
	/* Nodes */
	this.context.font = "bold 8pt Helvetica";
	this.context.fillStyle = Eplant.Color.Black;
	this.context.fillText("Nodes (proteins)", 65, 12);
	var compartments = ["cytoskeleton", "cytosol", "endoplasmic reticulum", "extracellular", "golgi", "mitochondrion", "nucleus", "peroxisome", "plasma membrane", "plastid", "vacuole", "unknown"];
	var n = 0;
	var y = 14;
	this.context.font = "8pt Helvetica";
	this.context.lineWidth = 3;
	for (; n < compartments.length / 2; n++) {
		this.context.strokeStyle = InteractionView.localisationToColor(compartments[n]);
		this.context.beginPath();
		this.context.arc(20, y + 10, 6, 0, 2 * Math.PI, false);
		this.context.stroke();
		this.context.fillStyle = Eplant.Color.Black;
		this.context.fillText(compartments[n], 30, y + 14);
		y += 20;
	}
	y = 14;
	for (; n < compartments.length; n++) {
		this.context.strokeStyle = InteractionView.localisationToColor(compartments[n]);
		this.context.beginPath();
		this.context.arc(150, y + 10, 6, 0, 2 * Math.PI, false);
		this.context.stroke();
		this.context.fillStyle = Eplant.Color.Black;
		this.context.fillText(compartments[n], 160, y + 14);
		y += 20;
	}
	/* Edges */
	this.context.font = "bold 8pt Helvetica";
	this.context.fillStyle = Eplant.Color.Black;
	this.context.fillText("Edges (interactions)", 60, 152);
	this.context.font = "8pt Helvetica";
	this.context.fillText("CV", 30, 166);
	this.context.fillText("Co-expression", 130, 166);
	y = 168;
	/* Thickness */
	this.context.strokeStyle = Eplant.Color.Black;
	this.context.beginPath();
	this.context.lineWidth = 4;
	this.context.moveTo(10, y + 7);
	this.context.lineTo(45, y + 7);
	this.context.stroke();
	this.context.fillText("> 10", 50, y + 11);
	y += 14;
	this.context.lineWidth = 2;
	this.context.beginPath();
	this.context.moveTo(10, y + 7);
	this.context.lineTo(45, y + 7);
	this.context.stroke();
	this.context.fillText("> 5", 50, y + 11);
	y += 14;
	this.context.lineWidth = 1;
	this.context.beginPath();
	this.context.moveTo(10, y + 7.5);
	this.context.lineTo(45, y + 7.5);
	this.context.stroke();
	this.context.fillText("> 2", 50, y + 11);
	y += 14;
	this.context.beginPath();
	this.context.moveTo(10, y + 7.5);
	this.context.lineTo(15, y + 7.5);
	this.context.moveTo(20, y + 7.5);
	this.context.lineTo(25, y + 7.5);
	this.context.moveTo(30, y + 7.5);
	this.context.lineTo(35, y + 7.5);
	this.context.moveTo(40, y + 7.5);
	this.context.lineTo(45, y + 7.5);
	this.context.stroke();
	this.context.fillText("<= 2", 50, y + 11);
	y = 168;
	/* Color */
	this.context.lineWidth = 2;
	var values = [0.8, 0.7, 0.6, 0.5];
	for (n = 0; n < values.length; n++) {
		var grey = (150 - values[n] * 150).toString(16);
		if (grey.length == 1) grey = "0" + grey;
		this.context.strokeStyle = "#" + grey + grey + grey;
		this.context.beginPath();
		this.context.moveTo(120, y + 7);
		this.context.lineTo(155, y + 7);
		this.context.stroke();
		this.context.fillText(values[n], 160, y + 11);
		y += 14;
	}
	var grey = (150).toString(16);
	if (grey.length == 1) grey = "0" + grey;
	this.context.strokeStyle = "#" + grey + grey + grey;
	this.context.beginPath();
	this.context.moveTo(120, y + 7);
	this.context.lineTo(155, y + 7);
	this.context.stroke();
		this.context.fillText("0 or unknown", 160, y + 11);
	this.context.restore();
};

InteractionView.Legend.prototype.remove = function() {
	if (this.container.parentNode) {
		this.container.parentNode.removeChild(this.container);
	}
};

InteractionView.Legend.prototype.add = function() {
	this.container.style.left = this.x + "px";
	this.container.style.top = this.y + "px";
	this.show();
};

InteractionView.Legend.prototype.hide = function() {
	ZUI.container.removeChild(this.container);
};

InteractionView.Legend.prototype.show = function() {
	ZUI.container.appendChild(this.container);
};
