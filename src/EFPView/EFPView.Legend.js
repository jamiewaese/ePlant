EFPView.Legend = function() {
	/* Properties */
	this.width = 60;
	this.height = 132;
	this.x = 10;
	this.y = ZUI.height - this.height - 10;
	this.container = document.createElement("div");
	this.visible = false;

	/* Set up container */
	this.container.style.position = "absolute";
	this.container.style.left = this.x + "px";
	this.container.style.top = this.y + "px";
	this.container.style.width = this.width + "px";
	this.container.style.height = this.height + "px";
	this.container.ondragstart = function() {
		return false;
	};

	/* Set up canvas */
	this.canvas = document.createElement("canvas");
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	this.context = this.canvas.getContext("2d");
	this.container.appendChild(this.canvas);

	/* Set up title label */
	this.titleLabel = document.createElement("span");
	this.titleLabel.style.position = "absolute";
	this.titleLabel.style.left = this.x + "px";
	this.titleLabel.style.top = (this.y - 16) + "px";

	/* Set up control label */
	this.controlLabel = document.createElement("span");
	this.controlLabel.style.position = "absolute";
	this.controlLabel.style.left = (this.x + this.width + 10) + "px";
	this.controlLabel.style.top = (this.y + this.height - 16) + "px";
};

EFPView.Legend.prototype.update = function(min, mid, max, minColor, midColor, maxColor, titleLabel, controlLabel) {
	/* Clear canvas */
	this.context.clearRect(0, 0, this.width, this.height);

	/* Break down color components */
	minColor = ZUI.Util.getColorComponents(minColor);
	midColor = ZUI.Util.getColorComponents(midColor);
	maxColor = ZUI.Util.getColorComponents(maxColor);

	/* Draw color scale on canvas */
	var level = Number(min);
	var color = {
		red: minColor.red,
		green: minColor.green,
		blue: minColor.blue
	};
	this.context.save();
	/* min to mid */
	for (var n = 0; n < 5; n++) {
		this.context.fillStyle = ZUI.Util.makeColorString(Math.round(color.red), Math.round(color.green), Math.round(color.blue));
		this.context.fillRect(0, (10 - n) * 12, 16, 12);
		this.context.fillStyle = Eplant.Color.Black;
		var label = level.toFixed(2);
		if (label == "-0.00") label = "0.00";
		this.context.fillText(label, 20, (10 - n) * 12 + 10);

		/* Calculate level and color for next step */
		level += (mid - min) / 5;
		color.red += (midColor.red - minColor.red) / 5;
		color.green += (midColor.green - minColor.green) / 5;
		color.blue += (midColor.blue - minColor.blue) / 5;
	}
	/* mid to max */
	for (var n = 5; n < 11; n++) {
		this.context.fillStyle = ZUI.Util.makeColorString(Math.round(color.red), Math.round(color.green), Math.round(color.blue));
		this.context.fillRect(0, (10 - n) * 12, 16, 12);
		this.context.fillStyle = Eplant.Color.Black;
		var label = level.toFixed(2);
		if (label == "-0.00") label = "0.00";
		this.context.fillText(label, 20, (10 - n) * 12 + 10);

		/* Calculate level and color for next step */
		level += (max - mid) / 5;
		color.red += (maxColor.red - midColor.red) / 5;
		color.green += (maxColor.green - midColor.green) / 5;
		color.blue += (maxColor.blue - midColor.blue) / 5;
	}
	this.context.restore();

	/* Update labels */
	this.titleLabel.innerHTML = titleLabel;
	this.controlLabel.innerHTML = controlLabel;
};

EFPView.Legend.prototype.remove = function() {
	if (this.container.parentNode) {
		this.container.parentNode.removeChild(this.container);
	}
};

EFPView.Legend.prototype.hide = function() {
	ZUI.container.removeChild(this.container);
	ZUI.container.removeChild(this.titleLabel);
	ZUI.container.removeChild(this.controlLabel);
	this.visible = false;
};

EFPView.Legend.prototype.show = function() {
	ZUI.container.appendChild(this.container);
	ZUI.container.appendChild(this.titleLabel);
	ZUI.container.appendChild(this.controlLabel);
	this.visible = true;
};
