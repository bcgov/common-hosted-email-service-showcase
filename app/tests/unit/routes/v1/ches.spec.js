const request = require('supertest');

const helper = require('../../../common/helper');

//
// mock middleware
//
const keycloak = require('../../../../src/components/keycloak');
//
// test assumes that caller has appropriate token, we are not testing middleware here...
//
keycloak.protect = jest.fn(() => {
  return jest.fn((req, res, next) => {
    next();
  });
});


const router = require('../../../../src/ches/routes');

const chesService = require('../../../../src/ches/chesService');

// Simple Express Server
const basePath = '/api/v1/ches';
const app = helper.expressHelper(basePath, router);
helper.logHelper();


describe(`GET ${basePath}/health`, () => {

  // check health endpoint
  // it('should return 200', async () => {
  //   chesService.health = jest.fn().mockReturnValue([]);
  //   const response = await request(app).get(`${basePath}`);
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body).toBeTruthy();
  // });

  const getHealthSpy = jest.spyOn(chesService, 'health');

  afterEach(() => {
    getHealthSpy.mockReset();
  });


  it('should yield a created response', async () => {
    getHealthSpy.mockReturnValue('test');
    const response = await request(app).get(`${basePath}/health`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body).toMatch('test');
    expect(getHealthSpy).toHaveBeenCalledTimes(1);
  });



  it('should yield an error and fail gracefully', async () => {
    getHealthSpy.mockImplementation(() => {
      throw new Error('bad');
    });
    const response = await request(app).get(`${basePath}/health`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeTruthy();
    expect(response.body.details).toBe('bad');
    expect(getHealthSpy).toHaveBeenCalledTimes(1);
  });

});
