module.exports = function(pathOrPaths, maxLength, options) {

  var dot = require('dot-object');

  return function() {
    var opts = options || {};
    var root = opts.root === undefined ? '_params' : opts.root;
    var errorPath = opts.errorPath || '_errors';
    var data = this.getData();
    maxLength = maxLength === undefined ? 10 : maxLength;
    var paths = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];
    var val, fullPath, err;
    paths.forEach(function(path) {
      fullPath = root ? root + '.' + path : path;
      val = dot.pick(fullPath, data);
      if (val !== null && val !== undefined) {
        if (val.length > maxLength) {
          err = true;
          dot.str(errorPath + '.' + path, 'is too long (max length is ' + maxLength + ')', data);
        }
      }
    });
    if (err) {
      this.reject();
    } else {
      this.resolve();
    }
  };
};
