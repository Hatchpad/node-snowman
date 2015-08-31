module.exports = function(pathOrPaths, options) {

  var dot = require('dot-object');

  return function() {
    var opts = options || {};
    var root = opts.root;
    var errorPath = opts.errorPath || '_errors';
    var data = this.getData();
    var paths = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];
    var val, fullPath, err;
    paths.forEach(function(path) {
      fullPath = root ? root + '.' + path : path;
      val = dot.pick(fullPath, data);
      if (val !== null && val !== undefined) {
        if (typeof(val) != 'object' || Array.isArray(val)) {
          err = true;
          dot.str(errorPath + '.' + path, 'is not an object', data);
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
