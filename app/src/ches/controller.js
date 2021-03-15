const config = require('config');
const chesService = require('./chesService');

const healthCheck = async (_req, res, next) => {
  try {
    const { data, status } = await chesService.health();
    res.status(status).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { healthCheck };
