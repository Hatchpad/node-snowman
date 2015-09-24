module.exports = function(pathOrPaths, options) {

  var dot = require('dot-object');

  return function() {
    var opts = options || {};
    var length = opts.length;
    var maxLength = opts.maxLength;
    var minLength = opts.minLength;
    var root = opts.root === undefined ? '_params' : opts.root;
    var errorPath = opts.errorPath || '_errors';
    var data = this.getData();
    var paths = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];
    var val, fullPath, err;
    paths.forEach(function(path) {
      fullPath = root ? root + '.' + path : path;
      val = dot.pick(fullPath, data);
      var innerErr = false;
      if (val !== null && val !== undefined) {
        if (!Array.isArray(val)) {
          err = true;
          innerErr = true;
          dot.str(errorPath + '.' + path, 'is not an array', data);
        } else {
          if (length !== undefined) {
            if (val.length !== length) {
              err = true;
              innerErr = true;
              dot.str(errorPath + '.' + path, 'must be an array of ' + length + ' elements', data);
            }
          }
          if (!innerErr && maxLength !== undefined) {
            if (val.length > maxLength) {
              err = true;
              innerErr = true;
              dot.str(errorPath + '.' + path, 'must be an array with a max of ' + maxLength + ' elements', data);
            }
          }
          if (!innerErr && minLength !== undefined) {
            if (val.length < minLength) {
              err = true;
              innerErr = true;
              dot.str(errorPath + '.' + path, 'must be an array with a min of ' + minLength + ' elements', data);
            }
          }
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
