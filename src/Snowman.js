var dot = require('dot-object');

var Snowman = function(data) {
  this.data_ = data || {};
  if (typeof this.data_ != 'object') {
    throw new Error('data must be an object');
  }
  this.snowballs_ = [];
  this.snowballOptions_ = [];
  this.rejected_ = false;
};

/**
 * options = {skip:<function>==null, abortOnReject:boolean==true}
 */
Snowman.prototype.pipe = function(snowball, options) {
  if (snowball instanceof Snowman) {
    snowball.snowballs_.forEach(function(dw) {
      this.snowballs_.push(dw);
    }.bind(this));
    snowball.snowballOptions_.forEach(function(dwo) {
      this.snowballOptions_.push(dwo);
    }.bind(this));
  } else {
    var opts = {
      abortOnReject: options && options.abortOnReject === false ? false : true,
      skip: options && options.skip ? options.skip : null,
      if: options && options.if ? options.if : null
    };
    this.snowballs_.push(snowball);
    this.snowballOptions_.push(opts);
  }
  return this;
};

Snowman.prototype.do = function(func, options) {
  var opts = {
    abortOnReject: options && options.abortOnReject === false ? false : true,
    skip: options && options.skip ? options.skip : null,
    if: options && options.if ? options.if : null,
    do: true
  };
  this.snowballs_.push(func);
  this.snowballOptions_.push(opts);
  return this;
};

Snowman.prototype.$ = Snowman.prototype.pipe;

var spawnAsync = function() {
  var snowballArr = this.snowballs_[this.idx_];
  var resultCount = 0;
  var data = this.getData();
  var rejected = false;
  var self = this;
  var checkDone = function() {
    if (resultCount == snowballArr.length) {
      if (rejected && this.snowballOptions_[this.idx_].abortOnReject) {
        if (this.onReject_) {
          this.onReject_.bind(this)();
        }
      } else {
        next.bind(this)();
      }
    }
  };
  var asyncDirtwadHandler = {
    resolve: function() {
      resultCount++;
      checkDone.bind(self)();
    },
    reject: function() {
      resultCount++;
      rejected = true;
      checkDone.bind(self)();
    },
    getData: function() {
      return data;
    }
  }
  snowballArr.forEach(function(snowball) {
    snowball.bind(asyncDirtwadHandler)();
  });
};

var evalIf = function() {
  var iff = this.snowballOptions_[this.idx_].if;
  if (!iff) {
    return true;
  }
  var reg = /{{(.+?)}}/g;
  var matches = iff.match(reg);
  var idx, match, prop, val;
  for (idx in matches) {
    match = matches[idx];
    prop = match.substr(2, match.length - 4).trim();
    val = dot.pick(prop, this.getData());
    if (typeof(val) === 'string') {
      val = '"' + val + '"';
    }
    iff = iff.replace(match, val);
  }
  return eval(iff);
};

var next = function() {
  this.idx_++;
  if (this.idx_ >= this.snowballs_.length) {
    if (this.rejected_) {
      if (this.onReject_) {
        this.onReject_.bind(this)();
      }
    } else {
      if (this.onResolve_) {
        this.onResolve_.bind(this)();
      }
    }
  } else {
    if (this.snowballOptions_[this.idx_].skip && this.snowballOptions_[this.idx_].skip.bind(this)()) {
      next.bind(this)();
    } else if (!evalIf.bind(this)()) {
      next.bind(this)();
    } else if (Array.isArray(this.snowballs_[this.idx_])) {
      spawnAsync.bind(this)();
    } else if (this.snowballOptions_[this.idx_].do) {
      this.snowballs_[this.idx_]();
      next.bind(this)();
    } else {
      this.snowballs_[this.idx_].bind(this)();
    }
  }
};

Snowman.prototype.exec = function(onResolve, onReject) {
  if (onResolve && (typeof onResolve != 'function')) {
    throw new Error('onResolve must be a function');
  }
  if (onReject && (typeof onReject != 'function')) {
    throw new Error('onReject must be a function');
  }
  this.onResolve_ = onResolve;
  this.onReject_ = onReject;
  this.idx_ = -1;
  next.bind(this)();
  return this;
};

Snowman.prototype.resolve = function() {
  if (this.rejected_ && this.snowballOptions_[this.idx_].abortOnReject) {
    if (this.onReject_) {
      this.onReject_.bind(this)();
    }
  } else {
    next.bind(this)();
  }
};

Snowman.prototype.reject = function() {
  this.rejected_ = true;
  if (this.snowballOptions_[this.idx_].abortOnReject) {
    if (this.onReject_) {
      this.onReject_.bind(this)();
    }
  } else {
    next.bind(this)();
  }
};

Snowman.prototype.getData = function() {
  return this.data_;
};

module.exports = Snowman;
