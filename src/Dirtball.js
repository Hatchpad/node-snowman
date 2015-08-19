var Dirtball = function(data) {
  this.data_ = data || {};
  if (typeof this.data_ != 'object') {
    throw new Error('data must be an object');
  }
  this.dirtwads_ = [];
  this.dirtwadOptions_ = [];
  this.rejected_ = false;
};

/**
 * options = {skip:<function>==null, abortOnReject:boolean==true}
 */
Dirtball.prototype.pipe = function(dirtwad, options) {
  if (dirtwad instanceof Dirtball) {
    dirtwad.dirtwads_.forEach(function(dw) {
      this.dirtwads_.push(dw);
    }.bind(this));
    dirtwad.dirtwadOptions_.forEach(function(dwo) {
      this.dirtwadOptions_.push(dwo);
    }.bind(this));
  } else {
    var opts = {
      abortOnReject: options && options.abortOnReject === false ? false : true,
      skip: options && options.skip ? options.skip : null
    };
    this.dirtwads_.push(dirtwad);
    this.dirtwadOptions_.push(opts);
  }
  return this;
};

var spawnAsync = function() {
  var dirtwadArr = this.dirtwads_[this.idx_];
  var resultCount = 0;
  var data = this.getData();
  var rejected = false;
  var self = this;
  var checkDone = function() {
    if (resultCount == dirtwadArr.length) {
      if (rejected && this.dirtwadOptions_[this.idx_].abortOnReject) {
        if (this.onReject_) {
          this.onReject_();
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
  dirtwadArr.forEach(function(dirtwad) {
    dirtwad.bind(asyncDirtwadHandler)();
  });
};

var next = function() {
  this.idx_++;
  if (this.idx_ >= this.dirtwads_.length) {
    if (this.rejected_) {
      if (this.onReject_) {
        this.onReject_();
      }
    } else {
      if (this.onResolve_) {
        this.onResolve_();
      }
    }
  } else {
    if (this.dirtwadOptions_[this.idx_].skip && this.dirtwadOptions_[this.idx_].skip.bind(this)()) {
      next.bind(this)();
    } else if (Array.isArray(this.dirtwads_[this.idx_])) {
      spawnAsync.bind(this)();
    } else {
      this.dirtwads_[this.idx_].bind(this)();
    }
  }
};

Dirtball.prototype.exec = function(onResolve, onReject) {
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
};

Dirtball.prototype.resolve = function() {
  if (this.rejected_ && this.dirtwadOptions_[this.idx_].abortOnReject) {
    if (this.onReject_) {
      this.onReject_();
    }
  } else {
    next.bind(this)();
  }
};

Dirtball.prototype.reject = function() {
  this.rejected_ = true;
  if (this.dirtwadOptions_[this.idx_].abortOnReject) {
    if (this.onReject_) {
      this.onReject_();
    }
  } else {
    next.bind(this)();
  }
};

Dirtball.prototype.getData = function() {
  return this.data_;
};

Dirtball.addons = {};
Dirtball.addons.validators = {};
Dirtball.addons.validators.isRequired = require('./addons/validators/isRequired')();
Dirtball.addons.validators.isDefined = require('./addons/validators/isDefined')();
Dirtball.addons.validators.isDefinedAndNotNull = require('./addons/validators/isDefinedAndNotNull')();
Dirtball.addons.validators.isEmail = require('./addons/validators/isEmail')();

module.exports = Dirtball;
