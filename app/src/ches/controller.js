const chesService = require('./chesService');

const healthCheck = async (_req, res, next) => {
  try {
    const { data, status } = await chesService.health();
    res.status(status).json(data);
  } catch (error) {
    next(error);
  }
};

const sendEmail = async (req, res, next) => {
  let email = {};
  try {
    email = req.body;
    const { data, status } = await chesService.send(email);
    res.status(status).json(data);
  } catch (error) {
    next(error);
  }
};

const getStatus = async (req, res, next) => {
  let params = Object.values(req.params).every(param => param !== undefined) ? req.params : req.query;
  try {
    const { data, status } = await chesService.getStatus(params);
    res.status(status).json(data);
  } catch (error) {
    next(error);
  }
};

const cancel = async (req, res, next) => {
  let params = Object.values(req.params).every(param => param !== undefined) ? req.params : req.query;
  try {
    const { data, status } = await chesService.cancel(params);
    res.status(status).json(data);
  } catch (error) {
    next(error);
  }
};

const merge = async (req, res, next) => {
  let mergeData = {};
  try {
    mergeData = req.body;
    const { data, status } = await chesService.merge(mergeData);
    res.status(status).json(data);
  } catch (error) {
    next(error);
  }
};

const mergePreview = async (req, res, next) => {
  let mergeData = {};
  try {
    mergeData = req.body;
    const { data, status } = await chesService.mergePeview(mergeData);
    res.status(status).json(data);
  } catch (error) {
    next(error);
  }
};

const promote = async (req, res, next) => {
  let params = Object.values(req.params).every(param => param !== undefined) ? req.params : req.query;
  try {
    const { data, status } = await chesService.promote(params);
    res.status(status).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { healthCheck, sendEmail, getStatus, cancel, merge, mergePreview, promote };
