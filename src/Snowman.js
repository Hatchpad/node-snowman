var Snowman = function(data) {
  this.data_ = data || {};
  if (typeof this.data_ != 'object') {
    throw new Error('data must be an object');
  }
  this.snowballs_ = [];
};

Snowman.prototype.pipe = function(snowball) {
  this.snowballs_.push(snowball);
  return this;
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
  this.resolve();
};

Snowman.prototype.resolve = function() {
  this.idx_++;
  if (this.idx_ >= this.snowballs_.length) {
    if (this.onResolve_) {
      this.onResolve_();
    }
  } else {
    this.snowballs_[this.idx_].bind(this)();
  }
};

Snowman.prototype.reject = function() {
  if (this.onReject_) {
    this.onReject_();
  }
};

Snowman.prototype.getData = function() {
  return this.data_;
};

Snowman.addons = {};
Snowman.addons.validators = {};
Snowman.addons.validators.isRequired = require('./addons/validators/isRequired')();
Snowman.addons.validators.isDefined = require('./addons/validators/isDefined')();
Snowman.addons.validators.isDefinedAndNotNull = require('./addons/validators/isDefinedAndNotNull')();

module.exports = Snowman;
