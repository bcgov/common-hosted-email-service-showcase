const config = require('config');
const ChesService = require('./chesService');

const getService = () => {
  const clientConfig = config.get('services.ches');
  return new ChesService(clientConfig);
};

const healthCheck = async (_req, res, next) => {
  const svc = getService();
  try {
    const { data, status } = await svc.health();
    res.status(status).json(data);
  } catch (error) {
    next(error);
  }
};


module.exports = { healthCheck };
