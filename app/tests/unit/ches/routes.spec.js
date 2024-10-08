const request = require('supertest');
const helper = require('../../common/helper');


// mock auth middleware
jest.mock('../../../src/middleware/authentication', () => ({
  authenticate: (req, res, next) => next()
}));

const router = require('../../../src/ches/routes');
const chesService = require('../../../src/ches/chesService');

// Simple Express Server
const basePath = '/ches';
const app = helper.expressHelper(basePath, router);

afterEach(() => {
  jest.clearAllMocks();
});

// health route
describe(`GET ${basePath}/health`, () => {

  const healthSpy = jest.spyOn(chesService, 'health');
  afterEach(() => {
    healthSpy.mockReset();
  });

  it('should yield a created response', async () => {

    healthSpy.mockImplementation(() => {
      return { data: 'test', status: 200 };
    });

    const response = await request(app).get(`${basePath}/health`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatch('test');
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

// email route
describe(`POST ${basePath}/email`, () => {

  const sendSpy = jest.spyOn(chesService, 'send');
  afterEach(() => {
    sendSpy.mockReset();
  });

  it('should yield a created response', async () => {

    sendSpy.mockImplementation(() => {
      return { data: 'test', status: 200 };
    });

    const response = await request(app).post(`${basePath}/email`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatch('test');
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });

  it('should yield an error and fail gracefully', async () => {

    sendSpy.mockImplementation(() => {
      throw new Error('bad');
    });

    const response = await request(app).post(`${basePath}/email`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeTruthy();
    expect(response.body.details).toBe('bad');
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});


// status route
describe(`GET ${basePath}/status/:msgId?`, () => {

  const getStatusSpy = jest.spyOn(chesService, 'getStatus');
  afterEach(() => {
    getStatusSpy.mockReset();
  });

  it('should yield a created response', async () => {

    getStatusSpy.mockImplementation(() => {
      return { data: 'test', status: 200 };
    });

    const response = await request(app).get(`${basePath}/status/:msgId?`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatch('test');
    expect(getStatusSpy).toHaveBeenCalledTimes(1);
  });

  it('should yield an error and fail gracefully', async () => {

    getStatusSpy.mockImplementation(() => {
      throw new Error('bad');
    });

    const response = await request(app).get(`${basePath}/status/:msgId?`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeTruthy();
    expect(response.body.details).toBe('bad');
    expect(getStatusSpy).toHaveBeenCalledTimes(1);
  });
});
