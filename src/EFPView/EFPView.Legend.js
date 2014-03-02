EFPView.Legend = function() {
	/* Properties */
	this.width = 300;
	this.height = 158;
	this.x = 10;
	this.y = ZUI.height - this.height - 10;
	this.container = document.createElement("div");
	this.visible = false;

	/* Set up container */
	this.container.style.pointerEvents = "none";
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
};

EFPView.Legend.prototype.update = function(min, mid, max, minColor, midColor, maxColor, maskColor, maskThreshold, titleLabel, controlLabel) {
	/* Clear canvas */
	this.context.clearRect(0, 0, this.width, this.height);
	this.context.save();

	/* Draw labels */
	this.context.fillStyle = Eplant.Color.Black;
	this.context.font = "12px Helvetica";
	this.context.fillText(titleLabel, 0, 10);
	this.context.fillText(controlLabel, 130, this.height - 1);
	var yOffset = 14;

	/* Break down color components */
	minColor = ZUI.Util.getColorComponents(minColor);
	midColor = ZUI.Util.getColorComponents(midColor);
	maxColor = ZUI.Util.getColorComponents(maxColor);

	/* Draw color scale on canvas */
	this.context.font = "10px Helvetica";
	var level = Number(min);
	var color = {
		red: minColor.red,
		green: minColor.green,
		blue: minColor.blue
	};
	/* min to mid */
	for (var n = 0; n < 5; n++) {
		this.context.fillStyle = ZUI.Util.makeColorString(Math.round(color.red), Math.round(color.green), Math.round(color.blue));
		this.context.fillRect(0, (10 - n) * 12 + yOffset, 16, 12);
		this.context.fillStyle = Eplant.Color.Black;
		var label = level.toFixed(2);
		if (label == "-0.00") label = "0.00";
		this.context.fillText(label, 20, (10 - n) * 12 + 10 + yOffset);

		/* Calculate level and color for next step */
		level += (mid - min) / 5;
		color.red += (midColor.red - minColor.red) / 5;
		color.green += (midColor.green - minColor.green) / 5;
		color.blue += (midColor.blue - minColor.blue) / 5;
	}
	/* mid to max */
	for (var n = 5; n < 11; n++) {
		this.context.fillStyle = ZUI.Util.makeColorString(Math.round(color.red), Math.round(color.green), Math.round(color.blue));
		this.context.fillRect(0, (10 - n) * 12 + yOffset, 16, 12);
		this.context.fillStyle = Eplant.Color.Black;
		var label = level.toFixed(2);
		if (label == "-0.00") label = "0.00";
		this.context.fillText(label, 20, (10 - n) * 12 + 10 + yOffset);

		/* Calculate level and color for next step */
		level += (max - mid) / 5;
		color.red += (maxColor.red - midColor.red) / 5;
		color.green += (maxColor.green - midColor.green) / 5;
		color.blue += (maxColor.blue - midColor.blue) / 5;
	}
	/* mask */
	this.context.fillStyle = maskColor;
	this.context.fillRect(0, 11 * 12 + yOffset, 16, 12);
	this.context.fillStyle = Eplant.Color.Black;
	var text = "Masked";
	if (maskThreshold !== null) {
		text += " (" + String.fromCharCode(8805) + (maskThreshold * 100) + "% RSE)";
	}
	else {
		text += " (off)";
	}
	this.context.fillText(text, 20, 11 * 12 + 10 + yOffset);
	this.context.restore();
};

EFPView.Legend.prototype.remove = function() {
	if (this.container.parentNode) {
		this.container.parentNode.removeChild(this.container);
	}
};

EFPView.Legend.prototype.hide = function() {
	ZUI.container.removeChild(this.container);
	this.visible = false;
};

EFPView.Legend.prototype.show = function() {
	ZUI.container.appendChild(this.container);
	this.visible = true;
};
