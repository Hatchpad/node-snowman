var Snowman = require('../../.');
var copy = require('../../src/addons/copy');

describe('copy', function() {

  var snowman, execSpy;

  beforeEach(function() {
    execSpy = {
      onResolve:function() {},
      onReject:function() {}
    };
    snowman = new Snowman({
      _params:{
        o1: {test:'object'},
        st1: 'stringObj',
        nullObj: null,
        undfndObj: undefined
      },
      rootProp: 'rootPropStr'
    });
    spyOn(execSpy, 'onResolve');
    spyOn(execSpy, 'onReject');
  });

  it('copies correctly', function() {
    var cpy = copy(['o1', 'st1', 'nullObj', 'undfndObj', 'und'], '_form', {root: '_params'});
    snowman
    .pipe(cpy)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
    expect(snowman.getData()._form.o1).toEqual({test:'object'});
    expect(snowman.getData()._form.st1).toBe('stringObj');
    expect(snowman.getData()._form.nullObj).toBe(null);
    expect(snowman.getData()._form.undfndObj).toBe(undefined);
    expect(snowman.getData()._form.und).toBe(undefined);
  });

  it('copies one at a time correctly', function() {
    var cpy = copy('st1', '_form', {root: '_params'});
    snowman
    .pipe(cpy)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
    expect(snowman.getData()._form.st1).toEqual('stringObj');
  });

  it('copies correctly without root option', function() {
    var cpy = copy(['_params.o1', '_params.st1', '_params.nullObj', '_params.undfndObj', '_params.und'], '_form');
    snowman
    .pipe(cpy)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
    expect(snowman.getData()._form.o1).toEqual({test:'object'});
    expect(snowman.getData()._form.st1).toBe('stringObj');
    expect(snowman.getData()._form.nullObj).toBe(null);
    expect(snowman.getData()._form.undfndObj).toBe(undefined);
    expect(snowman.getData()._form.und).toBe(undefined);
  });

  it('copies root properties correctly', function() {
    var cpy = copy('rootProp', '_form');
    snowman
    .pipe(cpy)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
    expect(snowman.getData()._form.rootProp).toEqual('rootPropStr');
  });
});
