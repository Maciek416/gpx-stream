gpx-stream
==========

[![NPM](https://nodei.co/npm/gpx-stream.png)](https://nodei.co/npm/gpx-stream/)

Stream tracked points (`<trkpt/>` nodes) from a GPX 1.1 input string. 

Usage
-----

```javascript

var gpx = require('gpx-stream');
var points = new gpx();
var source = fs.createReadStream('./oregon.gpx');

source.pipe(points);

points.on('readable', function(){
  var point;

  while(point = points.read()){
    console.log([
      'Lat:', point.lat,
      'Lon:', point.lon,
      'elevation:', point.elevation,
      '@time', point.time
    ].join(' '));
  }
});

points.on('end', function(){
  console.log('finished');
});

```