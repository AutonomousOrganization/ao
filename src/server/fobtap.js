const express = require('express')
const router = express.Router()

const state = require('./state')
const utils = require('./utils')
const validators = require('./validators')
const events = require('./events')
const calculations = require('../calculations')



function whatCharge(resource, notes){

    // look at notes, look at priorities of card
    // should resource.charged be minimum
    return resource.charged
}

function resourceCheck(req, res, next){
    let member = utils.memberFromFob(req.body.fob)
    let resource = utils.getResource(req.body.resourceId)
    let memberCard = validators.isTaskId(member.memberId, [])
    let charged = whatCharge(resource, req.body.notes) //XXX
    let notes = req.body.notes || 'A' //XXX (req.body.notes? from fobtap not a thing, should be?)
    if (member && resource && calculations.access(member.active, memberCard.boost ,charged)){
        events.resourceUsed(
          req.body.resourceId,
          member.memberId,
          charged,
          notes,
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
