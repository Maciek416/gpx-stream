var util = require('util');
var Selax = require('selax');

var Transform = require('stream').Transform;

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
  while(this.outputBuffer.length > 0){
    var p = this.outputBuffer.shift();
    this.push({
      lat: parseFloat(p.attr('lat')),
      lon: parseFloat(p.attr('lon')),
      time: p.children.filter(function(p){ return p.name === 'time'; })[0].text(),
      elevation: p.children.filter(function(p){ return p.name === 'ele'; })[0].text()
    });
  }
};

PointStream.prototype.buffer = function(chunk) {
  // accumulate computed nodes from Selax in local buffer
  this.outputBuffer.push(chunk);
};


module.exports = PointStream;