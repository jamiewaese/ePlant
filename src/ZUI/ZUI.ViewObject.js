/**
 * ViewObject class for ZUI framework
 * By Hans Yu
 */

/* Class constructor */
ZUI.ViewObject = function(attributes) {
	/* Append self to ZUI's global view objects array */
	ZUI.viewObjects.push(this);

	/* Get shape */
	if (!attributes.shape) return null;
	this.shape = attributes.shape;

	/* Object for custom data */
	this.data = {};

	/* Redraw status */
	this.redraw = true;

	/* On screen status */
	this.isOnScreen = false;

	/* Autodraw status */
	this.autoDraw = (attributes.autoDraw === undefined) ? false : attributes.autoDraw;

	/* Cache canvas */
	this.cache = document.createElement("canvas");
	this.cache.width = ZUI.width;
	this.cache.height = ZUI.height;
	this.cacheContext = this.cache.getContext("2d");

	/* Private attributes */
	this.private = {};

	/* General attributes */
	/* Scale of position, can be "world" or "screen" */
	this.private.positionScale = (attributes.positionScale === undefined) ? "world" : attributes.positionScale;
	Object.defineProperty(this, "positionScale", {
		get: function() {
			return this.private.positionScale;
		},
		set: function(value) {
			this.private.positionScale = value;
			this.redraw = true;
		}
	});

	/* Scale of size, can be "world" or "screen" */
	this.private.sizeScale = (attributes.sizeScale === undefined) ? "world" : attributes.sizeScale;
	Object.defineProperty(this, "sizeScale", {
		get: function() {
			return this.private.sizeScale;
		},
		set: function(value) {
			this.private.sizeScale = value;
			this.redraw = true;
		}
	});

	/* x coordinate */
	this.private.x = (attributes.x === undefined) ? 0 : attributes.x;
	Object.defineProperty(this, "x", {
		get: function() {
			return this.private.x;
		},
		set: function(value) {
			this.private.x = value;
			this.redraw = true;
		}
	});

	/* y coordinate */
	this.private.y = (attributes.y === undefined) ? 0 : attributes.y;
	Object.defineProperty(this, "y", {
		get: function() {
			return this.private.y;
		},
		set: function(value) {
			this.private.y = value;
			this.redraw = true;
		}
	});

	/* x offset affected by sizeScale */
	this.private.offsetX = (attributes.offsetX === undefined) ? 0 : attributes.offsetX;
	Object.defineProperty(this, "offsetX", {
		get: function() {
			return this.private.offsetX;
		},
		set: function(value) {
			this.private.offsetX = value;
			this.redraw = true;
		}
	});

	/* y offset affected by sizeScale */
	this.private.offsetY = (attributes.offsetY === undefined) ? 0 : attributes.offsetY;
	Object.defineProperty(this, "offsetY", {
		get: function() {
			return this.private.offsetY;
		},
		set: function(value) {
			this.private.offsetY = value;
			this.redraw = true;
		}
	});

	/* Whether to stroke */
	this.private.stroke = (attributes.stroke === undefined) ? ((this.shape == "text" || this.shape == "multilinetext") ? false : true) : attributes.stroke;
	Object.defineProperty(this, "stroke", {
		get: function() {
			return this.private.stroke;
		},
		set: function(value) {
			this.private.stroke = value;
			this.redraw = true;
		}
	});

	/* Color of stroke */
	this.private.strokeColor = (attributes.strokeColor === undefined) ? "#000000" : attributes.strokeColor;
	Object.defineProperty(this, "strokeColor", {
		get: function() {
			return this.private.strokeColor;
		},
		set: function(value) {
			this.private.strokeColor = value;
			this.redraw = true;
		}
	});

	/* Width of stroke */
	this.private.strokeWidth = (attributes.strokeWidth === undefined) ? 1 : attributes.strokeWidth;
	Object.defineProperty(this, "strokeWidth", {
		get: function() {
			return this.private.strokeWidth;
		},
		set: function(value) {
			this.private.strokeWidth = value;
			this.redraw = true;
		}
	});

	/* Whether to fill */
	this.private.fill = (attributes.fill === undefined) ? true : attributes.fill;
	Object.defineProperty(this, "fill", {
		get: function() {
			return this.private.fill;
		},
		set: function(value) {
			this.private.fill = value;
			this.redraw = true;
		}
	});

	/* Color of fill */
	this.private.fillColor = (attributes.fillColor === undefined) ? "#000000" : attributes.fillColor;
	Object.defineProperty(this, "fillColor", {
		get: function() {
			return this.private.fillColor;
		},
		set: function(value) {
			this.private.fillColor = value;
			this.redraw = true;
		}
	});

	/* Alpha value */
	this.private.alpha = (attributes.alpha === undefined) ? 1 : attributes.alpha;
	Object.defineProperty(this, "alpha", {
		get: function() {
			return this.private.alpha;
		},
		set: function(value) {
			this.private.alpha = value;
			this.redraw = true;
		}
	});

	/* Center at position */
	this.private.centerAt = (attributes.centerAt === undefined) ? "center center" : attributes.centerAt;
	Object.defineProperty(this, "centerAt", {
		get: function() {
			return this.private.centerAt;
		},
		set: function(value) {
			this.private.centerAt = value;
			this.redraw = true;
		}
	});

	if (this.shape == "rect") {
		this.private.width = (attributes.width === undefined) ? 0 : attributes.width;
		Object.defineProperty(this, "width", {
			get: function() {
				return this.private.width;
			},
			set: function(value) {
				this.private.width = value;
				this.redraw = true;
			}
		});

		this.private.height = (attributes.height === undefined) ? 0 : attributes.height;
		Object.defineProperty(this, "height", {
			get: function() {
				return this.private.height;
			},
			set: function(value) {
				this.private.height = value;
				this.redraw = true;
			}
		});

		if (attributes.radius === undefined) {
			this.private.ltradius = (attributes.ltradius === undefined) ? 0 : attributes.ltradius;
			this.private.rtradius = (attributes.rtradius === undefined) ? 0 : attributes.rtradius;
			this.private.lbradius = (attributes.lbradius === undefined) ? 0 : attributes.lbradius;
			this.private.rbradius = (attributes.rbradius === undefined) ? 0 : attributes.rbradius;
		}
		else {
			this.private.ltradius = attributes.radius;
			this.private.rtradius = attributes.radius;
			this.private.lbradius = attributes.radius;
			this.private.rbradius = attributes.radius;
		}
		Object.defineProperty(this, "radius", {
			get: function() {
				return (this.private.ltradius + this.private.rtradius + this.private.lbradius + this.private.rbradius) / 4;
			},
			set: function(value) {
				this.private.ltradius = value;
				this.private.rtradius = value;
				this.private.lbradius = value;
				this.private.rbradius = value;
				this.redraw = true;
			}
		});

		Object.defineProperty(this, "ltradius", {
			get: function() {
				return this.private.ltradius;
			},
			set: function(value) {
				this.private.ltradius = value;
				this.redraw = true;
			}
		});

		Object.defineProperty(this, "rtradius", {
			get: function() {
				return this.private.rtradius;
			},
			set: function(value) {
				this.private.rtradius = value;
				this.redraw = true;
			}
		});

		Object.defineProperty(this, "lbradius", {
			get: function() {
				return this.private.lbradius;
			},
			set: function(value) {
				this.private.lbradius = value;
				this.redraw = true;
			}
		});

		Object.defineProperty(this, "rbradius", {
			get: function() {
				return this.private.rbradius;
			},
			set: function(value) {
				this.private.rbradius = value;
				this.redraw = true;
			}
		});
	}
	else if (this.shape == "circle") {
		if (attributes.radius === undefined) {
			this.private.hradius = (attributes.hradius === undefined) ? 0 : attributes.hradius;
			this.private.vradius = (attributes.vradius === undefined) ? 0 : attributes.vradius;
		}
		else {
			this.private.hradius = attributes.radius;
			this.private.vradius = attributes.radius;
		}
		Object.defineProperty(this, "radius", {
			get: function() {
				return (this.private.hradius + this.private.vradius) / 2;
			},
			set: function(value) {
				this.private.hradius = value;
				this.private.vradius = value;
				this.redraw = true;
			}
		});

		Object.defineProperty(this, "hradius", {
			get: function() {
				return this.private.hradius;
			},
			set: function(value) {
				this.private.hradius = value;
				this.redraw = true;
			}
		});

		Object.defineProperty(this, "vradius", {
			get: function() {
				return this.private.vradius;
			},
			set: function(value) {
				this.private.vradius = value;
				this.redraw = true;
			}
		});
	}
	else if (this.shape == "polygon") {
		this.private.vertices = (attributes.vertices === undefined) ? [] : attributes.vertices;
		Object.defineProperty(this, "vertices", {
			get: function() {
				return this.private.vertices;
			},
			set: function(value) {
				this.private.vertices = value;
				this.redraw = true;
			}
		});
	}
	else if (this.shape == "path") {
		this.private.vertices = (attributes.vertices === undefined) ? [] : attributes.vertices;
		Object.defineProperty(this, "vertices", {
			get: function() {
				return this.private.vertices;
			},
			set: function(value) {
				this.private.vertices = value;
				this.redraw = true;
			}
		});
	}
	else if (this.shape == "text") {
		this.private.size = (attributes.size === undefined) ? 12 : attributes.size;
		Object.defineProperty(this, "size", {
			get: function() {
				return this.private.size;
			},
			set: function(value) {
				this.private.size = value;
				this.redraw = true;
			}
		});

		this.private.font = (attributes.font === undefined) ? "Helvetica" : attributes.font;
		Object.defineProperty(this, "font", {
			get: function() {
				return this.private.font;
			},
			set: function(value) {
				this.private.font = value;
				this.redraw = true;
			}
		});

		this.private.bold = (attributes.bold === undefined) ? false : attributes.bold;
		Object.defineProperty(this, "bold", {
			get: function() {
				return this.private.bold;
			},
			set: function(value) {
				this.private.bold = value;
				this.redraw = true;
			}
		});

		this.private.italic = (attributes.italic === undefined) ? false : attributes.italic;
		Object.defineProperty(this, "italic", {
			get: function() {
				return this.private.italic;
			},
			set: function(value) {
				this.private.italic = value;
				this.redraw = true;
			}
		});

		this.private.underline = (attributes.underline === undefined) ? false : attributes.underline;
		Object.defineProperty(this, "underline", {
			get: function() {
				return this.private.underline;
			},
			set: function(value) {
				this.private.underline = value;
				this.redraw = true;
			}
		});

		this.private.content = (attributes.content === undefined) ? [""] : attributes.content;
		Object.defineProperty(this, "content", {
			get: function() {
				return this.private.content;
			},
			set: function(value) {
				this.private.content = value;
				this.redraw = true;
			}
		});
	}
	else if (this.shape == "multilinetext") {
		this.private.size = (attributes.size === undefined) ? 12 : attributes.size;
		Object.defineProperty(this, "size", {
			get: function() {
				return this.private.size;
			},
			set: function(value) {
				this.private.size = value;
				for (var n = 0; n < this.private.texts.length; n++) {
					this.private.texts[n].size = value;
				}
				this.redraw = true;
			}
		});

		this.private.font = (attributes.font === undefined) ? "Helvetica" : attributes.font;
		Object.defineProperty(this, "font", {
			get: function() {
				return this.private.font;
			},
			set: function(value) {
				this.private.font = value;
				for (var n = 0; n < this.private.texts.length; n++) {
					this.private.texts[n].font = value;
				}
				this.redraw = true;
			}
		});

		this.private.bold = (attributes.bold === undefined) ? false : attributes.bold;
		Object.defineProperty(this, "bold", {
			get: function() {
				return this.private.bold;
			},
			set: function(value) {
				this.private.bold = value;
				for (var n = 0; n < this.private.texts.length; n++) {
					this.private.texts[n].bold = value;
				}
				this.redraw = true;
			}
		});

		this.private.italic = (attributes.italic === undefined) ? false : attributes.italic;
		Object.defineProperty(this, "italic", {
			get: function() {
				return this.private.italic;
			},
			set: function(value) {
				this.private.italic = value;
				for (var n = 0; n < this.private.texts.length; n++) {
					this.private.texts[n].bold = value;
				}
				this.redraw = true;
			}
		});

		this.private.underline = (attributes.underline === undefined) ? false : attributes.underline;
		Object.defineProperty(this, "underline", {
			get: function() {
				return this.private.underline;
			},
			set: function(value) {
				this.private.underline = value;
				for (var n = 0; n < this.private.texts.length; n++) {
					this.private.texts[n].underline = value;
				}
				this.redraw = true;
			}
		});

		this.private.content = (attributes.content === undefined) ? [""] : attributes.content.split("\n");
		Object.defineProperty(this, "content", {
			get: function() {
				return this.private.content;
			},
			set: function(value) {
				this.private.content = value.split("\n");
				this.redraw = true;

				/* Reset child text objects */
				var attributes = {
					shape: "text",
					positionScale: this.positionScale,
					sizeScale: this.sizeScale,
					x: this.x,
					y: this.y,
					offsetX: this.offsetX,
					offsetY: this.offsetY,
					stroke: this.stroke,
					strokeColor: this.strokeColor,
					strokeWidth: this.strokeWidth,
					fill: this.fill,
					fillColor: this.fillColor,
					alpha: this.alpha,
					centerAt: this.centerAt,
					size: this.size,
					font: this.font,
					bold: this.bold,
					italic: this.italic,
					underline: this.underline
				};
				this.private.texts = [];
				if (attributes.centerAt.split(" ")[1] == "center") attributes.y -= this.content.length * this.private.size / 2;
				else if (attributes.centerAt.split(" ")[1] == "bottom") attributes.y -= this.content.length * this.private.size;
				for (var n = 0; n < this.content.length; n++) {
					attributes.content = this.content[n];
					this.private.texts.push(new ZUI.ViewObject(attributes));
					attributes.y += this.private.size;
				}
			}
		});

		/* Create child text objects */
		this.private.texts = [];
		attributes.shape = "text";
		if (attributes.centerAt.split(" ")[1] == "center") attributes.y -= (this.content.length - 1) * this.private.size / 2;
		else if (attributes.centerAt.split(" ")[1] == "bottom") attributes.y -= (this.content.length - 1) * this.private.size;
		for (var n = 0; n < this.content.length; n++) {
			attributes.content = this.content[n];
			this.private.texts.push(new ZUI.ViewObject(attributes));
			attributes.y += this.private.size;
		}
	}
	else if (this.shape == "svg") {
		this.private.width = 0;
		Object.defineProperty(this, "width", {
			get: function() {
				return this.private.width;
			}
		});

		this.private.height = 0;
		Object.defineProperty(this, "height", {
			get: function() {
				return this.private.height;
			}
		});

		this.private.paths = [];
		Object.defineProperty(this, "paths", {
			get: function() {
				return this.private.paths;
			},
			set: function(value) {
				this.private.paths = value;
				this.redraw = true;
			}
		});

		this.private.hscale = (attributes.hscale === undefined) ? 1 : attributes.hscale;
		Object.defineProperty(this, "hscale", {
			get: function() {
				return this.private.hscale;
			},
			set: function(value) {
				this.private.hscale = value;
				this.redraw = true;
			}
		});

		this.private.vscale = (attributes.vscale === undefined) ? 1 : attributes.vscale;
		Object.defineProperty(this, "vscale", {
			get: function() {
				return this.private.vscale;
			},
			set: function(value) {
				this.private.vscale = value;
				this.redraw = true;
			}
		});

		this.private.url = (attributes.url === undefined) ? "" : attributes.url;
		Object.defineProperty(this, "url", {
			get: function() {
				return this.private.url;
			}
		});

		this.private.dataString = (attributes.dataString === undefined) ? null : attributes.dataString;
		Object.defineProperty(this, "dataString", {
			get: function() {
				return this.private.dataString;
			},
			set: function(value) {
				this.private.dataString = value;
				this.redraw = true;
			}
		});

		this.ready = false;
		if (!this.dataString) {
			$.ajax({
				type: "GET",
				url: this.url,
				dataType: "xml"
			}).done($.proxy(function(response) {
				var svg = response.getElementsByTagName("svg")[0];
				this.private.width = svg.getAttribute("width");
				this.private.height = svg.getAttribute("height");
				if (this.private.width.indexOf("px") >= 0) this.private.width = Number(this.private.width.substring(0, this.private.width.indexOf("px")));
				if (this.private.height.indexOf("px") >= 0) this.private.height = Number(this.private.height.substring(0, this.private.height.indexOf("px")));
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
		else {
			var xmlDoc = (new DOMParser()).parseFromString(this.dataString, "text/xml");
			var svg = response.getElementsByTagName("svg")[0];
			this.private.width = svg.getAttribute("width");
			this.private.height = svg.getAttribute("height");
			if (this.private.width.indexOf("px") >= 0) this.private.width = Number(this.private.width.substring(0, this.private.width.indexOf("px")));
			if (this.private.height.indexOf("px") >= 0) this.private.height = Number(this.private.height.substring(0, this.private.height.indexOf("px")));
			var paths = svg.getElementsByTagName("path");
			this.paths = [];
			for (var n = 0; n < paths.length; n++) {
				var path = {};
				path.id = paths[n].getAttribute("id");
				path.instructions = ZUI.Parser.pathToObj(paths[n].getAttribute("d"));
				this.paths.push(path);
			}
			this.ready = true;
		}
	}
	else if (this.shape == "advshape") {
		this.private.paths = [];
		Object.defineProperty(this, "paths", {
			get: function() {
				return this.private.paths;
			},
			set: function(value) {
				for (var n = 0; n < value.length; n++) {
					var path = {};
					path.instructions = ZUI.Parser.pathToObj(value[n]);
					this.private.paths.push(path);
				}
				this.redraw = true;
			}
		});
		this.private.rawPaths = (attributes.paths === undefined) ? [] : attributes.paths;
		this.paths = this.private.rawPaths;
	}
	else if (this.shape == "image") {
		this.private.width = 0;
		Object.defineProperty(this, "width", {
			get: function() {
				return this.private.width;
			}
		});

		this.private.height = 0;
		Object.defineProperty(this, "height", {
			get: function() {
				return this.private.height;
			}
		});

		this.private.hscale = (attributes.hscale === undefined) ? 1 : attributes.hscale;
		Object.defineProperty(this, "hscale", {
			get: function() {
				return this.private.hscale;
			},
			set: function(value) {
				this.private.hscale = value;
				this.redraw = true;
			}
		});

		this.private.vscale = (attributes.vscale === undefined) ? 1 : attributes.vscale;
		Object.defineProperty(this, "vscale", {
			get: function() {
				return this.private.vscale;
			},
			set: function(value) {
				this.private.vscale = value;
				this.redraw = true;
			}
		});

		this.private.url = (attributes.url === undefined) ? "" : attributes.url;
		Object.defineProperty(this, "url", {
			get: function() {
				return this.private.url;
			}
		});

		this.private.type = "";
		var index = this.url.lastIndexOf(".");
		if (index > -1) {
			this.private.type = this.url.substring(index);
		}
		if (attributes.type !== undefined) {
			this.private.type = attributes.type;
		}
		Object.defineProperty(this, "type", {
			get: function() {
				return this.private.type;
			}
		});

		this.private.dataString = (attributes.dataString === undefined) ? null : attributes.dataString;
		Object.defineProperty(this, "dataString", {
			get: function() {
				return this.private.dataString;
			},
			set: function(value) {
				this.private.dataString = value;
				this.redraw = true;
			}
		});

		this.private.image = new Image();
		Object.defineProperty(this, "image", {
			get: function() {
				return this.private.image;
			}
		});

		this.ready = false;
		this.image.onload = (function() {
			this.private.width = this.image.width;
			this.private.height = this.image.height;
			this.ready = true;
		}).bind(this);
		if (!this.dataString) {
			this.image.src = this.url;
		}
		else {
			this.image.src = "data:image/" + this.type + ";base64," + this.dataString;
		}
	}
	else {
		return null;
	}
	
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
ZUI.ViewObject.prototype.draw = function(canvasContext) {
	var context = canvasContext || ZUI.context;
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
			ZUI.context.lineWidth = ZUI.camera.projectDistance(this.strokeWidth);
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
			this.screenSize = ZUI.camera.projectDistance(this.size);
			ZUI.context.font = ((this.bold) ? "bold " : "") + ((this.italic) ? "italic " : "") + "24" + "px " + this.font;
			this.screenWidth = ZUI.context.measureText(this.content).width / 24 * this.screenSize;
			this.height = this.size * 0.8;
			this.width = ZUI.camera.unprojectDistance(this.screenWidth);
			this.screenHeight = ZUI.camera.projectDistance(this.height);
			ZUI.context.lineWidth = ZUI.camera.projectDistance(this.strokeWidth);
		}
		else if (this.sizeScale == "screen") {
			this.screenOffsetX = this.offsetX;
			this.screenOffsetY = this.offsetY;
			this.screenSize = this.size;
			ZUI.context.font = ((this.bold) ? "bold " : "") + ((this.italic) ? "italic " : "") + "24" + "px " + this.font;
			this.width = ZUI.context.measureText(this.content).width / 24 * this.screenSize;
			this.height = this.size * 0.8;
			this.screenWidth = this.width;
			this.screenHeight = this.height;
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
			screenY = this.screenHeight;
		}
		else if (centerAt[1] == "center") {
			screenY = this.screenHeight / 2;
		}
		else if (centerAt[1] == "bottom") {
			screenY = 0;
		}
		screenY += this.screenY + this.screenOffsetY;
		ZUI.context.save();
		ZUI.context.translate(screenX, screenY);
		ZUI.context.scale(this.screenSize / 24, this.screenSize / 24);
		if (this.stroke) {
			ZUI.context.lineJoin = "round";
			ZUI.context.strokeText(this.content, 0, 0);
		}
		if (this.fill) {
			ZUI.context.fillText(this.content, 0, 0);
		}
		ZUI.context.restore();
		if (this.underline) {
			if (this.stroke) {
				ZUI.context.beginPath();
				ZUI.context.moveTo(screenX - ZUI.context.lineWidth / 2, Math.round(screenY) + 1.5);
				ZUI.context.lineTo(screenX + this.screenWidth + ZUI.context.lineWidth / 2, Math.round(screenY) + 1.5);
				ZUI.context.stroke();
			}
			if (this.fill) {
				if (this.sizeScale == "world") {
					ZUI.context.lineWidth = ZUI.camera.projectDistance(1);
				}
				else if (this.sizeScale == "screen") {
					ZUI.context.lineWidth = 1;
				}
				ZUI.context.beginPath();
				ZUI.context.moveTo(screenX, Math.round(screenY) + 1.5);
				ZUI.context.lineTo(screenX + this.screenWidth, Math.round(screenY) + 1.5);
				ZUI.context.stroke();
			}
		}
		ZUI.context.restore();
		this.isOnScreen = true;
	}
	else if (this.shape == "multilinetext") {
		for (var n = 0; n < this.private.texts.length; n++) {
			this.private.texts[n].draw();
			this.isOnScreen = true;
		}
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
				context[instructions[m].instruction].apply(context, instructions[m].args);
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
		if (this.redraw) {
			this.cacheContext.clearRect(0, 0, ZUI.width, ZUI.height);
			this.cacheContext.save();
			this.cacheContext.strokeStyle = this.strokeColor;
			this.cacheContext.fillStyle = this.fillColor;
			this.cacheContext.globalAlpha = this.alpha;
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
						else if (instruction == "arcTo") {
							_instruction.screenPoints.push(ZUI.camera.projectPoint(args[0] + this.x, args[1] + this.y));
							_instruction.screenPoints.push(ZUI.camera.projectPoint(args[2] + this.x, args[3] + this.y));
						}
						for (var o = 0; o + 1 < _instruction.screenPoints.length; o += 2) {
							_instruction.screenPoints[o].x += this.offsetX;
							_instruction.screenPoints[o].y += this.offsetY;
						}
					}
				}
				this.cacheContext.lineWidth = ZUI.camera.projectDistance(this.strokeWidth);
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
						else if (instruction == "arcTo") {
							_instruction.screenPoints.push({x: args[0] + this.x, y: args[1] + this.y});
							_instruction.screenPoints.push({x: args[2] + this.x, y: args[3] + this.y});
						}
						for (var o = 0; o < _instruction.screenPoints.length; o++) {
							_instruction.screenPoints[o].x += this.offsetX;
							_instruction.screenPoints[o].y += this.offsetY;
						}
					}
				}
				this.cacheContext.lineWidth = this.strokeWidth;
			}

			this.cacheContext.save();
			this.cacheContext.beginPath();
			for (var n = 0; n < this.paths.length; n++) {
				var instructions = this.paths[n].instructions;
				for (var m = 0; m < instructions.length; m++) {
					var args = [];
					for (var o = 0; o < instructions[m].screenPoints.length; o++) {
						args.push(instructions[m].screenPoints[o].x);
						args.push(instructions[m].screenPoints[o].y);
					}
					if (instructions[m].instruction == "arcTo") {
						args.push(ZUI.camera.projectDistance(instructions[m].args[4]));
					}
					this.cacheContext[instructions[m].instruction].apply(this.cacheContext, args);
				}
			}
			this.cacheContext.restore();
			if (this.stroke) {
				this.cacheContext.stroke();
			}
			if (this.fill) {
				this.cacheContext.fill();
			}
			this.cacheContext.restore();
		}
		ZUI.context.drawImage(this.cache, 0, 0);
		this.redraw = false;
		this.isOnScreen = true;
	}
	else if (this.shape == "image" && this.ready) {
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
		}
		else if (this.sizeScale == "screen") {
			this.screenOffsetX = this.offsetX;
			this.screenOffsetY = this.offsetY;
			this.screenWidth = this.width * this.hscale;
			this.screenHeight = this.height * this.vscale;
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

		ZUI.context.drawImage(this.image, screenX, screenY, this.screenWidth, this.screenHeight);
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
	else if (this.shape == "multilinetext") {
		for (var n = 0; n < this.private.texts.length; n++) {
			if (this.private.texts[n].isInBound(x, y)) {
				return true;
			}
		}
		return false;
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
		this.cacheContext.beginPath();
		for (var n = 0; n < this.paths.length; n++) {
			var instructions = this.paths[n].instructions;
			for (var m = 0; m < instructions.length; m++) {
				var args = [];
				for (var o = 0; o < instructions[m].screenPoints.length; o++) {
					args.push(instructions[m].screenPoints[o].x);
					args.push(instructions[m].screenPoints[o].y);
				}
				if (instructions[m].instruction == "arcTo") {
					args.push(ZUI.camera.projectDistance(instructions[m].args[4]));
				}
				this.cacheContext[instructions[m].instruction].apply(this.cacheContext, args);
			}
		}
		return(this.cacheContext.isPointInPath(ZUI.mouseStatus.x, ZUI.mouseStatus.y));
	}
	else if (this.shape == "image") {
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
	return false;
};

/* Removes the ViewObject from the global ZUI reference, so that it becomes available for garbage collection */
ZUI.ViewObject.prototype.remove = function() {
	var index = ZUI.viewObjects.indexOf(this);
	if (index >= 0) {
		ZUI.viewObjects.splice(index, 1);
	}
};
