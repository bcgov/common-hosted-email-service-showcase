const config = require('config');
const log = require('npmlog');

const ClientConnection = require('./clientConnection');

const errorToProblem = require('./errorToProblem');
const SERVICE = 'CHES';

class ChesService {
  constructor({tokenUrl, clientId, clientSecret, apiUrl}) {
    log.verbose('ChesService', `Constructed with ${tokenUrl}, ${clientId}, clientSecret, ${apiUrl}`);
    if (!tokenUrl || !clientId || !clientSecret || !apiUrl) {
      log.error('ChesService', 'Invalid configuration.');
      throw new Error('ChesService is not configured. Check configuration.');
    }
    this.connection = new ClientConnection({ tokenUrl, clientId, clientSecret });
    this.axios = this.connection.axios;
    this.apiUrl = apiUrl;
  }

  async health() {
    try {
      const { data, status }  = await this.axios.get(
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

  async statusQuery(params) {
    try {
      const response = await this.axios.get(
        `${this.apiUrl}/status`,
        {
          params: params,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (e) {
      errorToProblem(SERVICE, e);
    }
  }

  async cancelMsg(msgId) {
    try {
      const response = await this.axios.delete(
        `${this.apiUrl}/cancel/${msgId}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (e) {
      errorToProblem(SERVICE, e);
    }
  }

  async cancelQuery(params) {
    try {
      const response = await this.axios.delete(
        `${this.apiUrl}/cancel`,
        {
          params: params,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (e) {
      errorToProblem(SERVICE, e);
    }
  }

  async send(email) {
    try {
      const response = await this.axios.post(
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
      return response.data;
    } catch (e) {
      errorToProblem(SERVICE, e);
    }
  }


  async merge(data) {
    try {
      const response = await this.axios.post(
        `${this.apiUrl}/emailMerge`,
        data,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );
      return response.data;
    } catch (e) {
      errorToProblem(SERVICE, e);
    }
  }

  async preview(data) {
    try {
      const response = await this.axios.post(
        `${this.apiUrl}/emailMerge/preview`,
        data,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );
      return response.data;
    } catch (e) {
      errorToProblem(SERVICE, e);
    }
  }

}

// const endpoint = config.get('serviceClient.commonServices.ches.endpoint');
// const tokenEndpoint = config.get('serviceClient.commonServices.tokenEndpoint');
// const username = config.get('serviceClient.commonServices.username');
// const password = config.get('serviceClient.commonServices.password');

// let chesService = new ChesService({tokenUrl: tokenEndpoint, clientId: username, clientSecret: password, apiUrl: endpoint});

module.exports = ChesService;
