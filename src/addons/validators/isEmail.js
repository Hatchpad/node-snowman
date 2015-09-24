module.exports = function(pathOrPaths, options) {

  var dot = require('dot-object');

  return function() {
    var opts = options || {};
    var root = opts.root === undefined ? '_params' : opts.root;
    var errorPath = opts.errorPath || '_errors';
    var data = this.getData();
    var paths = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];
    var val, fullPath, err;
    paths.forEach(function(path) {
      fullPath = root ? root + '.' + path : path;
      val = dot.pick(fullPath, data);
      if (val !== null && val !== undefined) {
        var atpos = val.indexOf("@");
        var dotpos = val.lastIndexOf(".");
        if (atpos < 1 || dotpos < atpos+2 || dotpos + 2 >= val.length) {
          err = true;
          dot.str(errorPath + '.' + path, 'is not a valid email address', data);
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
