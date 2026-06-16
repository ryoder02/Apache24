const router = require('express').Router();
router.use('/temperature', require('./temperature'));
router.use('/raw', require('./raw'));
router.use('/ports', require('./ports'));
router.use('/r0', require('./r0'));
router.use('/t0', require('./t0'));
router.use('/beta', require('./beta'));
router.use('/adcmax', require('./adcmax'));
module.exports = router;