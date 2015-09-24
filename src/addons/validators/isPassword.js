module.exports = function(pathOrPaths, options) {

  var dot = require('dot-object');
  var passwordStrength = require('password-strength');

  return function() {
    var opts = options || {};
    var root = opts.root === undefined ? '_params' : opts.root;
    var errorPath = opts.errorPath || '_errors';
    var resultPath = opts.resultPath || '_meta';
    passwordStrength.min = opts.min || 4;
    var data = this.getData();
    var paths = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];
    var val, fullPath, err, pwResult;
    paths.forEach(function(path) {
      fullPath = root ? root + '.' + path : path;
      val = dot.pick(fullPath, data);
      if (val !== undefined && val !== null) {
        pwResult = passwordStrength(val);
        dot.str(resultPath + '.' + path, pwResult, data);
        if (!pwResult.valid) {
          err = true;
          dot.str(errorPath + '.' + path, 'is ' + pwResult.hint, data);
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
