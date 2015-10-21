var util = require('util');
var Selax = require('selax');

var Transform = require('stream').Transform;

var makeNodeFilter = function(name) {
  return function(nodeName, node) {
    return node.name === nodeName;
  }.bind(this, name);
};

// FIXME: selax nodes need to be improved so that finding nodes isn't tedious.
var timeFilter = makeNodeFilter('time');
var elevationFilter = makeNodeFilter('ele');

var PointStream = function() {
  Transform.call(this, { objectMode: true });

  this.outputBuffer = [];

  this.ax = new Selax('trkpt');

  this.ax.on('data', this.buffer.bind(this));
};

util.inherits(PointStream, Transform);

PointStream.prototype._transform = function(chunk, encoding, callback) {
  // push XML to ax
  this.ax.write(chunk);
  // pipe out any outgoing data
  this.flush();
  // signal we're done
  callback();
};

PointStream.prototype._flush = function(callback) {
  this.flush();
  callback();
};

PointStream.prototype.flush = function() {
  // empty the buffer of computed data
  while(this.outputBuffer.length > 0) {
    var p = this.outputBuffer.shift();
    this.push({
      lat: parseFloat(p.attr('lat')),
      lon: parseFloat(p.attr('lon')),
      time: (p.children.filter(timeFilter)[0] ? p.children.filter(timeFilter)[0].text() : null),
      elevation: (p.children.filter(elevationFilter)[0] ? p.children.filter(elevationFilter)[0].text() : null)
    });
  }
};

PointStream.prototype.buffer = function(chunk) {
  // accumulate computed nodes from Selax in local buffer
  this.outputBuffer.push(chunk);
};


module.exports = PointStream;