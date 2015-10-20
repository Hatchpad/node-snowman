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
  var sb1, sb2, resultObj;

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
    snowman = new Snowman();
  });

  it('accumulates the data and calls onResolve', function() {
    snowman
    .pipe(sb1)
    .pipe(sb2)
    .exec(resultObj.onResolve);
    expect(snowman.getData()).toEqual({sb1:'test1',sb2:'test2'});
    expect(resultObj.onResolve).toHaveBeenCalled();
  });

  it('throws an error if onResolve is not a function', function() {
    snowman
    .pipe(sb1);
    expect( function() { snowman.exec('non-function');} ).toThrow(new Error('onResolve must be a function'));
  });

  it('throws an error if onReject is not a function', function() {
    snowman
    .pipe(sb1);
    expect( function() { snowman.exec(null, 'non-function');} ).toThrow(new Error('onReject must be a function'));
  });

  it('accumulates the data and aborts on reject', function() {
    snowman
    .pipe(sb1)
    .pipe(sb3)
    .pipe(sb2)
    .exec(resultObj.onResolve, resultObj.onReject);
    expect(snowman.getData()).toEqual({sb1:'test1',sb3:'test3'});
    expect(resultObj.onResolve).not.toHaveBeenCalled();
    expect(resultObj.onReject).toHaveBeenCalled();
  });

  describe('when abortOnReject is false', function() {
    it('accumulates the data on subsequent steps until aboutOnReject is true', function() {
      snowman
      .pipe(sb3, {abortOnReject:false})
      .pipe(sb1, {abortOnReject:false})
      .pipe(sb2)
      .pipe(sb4)
      .exec(resultObj.onResolve, resultObj.onReject);
      expect(snowman.getData()).toEqual({sb3:'test3', sb1:'test1', sb2: 'test2'});
      expect(snowman.getData().sb4).toBe(undefined);
      expect(resultObj.onResolve).not.toHaveBeenCalled();
      expect(resultObj.onReject).toHaveBeenCalled();
    });
  });

  describe('async', function() {
    it('handles arrays correctly', function() {
      snowman
      .pipe(sb1)
      .pipe([sb2, sb4])
      .pipe(sb5)
      .exec(resultObj.onResolve, resultObj.onReject);
      expect(snowman.getData()).toEqual({sb1:'test1', sb2:'test2', sb4:'test4', sb5:'test5'});
      expect(resultObj.onResolve).toHaveBeenCalled();
      expect(resultObj.onReject).not.toHaveBeenCalled();
    });

    it('rejects arrays correctly', function() {
      snowman
      .pipe(sb1)
      .pipe([sb3, sb4])
      .pipe(sb5)
      .exec(resultObj.onResolve, resultObj.onReject);
      expect(snowman.getData()).toEqual({sb1:'test1', sb3:'test3', sb4:'test4'});
      expect(resultObj.onResolve).not.toHaveBeenCalled();
      expect(resultObj.onReject).toHaveBeenCalled();
    });
  });

  describe('skip', function() {
    it('skips correctly', function() {
      var skipFunc = function() {
        return this.getData().sb2 === 'test2';
      };
      snowman
      .pipe(sb1, {skip:skipFunc})
      .pipe(sb2)
      .pipe(sb4, {skip:skipFunc})
      .pipe(sb5)
      .exec(resultObj.onResolve, resultObj.onReject);
      expect(snowman.getData()).toEqual({sb1:'test1', sb2:'test2', sb5:'test5'});
      expect(resultObj.onResolve).toHaveBeenCalled();
      expect(resultObj.onReject).not.toHaveBeenCalled();
    });
  });

  describe('if', function() {
    it('skips correctly', function() {
      var sm = new Snowman({person: {name: 'Bob'}});
      sm
      .pipe(sb1, {if:'{{person.name}} === "Bob"'})
      .pipe(sb2)
      .pipe(sb4, {if:'{{person.name}} === "John"'})
      .pipe(sb5)
      .exec(resultObj.onResolve, resultObj.onReject);
      expect(sm.getData()).toEqual({person: {name: 'Bob'}, sb1:'test1', sb2:'test2', sb5:'test5'});
      expect(resultObj.onResolve).toHaveBeenCalled();
      expect(resultObj.onReject).not.toHaveBeenCalled();
    });

    it('works with objects', function() {
      var sm = new Snowman({_params: {arr: [{one:1}, {two:2}, {three:3}, {four:4}]}});
      sm
      .pipe(sb1, {if:'{{_params.arr}} !== undefined'})
      .pipe(sb2)
      .pipe(sb4, {if:'{{_params.arr[1]}} == {two:2}'})
      .pipe(sb5)
      .exec(resultObj.onResolve, resultObj.onReject);
      expect(sm.getData()).toEqual({
        _params: {arr: [{one:1}, {two:2}, {three:3}, {four:4}]},
        sb1:'test1',
        sb2:'test2',
        sb5:'test5'
      });
      expect(resultObj.onResolve).toHaveBeenCalled();
      expect(resultObj.onReject).not.toHaveBeenCalled();
    });
  });

  describe('nested snowman', function() {
    it('nests the snowman', function() {
      var snowman2 = new Snowman().pipe(sb2).pipe(sb4);
      snowman
      .pipe(sb1)
      .pipe(snowman2)
      .pipe(sb5)
      .exec(resultObj.onResolve, resultObj.onReject);
      expect(snowman.getData()).toEqual({sb1:'test1', sb2:'test2', sb4:'test4', sb5:'test5'});
      expect(resultObj.onResolve).toHaveBeenCalled();
      expect(resultObj.onReject).not.toHaveBeenCalled();
    });
  });

  describe('do', function() {
    it('executes do functions', function() {
      var spyObj = {
        doIt: function() {}
      };
      var doFunc = function() {
        spyObj.doIt();
      };
      spyOn(spyObj, 'doIt');
      snowman
      .$(sb1)
      .do(doFunc)
      .$(sb2)
      .exec(resultObj.onResolve, resultObj.onReject);
      expect(snowman.getData()).toEqual({sb1:'test1', sb2:'test2'});
      expect(resultObj.onResolve).toHaveBeenCalled();
      expect(resultObj.onReject).not.toHaveBeenCalled();
      expect(spyObj.doIt).toHaveBeenCalled();
    });
  });
});
