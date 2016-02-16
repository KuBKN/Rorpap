/* Webservice API */

var express = require('express');
var router = express.Router();

router.post('/upload', function(req, res, next) {
    console.log(req);
    res.send(200);
});

module.exports = router;
