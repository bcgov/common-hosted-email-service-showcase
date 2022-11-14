const config = require('config');
const log = require('../../src/components/log')(module.filename);

const ClientConnection = require('../components/clientConnection');

const errorToProblem = require('../components/errorToProblem');
const SERVICE = 'CHES';

class ChesService {

  constructor({ tokenUrl, clientId, clientSecret, apiUrl }) {
    log.verbose('ChesService', `Constructed with ${tokenUrl}, ${clientId}, clientSecret, ${apiUrl}`);
    if (!tokenUrl || !clientId || !clientSecret || !apiUrl) {
      log.error('Invalid configuration.', { function: 'constructor' });
      throw new Error('ChesService is not configured. Check configuration.');
    }
    this.connection = new ClientConnection({ tokenUrl, clientId, clientSecret });
    this.axios = this.connection.axios;
    this.apiUrl = `${apiUrl}/v1`;
  }

  async health() {
    try {
      const { data, status } = await this.axios.get(
        `${this.apiUrl}/health`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return { data, status };
    } catch (e) {
      errorToProblem(SERVICE, e);
    }
  }

  async getStatus(params, query) {
    try {
      if (params && params.msgId) {
        const { data, status } = await this.axios.get(
          `${this.apiUrl}/status/${params.msgId}`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        return { data, status };
      } else {
        const { data, status } = await this.axios.get(
          `${this.apiUrl}/status`,
          {
            params: query,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        return { data, status };
      }
    } catch (e) {
      errorToProblem(SERVICE, e);
    }
  }

  async cancel(params, query) {
    try {
      if (params && params.msgId) {
        const { data, status } = await this.axios.delete(
          `${this.apiUrl}/cancel/${params.msgId}`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        return { data, status };
      } else {
        const { data, status } = await this.axios.delete(
          `${this.apiUrl}/cancel`,
          {
            params: query,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        return { data, status };
      }
    } catch (e) {
      errorToProblem(SERVICE, e);
    }
  }

  async send(email) {
    try {
      const { data, status } = await this.axios.post(
        `${this.apiUrl}/email`,
        email,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );
      return { data, status };
    } catch (e) {
      errorToProblem(SERVICE, e);
    }
  }

  async merge(mergeData) {
    try {
      const { data, status } = await this.axios.post(
        `${this.apiUrl}/emailMerge`,
        mergeData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );
      return { data, status };
    } catch (e) {
      errorToProblem(SERVICE, e);
    }
  }

  async mergePeview(mergeData) {
    try {
      const { data, status } = await this.axios.post(
        `${this.apiUrl}/emailMerge/preview`,
        mergeData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );
      return { data, status };
    } catch (e) {
      errorToProblem(SERVICE, e);
    }
  }

  async promote(params, query) {
    try {
      if (params && params.msgId) {
        const { data, status } = await this.axios.post(
          `${this.apiUrl}/promote/${params.msgId}`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        return { data, status };
      } else {
        const { data, status } = await this.axios.post(
          `${this.apiUrl}/promote`,
          {
            params: query,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        return { data, status };
      }
    } catch (e) {
      errorToProblem(SERVICE, e);
    }
  }

}

const endpoint = config.get('serviceClient.ches.endpoint');
const tokenEndpoint = config.get('serviceClient.ches.tokenEndpoint');
const username = config.get('serviceClient.ches.username');
const password = config.get('serviceClient.ches.password');

let chesService = new ChesService({ tokenUrl: tokenEndpoint, clientId: username, clientSecret: password, apiUrl: endpoint });
module.exports = chesService;
