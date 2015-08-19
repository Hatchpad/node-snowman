var Dirtball = require('../');

describe('Dirtball Init', function() {
  var dirtball;

  it('should initialize the data to empty object', function () {
    dirtball = new Dirtball();
    expect(dirtball.getData()).toEqual({});
  });

  it('should initialize the data to passed parameter', function () {
    dirtball = new Dirtball({'test': 'data'});
    expect(dirtball.getData()).toEqual({'test': 'data'});
  });

  it('should throw an exception if data is not object', function () {
    expect( function() { new Dirtball('test-data');} ).toThrow(new Error('data must be an object'));
  });
});

describe('Dirtball data accumulation', function() {
  var dirball, sb1, sb2, resultObj;

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
    sb4 = function() {
      this.getData()['sb4'] = 'test4';
      this.resolve();
    };
    sb5 = function() {
      this.getData()['sb5'] = 'test5';
      this.resolve();
    };
    spyOn(resultObj, 'onResolve');
    spyOn(resultObj, 'onReject');
    dirtball = new Dirtball();
  });

  it('accumulates the data and calls onResolve', function() {
    dirtball
    .pipe(sb1)
    .pipe(sb2)
    .exec(resultObj.onResolve);
    expect(dirtball.getData()).toEqual({sb1:'test1',sb2:'test2'});
    expect(resultObj.onResolve).toHaveBeenCalled();
  });

  it('throws an error if onResolve is not a function', function() {
    dirtball
    .pipe(sb1);
    expect( function() { dirtball.exec('non-function');} ).toThrow(new Error('onResolve must be a function'));
  });

  it('throws an error if onReject is not a function', function() {
    dirtball
    .pipe(sb1);
    expect( function() { dirtball.exec(null, 'non-function');} ).toThrow(new Error('onReject must be a function'));
  });

  it('accumulates the data and aborts on reject', function() {
    dirtball
    .pipe(sb1)
    .pipe(sb3)
    .pipe(sb2)
    .exec(resultObj.onResolve, resultObj.onReject);
    expect(dirtball.getData()).toEqual({sb1:'test1',sb3:'test3'});
    expect(resultObj.onResolve).not.toHaveBeenCalled();
    expect(resultObj.onReject).toHaveBeenCalled();
  });

  describe('when abortOnReject is false', function() {
    it('accumulates the data on subsequent steps until aboutOnReject is true', function() {
      dirtball
      .pipe(sb3, {abortOnReject:false})
      .pipe(sb1, {abortOnReject:false})
      .pipe(sb2)
      .pipe(sb4)
      .exec(resultObj.onResolve, resultObj.onReject);
      expect(dirtball.getData()).toEqual({sb3:'test3', sb1:'test1', sb2: 'test2'});
      expect(dirtball.getData().sb4).toBe(undefined);
      expect(resultObj.onResolve).not.toHaveBeenCalled();
      expect(resultObj.onReject).toHaveBeenCalled();
    });
  });

  describe('async', function() {
    it('handles arrays correctly', function() {
      dirtball
      .pipe(sb1)
      .pipe([sb2, sb4])
      .pipe(sb5)
      .exec(resultObj.onResolve, resultObj.onReject);
      expect(dirtball.getData()).toEqual({sb1:'test1', sb2:'test2', sb4:'test4', sb5:'test5'});
      expect(resultObj.onResolve).toHaveBeenCalled();
      expect(resultObj.onReject).not.toHaveBeenCalled();
    });

    it('rejects arrays correctly', function() {
      dirtball
      .pipe(sb1)
      .pipe([sb3, sb4])
      .pipe(sb5)
      .exec(resultObj.onResolve, resultObj.onReject);
      expect(dirtball.getData()).toEqual({sb1:'test1', sb3:'test3', sb4:'test4'});
      expect(resultObj.onResolve).not.toHaveBeenCalled();
      expect(resultObj.onReject).toHaveBeenCalled();
    });
  });

  describe('skip', function() {
    it('skips correctly', function() {
      var skipFunc = function() {
        return this.getData().sb2 === 'test2';
      };
      dirtball
      .pipe(sb1, {skip:skipFunc})
      .pipe(sb2)
      .pipe(sb4, {skip:skipFunc})
      .pipe(sb5)
      .exec(resultObj.onResolve, resultObj.onReject);
      expect(dirtball.getData()).toEqual({sb1:'test1', sb2:'test2', sb5:'test5'});
      expect(resultObj.onResolve).toHaveBeenCalled();
      expect(resultObj.onReject).not.toHaveBeenCalled();
    });
  });

  describe('nested dirtball', function() {
    it('nests the dirtball', function() {
      var dirtball2 = new Dirtball().pipe(sb2).pipe(sb4);
      dirtball
      .pipe(sb1)
      .pipe(dirtball2)
      .pipe(sb5)
      .exec(resultObj.onResolve, resultObj.onReject);
      expect(dirtball.getData()).toEqual({sb1:'test1', sb2:'test2', sb4:'test4', sb5:'test5'});
      expect(resultObj.onResolve).toHaveBeenCalled();
      expect(resultObj.onReject).not.toHaveBeenCalled();
    });
  });
});
