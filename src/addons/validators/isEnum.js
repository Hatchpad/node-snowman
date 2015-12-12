module.exports = function(pathOrPaths, enumArr, options) {

  var dot = require('dot-object');

  return function() {
    var opts = options || {};
    var root = opts.root === undefined ? '_params' : opts.root;
    var errorPath = opts.errorPath || '_errors';
    var equals = opts.equals || function(value, enumValue) {
      return value === enumValue;
    };
    var data = this.getData();
    var paths = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];
    var val, fullPath, err;
    paths.forEach(function(path) {
      fullPath = root ? root + '.' + path : path;
      val = dot.pick(fullPath, data);
      if (val !== null && val !== undefined) {
        var matchesOne = false;
        for (var i = 0; i < enumArr.length; i++) {
          var enumVal = enumArr[i];
          if (equals(val, enumVal)) {
            matchesOne = true;
            break;
          }
        }
        if (!matchesOne) {
          err = true;
          dot.str(errorPath + '.' + path, 'is invalid', data);
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
