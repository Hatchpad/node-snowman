var Snowman = require('../../../.');
var isEnumValidator = require('../../../src/addons/validators/isEnum');

describe('isEnum', function() {

  var snowman, execSpy;

  beforeEach(function() {
    execSpy = {
      onResolve:function() {},
      onReject:function() {}
    };
    snowman = new Snowman({
      _params:{
        n1: null,
        n2: undefined,
        n3: 'three',
        n4: 'four',
        n5: 'five',
        n6: {an:'object'},
        n7: 7,
        n8: 8,
        o1: {type:'cat', name:'patches'},
        o2: {type:'dog', name:'sam'},
        o3: {type:'rat', name:'george'},
        o4: {type:'cat', name:'bill'},
        o5: {type:'skunk', name:'peter'}
      }
    });
    spyOn(execSpy, 'onResolve');
    spyOn(execSpy, 'onReject');
  });

  it('succeeds', function() {
    var en = ['three', 'five', 8];
    var isEnum = isEnumValidator(['n3', 'n5', 'n8'], en, {root:'_params'});
    snowman
    .pipe(isEnum)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('fails', function() {
    var en = ['three', 'five', 8];
    var isEnum = isEnumValidator(['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7', 'n8'], en, {root:'_params'});
    snowman
    .pipe(isEnum)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({
      n4:'is invalid',
      n6:'is invalid',
      n7:'is invalid'
    });
  });

  it('succeeds with equals param', function() {
    var en = ['cat', 'dog'];
    var equals = function(value, enumValue) {
      return value.type === enumValue;
    };
    var isEnum = isEnumValidator(['o1', 'o2', 'o4'], en, {root:'_params', equals:equals});
    snowman
    .pipe(isEnum)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('fails with equals param', function() {
    var en = ['cat', 'dog', 8];
    var equals = function(value, enumValue) {
      return value.type === enumValue;
    };
    var isEnum = isEnumValidator(['o1', 'o2', 'o3', 'o4', 'o5'], en, {root:'_params', equals:equals});
    snowman
    .pipe(isEnum)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({
      o3:'is invalid',
      o5:'is invalid'
    });
  });
});
