const errorToProblem = require('../../../src/components/errorToProblem');
const helper = require('../../common/helper');

const SERVICE = 'TESTSERVICE';

helper.logHelper();

describe('errorToProblem', () => {
  it('should throw a 422', () => {
    const e = {
      response: {
        data: { detail: 'detail' },
        status: 422
      }
    };
    expect(() => errorToProblem(SERVICE, e)).toThrow('422');
  });

  it('should throw a 502', () => {
    const e = {
      message: 'msg'
    };
    expect(() => errorToProblem(SERVICE, e)).toThrow('502');
  });
});
