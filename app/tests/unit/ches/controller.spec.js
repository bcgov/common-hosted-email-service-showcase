const helper = require('../../common/helper');
const controller = require('../../../src/ches/controller');
const chesService = require('../../../src/ches/chesService');

helper.logHelper();

describe('healthCheck', () => {

  // afterEach(() => {
  //   jest.clearAllMocks();
  // });

  const healthSpy = jest.spyOn(chesService, 'health');

  it('controller should return a JSON object', async () => {

    healthSpy.mockImplementation(() => {
      return { data: 'test', status: 200 };
    });

    await controller.healthCheck({}, {}, () => {});

    expect(healthSpy).toHaveBeenCalledTimes(1);
  });
});


describe('sendEmail', () => {

  const sendSpy = jest.spyOn(chesService, 'send');

  it('controller should call CHES to send an email', async () => {

    sendSpy.mockImplementation(() => {
      return { data: 'test', status: 200 };
    });

    await controller.sendEmail({}, {}, () => {});

    expect(sendSpy).toHaveBeenCalledTimes(1);
  });

});
