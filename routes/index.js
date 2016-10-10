var express = require('express');
var passport = require('passport');
var router = express.Router();
var mqttSettings = require('../private/mqtt.js').mqttSettings;
/* GET home page. */
router.get('/',
 require('connect-ensure-login').ensureLoggedIn(),
 function(req, res, next) {
  res.render('index', { title: 'Graca Home' });
});



router.get('/mqttsettings',
require('connect-ensure-login').ensureLoggedIn(),
function(req, res, next) {
  res.send(mqttSettings);
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Graca Home' });
});

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

module.exports = router;
