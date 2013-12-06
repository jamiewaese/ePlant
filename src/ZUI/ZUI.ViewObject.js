/**
 * ViewObject class for ZUI framework
 * By Hans Yu
 */

/* Class constructor */
ZUI.ViewObject = function(attributes) {
	/* Object for custom data */
	this.data = {};

	/* Set shape and its attributes */
	if (!attributes.shape) return null;
	this.shape = attributes.shape;
	this.x = (attributes.x === undefined) ? 0 : attributes.x;
	this.y = (attributes.y === undefined) ? 0 : attributes.y;
	if (this.shape == "rect") {
		this.offsetX = (attributes.offsetX === undefined) ? 0 : attributes.offsetX;
		this.offsetY = (attributes.offsetY === undefined) ? 0 : attributes.offsetY;
		this.width = (attributes.width === undefined) ? 0 : attributes.width;
		this.height = (attributes.height === undefined) ? 0 : attributes.height;
		if (attributes.radius === undefined) {
			this.ltradius = (attributes.ltradius === undefined) ? 0 : attributes.ltradius;
			this.rtradius = (attributes.rtradius === undefined) ? 0 : attributes.rtradius;
			this.lbradius = (attributes.lbradius === undefined) ? 0 : attributes.lbradius;
			this.rbradius = (attributes.rbradius === undefined) ? 0 : attributes.rbradius;
		}
		else {
			this.ltradius = attributes.radius;
			this.rtradius = attributes.radius;
			this.lbradius = attributes.radius;
			this.rbradius = attributes.radius;
		}
		this.centerAt = (attributes.centerAt === undefined) ? "center center" : attributes.centerAt;
	}
	else if (this.shape == "circle") {
		this.offsetX = (attributes.offsetX === undefined) ? 0 : attributes.offsetX;
		this.offsetY = (attributes.offsetY === undefined) ? 0 : attributes.offsetY;
		if (attributes.radius === undefined) {
			this.hradius = (attributes.hradius === undefined) ? 0 : attributes.hradius;
			this.vradius = (attributes.vradius === undefined) ? 0 : attributes.vradius;
		}
		else {
			this.hradius = attributes.radius;
			this.vradius = attributes.radius;
		}
		this.centerAt = (attributes.centerAt === undefined) ? "center center" : attributes.centerAt;
	}
	else if (this.shape == "polygon") {
		this.vertices = (attributes.vertices === undefined) ? [] : attributes.vertices;
	}
	else if (this.shape == "path") {
		this.vertices = (attributes.vertices === undefined) ? "" : attributes.vertices;
	}
	else if (this.shape == "text") {
		this.offsetX = (attributes.offsetX === undefined) ? 0 : attributes.offsetX;
		this.offsetY = (attributes.offsetY === undefined) ? 0 : attributes.offsetY;
		this.size = (attributes.size === undefined) ? 12 : attributes.size;
		this.font = (attributes.font === undefined) ? "Helvetica" : attributes.font;
		this.bold = (attributes.bold === undefined) ? false : attributes.bold;
		this.italic = (attributes.italic === undefined) ? false : attributes.italic;
		this.underline = (attributes.underline === undefined) ? false : attributes.underline;
		this.centerAt = (attributes.centerAt === undefined) ? "center center" : attributes.centerAt;
		this.content = (attributes.content === undefined) ? "" : attributes.content;
	}
	else if (this.shape == "svg") {
		this.offsetX = (attributes.offsetX === undefined) ? 0 : attributes.offsetX;
		this.offsetY = (attributes.offsetY === undefined) ? 0 : attributes.offsetY;
		this.hscale = (attributes.hscale === undefined) ? 1 : attributes.hscale;
		this.vscale = (attributes.vscale === undefined) ? 1 : attributes.vscale;
		this.centerAt = (attributes.centerAt === undefined) ? "center center" : attributes.centerAt;
		this.url = (attributes.url === undefined) ? "" : attributes.url;
		this.ready = false;
		$.ajax({
			type: "GET",
			url: this.url,
			dataType: "xml"
		}).done($.proxy(function(response) {
			var svg = response.getElementsByTagName("svg")[0];
			this.width = svg.getAttribute("width");
			this.height = svg.getAttribute("height");
			if (this.width.indexOf("px") >= 0) this.width = this.width.substring(0, this.width.indexOf("px"));
			if (this.height.indexOf("px") >= 0) this.height = this.height.substring(0, this.height.indexOf("px"));
			var paths = svg.getElementsByTagName("path");
			this.paths = [];
			for (var n = 0; n < paths.length; n++) {
				var path = {};
				path.id = paths[n].getAttribute("id");
				path.instructions = ZUI.Parser.pathToObj(paths[n].getAttribute("d"));
				this.paths.push(path);
			}
			this.ready = true;
		}, this));
	}
	else if (this.shape == "advshape") {
		this.offsetX = (attributes.offsetX === undefined) ? 0 : attributes.offsetX;
		this.offsetY = (attributes.offsetY === undefined) ? 0 : attributes.offsetY;
		this.rawPaths = (attributes.paths === undefined) ? [] : attributes.paths;
		this.paths = [];
		for (var n = 0; n < this.rawPaths.length; n++) {
			var path = {};
			path.instructions = ZUI.Parser.pathToObj(this.rawPaths[n]);
			var start, end;
			for (var m = 0; m < path.instructions.length; m++) {
				if (path.instructions[m].args.length >= 2) {
					start = {
						x: path.instructions[m].args[path.instructions[m].args.length - 2],
						y: path.instructions[m].args[path.instructions[m].args.length - 1]
					};
					break;
				}
			}
			for (var m = path.instructions.length - 1; m >= 0; m--) {
				if (path.instructions[m].args.length >= 2) {
					end = {
						x: path.instructions[m].args[path.instructions[m].args.length - 2],
						y: path.instructions[m].args[path.instructions[m].args.length - 1]
					};
					break;
				}
			}
			if (start.x != end.x || start.y != end.y) {
				path.closed = false;
			}
			else {
				path.closed = true;
			}
			this.paths.push(path);
		}
	}
	else return null;

	/* Set stroke and fill */
	this.stroke = (attributes.stroke === undefined) ? true : attributes.stroke;
	this.strokeColor = (attributes.strokeColor === undefined) ? "#000000" : attributes.strokeColor;
	this.strokeWidth = (attributes.strokeWidth === undefined) ? 1 : attributes.strokeWidth;
	this.fill = (attributes.fill === undefined) ? true : attributes.fill;
	this.fillColor = (attributes.fillColor === undefined) ? "#000000" : attributes.fillColor;
	this.alpha = (attributes.alpha === undefined) ? 1 : attributes.alpha;

	/* Set scale */
	this.positionScale = (attributes.positionScale === undefined) ? "world" : attributes.positionScale;
	this.sizeScale = (attributes.sizeScale === undefined) ? "world" : attributes.sizeScale;

	/* Set autoDraw option */
	this.autoDraw = (attributes.autoDraw === undefined) ? false : attributes.autoDraw;

	/* On screen status */
	this.isOnScreen = false;
	
	/* Define event handlers */
	this.leftMouseDown = (attributes.leftMouseDown === undefined) ? function() {} : attributes.leftMouseDown;
	this.middleMouseDown = (attributes.middleMouseDown === undefined) ? function() {} : attributes.middleMouseDown;
	this.rightMouseDown = (attributes.rightMouseDown === undefined) ? function() {} : attributes.rightMouseDown;
	this.leftMouseUp = (attributes.leftMouseUp === undefined) ? function() {} : attributes.leftMouseUp;
	this.middleMouseUp = (attributes.middleMouseUp === undefined) ? function() {} : attributes.middleMouseUp;
	this.rightMouseUp = (attributes.rightMouseUp === undefined) ? function() {} : attributes.rightMouseUp;
	this.mouseMove = (attributes.mouseMove === undefined) ? function() {} : attributes.mouseMove;
	this.leftClick = (attributes.leftClick === undefined) ? function() {} : attributes.leftClick;
	this.middleClick = (attributes.middleClick === undefined) ? function() {} : attributes.middleClick;
	this.rightClick = (attributes.rightClick === undefined) ? function() {} : attributes.rightClick;
	this.leftDoubleClick = (attributes.leftDoubleClick === undefined) ? function() {} : attributes.leftDoubleClick;
	this.middleDoubleClick = (attributes.middleDoubleClick === undefined) ? function() {} : attributes.middleDoubleClick;
	this.mouseWheel = (attributes.mouseWheel === undefined) ? function() {} : attributes.mouseWheel;
	this.contextMenu = (attributes.contextMenu === undefined) ? function() {} : attributes.contextMenu;
	this.mouseOver = (attributes.mouseOver === undefined) ? function() {} : attributes.mouseOver;
	this.mouseOut = (attributes.mouseOut === undefined) ? function() {} : attributes.mouseOut;
};

/* Draw */
ZUI.ViewObject.prototype.draw = function() {
	if (this.shape == "rect") {
		ZUI.context.save();
		ZUI.context.strokeStyle = this.strokeColor;
		ZUI.context.fillStyle = this.fillColor;
		ZUI.context.globalAlpha = this.alpha;
		if (this.positionScale == "world") {
			var position = ZUI.camera.projectPoint(this.x, this.y);
			this.screenX = position.x;
			this.screenY = position.y;
		}
		else if (this.positionScale == "screen") {
			this.screenX = this.x;
			this.screenY = this.y;
		}
		if (this.sizeScale == "world") {
			this.screenOffsetX = ZUI.camera.projectDistance(this.offsetX);
			this.screenOffsetY = ZUI.camera.projectDistance(this.offsetY);
			this.screenWidth = ZUI.camera.projectDistance(this.width);
			this.screenHeight = ZUI.camera.projectDistance(this.height);
			this.screenLtradius = ZUI.camera.projectDistance(this.ltradius);
			this.screenRtradius = ZUI.camera.projectDistance(this.rtradius);
			this.screenLbradius = ZUI.camera.projectDistance(this.lbradius);
			this.screenRbradius = ZUI.camera.projectDistance(this.rbradius);
			ZUI.context.lineWidth = ZUI.camera.projectDistance(this.strokeWidth);
		}
		else if (this.sizeScale == "screen") {
			this.screenOffsetX = this.offsetX;
			this.screenOffsetY = this.offsetY;
			this.screenWidth = this.width;
			this.screenHeight = this.height;
			this.screenLtradius = this.ltradius;
			this.screenRtradius = this.rtradius;
			this.screenLbradius = this.lbradius;
			this.screenRbradius = this.rbradius;
			ZUI.context.lineWidth = this.strokeWidth;
		}
		if (this.screenLtradius > this.screenWidth / 2) this.screenLtradius = this.screenWidth / 2;
		if (this.screenLtradius > this.screenHeight / 2) this.screenLtradius = this.screenHeight / 2;
		if (this.screenRtradius > this.screenWidth / 2) this.screenRtradius = this.screenWidth / 2;
		if (this.screenRtradius > this.screenHeight / 2) this.screenRtradius = this.screenHeight / 2;
		if (this.screenLbradius > this.screenWidth / 2) this.screenLbradius = this.screenWidth / 2;
		if (this.screenLbradius > this.screenHeight / 2) this.screenLbradius = this.screenHeight / 2;
		if (this.screenRbradius > this.screenWidth / 2) this.screenRbradius = this.screenWidth / 2;
		if (this.screenRbradius > this.screenHeight / 2) this.screenRbradius = this.screenHeight / 2;
		var screenX, screenY;
		var centerAt = this.centerAt.split(" ");
		if (centerAt[0] == "left") {
			screenX = 0;
		}
		else if (centerAt[0] == "center") {
			screenX = -this.screenWidth / 2;
		}
		else if (centerAt[0] == "right") {
			screenX = -this.screenWidth;
		}
		screenX += this.screenX + this.screenOffsetX;
		if (centerAt[1] == "top") {
			screenY = 0;
		}
		else if (centerAt[1] == "center") {
			screenY = -this.screenHeight / 2;
		}
		else if (centerAt[1] == "bottom") {
			screenY = -this.screenHeight;
		}
		screenY += this.screenY + this.screenOffsetY;
		ZUI.context.beginPath();
		ZUI.context.moveTo(screenX + this.screenLtradius, screenY);
		ZUI.context.arcTo(screenX + this.screenWidth, screenY, screenX + this.screenWidth, screenY + this.screenHeight, this.screenRtradius);
		ZUI.context.arcTo(screenX + this.screenWidth, screenY + this.screenHeight, screenX, screenY + this.screenHeight, this.screenRbradius);
		ZUI.context.arcTo(screenX, screenY + this.screenHeight, screenX, screenY, this.screenLbradius);
		ZUI.context.arcTo(screenX, screenY, screenX + this.screenWidth, screenY, this.screenLtradius);
		ZUI.context.closePath();
		if (ZUI.activeView.viewObjects && ZUI.activeView.viewObjects.indexOf(this) >= 0) {
			this.mouseIntersect = ZUI.context.isPointInPath(ZUI.mouseStatus.x, ZUI.mouseStatus.y);
		}
		if (this.stroke) {
			ZUI.context.stroke();
		}
		if (this.fill) {
			ZUI.context.fill();
		}
		ZUI.context.restore();
		this.isOnScreen = true;
	}
	else if (this.shape == "circle") {
		ZUI.context.save();
		ZUI.context.strokeStyle = this.strokeColor;
		ZUI.context.fillStyle = this.fillColor;
		ZUI.context.globalAlpha = this.alpha;
		if (this.positionScale == "world") {
			var position = ZUI.camera.projectPoint(this.x, this.y);
			this.screenX = position.x;
			this.screenY = position.y;
		}
		else if (this.positionScale == "screen") {
			this.screenX = this.x;
			this.screenY = this.y;
		}
		if (this.sizeScale == "world") {
			this.screenOffsetX = ZUI.camera.projectDistance(this.offsetX);
			this.screenOffsetY = ZUI.camera.projectDistance(this.offsetY);
			this.screenHradius = ZUI.camera.projectDistance(this.hradius);
			this.screenVradius = ZUI.camera.projectDistance(this.vradius);
			ZUI.contex.lineWidth = ZUI.camera.projectDistance(this.strokeWidth);
		}
		else if (this.sizeScale == "screen") {
			this.screenOffsetX = this.offsetX;
			this.screenOffsetY = this.offsetY;
			this.screenHradius = this.hradius;
			this.screenVradius = this.vradius;
			ZUI.context.lineWidth = this.strokeWidth;
		}
		var screenX, screenY;
		var centerAt = this.centerAt.split(" ");
		if (centerAt[0] == "left") {
			screenX = this.screenHradius / 2;
		}
		else if (centerAt[0] == "center") {
			screenX = 0;
		}
		else if (centerAt[0] == "right") {
			screenX = -this.screenHradius / 2;
		}
		screenX += this.screenX + this.screenOffsetX;
		if (centerAt[1] == "top") {
			screenY = this.screenVradius / 2;
		}
		else if (centerAt[1] == "center") {
			screenY = 0;
		}
		else if (centerAt[1] == "bottom") {
			screenY = -this.screenVradius / 2;
		}
		screenY += this.screenY + this.screenOffsetY;
		ZUI.context.save();
		ZUI.context.translate(screenX, screenY);
		ZUI.context.scale(this.screenHradius, this.screenVradius);
		ZUI.context.beginPath();
		ZUI.context.arc(0, 0, 1, 0, 2 * Math.PI);
		ZUI.context.closePath();
		if (ZUI.activeView.viewObjects && ZUI.activeView.viewObjects.indexOf(this) >= 0) {
			this.mouseIntersect = ZUI.context.isPointInPath(ZUI.mouseStatus.x, ZUI.mouseStatus.y);
		}
		ZUI.context.restore();
		if (this.stroke) {
			ZUI.context.stroke();
		}
		if (this.fill) {
			ZUI.context.fill();
		}
		ZUI.context.restore();
		this.isOnScreen = true;
	}
	else if (this.shape == "polygon") {
		ZUI.context.save();
		ZUI.context.strokeStyle = this.strokeColor;
		ZUI.context.fillStyle = this.fillColor;
		ZUI.context.globalAlpha = this.alpha;
		if (this.positionScale == "world") {
			var position = ZUI.camera.projectPoint(this.x, this.y);
			this.screenX = position.x;
			this.screenY = position.y;
		}
		else if (this.positionScale == "screen") {
			this.screenX = this.x;
			this.screenY = this.y;
		}
		if (this.sizeScale == "world") {
			this.screenVertices = [];
			for (var n = 0; n < this.vertices.length; n++) {
				this.screenVertices.push({
					x: ZUI.camera.projectDistance(this.vertices[n].x),
					y: ZUI.camera.projectDistance(this.vertices[n].y)
				});
			}
			ZUI.context.lineWidth = ZUI.camera.projectDistance(this.strokeWidth);
		}
		else if (this.sizeScale == "screen") {
			this.screenVertices = [];
			for (var n = 0; n < this.vertices.length; n++) {
				this.screenVertices.push({
					x: this.vertices[n].x,
					y: this.vertices[n].y
				});
			}
			ZUI.context.lineWidth = this.strokeWidth;
		}
		ZUI.context.translate(this.screenX, this.screenY);
		ZUI.context.beginPath();
		ZUI.context.moveTo(this.screenVertices[this.screenVertices.length - 1].x, this.screenVertices[this.screenVertices.length - 1].y);
		for (var n = 0; n < this.screenVertices.length; n++) {
			ZUI.context.lineTo(this.screenVertices[n].x, this.screenVertices[n].y);
		}
		ZUI.context.closePath();
		if (ZUI.activeView.viewObjects && ZUI.activeView.viewObjects.indexOf(this) >= 0) {
			this.mouseIntersect = ZUI.context.isPointInPath(ZUI.mouseStatus.x, ZUI.mouseStatus.y);
		}
		if (this.stroke) {
			ZUI.context.stroke();
		}
		if (this.fill) {
			ZUI.context.fill();
		}
		ZUI.context.restore();
		this.isOnScreen = true;
	}
	else if (this.shape == "path") {
		ZUI.context.save();
		ZUI.context.strokeStyle = this.strokeColor;
		ZUI.context.globalAlpha = this.alpha;
		if (this.positionScale == "world") {
			var position = ZUI.camera.projectPoint(this.x, this.y);
			this.screenX = position.x;
			this.screenY = position.y;
		}
		else if (this.positionScale == "screen") {
			this.screenX = this.x;
			this.screenY = this.y;
		}
		if (this.sizeScale == "world") {
			this.screenVertices = [];
			for (var n = 0; n < this.vertices.length; n++) {
				this.screenVertices.push({
					x: ZUI.camera.projectDistance(this.vertices[n].x),
					y: ZUI.camera.projectDistance(this.vertices[n].y)
				});
			}
			ZUI.context.lineWidth = ZUI.camera.projectDistance(this.strokeWidth);
		}
		else if (this.sizeScale == "screen") {
			this.screenVertices = [];
			for (var n = 0; n < this.vertices.length; n++) {
				this.screenVertices.push({
					x: this.vertices[n].x,
					y: this.vertices[n].y
				});
			}
			ZUI.context.lineWidth = this.strokeWidth;
		}
		ZUI.context.translate(this.screenX, this.screenY);
		ZUI.context.beginPath();
		ZUI.context.moveTo(this.screenVertices[0].x, this.screenVertices[0].y);
		for (var n = 1; n < this.screenVertices.length; n++) {
			ZUI.context.lineTo(this.screenVertices[n].x, this.screenVertices[n].y);
		}
		if (this.stroke) {
			ZUI.context.stroke();
		}
		ZUI.context.closePath();
		ZUI.context.restore();
		this.isOnScreen = true;
	}
	else if (this.shape == "text") {
		ZUI.context.save();
		ZUI.context.font = ((this.bold) ? "bold " : "") + ((this.italic) ? "italic " : "") + this.size + "px " + this.font;
		this.width = ZUI.context.measureText(this.content).width;
		this.height = this.size * 0.8;
		ZUI.context.strokeStyle = this.strokeColor;
		ZUI.context.lineWidth = this.strokeWidth;
		ZUI.context.fillStyle = this.fillColor;
		ZUI.context.globalAlpha = this.alpha;
		if (this.positionScale == "world") {
			var position = ZUI.camera.projectPoint(this.x, this.y);
			this.screenX = position.x;
			this.screenY = position.y;
		}
		else if (this.positionScale == "screen") {
			this.screenX = this.x;
			this.screenY = this.y;
		}
		if (this.sizeScale == "world") {
			this.screenOffsetX = ZUI.camera.projectDistance(this.offsetX);
			this.screenOffsetY = ZUI.camera.projectDistance(this.offsetY);
			this.screenSize = ZUI.camera.projectDistance(this.size);
			this.screenWidth = ZUI.camera.projectDistance(this.width);
			this.screenHeight = ZUI.camera.projectDistance(this.height);
		}
		else if (this.sizeScale == "screen") {
			this.screenOffsetX = this.offsetX;
			this.screenOffsetY = this.offsetY;
			this.screenSize = this.size;
			this.screenWidth = this.width;
			this.screenHeight = this.height;
		}
		var screenX, screenY;
		var centerAt = this.centerAt.split(" ");
		if (centerAt[0] == "left") {
			screenX = 0;
		}
		else if (centerAt[0] == "center") {
			screenX = -this.screenWidth / 2;
		}
		else if (centerAt[0] == "right") {
			screenX = -this.screenWidth;
		}
		screenX += this.screenX + this.screenOffsetX;
		if (centerAt[1] == "top") {
			screenY = this.screenHeight;
		}
		else if (centerAt[1] == "center") {
			screenY = this.screenHeight / 2;
		}
		else if (centerAt[1] == "bottom") {
			screenY = 0;
		}
		screenY += this.screenY + this.screenOffsetY;
		if (this.fill) {
			ZUI.context.fillText(this.content, screenX, screenY);
		}
		else if (this.stroke) {
			ZUI.context.strokeText(this.content, screenX, screenY);
		}
		if (this.underline) {
			ZUI.context.beginPath();
			ZUI.context.moveTo(screenX, Math.round(screenY) + 1.5);
			ZUI.context.lineTo(screenX + this.screenWidth, Math.round(screenY) + 1.5);
			ZUI.context.stroke();
		}
		ZUI.context.restore();
		this.isOnScreen = true;
	}
	else if (this.shape == "svg" && this.ready) {
		ZUI.context.save();
		ZUI.context.strokeStyle = this.strokeColor;
		ZUI.context.fillStyle = this.fillColor;
		ZUI.context.globalAlpha = this.alpha;
		if (this.positionScale == "world") {
			var position = ZUI.camera.projectPoint(this.x, this.y);
			this.screenX = position.x;
			this.screenY = position.y;
		}
		else if (this.positionScale == "screen") {
			this.screenX = this.x;
			this.screenY = this.y;
		}
		if (this.sizeScale == "world") {
			this.screenOffsetX = ZUI.camera.projectDistance(this.offsetX);
			this.screenOffsetY = ZUI.camera.projectDistance(this.offsetY);
			this.screenWidth = ZUI.camera.projectDistance(this.width) * this.hscale;
			this.screenHeight = ZUI.camera.projectDistance(this.height) * this.vscale;
			ZUI.context.lineWidth = ZUI.camera.projectDistance(this.strokeWidth);
		}
		else if (this.sizeScale == "screen") {
			this.screenOffsetX = this.offsetX;
			this.screenOffsetY = this.offsetY;
			this.screenWidth = this.width * this.hscale;
			this.screenHeight = this.height * this.vscale;
			ZUI.context.lineWidth = this.strokeWidth;
		}
		var screenX, screenY;
		var centerAt = this.centerAt.split(" ");
		if (centerAt[0] == "left") {
			screenX = 0;
		}
		else if (centerAt[0] == "center") {
			screenX = -this.screenWidth / 2;
		}
		else if (centerAt[0] == "right") {
			screenX = -this.screenWidth;
		}
		screenX += this.screenX + this.screenOffsetX;
		if (centerAt[1] == "top") {
			screenY = 0;
		}
		else if (centerAt[1] == "center") {
			screenY = -this.screenHeight / 2;
		}
		else if (centerAt[1] == "bottom") {
			screenY = -this.screenHeight;
		}
		screenY += this.screenY + this.screenOffsetY;
		ZUI.context.save();
		ZUI.context.translate(screenX, screenY);
		ZUI.context.scale(this.screenWidth / this.width, this.screenHeight / this.height);
		ZUI.context.beginPath();
		for (var n = 0; n < this.paths.length; n++) {
			var instructions = this.paths[n].instructions;
			for (var m = 0; m < instructions.length; m++) {
				ZUI.context[instructions[m].instruction].apply(ZUI.context, instructions[m].args);
			}
		}
		ZUI.context.restore();
		if (this.stroke) {
			ZUI.context.stroke();
		}
		ZUI.context.restore();
		this.isOnScreen = true;
	}
	else if (this.shape == "advshape") {
		ZUI.context.save();
		ZUI.context.strokeStyle = this.strokeColor;
		ZUI.context.fillStyle = this.fillColor;
		ZUI.context.globalAlpha = this.alpha;
		if (this.positionScale == "world") {
			var position = ZUI.camera.projectPoint(this.x, this.y);
			this.screenX = position.x;
			this.screenY = position.y;
		}
		else if (this.positionScale == "screen") {
			this.screenX = this.x;
			this.screenY = this.y;
		}
		if (this.sizeScale == "world") {
			for (var n = 0; n < this.paths.length; n++) {
				var path = this.paths[n];
				for (var m = 0; m < path.instructions.length; m++) {
					var _instruction = path.instructions[m];
					var instruction = _instruction.instruction;
					var args = _instruction.args;
					_instruction.screenPoints = [];
					if (instruction == "moveTo") {
						_instruction.screenPoints.push(ZUI.camera.projectPoint(args[0] + this.x, args[1] + this.y));
					}
					else if (instruction == "lineTo") {
						_instruction.screenPoints.push(ZUI.camera.projectPoint(args[0] + this.x, args[1] + this.y));
					}
					else if (instruction == "quadraticCurveTo") {
						_instruction.screenPoints.push(ZUI.camera.projectPoint(args[0] + this.x, args[1] + this.y));
						_instruction.screenPoints.push(ZUI.camera.projectPoint(args[2] + this.x, args[3] + this.y));
					}
					else if (instruction == "bezierCurveTo") {
						_instruction.screenPoints.push(ZUI.camera.projectPoint(args[0] + this.x, args[1] + this.y));
						_instruction.screenPoints.push(ZUI.camera.projectPoint(args[2] + this.x, args[3] + this.y));
						_instruction.screenPoints.push(ZUI.camera.projectPoint(args[4] + this.x, args[5] + this.y));
					}
					for (var o = 0; o + 1 < _instruction.screenPoints.length; o += 2) {
						_instruction.screenPoints[o].x += this.offsetX;
						_instruction.screenPoints[o].y += this.offsetY;
					}
				}
			}
			ZUI.context.lineWidth = ZUI.camera.projectDistance(this.strokeWidth);
		}
		else if (this.sizeScale == "screen") {
			for (var n = 0; n < this.paths.length; n++) {
				var path = this.paths[n];
				for (var m = 0; m < path.instructions.length; m++) {
					var _instruction = path.instructions[m];
					var instruction = _instruction.instruction;
					var args = _instruction.args;
					_instruction.screenPoints = [];
					if (instruction == "moveTo") {
						_instruction.screenPoints.push({x: args[0] + this.x, y: args[1] + this.y});
					}
					else if (instruction == "lineTo") {
						_instruction.screenPoints.push({x: args[0] + this.x, y: args[1] + this.y});
					}
					else if (instruction == "quadraticCurveTo") {
						_instruction.screenPoints.push({x: args[0] + this.x, y: args[1] + this.y});
						_instruction.screenPoints.push({x: args[2] + this.x, y: args[3] + this.y});
					}
					else if (instruction == "bezierCurveTo") {
						_instruction.screenPoints.push({x: args[0] + this.x, y: args[1] + this.y});
						_instruction.screenPoints.push({x: args[2] + this.x, y: args[3] + this.y});
						_instruction.screenPoints.push({x: args[4] + this.x, y: args[5] + this.y});
					}
					for (var o = 0; o < _instruction.screenPoints.length; o++) {
						_instruction.screenPoints[o].x += this.offsetX;
						_instruction.screenPoints[o].y += this.offsetY;
					}
				}
			}
			ZUI.context.lineWidth = this.strokeWidth;
		}
		ZUI.context.save();
		ZUI.context.beginPath();
		for (var n = 0; n < this.paths.length; n++) {
			if (!this.paths[n].closed) continue;
			var instructions = this.paths[n].instructions;
			for (var m = 0; m < instructions.length; m++) {
				var args = [];
				for (var o = 0; o < instructions[m].screenPoints.length; o++) {
					args.push(instructions[m].screenPoints[o].x);
					args.push(instructions[m].screenPoints[o].y);
				}
				ZUI.context[instructions[m].instruction].apply(ZUI.context, args);
			}
		}
		if (ZUI.activeView.viewObjects && ZUI.activeView.viewObjects.indexOf(this) >= 0) {
			this.mouseIntersect = ZUI.context.isPointInPath(ZUI.mouseStatus.x, ZUI.mouseStatus.y);
		}
		ZUI.context.restore();
		if (this.stroke) {
			ZUI.context.stroke();
		}
		if (this.fill) {
			ZUI.context.fill();
		}
		ZUI.context.save();
		ZUI.context.beginPath();
		for (n = 0; n < this.paths.length; n++) {
			if (this.paths[n].closed) continue;
			var instructions = this.paths[n].instructions;
			for (var m = 0; m < instructions.length; m++) {
				var args = [];
				for (var o = 0; o < instructions[m].screenPoints.length; o++) {
					args.push(instructions[m].screenPoints[o].x);
					args.push(instructions[m].screenPoints[o].y);
				}
				ZUI.context[instructions[m].instruction].apply(ZUI.context, args);
			}
		}
		if (this.stroke) {
			ZUI.context.stroke();
		}
		ZUI.context.restore();
		this.isOnScreen = true;
	}
};

/* Checks whether the given coordinate pair is inside the view object */
ZUI.ViewObject.prototype.isInBound = function(x, y) {
	if (!this.isOnScreen) return false;
	if (this.shape == "rect") {
		return this.mouseIntersect;
	}
	else if (this.shape == "circle") {
		return this.mouseIntersect;
	}
	else if (this.shape == "polygon") {
		return this.mouseIntersect;
	}
	else if (this.shape == "text") {
		var screenX, screenY;
		var centerAt = this.centerAt.split(" ");
		if (centerAt[0] == "left") {
			screenX = 0;
		}
		else if (centerAt[0] == "center") {
			screenX = -this.screenWidth / 2;
		}
		else if (centerAt[0] == "right") {
			screenX = -this.screenWidth;
		}
		screenX += this.screenX + this.screenOffsetX;
		if (centerAt[1] == "top") {
			screenY = 0;
		}
		else if (centerAt[1] == "center") {
			screenY = -this.screenHeight / 2;
		}
		else if (centerAt[1] == "bottom") {
			screenY = -this.screenHeight;
		}
		screenY += this.screenY + this.screenOffsetY;
		if (x < screenX) return false;
		if (x > screenX + this.screenWidth) return false;
		if (y < screenY) return false;
		if (y > screenY + this.screenHeight) return false;
		return true;
	}
	else if (this.shape == "svg") {
		var screenX, screenY;
		var centerAt = this.centerAt.split(" ");
		if (centerAt[0] == "left") {
			screenX = 0;
		}
		else if (centerAt[0] == "center") {
			screenX =  -this.screenWidth / 2;
		}
		else if (centerAt[0] == "right") {
			screenX = -this.screenWidth;
		}
		screenX += this.screenX + this.screenOffsetX;
		if (centerAt[1] == "top") {
			screenY = 0;
		}
		else if (centerAt[1] == "center") {
			screenY = -this.screenHeight / 2;
		}
		else if (centerAt[1] == "bottom") {
			screenY = -this.screenHeight;
		}
		screenY += this.screenY + this.screenOffsetY;
		if (x < screenX) return false;
		if (x > screenX + this.screenWidth) return false;
		if (y < screenY) return false;
		if (y > screenY + this.screenHeight) return false;
		return true;
	}
	else if (this.shape == "advshape") {
		return this.mouseIntersect;
	}
	return false;
};
