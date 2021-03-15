const router = require('express').Router();

const ches = require('../ches');
const chesPath = ches.mount(router);

// Base v1 responder
router.get('/', (req, res) => {
  res.status(200).json({

    // requests for website pages
    links: relatedLinks.createLinks(req, [
      { r: 'email', m: 'GET', p: '/email' }
    ]),

    // child routes
    endpoints: [
      chesPath
    ]
  });
});

module.exports = router;
