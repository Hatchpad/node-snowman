module.exports = function(input, options) {

  var dot = require('dot-object');

  return function() {
    var opts = options || {};
    var root = opts.root;
    var errorPath = opts.errorPath || '_errors';
    var data = this.getData();
    var pathsOrObjs = Array.isArray(input) ? input : [input];
    var val, from, to, fullFrom, fullTo;
    pathsOrObjs.forEach(function(pathOrObj) {
      if (typeof(pathOrObj) === 'object') {
        from = pathOrObj.from;
        to = pathOrObj.to || from;
      } else {
        to = from = pathOrObj;
      }
      fullFrom = root ? root + '.' + from : from;
      fullTo = root ? root + '.' + to : to;
      val = dot.pick(fullFrom, data);
      if (val !== undefined && val !== null) {
        dot.str(fullTo, (val === true || val === 'true' ? true : false), data);
      }
    });
    this.resolve();
  };
};
