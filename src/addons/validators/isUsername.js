module.exports = function(pathOrPaths, options) {

  var dot = require('dot-object');

  return function() {
    var opts = options || {};
    var root = opts.root;
    var errorPath = opts.errorPath || '_errors';
    var data = this.getData();
    var paths = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];
    var val, fullPath, err;
    var usernameRegex = /^[a-zA-Z]+[a-zA-Z0-9_]*$/;
    paths.forEach(function(path) {
      fullPath = root ? root + '.' + path : path;
      val = dot.pick(fullPath, data);
      if (val !== null && val !== undefined && val !== '') {
        if (val.length < 4) {
          err = true;
          dot.str(errorPath + '.' + path, 'is too short', data);
        } else if (val.length > 20) {
          err = true;
          dot.str(errorPath + '.' + path, 'is too long', data);
        } else if (!usernameRegex.test(val)) {
          err = true;
          dot.str(errorPath + '.' + path, 'is not a valid username', data);
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
