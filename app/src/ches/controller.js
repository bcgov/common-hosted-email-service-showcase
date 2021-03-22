const chesService = require('./chesService');

const healthCheck = async (_req, res, next) => {
  try {
    const { data, status } = await chesService.health();
    res.status(status).json(data);
  } catch (error) {
    next(error);
  }
};

const sendEmail = async (_req, res, next) => {
  let email = {};
  try {
    email = _req.body;
    const { data, status } = await chesService.send(email);
    res.status(status).json(data);
  } catch (error) {
    next(error);
  }
};

const getStatus = async (_req, res, next) => {
  let params = Object.values(_req.params).every(param => param !== undefined) ? _req.params : _req.query;
  try {
    const { data, status } = await chesService.getStatus(params);
    res.status(status).json(data);
  } catch (error) {
    next(error);
  }
};

const cancel = async (_req, res, next) => {
  let params = Object.values(_req.params).every(param => param !== undefined) ? _req.params : _req.query;
  try {
    const { data, status } = await chesService.cancel(params);
    res.status(status).json(data);
  } catch (error) {
    next(error);
  }
};

const merge = async (_req, res, next) => {
  let mergeData = {};
  try {
    mergeData = _req.body;
    const { data, status } = await chesService.merge(mergeData);
    res.status(status).json(data);
  } catch (error) {
    next(error);
  }
};

const mergePreview = async (_req, res, next) => {
  let mergeData = {};
  try {
    mergeData = _req.body;
    const { data, status } = await chesService.mergePeview(mergeData);
    res.status(status).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { healthCheck, sendEmail, getStatus, cancel, merge, mergePreview };
