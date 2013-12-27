/**
 * World View class
 * UI design by Jamie Waese
 * Code by Hans Yu
 */

function WorldView(element) {
	this.element = element;

	this.webService = null;
	this.control = null;
	this.groups = [];

	this.isDataReady = false;

	this.mode = "absolute";

	this.maxLevel = 0;

	/* Create view-specific UI elements */
	this.modeContainerElement = document.createElement("div");
	this.modeContainerElement.className = "iconSmall hint--top hint--success hint--rounded";
	this.modeContainerElement.setAttribute("data-hint", "Toggle data mode.");
	this.modeContainerElement.setAttribute("data-enabled", Eplant.tooltipSwitch.toString());
	this.modeContainerElement.style.padding = "5px";
	this.modeContainerElement.onclick = $.proxy(function() {
		if (this.mode == "absolute") this.mode = "relative";
		else if (this.mode == "relative") this.mode = "absolute";
		this.updateEFP();
	}, this);
	/* Set icon */
	var img = document.createElement("img");
	img.src = "img/efpmode.png";
	this.modeContainerElement.appendChild(img);

	/* Retrieve eFP JSON */
	$.getJSON("data/world/" + element.chromosome.species.scientificName.replace(" ", "_") + ".json", $.proxy(function(response) {
		this.webService = response.webService;

		this.marker = response.marker;

		var samples = [];

		/* Control samples */
		var control = response.control;
		this.control = {
			id: control.id,
			samples: [],
			source: control.source
		};
		for (var n = 0; n < control.samples.length; n++) {
			var sample = {
				name: control.samples[n],
				level: null
			};
			samples.push(sample);
			this.control.samples.push(sample);
		}

		/* Ecotypes */
		for (n = 0; n < response.groups.length; n++) {
			var group = response.groups[n];
			var _group = {};
			_group.id = group.id;
			_group.source = group.source;
			_group.position = {
				lat: group.position.lat,
				lng: group.position.lng
			};
			_group.color = Eplant.Color.White;
			_group.samples = [];
			for (var m = 0; m < group.samples.length; m++) {
				var sample = {
					name: group.samples[m],
					level: null
				};
				samples.push(sample);
				_group.samples.push(sample);
			}

			/* Create marker */
			_group.marker = new google.maps.Marker({
				position: new google.maps.LatLng(_group.position.lat, _group.position.lng),
				icon: this.getMarkerIcon(_group.color)
			});
			_group.marker.data = group;

			/* Create info window */
			_group.infoWindow = new google.maps.InfoWindow({
				content: _group.id
			});
			google.maps.event.addListener(_group.marker, "mouseover", $.proxy(function() {
				this.infoWindow.open(WorldView.googleMap, this.marker);
			}, _group));
			google.maps.event.addListener(_group.marker, "mouseout", $.proxy(function() {
				this.infoWindow.close();
			}, _group));
			this.groups.push(_group);

			if (ZUI.activeView == this) {
				var marker = _group.marker;
				marker.setMap(WorldView.googleMap);
				WorldView.oms.addMarker(marker);
			}
		}

		/* Query sample levels */
		var samplenames = [];
		for (var m = 0; m < samples.length; m++) {
			samplenames.push(samples[m].name);
		}
		$.getJSON(this.webService + "id=" + this.element.identifier + "&samples=" + JSON.stringify(samplenames), $.proxy(function(response) {
			for (var m = 0; m < this.samples.length; m++) {
				for (var n = 0; n < response.length; n++) {
					if (response[n].name == this.samples[m].name) {
						this.samples[m].level = Number(response[n].level);
						break;
					}
				}
			}
			this.view.updateLevels();
			this.view.updateEFP();
		}, {
			samples: samples,
			view: this
		}));
	}, this));
}

/* Inherit from View superclass */
WorldView.prototype = new ZUI.View();
WorldView.prototype.constructor = WorldView;

WorldView.initGoogleMaps = function() {
	google.maps.visualRefresh = false;

	WorldView.container = document.getElementById("map_container");
	WorldView.googleMap = new google.maps.Map(WorldView.container, {
		center: new google.maps.LatLng(0, 0),
		zoom: 21,
		streetViewControl: false
	});

	WorldView.oms = new OverlappingMarkerSpiderfier(WorldView.googleMap, {
		markersWontMove: true,
		markersWontHide: true
	});

	WorldView.markerCluster = new MarkerClusterer(WorldView.googleMap, undefined, {
		zoomOnClick: false,
		maxZoom: 6,
		gridSize: 20
	});
};

WorldView.prototype.getMarkerIcon = function(color) {
	var _color = color;
	if (_color[0] == "#") _color = _color.substring(1);
	if (this.marker) {
		var canvas = document.createElement("canvas");
		canvas.width = this.marker.width;
		canvas.height = this.marker.height;
		var context = canvas.getContext("2d");
		context.beginPath();
		for (var n = 0; n < this.marker.paths.length; n++) {
			var instructions = ZUI.Parser.pathToObj(this.marker.paths[n]);
			for (var m = 0; m < instructions.length; m++) {
				var instruction = instructions[m];
				context[instruction.instruction].apply(context, instruction.args);
			}
		}
		context.strokeStyle = "#000000";
		context.stroke();
		context.fillStyle = color;
		context.fill();

		return canvas.toDataURL("image/png");
	}
	else {
		return "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + _color;
	}
};

WorldView.prototype.active = function() {
	/* Append to view history */
	if (Eplant.viewHistory[Eplant.viewHistorySelected] != this) {
		Eplant.pushViewHistory(this);
	}

	/* Append view-specific UI */
	var viewSpecificUI = document.getElementById("viewSpecificUI");
	viewSpecificUI.appendChild(this.modeContainerElement);

	WorldView.container.style.visibility = "visible";

	/* Insert markers */
	for (var n = 0; n < this.groups.length; n++) {
		var group = this.groups[n];
		var marker = group.marker;
		marker.setMap(WorldView.googleMap);
		WorldView.oms.addMarker(marker);
//		WorldView.markerCluster.addMarker(marker);
	}
};

WorldView.prototype.inactive = function() {
	/* Remove application specific UI */
	document.getElementById("viewSpecificUI").innerHTML = "";

	WorldView.container.style.visibility = "hidden";

	/* Remove markers */
	for (var n = 0; n < this.groups.length; n++) {
		var group = this.groups[n];
		var marker = group.marker;
		group.marker.setMap(null);
		WorldView.oms.clearMarkers();
		WorldView.markerCluster.clearMarkers();
	}
};

WorldView.prototype.updateLevels = function() {
	/* Calculate mean and standard deviation, also get maximum level */
	this.maxLevel = 0;
	this.minLevel = Number.NaN;
	for (var n = 0; n < this.groups.length; n++) {
		var group = this.groups[n];
		var values = [];
		for (var m = 0; m < group.samples.length; m++) {
			var sample = group.samples[m];
			if (!isNaN(sample.level)) {
				values.push(sample.level);
			}
		}
		group.meanLevel = ZUI.Statistics.mean(values);
		group.nLevel = values.length;
		group.stdevLevel = ZUI.Statistics.stdev(values);
		group.sterrorLevel = ZUI.Statistics.sterror(values);
		if (group.meanLevel > this.maxLevel) this.maxLevel = group.meanLevel;
		if (isNaN(this.minLevel) || group.meanLevel < this.minLevel) this.minLevel = group.meanLevel;
	}

	/* Control */
	var values = [];
	for (var m = 0; m < this.control.samples.length; m++) {
		var sample = this.control.samples[m];
		if (!isNaN(sample.level)) {
			values.push(sample.level);
		}
	}
	this.control.meanLevel = ZUI.Statistics.mean(values);
	this.control.nLevel = values.length;
	this.control.stdevLevel = ZUI.Statistics.stdev(values);
	this.control.sterrorLevel = ZUI.Statistics.sterror(values);

	this.isDataReady = true;
};

WorldView.prototype.updateEFP = function() {
	if (!this.isDataReady) return;

	/* Update eFP */
	if (this.mode == "absolute") {
		for (n = 0; n < this.groups.length; n++) {
			var group = this.groups[n];
			var levelRatio = group.meanLevel / this.maxLevel;
			if (isNaN(levelRatio)) {
				group.color = "#000000";
			}
			else {
				var green = Math.round((1 - levelRatio) * 255).toString(16).toUpperCase();
				if (green.length < 2) green = "0" + green;
				group.color = "#FF" + green + "00";
			}
			group.marker.setIcon(this.getMarkerIcon(group.color));
			group.infoWindow.setContent(group.id + "<br>Mean: " + (+parseFloat(group.meanLevel).toFixed(2)) + "<br>Standard error: " + (+parseFloat(group.stdevLevel).toFixed(2)) + "<br>Sample size: " + group.nLevel);
		}
	}
	else if (this.mode == "relative") {
		var max = ZUI.Math.log(this.maxLevel / this.control.meanLevel, 2);
		var min = ZUI.Math.log(this.minLevel / this.control.meanLevel, 2);
		var cap = (Math.abs(max) > Math.abs(min)) ? Math.abs(max) : Math.abs(min);
		for (n = 0; n < this.groups.length; n++) {
			var group = this.groups[n];
			var log2Level = ZUI.Math.log(group.meanLevel / this.control.meanLevel, 2);
			var levelRatio = log2Level / cap;
			if (isNaN(levelRatio)) {
				group.color = "#000000";
			}
			else {
				if (levelRatio > 0) {
					var green = Math.round((1 - levelRatio) * 255).toString(16).toUpperCase();
					if (green.length < 2) green = "0" + green;
					group.color = "#FF" + green + "00";
				}
				else {
					var redgreen = Math.round((1 + levelRatio) * 255).toString(16).toUpperCase();
					if (redgreen.length < 2) redgreen = "0" + redgreen;
					var blue = Math.round(-levelRatio * 255).toString(16).toUpperCase();
					if (blue.length < 2) blue = "0" + blue;
					group.color = "#" + redgreen + redgreen + blue;
				}

			}
			group.marker.setIcon(this.getMarkerIcon(group.color));
			group.infoWindow.setContent(group.id + "<br>Log2 value: " + (+parseFloat(ZUI.Math.log(group.meanLevel / this.control.meanLevel, 2)).toFixed(2)) + "<br>Fold difference: " + (+parseFloat(group.meanLevel / this.control.meanLevel).toFixed(2)));
		}
	}
};

WorldView.prototype.getLoadProgress = function() {
	if (this.isDataReady) return 1;
	else return 0;
};

WorldView.prototype.getZoomOutEntryAnimationSettings = function() {
	return {
		view: this,
		duration: 1000,
		begin: function() {
			WorldView.googleMap.setCenter(new google.maps.LatLng(0, 0));
			WorldView.googleMap.setZoom(21);
		},
		draw: function(elapsedTime, remainingTime, view, data) {
			var zoom = Math.round((21 - 2) * remainingTime / (elapsedTime + remainingTime) + 2);
			WorldView.googleMap.setZoom(zoom);
		},
		end: function() {
			WorldView.googleMap.setZoom(2);
		}
	};
};

WorldView.prototype.getZoomInExitAnimationSettings = function() {
	return {
		view: this,
		duration: 1000,
		data: {
			sourceZoom: WorldView.googleMap.getZoom()
		},
		draw: function(elapsedTime, remainingTime, view, data) {
			var zoom = Math.round((21 - data.sourceZoom) * elapsedTime / (elapsedTime + remainingTime) + data.sourceZoom);
			WorldView.googleMap.setZoom(zoom);
		},
		end: function() {
			WorldView.googleMap.setZoom(21);
		}
	};
};
