module.exports = function(srcPathOrPaths, destPath, options) {

  if (!destPath) {
    throw new Error('destPath is required');
  }

  var dot = require('dot-object');

  return function() {
    var opts = options || {};
    var root = opts.root;
    var data = this.getData();
    var paths = Array.isArray(srcPathOrPaths) ? srcPathOrPaths : [srcPathOrPaths];
    var val, from, fromKey, fullFrom, fromSplit, to;
    paths.forEach(function(from) {
      fullFrom = root ? root + '.' + from : from;
      val = dot.pick(fullFrom, data);
      fromSplit = from.split('.');
      fromKey = fromSplit[fromSplit.length - 1];
      to = destPath + '.' + fromKey;
      dot.str(to, val, data);
    });
    this.resolve();
  };
};
