const axios = require('axios');
const config = require('config');
const MockAdapter = require('axios-mock-adapter');

const chesService = require('../../../src/ches/chesService');
const errorToProblem = require('../../../src/components/errorToProblem');

const apiUrl = `${config.get('serviceClient.commonServices.ches.endpoint')}/v1`;
const mockInstance = axios.create();
const mockAxios = new MockAdapter(mockInstance);

chesService.axios = mockInstance;
jest.mock('../../../src/components/errorToProblem');

describe('chesService', () => {
  beforeEach(() => {
    mockAxios.reset();
    errorToProblem.mockReset();
  });

  describe('health', () => {
    const endpoint = `${apiUrl}/health`;

    it('should call CHES endpoint successfully', async () => {
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

  describe('getStatus', () => {
    const endpoint = `${apiUrl}/status`;

    it('should call CHES endpoint successfully', async () => {
      mockAxios.onGet(endpoint).reply(200, {});
      const result = await chesService.getStatus();

      expect(result.data).toBeTruthy();
      expect(result.status).toBe(200);
      expect(mockAxios.history.get).toHaveLength(1);
      expect(errorToProblem).toHaveBeenCalledTimes(0);
    });

    it('should report a problem', async () => {
      mockAxios.onGet(endpoint).networkError();
      await chesService.getStatus();

      expect(mockAxios.history.get).toHaveLength(1);
      expect(errorToProblem).toHaveBeenCalledTimes(1);
    });
  });

  describe('cancel', () => {
    const endpoint = `${apiUrl}/cancel`;

    it('should call CHES endpoint successfully', async () => {
      mockAxios.onDelete(endpoint).reply(202, {});
      const result = await chesService.cancel();

      expect(result.data).toBeTruthy();
      expect(result.status).toBe(202);
      expect(mockAxios.history.delete).toHaveLength(1);
      expect(errorToProblem).toHaveBeenCalledTimes(0);
    });

    it('should report a problem', async () => {
      mockAxios.onDelete(endpoint).networkError();
      await chesService.cancel();

      expect(mockAxios.history.delete).toHaveLength(1);
      expect(errorToProblem).toHaveBeenCalledTimes(1);
    });
  });

  describe('send', () => {
    const endpoint = `${apiUrl}/email`;

    it('should call CHES endpoint successfully', async () => {
      mockAxios.onPost(endpoint).reply(201, {});
      const result = await chesService.send();

      expect(result.data).toBeTruthy();
      expect(result.status).toBe(201);
      expect(mockAxios.history.post).toHaveLength(1);
      expect(errorToProblem).toHaveBeenCalledTimes(0);
    });

    it('should report a problem', async () => {
      mockAxios.onPost(endpoint).networkError();
      await chesService.send();

      expect(mockAxios.history.post).toHaveLength(1);
      expect(errorToProblem).toHaveBeenCalledTimes(1);
    });
  });

  describe('merge', () => {
    const endpoint = `${apiUrl}/emailMerge`;

    it('should call CHES endpoint successfully', async () => {
      mockAxios.onPost(endpoint).reply(201, {});
      const result = await chesService.merge();

      expect(result.data).toBeTruthy();
      expect(result.status).toBe(201);
      expect(mockAxios.history.post).toHaveLength(1);
      expect(errorToProblem).toHaveBeenCalledTimes(0);
    });

    it('should report a problem', async () => {
      mockAxios.onPost(endpoint).networkError();
      await chesService.merge();

      expect(mockAxios.history.post).toHaveLength(1);
      expect(errorToProblem).toHaveBeenCalledTimes(1);
    });
  });

  describe('mergePeview', () => {
    const endpoint = `${apiUrl}/emailMerge/preview`;

    it('should call CHES endpoint successfully', async () => {
      mockAxios.onPost(endpoint).reply(200, {});
      const result = await chesService.mergePeview();

      expect(result.data).toBeTruthy();
      expect(result.status).toBe(200);
      expect(mockAxios.history.post).toHaveLength(1);
      expect(errorToProblem).toHaveBeenCalledTimes(0);
    });

    it('should report a problem', async () => {
      mockAxios.onPost(endpoint).networkError();
      await chesService.mergePeview();

      expect(mockAxios.history.post).toHaveLength(1);
      expect(errorToProblem).toHaveBeenCalledTimes(1);
    });
  });

  describe('promote', () => {
    const endpoint = `${apiUrl}/promote`;

    it('should call CHES endpoint successfully', async () => {
      mockAxios.onPost(endpoint).reply(202, {});
      const result = await chesService.promote();

      expect(result.data).toBeTruthy();
      expect(result.status).toBe(202);
      expect(mockAxios.history.post).toHaveLength(1);
      expect(errorToProblem).toHaveBeenCalledTimes(0);
    });

    it('should report a problem', async () => {
      mockAxios.onPost(endpoint).networkError();
      await chesService.promote();

      expect(mockAxios.history.post).toHaveLength(1);
      expect(errorToProblem).toHaveBeenCalledTimes(1);
    });
  });
});
