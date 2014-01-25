var fs = require('fs');
var GTP = require('../gpx-stream');

'use strict';

process.env.NODE_ENV = 'test';

var should = require('should');

describe('gpx-stream', function() {


  it('should stream all the points in a GPX file', function(done) {
    var count = 0;
    var points = new GTP();
    var source = fs.createReadStream('./test/oregon.gpx');

    source.pipe(points);

    points.on('readable', function(){
      var point;

      while(point = points.read()){
        count++;
      }
    });

    points.on('end', function(){
      count.should.eql(1443);
      done();
    });
    
  });

});
