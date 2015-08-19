module.exports = function() {

  var dot = require('dot-object');

  return function(pathOrPaths, options) {
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
        if (val === undefined) {
          err = true;
          dot.str(errorPath + '.' + path, 'is undefined', data);
        }
      });
      if (err) {
        this.reject();
      } else {
        this.resolve();
      }
    };
  };
};
