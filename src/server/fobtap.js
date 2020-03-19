const express = require('express')
const router = express.Router()

const state = require('./state')
const utils = require('./utils')
const validators = require('./validators')
const events = require('./events')

function access(member, resource){
    if (member.active < 0){
        return false
    }
    if (resource.charged === 0){
        return true
    }
    let newBalance = member.balance - resource.charged
    return newBalance >= 0
}

function resourceCheck(req, res, next){
    let member = utils.memberFromFob(req.body.fob)
    let resource = utils.getResource(req.body.resourceId)
    if (member && resource && access(member,resource)){
        events.resourceUsed(
          req.body.resourceId,
          member.memberId,
          req.body.amount || 1,
          resource.charged || 0,
          req.body.notes || 'D',
          utils.buildResCallback(res)
        )
    } else {
        next()
    }
}

router.use('/fobtap', resourceCheck)

router.use('/fobtap', (req, res)=> {
    res.end('fobtap not handled')
})

module.exports = router
