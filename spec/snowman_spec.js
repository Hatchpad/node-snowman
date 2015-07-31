var Snowman = require('../');

describe('Snowman Init', function() {
  var snowman;

  it('should initialize the data to empty object', function () {
    snowman = new Snowman();
    expect(snowman.getData()).toEqual({});
  });

  it('should initialize the data to passed parameter', function () {
    snowman = new Snowman({'test': 'data'});
    expect(snowman.getData()).toEqual({'test': 'data'});
  });

  it('should throw an exception if data is not object', function () {
    expect( function() { new Snowman('test-data');} ).toThrow(new Error('data must be an object'));
  });
});

describe('Snowman data accumulation', function() {
  var snowman, sb1, sb2, resultObj;

  beforeEach(function() {
    resultObj = {
      onResolve: function() {},
      onReject: function() {}
    };
    sb1 = function() {
      this.getData()['sb1'] = 'test1';
      this.resolve();
    };
    sb2 = function() {
      this.getData()['sb2'] = 'test2';
      this.resolve();
    };
    sb3 = function() {
      this.getData()['sb3'] = 'test3';
      this.reject();
    };
    spyOn(resultObj, 'onResolve');
    spyOn(resultObj, 'onReject');
    snowman = new Snowman();
  });

  it('accumulates the data and calls onResolve', function() {
    snowman
    .pipe(sb1)
    .pipe(sb2)
    .execute(resultObj.onResolve);
    expect(snowman.getData()).toEqual({sb1:'test1',sb2:'test2'});
    expect(resultObj.onResolve).toHaveBeenCalled();
  });

  it('throws an error if onResolve is not a function', function() {
    snowman
    .pipe(sb1);
    expect( function() { snowman.execute('non-function');} ).toThrow(new Error('onResolve must be a function'));
  });

  it('throws an error if onReject is not a function', function() {
    snowman
    .pipe(sb1);
    expect( function() { snowman.execute(null, 'non-function');} ).toThrow(new Error('onReject must be a function'));
  });

  it('accumulates the data and steps out on reject', function() {
    snowman
    .pipe(sb1)
    .pipe(sb3)
    .pipe(sb2)
    .execute(resultObj.onResolve, resultObj.onReject);
    expect(snowman.getData()).toEqual({sb1:'test1',sb3:'test3'});
    expect(resultObj.onResolve).not.toHaveBeenCalled();
    expect(resultObj.onReject).toHaveBeenCalled();
  });
});
