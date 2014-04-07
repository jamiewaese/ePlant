(function() {

    // add namespace
    window.ZUI = {};

})();

(function() {

    // constructor
    ZUI.Base = function() {
        this._private = {};
        this._private.isUpdated = false;
    };

    // getter
    ZUI.Base.prototype.get = function() {
        var obj = this;
        var propertyName = arguments[0];
        if (propertyName === undefined || propertyName === null) {
            return undefined;
        }

        var n = 0;
        while (n < arguments.length - 1) {
            if (obj === undefined || obj === null) {
                return undefined;
            }
            obj = obj[propertyName];
            propertyName = arguments[++n];
            if (propertyName === undefined || propertyName === null) {
                return undefined;
            }
        }

        return obj[propertyName];
    };

    // setter
    ZUI.Base.prototype.set = function() {
        var obj = this;
        var propertyName = arguments[0];
        if (propertyName === undefined || propertyName === null) {
            propertyName = 0;
        }

        var n = 0;
        while (n < arguments.length - 2) {
            if (obj === undefined || obj === null) {
                obj = {};
            }
            obj = obj[propertyName];
            propertyName = arguments[++n];
            if (propertyName === undefined || propertyName === null) {
                propertyName = 0;
            }
        }
        if (obj === undefined || obj === null) {
            obj = {};
        }

        this.update(arguments.slice(0, n + 1), arguments[n + 1]);

        return obj[propertyName] = arguments[n + 1];
    };

    ZUI.Base.prototype.update = function (propertyName, value) {};

})();

(function() {

    // add namespace
    ZUI.Helper = {};

})();

(function() {

    /**
     * Taken from http://greweb.me/2012/02/bezier-curve-based-easing-functions-from-concept-to-implementation/
     */

    /**
     * KeySpline - use bezier curve for transition easing function
     * is inspired from Firefox's nsSMILKeySpline.cpp
     * Usage:
     * var spline = new KeySpline(0.25, 0.1, 0.25, 1.0)
     * spline.get(x) => returns the easing value | x must be in [0, 1] range
     */
    ZUI.Helper.KeySpline = function(mX1, mY1, mX2, mY2) {

        this.get = function(aX) {
            if (mX1 == mY1 && mX2 == mY2) return aX; // linear
            return CalcBezier(GetTForX(aX), mY1, mY2);
        }

        function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
        function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
        function C(aA1)      { return 3.0 * aA1; }

        // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
        function CalcBezier(aT, aA1, aA2) {
            return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
        }

        // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
        function GetSlope(aT, aA1, aA2) {
            return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
        }

        function GetTForX(aX) {
            // Newton raphson iteration
            var aGuessT = aX;
            for (var i = 0; i < 4; ++i) {
                var currentSlope = GetSlope(aGuessT, mX1, mX2);
                if (currentSlope == 0.0) return aGuessT;
                var currentX = CalcBezier(aGuessT, mX1, mX2) - aX;
                aGuessT -= currentX / currentSlope;
            }
            return aGuessT;
        }
    }

})();

(function() {

    // remove an item from an array
    ZUI.Helper.removeFromArray = function(array, item) {
        var index = array.indexOf(item);
        if (index >= 0) {
            array.splice(index, 1);
        }
        return item;
    };

    // inherit parent class prototype without calling parent constructor
    ZUI.Helper.inheritClass = function(parent, child) {
        function protoCreator() {
            this.constructor = child.prototype.constructor;
        }
        protoCreator.prototype = parent.prototype;
        child.prototype = new protoCreator();
    };

    // assign default property to an object recursively if the property is undefined
    ZUI.Helper.assignDefaultProperty = function (propertyName, obj, defaultProperty) {
        var hasProperties = false;
        if ((typeof defaultProperty) !== 'string' && !(defaultProperty instanceof Array) && isNaN(defaultProperty)) {
            for (var foo in defaultProperty) {
                hasProperties = true;
                break;
            }
        }
        if (obj[propertyName] === undefined) {
            if (hasProperties) {
                obj[propertyName] = {};
            }
            else {
                obj[propertyName] = defaultProperty;
            }
        }
        if ((typeof defaultProperty) !== 'string' && !(defaultProperty instanceof Array) && isNaN(defaultProperty)) {
            for (var foo in defaultProperty) {
                ZUI.Helper.assignDefaultProperty(foo, obj[propertyName], defaultProperty[foo]);
            }
        }
        return obj[propertyName];
    };

    // get mouse position from event
    ZUI.Helper.getMousePosition = function(event) {
        var canvasBoundingRect = ZUI.canvas.getBoundingClientRect();
        return {
            x: event.clientX - canvasBoundingRect.left,
            y: event.clientY - canvasBoundingRect.top
        };
    };

    // disable pointer events on canvas
    ZUI.Helper.disablePointerEvents = function() {
        ZUI.canvas.style.pointerEvents = "none";
    };

    // restore point events on canvas
    ZUI.Helper.restorePointerEvents = function() {
        ZUI.canvas.style.pointerEvents = "auto";
    };

    // interpret the scale option and returns the updated value
    ZUI.Helper.interpretScale = function(value, scale) {
        if (scale === ZUI.Def.ScreenScale) {
            return value;
        }
        else if (scale === ZUI.Def.WorldScale) {
            // point
            if (isNaN(value)) {
                return ZUI.camera.projectPoint(value);
            }

            // distance
            else {
                return ZUI.camera.projectDistance(value);
            }
        }
        else {
            return null;
        }
    };

    // interpret the centerAt option and returns the updated position
    ZUI.Helper.interpretCenterAt = function(position, positionOffset, width, height, centerAt) {
        var adjustedPosition = {
            x: position.x + positionOffset.x,
            y: position.y + positionOffset.y
        }

        if (centerAt.horizontal === ZUI.Def.Left) {
            adjustedPosition.x -= 0;
        }
        else if (centerAt.horizontal === ZUI.Def.Center) {
            adjustedPosition.x -= width / 2;
        }
        else if (centerAt.horizontal === ZUI.Def.Right) {
            adjustedPosition.x -= width;
        }
        else {
            throw {
                name: 'InvalidPropertyException',
                message: 'Value of centerAt is invalid.'
            };
        }

        if (centerAt.vertical === ZUI.Def.Top) {
            adjustedPosition.y -= 0;
        }
        else if (centerAt.vertical === ZUI.Def.Center) {
            adjustedPosition.y -= height / 2;
        }
        else if (centerAt.vertical === ZUI.Def.Bottom) {
            adjustedPosition.y -= height;
        }
        else {
            throw {
                name: 'InvalidPropertyException',
                message: 'Value of centerAt is invalid.'
            };
        }

        return adjustedPosition;
    };

    // check whether a color string is valid
    ZUI.Helper.isValidColor = function(str) {
        if (!str || !str.match) {
            return null;
        }
        else {
            return str.match(/^#[a-f0-9]{6}$/i) !== null;
        }
    };

    // check whether a string ends with a suffix
    ZUI.Helper.isEndsWith = function(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };

    // convert number to to string with comma-separators
    ZUI.Helper.getNumberWithComma = function(number) {
        /* By mikez302, http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript */
        var parts = (number + '').split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    };

    // get index of a regex in a string
    ZUI.Helper.regexIndexOf = function(string, regex, start) {
        var index = string.substring(start || 0).search(regex);
        return (index >= 0) ? (index + (start || 0)) : index;
    };

    // get time in milliseconds since 1970/01/01
    ZUI.Helper.getTime = function() {
        return (new Date()).getTime();
    };

    // stop bubbling through DOM hierarchy
    ZUI.Helper.stopBubble = function(event) {
        event.stopPropagation();
    };

    // get color string from color components
    ZUI.Helper.getColorString = function(red, green, blue) {
        if (red.red !== undefined && red.green !== undefined && red.blue !== undefined) {
            var color = red;
            red = color.red;
            green = color.green;
            blue = color.blue;
        }
        var _red = red.toString(16);
        if (_red.length == 1) _red = '0' + _red;
        var _green = green.toString(16);
        if (_green.length == 1) _green = '0' + _green;
        var _blue = blue.toString(16);
        if (_blue.length == 1) _blue = '0' + _blue;
        return '#' + _red + _green + _blue;
    };

    // get color components from a color string
    ZUI.Helper.getColorComponents = function(color) {
        var _color = color.substring(0);
        if (_color[0] == '#') {
            _color = color.substring(1);
        }
        var red = parseInt(_color.substring(0, 2), 16);
        var green = parseInt(_color.substring(2, 4), 16);
        var blue = parseInt(_color.substring(4, 6), 16);
        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            return null;
        }
        else {
            return {
                red: red,
                green: green,
                blue: blue
            };
        }
    };

    // get property from its path string
    ZUI.Helper.readPropertyPath = function(propertyPath) {
        var parts = propertyPath.split('.');
        var scope = window;
        for (var n = 0; n < parts.length; n++) {
            scope = scope[parts[n]];
            if (scope === undefined || scope === null) {
                throw {
                    name: 'BadPathException',
                    message: 'The path ' + propertyPath + ' cannot be found.'
                };
                return undefined;
            }
        }
        return scope;
    };

    // parses an SVG path and outputs an object
    ZUI.Helper.parseSVGPath = function(path) {
        // splits the path string into instructions
        var instructions = [];
        for (var n = 0; n < path.length;) {
            var instruction = path[n];
            var next = ZUI.Helper.regexIndexOf(path, "[A-Za-z]", n + 1);
            if (next < 0) next = path.length;
            var args = path.substring(n + 1, next).replace(new RegExp("([0-9])-", "gi"), "$1,-").trim().replace(new RegExp("[\t\n ,]+", "gi"), ",").split(/[,]+/);
            for (var m = 0; m < args.length; m++) {
                args[m] = Number(args[m]);
            }
            instructions.push({
                type: instruction,
                args: args
            });
            n = next;
        }

        // process instructions
        var objs = []
        var lastX = 0, lastY = 0;
        for (n = 0; n < instructions.length; n++) {
            if (instructions[n].type == "M") {			// moveto (absolute)
                var obj = {};
                obj.type = "moveTo";
                obj.args = [instructions[n].args[0], instructions[n].args[1]];
                objs.push(obj);
                lastX = instructions[n].args[0];
                lastY = instructions[n].args[1];
            }
            else if (instructions[n].type == "m") {		// moveto (relative)
                var obj = {};
                obj.type = "moveTo";
                obj.args = [instructions[n].args[0] + lastX, instructions[n].args[1] + lastY];
                objs.push(obj);
                lastX += instructions[n].args[0];
                lastY += instructions[n].args[1];
            }
            else if (instructions[n].type == "Z" || instructions[n].type == "z") {	// closepath
                var obj = {};
                obj.type = "closePath";
                obj.args = [];
                objs.push(obj);
            }
            else if (instructions[n].type == "L") {		// lineto (absolute)
                var obj = {};
                obj.type = "lineTo";
                obj.args = [instructions[n].args[0], instructions[n].args[1]];
                objs.push(obj);
                lastX = instructions[n].args[0];
                lastY = instructions[n].args[1];
            }
            else if (instructions[n].type == "l") {		// lineto (relative)
                var obj = {};
                obj.type = "lineTo";
                obj.args = [instructions[n].args[0] + lastX, instructions[n].args[1] + lastY];
                objs.push(obj);
                lastX += instructions[n].args[0];
                lastY += instructions[n].args[1];
            }
            else if (instructions[n].type == "H") {		// horizontal lineto (absolute)
                var obj = {};
                obj.type = "lineTo";
                obj.args = [instructions[n].args[0], lastY];
                objs.push(obj);
                lastX = instructions[n].args[0];
            }
            else if (instructions[n].type == "h") {		// horizontal lineto (relative)
                var obj = {};
                obj.type = "lineTo";
                obj.args = [instructions[n].args[0] + lastX, lastY];
                objs.push(obj);
                lastX += instructions[n].args[0];
            }
            else if (instructions[n].type == "V") {		// vertical lineto (absolute)
                var obj = {};
                obj.type = "lineTo";
                obj.args = [lastX, instructions[n].args[0]];
                objs.push(obj);
                lastY = instructions[n].args[0];
            }
            else if (instructions[n].type == "v") {		// vertical lineto (relative)
                var obj = {};
                obj.type = "lineTo";
                obj.args = [lastX, instructions[n].args[0] + lastY];
                objs.push(obj);
                lastY += instructions[n].args[0];
            }
            else if (instructions[n].type == "C") {		// curveto (absolute)
                var obj = {};
                obj.type = "bezierCurveTo";
                obj.args = [instructions[n].args[0], instructions[n].args[1], instructions[n].args[2], instructions[n].args[3], instructions[n].args[4], instructions[n].args[5]];
                objs.push(obj);
                lastX = instructions[n].args[4];
                lastY = instructions[n].args[5];
            }
            else if (instructions[n].type == "c") {		// curveto (relative)
                var obj = {};
                obj.type = "bezierCurveTo";
                obj.args = [instructions[n].args[0] + lastX, instructions[n].args[1] + lastY, instructions[n].args[2] + lastX, instructions[n].args[3] + lastY, instructions[n].args[4] + lastX, instructions[n].args[5] + lastY];
                objs.push(obj);
                lastX += instructions[n].args[4];
                lastY += instructions[n].args[5];
            }
            else if (instructions[n].type == "S") {		// shorthand/smooth curveto (absolute)
                var obj = {};
                obj.type = "bezierCurveTo";
                obj.args = [lastX, lastY, instructions[n].args[0], instructions[n].args[1], instructions[n].args[2], instructions[n].args[3]];
                objs.push(obj);
                lastX = instructions[n].args[2];
                lastY = instructions[n].args[3];
            }
            else if (instructions[n].type == "s") {		// shorthand/smooth curveto (relative)
                var obj = {};
                obj.type = "bezierCurveTo";
                obj.args = [lastX, lastY, instructions[n].args[0] + lastX, instructions[n].args[1] + lastY, instructions[n].args[2] + lastX, instructions[n].args[3] + lastY];
                objs.push(obj);
                lastX += instructions[n].args[2];
                lastY += instructions[n].args[3];
            }
            else if (instructions[n].type == "Q") {		// quadratic Bezier curveto (absolute)
                var obj = {};
                obj.type = "quadraticCurveTo";
                obj.args = [instructions[n].args[0], instructions[n].args[1], instructions[n].args[2], instructions[n].args[3]];
                objs.push(obj);
                lastX = instructions[n].args[2];
                lastY = instructions[n].args[3];
            }
            else if (instructions[n].type == "q") {		// quadratic Bezier curveto (relative)
                var obj = {};
                obj.type = "quadraticCurveTo";
                obj.args = [instructions[n].args[0] + lastX, instructions[n].args[1] + lastY, instructions[n].args[2] + lastX, instructions[n].args[3] + lastY];
                objs.push(obj);
                lastX += instructions[n].args[2];
                lastY += instructions[n].args[3];
            }
            else if (instructions[n].type == "T") {		// shorthand/smooth quadratic Bezier curveto (absolute)
                var obj = {};
                obj.type = "quadraticCurveTo";
                obj.args = [lastX, lastY, instructions[n].args[0], instructions[n].args[1]];
                objs.push(obj);
                lastX = instructions[n].args[0];
                lastY = instructions[n].args[1];
            }
            else if (instructions[n].type == "t") {		// shorthand/smooth quadratic Bezier curveto (relative)
                var obj = {};
                obj.type = "quadraticCurveTo";
                obj.args = [lastX, lastY, instructions[n].args[0] + lastX, instructions[n].args[1] + lastY];
                objs.push(obj);
                lastX += instructions[n].args[0];
                lastY += instructions[n].args[1];
            }
            else if (instructions[n].type == "A") {		// elliptical arc (absolute), NOT THE SAME AS THE SVG COMMAND
                var obj = {};
                obj.type = "arcTo";
                obj.args = [instructions[n].args[0], instructions[n].args[1], instructions[n].args[2], instructions[n].args[3], instructions[n].args[4]];
                objs.push(obj);
                lastX = instructions[n].args[2];
                lastY = instructions[n].args[3];
            }
            else if (instructions[n].type == "a") {		// elliptical arc (relative), NOT THE SAME AS THE SVG COMMAND
                var obj = {};
                obj.type = "arcTo";
                obj.args = [instructions[n].args[0] + lastX, instructions[n].args[1] + lastY, instructions[n].args[2] + lastX, instructions[n].args[3] + lastY, instructions[n].args[4]];
                objs.push(obj);
                lastX += instructions[n].args[2];
                lastY += instructions[n].args[3];
            }
        }

        return objs;
    };

})();

(function() {

    // add namespace
    ZUI.Def = {};

})();

(function() {

    ZUI.Def.Left = 0x0001;
    ZUI.Def.Right = 0x0002;
    ZUI.Def.Top = 0x0003;
    ZUI.Def.Bottom = 0x0004;
    ZUI.Def.Center = 0x0005;

    ZUI.Def.WorldScale = 0x0011;
    ZUI.Def.ScreenScale = 0x0012;

})();

(function() {

    // add namespace
    ZUI.Math = {};

})();

(function() {

    // calculate the log of a number with a specified base
    ZUI.Math.log = function(number, base) {
        return Math.log(number) / Math.log(base);
    };

    // calculate mean for a group of numbers
    ZUI.Math.mean = function(numbers) {
        var sum = 0;
        for (var n = 0; n < numbers.length; n++) {
            sum += numbers[n];
        }
        return sum / numbers.length;
    };

    // calculate standard deviation for a group of numbers
    ZUI.Math.stDev = function(numbers) {
        if (numbers.length < 2) return Number.NaN;
        var mean = ZUI.Helper.mean(numbers);
        var sqSum = 0;
        for (var n = 0; n < numbers.length; n++) {
            sqSum += Math.pow(mean - numbers[n], 2);
        }
        return Math.sqrt(sqSum / (numbers.length - 1));
    };

    // calculate standard error for a group of numbers
    ZUI.Math.stError = function(numbers) {
        if (numbers.length < 2) return Number.NaN;
        return ZUI.Helper.stdev(numbers) / Math.sqrt(numbers.length);
    };

})();

(function() {

    ZUI.Hash = function() {
        // call base constructor
        ZUI.Base.call(this);

        this._private.pairs = [];
    };

    // inherit base
    ZUI.Helper.inheritClass(ZUI.Base, ZUI.Hash);

    // adds a new key-value pair or sets an existing key's value
    ZUI.Hash.prototype.put = function(key, value) {
        for (var n = 0; n < this._private.pairs.length; n++) {
            if (this._private.pairs[n].key == key) {
                this._private.pairs[n].value = value;
                return;
            }
        }
        this._private.pairs.push({
            key: key,
            value: value
        });
    };

    // gets a key's value
    ZUI.Hash.prototype.get = function(key) {
        for (var n = 0; n < this._private.pairs.length; n++) {
            if (this._private.pairs[n].key == key) {
                return this._private.pairs[n].value;
            }
        }
        return null;
    };

    // deletes a key-value pair
    ZUI.Hash.prototype.delete = function(key) {
        for (var n = 0; n < this._private.pairs.length; n++) {
            if (this._private.pairs[n].key == key) {
                this._private.pairs.splice(n, 1);
                return;
            }
        }
    };

    // returns a list of keys
    ZUI.Hash.prototype.getKeys = function() {
        var keys = [];
        for (var n = 0; n < this._private.pairs.length; n++) {
            keys.push(this._private.pairs[n].key);
        }
        return keys;
    };

    // returns the number of key:value pairs
    ZUI.Hash.prototype.getSize = function() {
        return this._private.pairs.length;
    };

})();

(function() {

    // constructor
    ZUI.Event = function(type, target, data) {
        // call base constructor
        ZUI.Base.call(this);

        this.type = type;
        this.target = target;
        this.data = data;
        this.timeStamp = ZUI.Helper.getTime();
    };

    // inherit base
    ZUI.Helper.inheritClass(ZUI.Base, ZUI.Event);

})();

(function() {

    // constructor
    ZUI.EventListener = function(type, target, callback, data) {
        // call base constructor
        ZUI.Base.call(this);

        this.type = type;
        this.target = target;
        this.callback = callback;
        this.data = data;
    };

    // inherit base
    ZUI.Helper.inheritClass(ZUI.Base, ZUI.EventListener);

})();

(function() {

    ZUI.container = null;
    ZUI.canvas = null;
    ZUI.context = null;

    ZUI.camera = null;
    ZUI.frameRate = null;
    ZUI.lastTimeStamp = null;

    ZUI.activeView = null;

    ZUI.contextMenu = null;

    ZUI.appStatus = null;
    ZUI.mouseStatus = null;

    ZUI.eventListeners = null;

    ZUI.passInputEvent = null;

})();

(function() {

    // initialize ZUI
    ZUI.initialize = function (properties) {
        // transfer properties to this object
        for (var propertyName in properties) {
            ZUI[propertyName] = properties[propertyName];
        }

        // assign default to undefined properties
        //   width
        //   height
        //   background
        //   frameRate
        (function () {
            // define default properties
            var defaultProperties = {
                width: 900,
                height: 600,
                background: '#FFFFFF',
                backgroundAlpha: 0,
                frameRate: 30,
                cameraFollowRate: 1
            };

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, ZUI, defaultProperties[propertyName]);
            }
        })();

        // initialize properties that cannot be defined by the user
        if (properties.canvas) {
            ZUI.container = properties.canvas.parentNode;
            ZUI.canvas = properties.canvas;
            ZUI.context = ZUI.canvas.getContext('2d');
        }

        // create and set camera
        ZUI.camera = new ZUI.Camera.DefaultCamera({});

        // create and set context menu
        ZUI.customContextMenu = new ZUI.ContextMenu();

        // set canvas size
        ZUI.canvas.width = ZUI.width;
        ZUI.canvas.height = ZUI.height;

        // set cursor
        ZUI.canvas.style.cursor = "default";

        // add event listeners
        ZUI.canvas.addEventListener("mousedown", ZUI.mouseDown, false);
        document.addEventListener("mouseup", ZUI.mouseUp, false);
        ZUI.canvas.addEventListener("mousemove", ZUI.mouseMove, false);
        ZUI.canvas.addEventListener("click", ZUI.click, false);
        ZUI.canvas.addEventListener("dblclick", ZUI.doubleClick, false);
        ZUI.canvas.addEventListener("mousewheel", ZUI.mouseWheel, false);
        ZUI.canvas.addEventListener("DOMMouseScroll", ZUI.mouseWheel, false);

        // intercept contextmenu event
        ZUI.canvas.oncontextmenu = function(event) {
            ZUI.contextMenu(event);
            return false;
        };

        // initialize ZUI event listeners hash
        ZUI.eventListeners = new ZUI.Hash();

        // initialize app status
        ZUI.appStatus = {
            start: 0,
            progress: 0
        };

        // initialize mouse status
        ZUI.mouseStatus = {
            x: 0,
            y: 0,
            xLast: 0,
            yLast: 0,
            leftDown: false,
            middleDown: false,
            rightDown: false
        };

        // set first view
        ZUI.activeView = new ZUI.View();
        ZUI.activeView.active();

        // begin draw loop
        requestAnimationFrame(ZUI.draw);
    };

    // draw frame
    ZUI.draw = function (timeStamp) {
        // request next frame
        requestAnimationFrame(ZUI.draw);

        if (timeStamp - ZUI.lastTimeStamp > 1000 / ZUI.frameRate) {
            // update lastTimeStamp
            ZUI.lastTimeStamp = timeStamp - ((timeStamp - ZUI.lastTimeStamp) % 1000 / ZUI.frameRate);

            // update app status
            if (ZUI.appStatus.start == null) {
                ZUI.appStatus.start = timeStamp;
            }
            ZUI.appStatus.progress = timeStamp - ZUI.appStatus.start;

            // update camera
            ZUI.camera.update();

            // call update
            ZUI.update();
            ZUI.activeView.update();

            // animate
            for (var n = 0; n < ZUI.activeView.animations.length; n++) {
                var animation = ZUI.activeView.animations[n];
                animation.draw();
            }

            // update all renderedObjects if view is updated
            if (ZUI.activeView._private.isUpdated) {
                for (var n = 0; n < ZUI.activeView.renderedObjects.length; n++) {
                    ZUI.activeView.renderedObjects[n]._private.isUpdated = true;
                }
            }

            // render rendered objects if needed
            for (var n = 0; n < ZUI.activeView.renderedObjects.length; n++) {
                if (ZUI.activeView.renderedObjects[n]._private.isReady && ZUI.activeView.renderedObjects[n]._private.isUpdated) {
                    ZUI.activeView.renderedObjects[n].render();
                    ZUI.activeView.renderedObjects[n]._private.isUpdated = false;
                    ZUI.activeView._private.isUpdated = true;
                }
            }

            // draw view if needed
            if (ZUI.activeView._private.isUpdated) {
                // clear canvas
                ZUI.context.clearRect(0, 0, ZUI.width, ZUI.height);
                if (ZUI.backgroundAlpha > 0) {
                    ZUI.context.save();
                    ZUI.context.globalAlpha = ZUI.backgroundAlpha;
                    ZUI.context.strokeStyle = ZUI.background;
                    ZUI.context.fillStyle = ZUI.background;
                    ZUI.context.fillRect(0, 0, ZUI.width, ZUI.height)
                    ZUI.context.restore();
                }

                // call view's custom draw method
                ZUI.activeView.draw();

                // draw active view's rendered objects
                for (var n = 0; n < ZUI.activeView.renderedObjects.length; n++) {
                    if (ZUI.activeView.renderedObjects[n]._private.isReady) {
                        ZUI.activeView.renderedObjects[n].draw();
                    }
                }

                // reset updated flag
                ZUI.activeView._private.isUpdated = false;
            }

            // check for mouse over/out events
            var x = ZUI.mouseStatus.x;
            var y = ZUI.mouseStatus.y;
            var renderedObjects = ZUI.activeView.renderedObjects;
            var renderedObject = null;
            for (var n = 0; n < renderedObjects.length; n++) {
                var hasEventListeners = false;
                for (var foo in renderedObjects[n].eventListeners) {
                    hasEventListeners = true;
                    break;
                }
                if (hasEventListeners && renderedObjects[n].pointHitTest(x, y)) {
                    renderedObject = renderedObjects[n];
                }
            }
            for (n = 0; n < renderedObjects.length; n++) {
                if (renderedObjects[n] != renderedObject && renderedObjects[n]._private.isHovered) {
                    renderedObjects[n]._private.isHovered = false;
                    renderedObjects[n].eventListeners.mouseOut();
                }
            }
            if (renderedObject) {
                if (renderedObject.eventListeners.mouseOver && !renderedObject._private.isHovered) {
                    renderedObject._private.isHovered = true;
                    renderedObject.eventListeners.mouseOver();
                }
            }
        }
    };

    // change active view
    ZUI.changeActiveView = function(view) {
        ZUI.activeView.inactive();
        ZUI.activeView = view;
        ZUI.activeView.active();
    };

    // mousedown event handler */
    ZUI.mouseDown = function(event) {
        var x = ZUI.mouseStatus.x;
        var y = ZUI.mouseStatus.y;
        var renderedObjects = ZUI.activeView.renderedObjects;
        var renderedObject = null;
        for (var n = renderedObjects.length - 1; n >= 0; n--) {
            var hasEventListeners = false;
            for (var foo in renderedObjects[n].eventListeners) {
                hasEventListeners = true;
                break;
            }
            if (hasEventListeners && renderedObjects[n].pointHitTest(x, y)) {
                renderedObject = renderedObjects[n];
                break;
            }
        }

        if (event.button == 0) {
            ZUI.mouseStatus.leftDown = true;
            ZUI.activeView.leftMouseDown();
            if (renderedObject && renderedObject.eventListeners.leftMouseDown) {
                renderedObject.eventListeners.leftMouseDown();
            }
        }
        else if (event.button == 1) {
            ZUI.mouseStatus.middleDown = true;
            ZUI.activeView.middleMouseDown();
            if (renderedObject && renderedObject.eventListeners.middleMouseDown) {
                renderedObject.eventListeners.middleMouseDown();
            }
        }
        else if (event.button == 2) {
            ZUI.mouseStatus.rightDown = true;
            ZUI.activeView.rightMouseDown();
            if (renderedObject && renderedObject.eventListeners.rightMouseDown) {
                renderedObject.eventListeners.rightMouseDown();
            }
        }
        if (ZUI.passInputEvent) {
            ZUI.passInputEvent(event);
        }
    };

    // mouseup event handler
    ZUI.mouseUp = function(event) {
        var x = ZUI.mouseStatus.x;
        var y = ZUI.mouseStatus.y;
        var renderedObjects = ZUI.activeView.renderedObjects;
        var renderedObject = null;
        for (var n = renderedObjects.length - 1; n >= 0; n--) {
            var hasEventListeners = false;
            for (var foo in renderedObjects[n].eventListeners) {
                hasEventListeners = true;
                break;
            }
            if (hasEventListeners && renderedObjects[n].pointHitTest(x, y)) {
                renderedObject = renderedObjects[n];
                break;
            }
        }

        if (event.button == 0) {
            ZUI.mouseStatus.leftDown = false;
            ZUI.activeView.leftMouseUp();
            if (renderedObject && renderedObject.eventListeners.leftMouseUp) {
                renderedObject.eventListeners.leftMouseUp();
            }
        }
        else if (event.button == 1) {
            ZUI.mouseStatus.middleDown = false;
            ZUI.activeView.middleMouseUp();
            if (renderedObject && renderedObject.eventListeners.middleMouseUp) {
                renderedObject.eventListeners.middleMouseUp();
            }
        }
        else if (event.button == 2) {
            ZUI.mouseStatus.rightDown = false;
            ZUI.activeView.rightMouseUp();
            if (renderedObject && renderedObject.eventListeners.rightMouseUp) {
                renderedObject.eventListeners.rightMouseUp();
            }
        }
        if (ZUI.passInputEvent) {
            ZUI.passInputEvent(event);
        }
    };

    // mousemove event handler
    ZUI.mouseMove = function(event) {
        var mousePosition = ZUI.Helper.getMousePosition(event);
        ZUI.mouseStatus.xLast = ZUI.mouseStatus.x;
        ZUI.mouseStatus.yLast = ZUI.mouseStatus.y;
        ZUI.mouseStatus.x = mousePosition.x;
        ZUI.mouseStatus.y = mousePosition.y;

        var x = ZUI.mouseStatus.x;
        var y = ZUI.mouseStatus.y;
        var renderedObjects = ZUI.activeView.renderedObjects;
        var renderedObject = null;
        for (var n = 0; n < renderedObjects.length; n++) {
            var hasEventListeners = false;
            for (var foo in renderedObjects[n].eventListeners) {
                hasEventListeners = true;
                break;
            }
            if (hasEventListeners && renderedObjects[n].pointHitTest(x, y)) {
                renderedObject = renderedObjects[n];
            }
        }

        ZUI.activeView.mouseMove();
        for (n = 0; n < renderedObjects.length; n++) {
            if (renderedObjects[n] != renderedObject && renderedObjects[n]._private.isHovered) {
                renderedObjects[n]._private.isHovered = false;
                renderedObjects[n].eventListeners.mouseOut();
            }
        }
        if (renderedObject) {
            if (renderedObject.eventListeners.mouseMove) {
                renderedObject.eventListeners.mouseMove();
            }
            if (renderedObject.eventListeners.mouseOver && !renderedObject._private.isHovered) {
                renderedObject._private.isHovered = true;
                renderedObject.eventListeners.mouseOver();
            }
        }

        if (ZUI.passInputEvent) {
            ZUI.passInputEvent(event);
        }
    };

    // click event callback
    ZUI.click = function(event) {
        var x = ZUI.mouseStatus.x;
        var y = ZUI.mouseStatus.y;
        var renderedObjects = ZUI.activeView.renderedObjects;
        var renderedObject = null;
        for (var n = renderedObjects.length - 1; n >= 0; n--) {
            var hasEventListeners = false;
            for (var foo in renderedObjects[n].eventListeners) {
                hasEventListeners = true;
                break;
            }
            if (hasEventListeners && renderedObjects[n].pointHitTest(x, y)) {
                renderedObject = renderedObjects[n];
                break;
            }
        }

        if (event.button == 0) {
            if (ZUI.customContextMenu.active) {
                ZUI.customContextMenu.close();
            }
            ZUI.activeView.leftClick();
            if (renderedObject && renderedObject.eventListeners.leftClick) {
                renderedObject.eventListeners.leftClick();
            }
        }
        else if (event.button == 1) {
            ZUI.activeView.middleClick();
            if (renderedObject && renderedObject.eventListeners.middleClick) {
                renderedObject.eventListeners.middleClick();
            }
        }
        else if (event.button == 2) {
            ZUI.activeView.rightClick();
            if (renderedObject && renderedObject.eventListeners.rightClick) {
                renderedObject.eventListeners.rightClick();
            }
        }
        if (ZUI.passInputEvent) {
            ZUI.passInputEvent(event);
        }
    };

    // dblclick event handler
    ZUI.doubleClick = function(event) {
        var x = ZUI.mouseStatus.x;
        var y = ZUI.mouseStatus.y;
        var renderedObjects = ZUI.activeView.renderedObjects;
        var renderedObject = null;
        for (var n = renderedObjects.length - 1; n >= 0; n--) {
            var hasEventListeners = false;
            for (var foo in renderedObjects[n].eventListeners) {
                hasEventListeners = true;
                break;
            }
            if (hasEventListeners && renderedObjects[n].pointHitTest(x, y)) {
                renderedObject = renderedObjects[n];
                break;
            }
        }

        if (event.button == 0) {
            ZUI.activeView.leftDoubleClick();
            if (renderedObject && renderedObject.eventListeners.leftDoubleClick) {
                renderedObject.eventListeners.leftDoubleClick();
            }
        }
        else if (event.button == 1) {
            ZUI.activeView.middleDoubleClick();
            if (renderedObject && renderedObject.eventListeners.middleDoubleClick) {
                renderedObject.eventListeners.middleDoubleClick();
            }
        }
        if (ZUI.passInputEvent) {
            ZUI.passInputEvent(event);
        }
    };

    // mousewheel / DOMMouseScroll event handler
    ZUI.mouseWheel = function(event) {
        event.preventDefault();
        var scroll = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

        var x = ZUI.mouseStatus.x;
        var y = ZUI.mouseStatus.y;
        var renderedObjects = ZUI.activeView.renderedObjects;
        var renderedObject = null;
        for (var n = renderedObjects.length - 1; n >= 0; n--) {
            var hasEventListeners = false;
            for (var foo in renderedObjects[n].eventListeners) {
                hasEventListeners = true;
                break;
            }
            if (hasEventListeners && renderedObjects[n].pointHitTest(x, y)) {
                renderedObject = renderedObjects[n];
                break;
            }
        }

        ZUI.activeView.mouseWheel(scroll);
        if (renderedObject && renderedObject.eventListeners.mouseWheel) {
            renderedObject.eventListeners.mouseWheel(scroll);
        }
        if (ZUI.passInputEvent) {
            ZUI.passInputEvent(event);
        }
    };

    // contextmenu event handler
    ZUI.contextMenu = function(event) {
        var x = ZUI.mouseStatus.x;
        var y = ZUI.mouseStatus.y;
        var renderedObjects = ZUI.activeView.renderedObjects;
        var renderedObject = null;
        for (var n = renderedObjects.length - 1; n >= 0; n--) {
            var hasEventListeners = false;
            for (var foo in renderedObjects[n].eventListeners) {
                hasEventListeners = true;
                break;
            }
            if (hasEventListeners && renderedObjects[n].pointHitTest(x, y)) {
                renderedObject = renderedObjects[n];
                break;
            }
        }

        ZUI.activeView.contextMenu();
        if (renderedObject && renderedObject.eventListeners.contextMenu) {
            renderedObject.eventListeners.contextMenu();
        }
        if (ZUI.passInputEvent) {
            ZUI.passInputEvent(event);
        }
    };

    // fires a ZUI event */
    ZUI.fireEvent = function(event) {
        // filter event listeners by type
        var eventListeners1 = ZUI.eventListeners.get(event.type);
        if (!eventListeners1) {
            return;
        }

        // filter event listeners by target
        var eventListeners2 = eventListeners1.get(event.target);
        if (eventListeners2) {
            // execute callback functions
            for (var n = 0; n < eventListeners2.length; n++) {
                eventListeners2[n].callback(event, event.data, eventListeners2[n].data);
            }
        }

        // execute callback functions with no particular target
        var eventListeners3 = eventListeners1.get("_all");
        if (eventListeners3) {
            for (n = 0; n < eventListeners3.length; n++) {
                eventListeners3[n].callback(event, event.data, eventListeners3[n].data);
            }
        }
    };

    // adds a ZUI event listener
    ZUI.addEventListener = function(eventListener) {
        // filter event listeners by type
        var eventListeners1 = ZUI.eventListeners.get(eventListener.type);
        if (!eventListeners1) {
            eventListeners1 = new ZUI.Hash();
            ZUI.eventListeners.put(eventListener.type, eventListeners1);
        }

        // filter event listeners by target
        var target = eventListener.target;
        if (target === undefined || target === null) {
            target = "_all";
        }
        var eventListeners2 = eventListeners1.get(target);
        if (!eventListeners2) {
            eventListeners2 = [];
            eventListeners1.put(target, eventListeners2);
        }

        // add event listener
        eventListeners2.push(eventListener);
    };

    // removes a ZUI event listener
    ZUI.removeEventListener = function(eventListener) {
        // filter event listeners by type
        var eventListeners1 = ZUI.eventListeners.get(eventListener.type);
        if (!eventListeners1) {
            return;
        }

        // filter event listeners by target
        var target = eventListener.target;
        if (target === undefined || target === null) {
            target = "_all";
        }
        var eventListeners2 = eventListeners1.get(target);
        if (!eventListeners2) {
            return;
        }

        // remove event listener
        var index = eventListeners2.indexOf(eventListener);
        if (index < 0) {
            return;
        }
        eventListeners2.splice(index, 1);

        // remove target level eventListeners if empty
        if (eventListeners2.length == 0) {
            eventListeners1.delete(target);
        }

        // remove type level eventListeners if empty
        if (eventListeners1.length == 0) {
            ZUI.eventListeners.delete(eventListener.type);
        }
    };

    // removes all ZUI event listeners for the specified target
    ZUI.removeEventListenersForTarget = function(target) {
        var keys = ZUI.eventListeners.getKeys();
        for (var n = 0; n < keys.length; n++) {
            var key = keys[n];
            var eventListeners = ZUI.eventListeners.get(key);
            if (eventListeners.get(target)) {
                eventListeners.delete(target);
            }
            if (!eventListeners.getSize()) {
                ZUI.eventListeners.delete(key);
            }
        }
    };

    // per-frame update with customized logic (override if needed)
    ZUI.update = function() {};

})();

(function() {

    // constructor
    ZUI.View = function() {
        // call base constructor
        ZUI.Base.call(this);

        this._private.isUpdated = true;

        this.renderedObjects = [];
        this.animations = [];
    };

    // inherit base
    ZUI.Helper.inheritClass(ZUI.Base, ZUI.View);

    // start an animation
    ZUI.View.prototype.animate = function(animation) {
        animation.begin();
    };

    // active callback (abstract)
    ZUI.View.prototype.active = function() {
        this._private.isUpdated = true;
    };

    // inactive callback (abstract)
    ZUI.View.prototype.inactive = function() {};

    // update callback (abstract)
    ZUI.View.prototype.update = function() {};

    // custom draw callback (abstract)
    ZUI.View.prototype.draw = function() {};

    // remove callback (abstract)
    ZUI.View.prototype.remove = function() {};

    // leftMouseDown callback (abstract)
    ZUI.View.prototype.leftMouseDown = function() {};

    // middleMouseDown callback (abstract)
    ZUI.View.prototype.middleMouseDown = function() {};

    // rightMouseDown callback (abstract)
    ZUI.View.prototype.rightMouseDown = function() {};

    // leftMouseUp callback (abstract)
    ZUI.View.prototype.leftMouseUp = function() {};

    // middleMouseUp callback (abstract)
    ZUI.View.prototype.middleMouseUp = function() {};

    // rightMouseUp callback (abstract)
    ZUI.View.prototype.rightMouseUp = function() {};

    // mouseMove callback (abstract)
    ZUI.View.prototype.mouseMove = function() {};

    // leftClick callback (abstract)
    ZUI.View.prototype.leftClick = function() {};

    // middleClick callback (abstract)
    ZUI.View.prototype.middleClick = function() {};

    // rightClick callback (abstract)
    ZUI.View.prototype.rightClick = function() {};

    // leftDoubleClick callback (abstract)
    ZUI.View.prototype.leftDoubleClick = function() {};

    // middleDoubleClick callback (abstract)
    ZUI.View.prototype.middleDoubleClick = function() {};

    // mouseWheel callback (abstract)
    ZUI.View.prototype.mouseWheel = function(scroll) {};

    // contextMenu callback (abstract)
    ZUI.View.prototype.contextMenu = function() {};

})();

(function() {

    // constructor
    ZUI.Animation = function(attributes) {
        this.view = (attributes.view === undefined) ? null : attributes.view;
        this.duration = (attributes.duration === undefined) ? 0 : attributes.duration;
        this.type = (attributes.type === undefined) ? "custom" : attributes.type;
        this._begin = (attributes.begin === undefined) ? function(){} : attributes.begin;
        this._end = (attributes.end === undefined) ? function(){} : attributes.end;
        this._draw = (attributes.draw === undefined) ? function(elapsedTime, remainingTime, view){} : attributes.draw;
        this.data = (attributes.data === undefined) ? null : attributes.data;
        if (this.type == "zoom") {
            this.bezier = (attributes.bezier === undefined) ? [0.25, 0.1, 0.25, 1] : attributes.bezier;
            this.spline = new ZUI.Helper.KeySpline(this.bezier[0], this.bezier[1], this.bezier[2], this.bezier[3]);
            this.sourceX = (attributes.sourceX === undefined) ? undefined : attributes.sourceX;
            this.sourceY = (attributes.sourceY === undefined) ? undefined : attributes.sourceY;
            this.sourceDistance = (attributes.sourceDistance === undefined) ? undefined : attributes.sourceDistance;
            this.targetX = (attributes.targetX === undefined) ? undefined : attributes.targetX;
            this.targetY = (attributes.targetY === undefined) ? undefined : attributes.targetY;
            this.targetDistance = (attributes.targetDistance === undefined) ? undefined : attributes.targetDistance;
        }
    };

    // begin
    ZUI.Animation.prototype.begin = function() {
        if (this.view) {
            this.view.animations.push(this);
        }
        this.startTime = ZUI.Helper.getTime();
        this.remainingTime = this.duration;
        if (this.type == "zoom") {
            if (this.sourceX === undefined) this.sourceX = ZUI.camera.truePosition.x;
            if (this.sourceY === undefined) this.sourceY = ZUI.camera.truePosition.y;
            if (this.sourceDistance === undefined) this.sourceDistance = ZUI.camera.trueDistance;
            if (this.targetX === undefined) this.targetX = this.sourceX;
            if (this.targetY === undefined) this.targetY = this.sourceY;
            if (this.targetDistance === undefined) this.targetDistance = this.sourceDistance;
            ZUI.camera.setPosition(
                this.sourceX,
                this.sourceY
            );
            ZUI.camera.setDistance(this.sourceDistance);
        }
        this._begin(this.data);
        if (this.remainingTime <= 0) {
            this.end();
        }
    };

    // end
    ZUI.Animation.prototype.end = function() {
        if (this.view) {
            var index = this.view.animations.indexOf(this);
            if (index >= 0) {
                this.view.animations.splice(index, 1);
            }
        }
        if (this.type == "zoom") {
            ZUI.camera.setPosition(
                this.targetX,
                this.targetY
            );
            ZUI.camera.setDistance(this.targetDistance);
        }
        this._end(this.data);
    };

    // draw
    ZUI.Animation.prototype.draw = function() {
        var currentTime = ZUI.Helper.getTime();
        this.elapsedTime = currentTime - this.startTime;
        this.remainingTime = this.duration - this.elapsedTime;
        if (this.remainingTime > 0) {
            if (this.type == "zoom") {
                var time = this.elapsedTime / (this.elapsedTime + this.remainingTime);
                var progress = this.spline.get(time);
                ZUI.camera.setPosition(
                    (this.targetX - this.sourceX) * progress + this.sourceX,
                    (this.targetY - this.sourceY) * progress + this.sourceY
                );
                ZUI.camera.setDistance((this.targetDistance - this.sourceDistance) * progress + this.sourceDistance);
            }
            this._draw(this.elapsedTime, this.remainingTime, this.view, this.data);
        }
        else {
            this.end();
        }
    };

})();

(function() {

    // constructor
    ZUI.ContextMenu = function() {
        // call base constructor
        ZUI.Base.call(this);

        // properties
        this.options = null;
        this.x = 0;
        this.y = 0;
        this.active = false;
        this.container = document.createElement('div');

        // set up DOM element
        this.container.className = 'zui-contextMenu';
        this.container.style.border = '1px solid #B4B4B4';
        this.container.style.width = '160px';
        this.container.style.height = 'auto';
        this.container.style.minHeight = '0';
        this.container.style.position = 'relative';
        this.container.style.left = ((this.x > ZUI.width / 2) ? (this.x - 162) : this.x) + 'px';
        this.container.style.top = this.y + 'px';
        this.container.oncontextmenu = function() {
            return false;
        };
    };

    // inherit base
    ZUI.Helper.inheritClass(ZUI.Base, ZUI.ContextMenu);

    // open
    ZUI.ContextMenu.prototype.open = function(x, y, options) {
        // close context menu if already open
        if (this.active) {
            this.close();
        }

        // set position, if specified
        if (x === undefined && y === undefined) {
            this.x = ZUI.mouseStatus.x;
            this.y = ZUI.mouseStatus.y;
            this.container.style.left = ((this.x > ZUI.width / 2) ? (this.x - 162) : this.x) + 'px';
            this.container.style.top = this.y + 'px';
        }
        else {
            this.x = x;
            this.y = y;
            this.container.style.left = ((this.x > ZUI.width / 2) ? (this.x - 162) : this.x) + 'px';
            this.container.style.top = this.y + 'px';
        }

        // add options
        this.options = options;
        for (var n = 0; n < options.length; n++) {
            this.container.appendChild(options[n].container);
            options[n].contextMenu = this;
        }

        // append context menu container to document
        ZUI.container.appendChild(this.container);

        // change status to active
        this.active = true;
    };

    // close
    ZUI.ContextMenu.prototype.close = function() {
        // remove context menu container from document
        ZUI.container.removeChild(this.container);

        // clear options
        this.options = null;
        this.container.innerHTML = '';

        // change status to inactive
        this.active = false;
    };

    ///////////////////////////////////////////////////////////////////////////////

    // constructor
    ZUI.ContextMenu.Option = function(label, callback, data, enabled, autoClose) {
        // call base constructor
        ZUI.Base.call(this);

        // properties
        this.label = label;
        this.callback = callback;
        this.data = data;
        this.enabled = (enabled === undefined) ? true : enabled;
        this.autoClose = (autoClose === undefined) ? true : autoClose;
        this.contextMenu = null;
        this.container = document.createElement("span");

        // set up DOM element
        this.container.className = "zui-contextMenu-option";
        this.container.style.padding = "3px 20px";
        this.container.style.display = "block";
        this.container.style.width = "120px";
        if (this.enabled) {
            this.container.style.backgroundColor = "#FFFFFF";
            this.container.style.color = "#3C3C3C";
        }
        else {
            this.container.style.backgroundColor = "#FFFFFF";
            this.container.style.color = "#B4B4B4";
        }
        this.container.innerHTML = label;
        this.container.onmouseover = (function() {
            if (this.enabled) {
                this.container.style.backgroundColor = "#787878";
                this.container.style.color = "#FFFFFF";
            }
            else {
                this.container.style.backgroundColor = "#FFFFFF";
                this.container.style.color = "#B4B4B4";
            }
        }).bind(this);
        this.container.onmouseout = (function() {
            if (this.enabled) {
                this.container.style.backgroundColor = "#FFFFFF";
                this.container.style.color = "#3C3C3C";
            }
            else {
                this.container.style.backgroundColor = "#FFFFFF";
                this.container.style.color = "#B4B4B4";
            }
        }).bind(this);
        this.container.onclick = (function(){
            this.callback(this.data);
            if (this.autoClose && this.contextMenu.active) {
                this.contextMenu.close();
            }
        }).bind(this);
    };

    // inherit base
    ZUI.Helper.inheritClass(ZUI.Base, ZUI.ContextMenu.Option);

})();


(function() {

    // add namespace
    ZUI.Camera = {};

})();

(function() {

    // constructor
    ZUI.Camera.DefaultCamera = function(properties) {
        // call base constructor
        ZUI.Base.call(this);

        // transfer properties to this object
        for (var propertyName in properties) {
            this[propertyName] = properties[propertyName];
        }

        // save scope for access by child scopes
        var that = this;

        // assign default to undefined properties
        //   data
        //   position
        //   truePosition
        //   distance
        //   trueDistance
        //   fov
        //   followRate
        (function () {
            // define default properties
            var defaultProperties = {
                data: {},
                position: {
                    x: 0,
                    y: 0
                },
                truePosition: {
                    x: 0,
                    y: 0
                },
                positionOffset: {
                    x: 0,
                    y: 0
                },
                distance: null,
                trueDistance: null,
                fov: Math.PI / 2,
                followRate: 1
            };
            defaultProperties.distance = defaultProperties.trueDistance = (ZUI.width / 2) / Math.tan(defaultProperties.fov / 2);

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, that, defaultProperties[propertyName]);
            }
        })();
    };

    // inherit base prototype
    ZUI.Helper.inheritClass(ZUI.Base, ZUI.Camera.DefaultCamera);

    // update
    ZUI.Camera.DefaultCamera.prototype.update = function () {
        if (this.truePosition.x != this.position.x) {
            this.truePosition.x += (this.position.x - this.truePosition.x) * this.followRate;
            if (Math.abs(this.position.x - this.truePosition.x) < this.trueDistance * 0.005) {
                this.truePosition.x = this.position.x;
            }
            ZUI.activeView._private.isUpdated = true;
        }

        if (this.truePosition.y != this.position.y) {
            this.truePosition.y += (this.position.y - this.truePosition.y) * this.followRate;
            if (Math.abs(this.position.y - this.truePosition.y) < this.trueDistance * 0.005) {
                this.truePosition.y = this.position.y;
            }
            ZUI.activeView._private.isUpdated = true;
        }

        if (this.trueDistance != this.distance) {
            this.trueDistance += (this.distance - this.trueDistance) * this.followRate;
            if (Math.abs(this.distance - this.trueDistance) < this.trueDistance * 0.005) {
                this.trueDistance = this.distance;
            }
            ZUI.activeView._private.isUpdated = true;
        }
    };

    // set position
    ZUI.Camera.DefaultCamera.prototype.setPosition = function(x, y) {
        this.position.x = this.truePosition.x = x;
        this.position.y = this.truePosition.y = y;
        ZUI.activeView._private.isUpdated = true;
    };

    // set distance
    ZUI.Camera.DefaultCamera.prototype.setDistance = function(distance) {
        this.distance = this.trueDistance = distance;
        ZUI.activeView._private.isUpdated = true;
    };

    // project point
    ZUI.Camera.DefaultCamera.prototype.projectPoint = function(point) {
        var pixelsPerUnit = ZUI.width / (Math.tan(this.fov / 2) * this.trueDistance * 2);
        return {
            x: (point.x - this.truePosition.x) * pixelsPerUnit + ZUI.width / 2,
            y: (point.y - this.truePosition.y) * pixelsPerUnit + ZUI.height / 2
        };
    };

    // unproject point
    ZUI.Camera.DefaultCamera.prototype.unprojectPoint = function(point) {
        var pixelsPerUnit = ZUI.width / (Math.tan(this.fov / 2) * this.trueDistance * 2);
        return {
            x: (point.x - ZUI.width / 2) / pixelsPerUnit + this.truePosition.x,
            y: (point.y - ZUI.height / 2) / pixelsPerUnit + this.truePosition.y
        };
    };

    // project distance
    ZUI.Camera.DefaultCamera.prototype.projectDistance = function(distance) {
        var pixelsPerUnit = ZUI.width / (Math.tan(this.fov / 2) * this.trueDistance * 2);
        return distance * pixelsPerUnit;
    };

    // unproject distance
    ZUI.Camera.DefaultCamera.prototype.unprojectDistance = function(distance) {
        var pixelsPerUnit = ZUI.width / (Math.tan(this.fov / 2) * this.trueDistance * 2);
        return distance / pixelsPerUnit;
    };

    // reset
    ZUI.Camera.DefaultCamera.prototype.reset = function() {
        this.setPosition(0, 0);
        this.setDistance((ZUI.width / 2) / Math.tan(this.fov / 2));
    };

})();

(function() {

    // add namespace
    ZUI.RenderedObject = {};

})();

(function () {

    // constructor
    ZUI.RenderedObject.Base = function (properties) {
        // call base constructor
        ZUI.Base.call(this);

        // private properties
        this._private.isUpdated = true;
        this._private.isReady = false;
        this._private.canvas = document.createElement('canvas');
        this._private.context = this._private.canvas.getContext('2d');
        this._private.views = [];
        this._private.isHovered = false;

        // set canvas size
        this._private.canvas.width = ZUI.width;
        this._private.canvas.height = ZUI.height;

        // transfer properties to this object
        for (var propertyName in properties) {
            this[propertyName] = properties[propertyName];
        }

        // save scope for access by child scopes
        var that = this;

        // assign default to undefined properties
        //   data
        //   position {x, y}
        //   positionScale
        //   positionOffset {x, y}
        //   positionOffsetScale
        //   rotate
        //   hStretch
        //   vStretch
        //   stroke
        //   strokeColor
        //   strokeThickness
        //   strokeThicknessScale
        //   fill
        //   fillColor
        //   alpha
        //   centerAt {horizontal, vertical}
        //   eventListeners
        (function () {
            // define default properties
            var defaultProperties = {
                data: {},
                position: {
                    x: 0,
                    y: 0
                },
                positionScale: ZUI.Def.WorldScale,
                positionOffset: {
                    x: 0,
                    y: 0
                },
                positionOffsetScale: ZUI.Def.ScreenScale,
                rotate: 0,
                hStretch: 1,
                vStretch: 1,
                stroke: true,
                strokeColor: "#000000",
                strokeThickness: 1,
                strokeThicknessScale: ZUI.Def.WorldScale,
                fill: true,
                fillColor: "#000000",
                alpha: 1,
                centerAt: {
                    horizontal: ZUI.Def.Left,
                    vertical: ZUI.Def.Top
                },
                eventListeners: []
            };

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, that, defaultProperties[propertyName]);
            }
        })();
    };

    // inherit base
    ZUI.Helper.inheritClass(ZUI.Base, ZUI.RenderedObject.Base);

    // property update callback
    ZUI.RenderedObject.Base.prototype.update = function() {
        this._private.isUpdated = true;
        for (var n = 0; n < this._private.views.length; n++) {
            this._private.views[n]._private.isUpdated = true;
        }
    }

    // attach to view
    ZUI.RenderedObject.Base.prototype.attachToView = function(view) {
        this._private.views.push(view);
        view.renderedObjects.push(this);
        view._private.isUpdated = true;
        return this;
    };

    // detach from view
    ZUI.RenderedObject.Base.prototype.detachFromView = function (view) {
        ZUI.Helper.removeFromArray(this._private.views, view);
        ZUI.Helper.removeFromArray(view.renderedObjects, this);
        view._private.isUpdated = true;
        return this;
    };

    // draw
    ZUI.RenderedObject.Base.prototype.draw = function () {
        if (this._private.isUpdated) {
            this.render();
        }

        ZUI.context.drawImage(this._private.canvas, 0, 0);
    };

    // point hit test
    ZUI.RenderedObject.Base.prototype.pointHitTest = function (x, y) {
        return this._private.context.isPointInPath(x, y);
    };

    // render (abstract)
    ZUI.RenderedObject.Base.prototype.render = function () {
        // reset update flag
        this._private.isUpdated = false;

        // clear canvas
        this._private.context.clearRect(0, 0, this._private.canvas.width, this._private.canvas.height);

        // get rendered position
        this.renderedPosition = ZUI.Helper.interpretScale(this.position, this.positionScale);
        this.renderedPositionOffset = ZUI.Helper.interpretScale(this.positionOffset, this.positionOffsetScale);

        // get rendered stroke thickness
        this.renderedStrokeThickness = ZUI.Helper.interpretScale(this.strokeThickness, this.strokeThicknessScale);
    };

    // force render
    ZUI.RenderedObject.Base.prototype.forceRender = function () {
        this._private.isUpdated = true;

        for (var n = 0; n < this._private.views.length; n++) {
            this._private.views[n]._private.isUpdated = true;
        }
    };

    // remove
    ZUI.RenderedObject.Base.prototype.remove = function () {
        // detach from all views
        for (var n = 0; n < this._private.views.length; n++) {
            this.detachFromView(this._private.views[n]);
        }
    }

})();

(function() {

    // constructor
    ZUI.RenderedObject.Rectangle = function(properties) {
        // call base constructor
        ZUI.RenderedObject.Base.call(this, properties);

        // save scope for access by child scopes
        var that = this;

        // assign default to undefined properties
        //   width
        //   widthScale
        //   height
        //   heightScale
        //   radius
        //   radiusScale
        //   ltRadius
        //   ltRadiusScale
        //   rtRadius
        //   rtRadiusScale
        //   lbRadius
        //   lbRadiusScale
        //   rbRadius
        //   rbRadiusScale
        (function () {
            // define default properties (part 1)
            var defaultProperties = {
                width: 0,
                widthScale: ZUI.Def.WorldScale,
                height: 0,
                heightScale: ZUI.Def.WorldScale,
                radius: 0,
                radiusScale: ZUI.Def.WorldScale
            };

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, that, defaultProperties[propertyName]);
            }

            // define default properties (part 2)
            var defaultProperties = {
                ltRadius: that.radius,
                ltRadiusScale: that.radiusScale,
                rtRadius: that.radius,
                rtRadiusScale: that.radiusScale,
                lbRadius: that.radius,
                lbRadiusScale: that.radiusScale,
                rbRadius: that.radius,
                rbRadiusScale: that.radiusScale
            };

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, that, defaultProperties[propertyName]);
            }
        })();

        // set ready flag
        this._private.isReady = true;
    };

    // inherit base prototype
    ZUI.Helper.inheritClass(ZUI.RenderedObject.Base, ZUI.RenderedObject.Rectangle);

    // render
    ZUI.RenderedObject.Rectangle.prototype.render = function () {
        // call base method
        ZUI.RenderedObject.Base.prototype.render.call(this);

        // get rendered size
        this.renderedWidth = ZUI.Helper.interpretScale(this.width, this.widthScale);
        this.renderedHeight = ZUI.Helper.interpretScale(this.height, this.heightScale);
        this.renderedRadius = ZUI.Helper.interpretScale(this.radius, this.radiusScale);
        this.renderedLtRadius = ZUI.Helper.interpretScale(this.ltRadius, this.ltRadiusScale);
        this.renderedRtRadius = ZUI.Helper.interpretScale(this.rtRadius, this.rtRadiusScale);
        this.renderedLbRadius = ZUI.Helper.interpretScale(this.lbRadius, this.lbRadiusScale);
        this.renderedRbRadius = ZUI.Helper.interpretScale(this.rbRadius, this.rbRadiusScale);

        // adjust rendered radius
        if (this.renderedRadius > this.renderedWidth / 2) this.renderedRadius = this.renderedWidth / 2;
        if (this.renderedRadius > this.renderedHeight / 2) this.renderedRadius = this.renderedHeight / 2;
        if (this.renderedLtRadius > this.renderedWidth / 2) this.renderedLtRadius = this.renderedWidth / 2;
        if (this.renderedLtRadius > this.renderedHeight / 2) this.renderedLtRadius = this.renderedHeight / 2;
        if (this.renderedRtRadius > this.renderedWidth / 2) this.renderedRtRadius = this.renderedWidth / 2;
        if (this.renderedRtRadius > this.renderedHeight / 2) this.renderedRtRadius = this.renderedHeight / 2;
        if (this.renderedLbRadius > this.renderedWidth / 2) this.renderedLbRadius = this.renderedWidth / 2;
        if (this.renderedLbRadius > this.renderedHeight / 2) this.renderedLbRadius = this.renderedHeight / 2;
        if (this.renderedRbRadius > this.renderedWidth / 2) this.renderedRbRadius = this.renderedWidth / 2;
        if (this.renderedRbRadius > this.renderedHeight / 2) this.renderedRbRadius = this.renderedHeight / 2;

        // get adjusted position
        var adjustedPosition = ZUI.Helper.interpretCenterAt(this.renderedPosition, this.renderedPositionOffset, this.renderedWidth, this.renderedHeight, this.centerAt);

        // set up context
        this._private.context.save();
        this._private.context.strokeStyle = this.strokeColor;
        this._private.context.fillStyle = this.fillColor;
        this._private.context.globalAlpha = this.alpha;
        this._private.context.lineWidth = this.renderedStrokeThickness;

        // render
        this._private.context.save();
        this._private.context.translate(adjustedPosition.x, adjustedPosition.y);
        this._private.context.scale(this.hStretch, this.vStretch);
        this._private.context.rotate(this.rotate);
        this._private.context.beginPath();
        this._private.context.moveTo(this.renderedLtRadius, 0);
        this._private.context.arcTo(this.renderedWidth, 0, this.renderedWidth, this.renderedHeight, this.renderedRtRadius);
        this._private.context.arcTo(this.renderedWidth, this.renderedHeight, 0, this.renderedHeight, this.renderedRbRadius);
        this._private.context.arcTo(0, this.renderedHeight, 0, 0, this.renderedLbRadius);
        this._private.context.arcTo(0, 0, this.renderedWidth, 0, this.renderedLtRadius);
        this._private.context.closePath();
        this._private.context.restore();
        if (this.stroke) {
            this._private.context.stroke();
        }
        if (this.fill) {
            this._private.context.fill();
        }

        // restore context
        this._private.context.restore();
    };

})();


(function() {

    // constructor
    ZUI.RenderedObject.Circle = function(properties) {
        // call base constructor
        ZUI.RenderedObject.Base.call(this, properties);

        // save scope for access by child scopes
        var that = this;

        // assign default to undefined properties
        //   radius
        //   radiusScale
        //   hRadius
        //   hRadiusScale
        //   vRadius
        //   vRadiusScale
        (function () {
            // define default properties (part 1)
            var defaultProperties = {
                radius: 0,
                radiusScale: ZUI.Def.WorldScale
            };

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, that, defaultProperties[propertyName]);
            }

            // define default properties (part 2)
            var defaultProperties = {
                hRadius: that.radius,
                hRadiusScale: that.radiusScale,
                vRadius: that.radius,
                vRadiusScale: that.radiusScale
            };

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, that, defaultProperties[propertyName]);
            }
        })();

        // set ready flag
        this._private.isReady = true;
    };

    // inherit base prototype
    ZUI.Helper.inheritClass(ZUI.RenderedObject.Base, ZUI.RenderedObject.Circle);

    // render
    ZUI.RenderedObject.Circle.prototype.render = function () {
        // call base method
        ZUI.RenderedObject.Base.prototype.render.call(this);

        // get rendered size
        this.renderedRadius = ZUI.Helper.interpretScale(this.radius, this.radiusScale);
        this.renderedHRadius = ZUI.Helper.interpretScale(this.hRadius, this.hRadiusScale);
        this.renderedVRadius = ZUI.Helper.interpretScale(this.vRadius, this.vRadiusScale);

        // get adjusted position
        var adjustedPosition = ZUI.Helper.interpretCenterAt({
            x: this.renderedPosition.x + this.renderedRadius,
            y: this.renderedPosition.y + this.renderedRadius
        }, this.renderedPositionOffset, this.renderedRadius * 2, this.renderedRadius * 2, this.centerAt);

        // set up context
        this._private.context.save();
        this._private.context.strokeStyle = this.strokeColor;
        this._private.context.fillStyle = this.fillColor;
        this._private.context.globalAlpha = this.alpha;
        this._private.context.lineWidth = this.renderedStrokeThickness;

        // render
        this._private.context.save();
        this._private.context.translate(adjustedPosition.x, adjustedPosition.y);
        this._private.context.scale(this.hStretch * this.renderedHRadius, this.vStretch * this.renderedVRadius);
        this._private.context.rotate(this.rotate);
        this._private.context.beginPath();
        this._private.context.arc(0, 0, 1, 0, 2 * Math.PI);
        this._private.context.closePath();
        this._private.context.restore();
        if (this.stroke) {
            this._private.context.stroke();
        }
        if (this.fill) {
            this._private.context.fill();
        }

        // restore context
        this._private.context.restore();
    };

})();


(function() {

    // constructor
    ZUI.RenderedObject.Text = function(properties) {
        // call base constructor
        ZUI.RenderedObject.Base.call(this, properties);

        // private properties
        this._private.lines = [];

        // save scope for access by child scopes
        var that = this;

        // assign default to undefined properties
        //   size
        //   sizeScale
        //   font
        //   content
        //   isBold
        //   isItalic
        //   isUnderline
        (function () {
            // define default properties
            var defaultProperties = {
                size: 12,
                sizeScale: ZUI.Def.WorldScale,
                font: 'Helvetica',
                content: '',
                isBold: false,
                isItalic: false,
                isUnderline: false
            };

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, that, defaultProperties[propertyName]);
            }
        })();

        // split lines
        var contentInLines = this.content.split('\n');
        for (var n = 0; n < contentInLines.length; n++) {
            var line = {
                content: contentInLines[n],
                renderedPosition: null,
                renderedWidth: null,
                renderedHeight: null
            };
            this._private.lines.push(line);
        }

        // set ready flag
        this._private.isReady = true;
    };

    // inherit base prototype
    ZUI.Helper.inheritClass(ZUI.RenderedObject.Base, ZUI.RenderedObject.Text);

    // render
    ZUI.RenderedObject.Text.prototype.render = function () {
        // call base method
        ZUI.RenderedObject.Base.prototype.render.call(this);

        // get rendered size
        this.renderedSize = ZUI.Helper.interpretScale(this.size, this.sizeScale);
        this.renderedWidth = 0;
        this.renderedHeight = this.renderedSize * (this._private.lines.length - 0.2);
        this._private.context.save();
        this._private.context.font = ((this.isBold) ? 'bold ' : '') + ((this.isItalic) ? 'italic ' : '') + '60' + 'px ' + this.font;
        for (var n = 0; n < this._private.lines.length; n++) {
            var line = this._private.lines[n];
            line.renderedWidth = this._private.context.measureText(line.content).width / 60 * this.renderedSize;
            if (line.renderedWidth > this.renderedWidth) {
                this.renderedWidth = line.renderedWidth;
            }
            line.renderedHeight = this.renderedSize * 0.8;
        }
        this._private.context.restore();

        // get adjusted position
        var adjustedPosition = ZUI.Helper.interpretCenterAt(this.renderedPosition, this.renderedPositionOffset, 0, this.renderedHeight, this.centerAt);

        // set up context
        this._private.context.save();
        this._private.context.strokeStyle = this.strokeColor;
        this._private.context.fillStyle = this.fillColor;
        this._private.context.globalAlpha = this.alpha;
        this._private.context.lineWidth = this.renderedStrokeThickness;
        this._private.context.font = ((this.isBold) ? 'bold ' : '') + ((this.isItalic) ? 'italic ' : '') + '60' + 'px ' + this.font;

        // render
        this._private.context.save();
        this._private.context.translate(adjustedPosition.x, adjustedPosition.y);
        this._private.context.rotate(this.rotate);
        for (var n = 0; n < this._private.lines.length; n++) {
            var line = this._private.lines[n];
            line.renderedPosition = ZUI.Helper.interpretCenterAt(
                {
                    x: 0,
                    y: this.renderedSize * n
                },
                {
                    x: 0,
                    y: 0
                },
                line.renderedWidth,
                0,
                this.centerAt
            );
            this._private.context.save();
            this._private.context.translate(line.renderedPosition.x, line.renderedPosition.y + this.renderedSize * 0.8);
            this._private.context.scale(this.renderedSize / 60 * this.hStretch, this.renderedSize / 60 * this.vStretch);
            if (this.stroke) {
                this._private.context.lineJoin = 'round';
                this._private.context.strokeText(line.content, 0, 0);
            }
            if (this.fill) {
                this._private.context.fillText(line.content, 0, 0);
            }
            this._private.context.restore();
            if (this.isUnderline) {
                if (this.stroke) {
                    this._private.context.beginPath();
                    this._private.context.moveTo(
                        line.renderedPosition.x - this.renderedStrokeThickness / 2,
                        Math.round(line.renderedPosition.y + this.renderedSize * 0.85) + 0.5
                    );
                    this._private.context.lineTo(
                        line.renderedPosition.x + line.renderedWidth + this.renderedStrokeThickness / 2,
                        Math.round(line.renderedPosition.y + this.renderedSize * 0.85) + 0.5
                    );
                    this._private.context.stroke();
                }
                if (this.fill) {
                    this._private.context.beginPath();
                    this._private.context.moveTo(
                        line.renderedPosition.x,
                        Math.round(line.renderedPosition.y + this.renderedSize * 0.85) + 0.5
                    );
                    this._private.context.lineTo(
                        line.renderedPosition.x + line.renderedWidth,
                        Math.round(line.renderedPosition.y + this.renderedSize * 0.85) + 0.5
                    );
                    this._private.context.stroke();
                }
            }
        }
        this._private.context.beginPath();
        for (var n = 0; n < this._private.lines.length; n++) {
            var line = this._private.lines[n];
            this._private.context.moveTo(line.renderedPosition.x, line.renderedPosition.y);
            this._private.context.lineTo(line.renderedPosition.x + line.renderedWidth, line.renderedPosition.y);
            this._private.context.lineTo(line.renderedPosition.x + line.renderedWidth, line.renderedPosition.y + line.renderedHeight);
            this._private.context.lineTo(line.renderedPosition.x, line.renderedPosition.y + line.renderedHeight);
            this._private.context.closePath();
        }
        this._private.context.restore();

        // restore context
        this._private.context.restore();
    };

})();


(function() {

    // constructor
    ZUI.RenderedObject.LinePath = function(properties) {
        // call base constructor
        ZUI.RenderedObject.Base.call(this, properties);

        // save scope for access by child scopes
        var that = this;

        // assign default to undefined properties
        //   vertices
        //   verticesScale
        (function () {
            // define default properties (part 1)
            var defaultProperties = {
                vertices: []
            };

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, that, defaultProperties[propertyName]);
            }

            // define default properties (part 2)
            var defaultProperties = {
                verticesScale: []
            };
            for (var n = 0; n < that['vertices'].length; n++) {
                defaultProperties.verticesScale.push(ZUI.Def.WorldScale);
            }

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, that, defaultProperties[propertyName]);
            }
        })();

        // set ready flag
        this._private.isReady = true;
    };

    // inherit base prototype
    ZUI.Helper.inheritClass(ZUI.RenderedObject.Base, ZUI.RenderedObject.LinePath);

    // render
    ZUI.RenderedObject.LinePath.prototype.render = function () {
        // call base method
        ZUI.RenderedObject.Base.prototype.render.call(this);

        // get rendered vertices
        this.renderedVertices = [];
        for (var n = 0; n < this.vertices.length; n++) {
            this.renderedVertices.push(ZUI.Helper.interpretScale(this.vertices[n], this.verticesScale[n]));
        }

        // get adjusted position
        // centerAt property does not apply for line paths

        // set up context
        this._private.context.save();
        this._private.context.strokeStyle = this.strokeColor;
        this._private.context.fillStyle = this.fillColor;
        this._private.context.globalAlpha = this.alpha;
        this._private.context.lineWidth = this.renderedStrokeThickness;

        // render
        this._private.context.save();
        this._private.context.translate(this.renderedPosition.x, this.renderedPosition.y);
        this._private.context.scale(this.hStretch, this.vStretch);
        this._private.context.rotate(this.rotate);
        this._private.context.beginPath();
        this._private.context.moveTo(this.renderedVertices[0].x, this.renderedVertices[0].y);
        for (var n = 1; n < this.renderedVertices.length; n++) {
            this._private.context.lineTo(this.renderedVertices[n].x, this.renderedVertices[n].y);
        }
        this._private.context.restore();
        if (this.stroke) {
            this._private.context.stroke();
        }
        if (this.fill) {
            this._private.context.fill();
        }

        // restore context
        this._private.context.restore();
    };

})();


(function() {

    // constructor
    ZUI.RenderedObject.Shape = function(properties) {
        // call base constructor
        ZUI.RenderedObject.Base.call(this, properties);

        // private properties
        this._private.paths = [];

        // save scope for access by child scopes
        var that = this;

        // assign default to undefined properties
        //   paths
        (function () {
            // define default properties
            var defaultProperties = {
                paths: [],
                scale: ZUI.Def.WorldScale
            };

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, that, defaultProperties[propertyName]);
            }
        })();

        // parse paths
        for (var n = 0; n < this.paths.length; n++) {
            var path = {};
            path.instructions = ZUI.Helper.parseSVGPath(this.paths[n]);
            this._private.paths.push(path);
        }

        // set ready flag
        this._private.isReady = true;
    };

    // inherit base prototype
    ZUI.Helper.inheritClass(ZUI.RenderedObject.Base, ZUI.RenderedObject.Shape);

    // render
    ZUI.RenderedObject.Shape.prototype.render = function () {
        // call base method
        ZUI.RenderedObject.Base.prototype.render.call(this);

        // get rendered paths
        this._private.renderedPaths = [];
        for (var n = 0; n < this._private.paths.length; n++) {
            var path = this._private.paths[n];
            var renderedPath = {
                instructions: []
            };
            for (var m = 0; m < path.instructions.length; m++) {
                var instruction = path.instructions[m];
                var renderedInstruction = {
                    type: instruction.type,
                    args: []
                };
                var type = instruction.type;
                var args = instruction.args;
                for (var i = 0; i < args.length; i++) {
                    renderedInstruction.args.push(args[i]);
                }
                for (var i = 0; i + 1 < args.length; i += 2) {
                    var renderedPoint = ZUI.Helper.interpretScale({
                        x: renderedInstruction.args[i],
                        y: renderedInstruction.args[i + 1]
                    }, this.scale);
                    renderedInstruction.args[i] = renderedPoint.x;
                    renderedInstruction.args[i + 1] = renderedPoint.y;
                }
                renderedPath.instructions.push(renderedInstruction);
            }
            this._private.renderedPaths.push(renderedPath);
        }

        // get adjusted position
        var adjustedPosition = ZUI.Helper.interpretCenterAt(this.renderedPosition, this.renderedPositionOffset, 0, 0, this.centerAt);

        // set up context
        this._private.context.save();
        this._private.context.strokeStyle = this.strokeColor;
        this._private.context.fillStyle = this.fillColor;
        this._private.context.globalAlpha = this.alpha;
        this._private.context.lineWidth = this.renderedStrokeThickness;

        // render
        this._private.context.save();
        this._private.context.translate(adjustedPosition.x, adjustedPosition.y);
        this._private.context.scale(this.hStretch, this.vStretch);
        this._private.context.rotate(this.rotate);
        this._private.context.beginPath();
        for (var n = 0; n < this._private.renderedPaths.length; n++) {
            var renderedPath = this._private.renderedPaths[n];
            for (var m = 0; m < renderedPath.instructions.length; m++) {
                var instruction = renderedPath.instructions[m];
                this._private.context[instruction.type].apply(this._private.context, instruction.args);
            }
        }
        this._private.context.restore();
        if (this.stroke) {
            this._private.context.stroke();
        }
        if (this.fill) {
            this._private.context.fill();
        }

        // restore context
        this._private.context.restore();
    };

})();


(function() {
// TODO retain SVG properties and hierarchy
    // constructor
    ZUI.RenderedObject.SVG = function(properties) {
        // call base constructor
        ZUI.RenderedObject.Base.call(this, properties);

        // save scope for access by child scopes
        var that = this;

        // assign default to undefined properties
        //   width
        //   widthScale
        //   height
        //   heightScale
        //   url
        //   dataString
        (function () {
            // define default properties
            var defaultProperties = {
                width: 0,
                widthScale: ZUI.Def.WorldScale,
                height: 0,
                heightScale: ZUI.Def.WorldScale,
                url: '',
                dataString: null
            };

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, that, defaultProperties[propertyName]);
            }
        })();

        // load svg
        if (!this.dataString) {
            $.get(this.url, (function(data) {
                var svg = data.getElementsByTagName("svg")[0];
                this._private.width = svg.getAttribute("width");
                if (this._private.width.indexOf("px") >= 0) this._private.width = Number(this._private.width.substring(0, this._private.width.indexOf("px")));
                this._private.height = svg.getAttribute("height");
                if (this._private.height.indexOf("px") >= 0) this._private.height = Number(this._private.height.substring(0, this._private.height.indexOf("px")));
                var paths = svg.getElementsByTagName("path");
                this._private.paths = [];
                for (var n = 0; n < paths.length; n++) {
                    var path = {};
                    path.id = paths[n].getAttribute("id");
                    path.instructions = ZUI.Helper.parseSVGPath(paths[n].getAttribute("d"));
                    this._private.paths.push(path);
                }
                this._private.isReady = true;
                this._private.isUpdated = true;
            }).bind(this));
        }
        else {
            var xmlDoc = (new DOMParser()).parseFromString(this.dataString, "text/xml");
            var svg = xmlDoc.getElementsByTagName("svg")[0];
            this._private.width = svg.getAttribute("width");
            if (this._private.width.indexOf("px") >= 0) this._private.width = Number(this._private.width.substring(0, this._private.width.indexOf("px")));
            this._private.height = svg.getAttribute("height");
            if (this._private.height.indexOf("px") >= 0) this._private.height = Number(this._private.height.substring(0, this._private.height.indexOf("px")));
            var paths = svg.getElementsByTagName("path");
            this._private.paths = [];
            for (var n = 0; n < paths.length; n++) {
                var path = {};
                path.id = paths[n].getAttribute("id");
                path.instructions = ZUI.Helper.parseSVGPath(paths[n].getAttribute("d"));
                this._private.paths.push(path);
            }
            this._private.isReady = true;
        }
    };

    // inherit base prototype
    ZUI.Helper.inheritClass(ZUI.RenderedObject.Base, ZUI.RenderedObject.SVG);

    // render
    ZUI.RenderedObject.SVG.prototype.render = function () {
        // call base method
        ZUI.RenderedObject.Base.prototype.render.call(this);

        // get rendered size
        this.renderedWidth = ZUI.Helper.interpretScale(this.width, this.widthScale);
        this.renderedHeight = ZUI.Helper.interpretScale(this.height, this.heightScale);

        // get adjusted position
        var adjustedPosition = ZUI.Helper.interpretCenterAt(this.renderedPosition, this.renderedPositionOffset, this.renderedWidth, this.renderedHeight, this.centerAt);

        // set up context
        this._private.context.save();
        this._private.context.strokeStyle = this.strokeColor;
        this._private.context.fillStyle = this.fillColor;
        this._private.context.globalAlpha = this.alpha;
        this._private.context.lineWidth = this.renderedStrokeThickness;

        // render
        this._private.context.save();
        this._private.context.translate(adjustedPosition.x, adjustedPosition.y);
        this._private.context.scale(this.renderedWidth / this._private.width * this.hStretch, this.renderedHeight / this._private.height * this.vStretch);
        this._private.context.rotate(this.rotate);
        this._private.context.beginPath();
        for (var n = 0; n < this._private.paths.length; n++) {
            var path = this._private.paths[n];
            for (var m = 0; m < path.instructions.length; m++) {
                var instruction = path.instructions[m];
                this._private.context[instruction.type].apply(this._private.context, instruction.args);
            }
        }
        this._private.context.closePath();
        this._private.context.restore();
        if (this.stroke) {
            this._private.context.stroke();
        }
        if (this.fill) {
            this._private.context.fill();
        }

        // restore context
        this._private.context.restore();
    };

})();


(function() {

    // constructor
    ZUI.RenderedObject.Image = function(properties) {
        // call base constructor
        ZUI.RenderedObject.Base.call(this, properties);

        // private properties
        this._private.image = new Image();

        // save scope for access by child scopes
        var that = this;

        // assign default to undefined properties
        //   width
        //   widthScale
        //   height
        //   heightScale
        //   url
        //   dataString
        //   type
        (function () {
            // define default properties
            var defaultProperties = {
                width: 0,
                widthScale: ZUI.Def.WorldScale,
                height: 0,
                heightScale: ZUI.Def.WorldScale,
                url: '',
                dataString: null,
                type: 'png'
            };

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, that, defaultProperties[propertyName]);
            }
        })();

        // load image
        this._private.image.onload = (function() {
            this._private.isReady = true;
            this._private.isUpdated = true;
        }).bind(this);
        if (!this.dataString) {
            this._private.image.src = this.url;
        }
        else {
            this._private.image.src = 'data:image/' + this.type + ';base64,' + this.dataString;
        }
    };

    // inherit base prototype
    ZUI.Helper.inheritClass(ZUI.RenderedObject.Base, ZUI.RenderedObject.Image);

    // render
    ZUI.RenderedObject.Image.prototype.render = function () {
        // call base method
        ZUI.RenderedObject.Base.prototype.render.call(this);

        // get rendered size
        this.renderedWidth = ZUI.Helper.interpretScale(this.width, this.widthScale);
        this.renderedHeight = ZUI.Helper.interpretScale(this.height, this.heightScale);

        // get adjusted position
        var adjustedPosition = ZUI.Helper.interpretCenterAt(this.renderedPosition, this.renderedPositionOffset, this.renderedWidth, this.renderedHeight, this.centerAt);

        // set up context
        this._private.context.save();

        // render
        this._private.context.save();
        this._private.context.translate(adjustedPosition.x, adjustedPosition.y);
        this._private.context.scale(this.hStretch, this.vStretch);
        this._private.context.rotate(this.rotate);
        this._private.context.drawImage(this._private.image, 0, 0, this.renderedWidth, this.renderedHeight);
        this._private.context.beginPath();
        this._private.context.moveTo(0, 0);
        this._private.context.lineTo(this.renderedWidth, 0);
        this._private.context.lineTo(this.renderedWidth, this.renderedHeight);
        this._private.context.lineTo(0, this.renderedHeight);
        this._private.context.closePath();
        this._private.context.restore();

        // restore context
        this._private.context.restore();
    };

})();
