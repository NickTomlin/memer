var EventEmitter, GIF, browser,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

EventEmitter = require('events').EventEmitter;

browser = require('./browser.coffee');

GIF = (function(_super) {
  var defaults, frameDefaults;

  __extends(GIF, _super);

  defaults = {
    workerScript: 'gif.worker.js',
    workers: 2,
    repeat: 0,
    background: '#fff',
    quality: 10,
    width: null,
    height: null
  };

  frameDefaults = {
    delay: 500,
    copy: false
  };

  function GIF(options) {
    var key, value, _base, _ref;
    this.running = false;
    this.options = {};
    this.frames = [];
    this.freeWorkers = [];
    this.activeWorkers = [];
    this.setOptions(options);
    for (key in defaults) {
      value = defaults[key];
      if ((_ref = (_base = this.options)[key]) == null) {
        _base[key] = value;
      }
    }
  }

  GIF.prototype.setOption = function(key, value) {
    this.options[key] = value;
    if ((this._canvas != null) && (key === 'width' || key === 'height')) {
      return this._canvas[key] = value;
    }
  };

  GIF.prototype.setOptions = function(options) {
    var key, value, _results;
    _results = [];
    for (key in options) {
      if (!__hasProp.call(options, key)) continue;
      value = options[key];
      _results.push(this.setOption(key, value));
    }
    return _results;
  };

  GIF.prototype.addFrame = function(image, options) {
    var frame, key;
    if (options == null) {
      options = {};
    }
    frame = {};
    for (key in frameDefaults) {
      frame[key] = options[key] || frameDefaults[key];
    }
    if (((typeof CanvasRenderingContext2D !== "undefined" && CanvasRenderingContext2D !== null) && image instanceof CanvasRenderingContext2D) || ((typeof WebGLRenderingContext !== "undefined" && WebGLRenderingContext !== null) && image instanceof WebGLRenderingContext)) {
      if (options.copy) {
        frame.data = this.getContextData(image);
      } else {
        frame.context = image;
      }
    } else if (image.childNodes != null) {
      if (this.options.width == null) {
        this.setOption('width', image.width);
      }
      if (this.options.height == null) {
        this.setOption('height', image.height);
      }
      if (options.copy) {
        frame.data = this.getImageData(image);
      } else {
        frame.image = image;
      }
    } else {
      throw new Error('Invalid image');
    }
    this.frames.push(frame);
    if (frame.width != null) {
      this.setOption('width', frame.width);
    }
    if (frame.height != null) {
      return this.setOption('height', frame.height);
    }
  };

  GIF.prototype.render = function() {
    var i, numWorkers, _i;
    if (this.running) {
      throw new Error('Already running');
    }
    this.running = true;
    this.nextFrame = 0;
    this.finishedFrames = 0;
    this.imageParts = (function() {
      var _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.frames.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(null);
      }
      return _results;
    }).call(this);
    numWorkers = this.spawnWorkers();
    for (i = _i = 0; 0 <= numWorkers ? _i < numWorkers : _i > numWorkers; i = 0 <= numWorkers ? ++_i : --_i) {
      this.renderNextFrame();
    }
    this.emit('start');
    return this.emit('progress', 0);
  };

  GIF.prototype.abort = function() {
    var worker;
    while (true) {
      worker = this.activeWorkers.shift();
      if (worker == null) {
        break;
      }
      console.log("killing active worker");
      worker.terminate();
    }
    this.running = false;
    return this.emit('abort');
  };

  GIF.prototype.spawnWorkers = function() {
    var i, numWorkers, _fn, _i, _ref,
      _this = this;
    numWorkers = Math.min(this.options.workers, this.frames.length);
    _fn = function(i) {
      var worker;
      console.log("spawning worker " + i);
      worker = new Worker(_this.options.workerScript);
      worker.onmessage = function(event) {
        _this.activeWorkers.splice(_this.activeWorkers.indexOf(worker), 1);
        _this.freeWorkers.push(worker);
        return _this.frameFinished(event.data);
      };
      return _this.freeWorkers.push(worker);
    };
    for (i = _i = _ref = this.freeWorkers.length; _ref <= numWorkers ? _i < numWorkers : _i > numWorkers; i = _ref <= numWorkers ? ++_i : --_i) {
      _fn(i);
    }
    return numWorkers;
  };

  GIF.prototype.frameFinished = function(frame) {
    console.log("frame " + frame.index + " finished - " + this.activeWorkers.length + " active");
    this.finishedFrames++;
    this.emit('progress', this.finishedFrames / this.frames.length);
    this.imageParts[frame.index] = frame;
    if (__indexOf.call(this.imageParts, null) >= 0) {
      return this.renderNextFrame();
    } else {
      return this.finishRendering();
    }
  };

  GIF.prototype.finishRendering = function() {
    var data, frame, i, image, len, offset, page, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    len = 0;
    _ref = this.imageParts;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      frame = _ref[_i];
      len += (frame.data.length - 1) * frame.pageSize + frame.cursor;
    }
    len += frame.pageSize - frame.cursor;
    console.log("rendering finished - filesize " + (Math.round(len / 1000)) + "kb");
    data = new Uint8Array(len);
    offset = 0;
    _ref1 = this.imageParts;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      frame = _ref1[_j];
      _ref2 = frame.data;
      for (i = _k = 0, _len2 = _ref2.length; _k < _len2; i = ++_k) {
        page = _ref2[i];
        data.set(page, offset);
        if (i === frame.data.length - 1) {
          offset += frame.cursor;
        } else {
          offset += frame.pageSize;
        }
      }
    }
    image = new Blob([data], {
      type: 'image/gif'
    });
    return this.emit('finished', image, data);
  };

  GIF.prototype.renderNextFrame = function() {
    var frame, task, worker;
    if (this.freeWorkers.length === 0) {
      throw new Error('No free workers');
    }
    if (this.nextFrame >= this.frames.length) {
      return;
    }
    frame = this.frames[this.nextFrame++];
    worker = this.freeWorkers.shift();
    task = this.getTask(frame);
    console.log("starting frame " + (task.index + 1) + " of " + this.frames.length);
    this.activeWorkers.push(worker);
    return worker.postMessage(task);
  };

  GIF.prototype.getContextData = function(ctx) {
    return ctx.getImageData(0, 0, this.options.width, this.options.height).data;
  };

  GIF.prototype.getImageData = function(image) {
    var ctx;
    if (!(this._canvas != null)) {
      this._canvas = document.createElement('canvas');
      this._canvas.width = this.options.width;
      this._canvas.height = this.options.height;
    }
    ctx = this._canvas.getContext('2d');
    ctx.setFill = this.options.background;
    ctx.fillRect(0, 0, this.options.width, this.options.height);
    ctx.drawImage(image, 0, 0);
    return this.getContextData(ctx);
  };

  GIF.prototype.getTask = function(frame) {
    var index, task;
    index = this.frames.indexOf(frame);
    task = {
      index: index,
      last: index === (this.frames.length - 1),
      delay: frame.delay,
      width: this.options.width,
      height: this.options.height,
      quality: this.options.quality,
      repeat: this.options.repeat,
      canTransfer: browser.name === 'chrome'
    };
    if (frame.data != null) {
      task.data = frame.data;
    } else if (frame.context != null) {
      task.data = this.getContextData(frame.context);
    } else if (frame.image != null) {
      task.data = this.getImageData(frame.image);
    } else {
      throw new Error('Invalid frame');
    }
    return task;
  };

  return GIF;

})(EventEmitter);

module.exports = GIF;
