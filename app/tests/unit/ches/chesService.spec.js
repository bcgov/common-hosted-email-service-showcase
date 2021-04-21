const axios = require('axios');
const config = require('config');
const MockAdapter = require('axios-mock-adapter');

const helper = require('../../common/helper');
const chesService = require('../../../src/ches/chesService');
const errorToProblem = require('../../../src/components/errorToProblem');

const apiUrl = `${config.get('serviceClient.commonServices.ches.endpoint')}/v1`;
const mockInstance = axios.create();
const mockAxios = new MockAdapter(mockInstance);

chesService.axios = mockInstance;
jest.mock('../../../src/components/errorToProblem');

helper.logHelper();

describe('chesService', () => {
  beforeEach(() => {
    mockAxios.reset();
    errorToProblem.mockReset();
  });

  describe('health', () => {
    const endpoint = `${apiUrl}/health`;

    it('should call CHES health endpoint successfully', async () => {
      mockAxios.onGet(endpoint).reply(200, {});
      const result = await chesService.health();

      expect(result.data).toBeTruthy();
      expect(result.status).toBe(200);
      expect(mockAxios.history.get).toHaveLength(1);
      expect(errorToProblem).toHaveBeenCalledTimes(0);
    });

    it('should report a problem', async () => {
      mockAxios.onGet(endpoint).networkError();
      await chesService.health();

      expect(mockAxios.history.get).toHaveLength(1);
      expect(errorToProblem).toHaveBeenCalledTimes(1);
    });
  });

  describe('send', () => {
    const endpoint = `${apiUrl}/email`;

    it('should call CHES email endpoint successfully', async () => {
      mockAxios.onPost(endpoint).reply(201, 'test');
      const result = await chesService.send();

      expect(result.data).toBeTruthy();
      expect(result.status).toBe(201);
      expect(mockAxios.history.post).toHaveLength(1);
      expect(errorToProblem).toHaveBeenCalledTimes(0);
    });

    it('should report a problem', async () => {
      mockAxios.onGet(endpoint).networkError();
      await chesService.send();

      expect(mockAxios.history.post).toHaveLength(1);
      expect(errorToProblem).toHaveBeenCalledTimes(1);
    });
  });
});
