const express = require('express')
const router = express.Router()

const state = require('./state')
const events = require('./events')
const uuidV1 = require('uuid/v1')

router.get('/newaccount/:name', (req, res) => {
    let token, session = req.params.name
    console.log('?? new')
    let secret = uuidV1()
    events.memberCreated(req.params.name, '', secret, (err2, res2) => {
        console.log('member created ..~ ',{err2, res2})
        let session = uuidV1()
        let token = uuidV1()
        let ownerId = res2.ev.memberId
        events.sessionCreated(ownerId, session, token, (err3, res3)=>{
            console.log('session created ..~ ',{err3, res3})
            res.json({token, session})
        })
    })
})

module.exports = router
