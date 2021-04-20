const router = require('express').Router();

const ches = require('../ches');
const chesPath = ches.mount(router);

// Base v1 responder
router.get('/', (_req, res) => {
  res.status(200).json({
    endpoints: [
      chesPath
    ]
  });
});

module.exports = router;
