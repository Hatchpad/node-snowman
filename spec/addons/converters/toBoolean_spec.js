var Snowman = require('../../../.');
var toBooleanConverter = require('../../../src/addons/converters/toBoolean');

describe('toBoolean', function() {

  var snowman, execSpy;

  beforeEach(function() {
    execSpy = {
      onResolve:function() {},
      onReject:function() {}
    };
    snowman = new Snowman({
      _params:{
        b1: true,
        b2: 'true',
        b3: false,
        b4: 'false',
        b5: undefined,
        b6: null
      }
    });
    spyOn(execSpy, 'onResolve');
    spyOn(execSpy, 'onReject');
  });

  it('converts boolean true correctly for 1 field', function() {
    var toBoolean = toBooleanConverter(
      'b1',
      {root:'_params'}
    );
    snowman
    .pipe(toBoolean)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
    expect(snowman.getData()._params.b1).toBe(true);
  });

  it('converts string true correctly for 1 field', function() {
    var toBoolean = toBooleanConverter(
      'b2',
      {root:'_params'}
    );
    snowman
    .pipe(toBoolean)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
    expect(snowman.getData()._params.b2).toBe(true);
  });

  it('converts boolean false correctly for 1 field', function() {
    var toBoolean = toBooleanConverter(
      'b3',
      {root:'_params'}
    );
    snowman
    .pipe(toBoolean)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
    expect(snowman.getData()._params.b3).toBe(false);
  });

  it('converts string false correctly for 1 field', function() {
    var toBoolean = toBooleanConverter(
      'b4',
      {root:'_params'}
    );
    snowman
    .pipe(toBoolean)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
    expect(snowman.getData()._params.b4).toBe(false);
  });

  it('converts correctly for multiple field', function() {
    var toBoolean = toBooleanConverter(
      ['b1', 'b2', 'b3', 'b4'],
      {root:'_params'}
    );
    snowman
    .pipe(toBoolean)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
    expect(snowman.getData()._params.b1).toBe(true);
    expect(snowman.getData()._params.b2).toBe(true);
    expect(snowman.getData()._params.b3).toBe(false);
    expect(snowman.getData()._params.b4).toBe(false);
  });

  it('converts boolean true correctly for 1 field with from and to', function() {
    var toBoolean = toBooleanConverter(
      {from:'_params.b1', to:'out.b1'}
    );
    snowman
    .pipe(toBoolean)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
    expect(snowman.getData().out.b1).toBe(true);
  });

  it('converts string true correctly for 1 field with from and to', function() {
    var toBoolean = toBooleanConverter(
      {from:'_params.b2', to:'out.b2'}
    );
    snowman
    .pipe(toBoolean)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
    expect(snowman.getData()._params.b2).toBe('true');
    expect(snowman.getData().out.b2).toBe(true);
  });

  it('converts correctly for array with from and to', function() {
    var toBoolean = toBooleanConverter(
      [
        {from:'_params.b1', to:'out.b1'},
        {from:'_params.b2', to:'out.b2'}
      ]
    );
    snowman
    .pipe(toBoolean)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
    expect(snowman.getData().out.b1).toBe(true);
    expect(snowman.getData().out.b2).toBe(true);
  });
});
