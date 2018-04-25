const router = require('koa-router')({
  prefix: '/weapp'
})

const eatController = require('../controllers/eatController.js')

router.get('/eat/map', eatController.getLocation)

router.post('/eat/submit', eatController.submitEatRecord)

router.get('/eat/gethistory', eatController.getHistoryRecord)

module.exports = router;