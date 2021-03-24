const request = require('supertest');
const helper = require('../../../common/helper');


// mock middleware
const keycloak = require('../../../../src/components/keycloak');
keycloak.protect = jest.fn(() => {
  return jest.fn((req, res, next) => {
    next();
  });
});

const router = require('../../../../src/ches/routes');
const chesService = require('../../../../src/ches/chesService');

// Simple Express Server
const basePath = '/ches';
const app = helper.expressHelper(basePath, router);
helper.logHelper();

afterEach(() => {
  jest.clearAllMocks();
});


describe(`GET ${basePath}/health`, () => {
  const healthSpy = jest.spyOn(chesService, 'health');

  afterEach(() => {
    healthSpy.mockReset();
  });


  it('should yield a created response...', async () => {
    healthSpy.mockReturnValue('test');
    const response = await request(app).get(`${basePath}/health`);

    expect(response.status).toBe(200);
    expect(response.data).toBeTruthy();
    expect(response.data).toMatch('test');
    expect(healthSpy).toHaveBeenCalledTimes(1);
  });



  it('should yield an error and fail gracefully', async () => {
    healthSpy.mockImplementation(() => {
      throw new Error('bad');
    });
    const response = await request(app).get(`${basePath}/health`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeTruthy();
    expect(response.body.details).toBe('bad');
    expect(healthSpy).toHaveBeenCalledTimes(1);
  });

});
