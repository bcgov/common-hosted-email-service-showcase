const helper = require('../../common/helper');
const chesService = require('../../../src/ches/chesService');

helper.logHelper();

describe('health', () => {

  it('should call CHES service to get health', async () => {

    chesService.health = jest.fn().mockReturnValue({ data: 'test', status: 200 });
    const { data, status } = await chesService.health();

    expect(data).toBeTruthy();
    expect(status).toBe(200);
    expect(chesService.health).toHaveBeenCalledTimes(1);
  });

});


describe('send', () => {

  // const email = {
  //   bodyType: 'html',
  //   body: '<h1>Welcome to Common Services</h1><p>Sent by <a href="https://bcgov.github.io/common-hosted-email-service/">CHES</a></p>',
  //   delayTS: 0,
  //   from: 'abc@gov.bc.ca',
  //   subject: 'CHES Email Message',
  //   to: ['xyz@gov.bc.ca'],
  //   tag: 'email_123'
  // };


  it('calls CHES service to send email', async () => {

    chesService.send = jest.fn().mockReturnValue({ data: 'test', status: 200 });
    const { data, status } = await chesService.send({});

    expect(data).toBeTruthy();
    expect(status).toBe(200);
    expect(chesService.send).toHaveBeenCalledTimes(1);
  });

});

