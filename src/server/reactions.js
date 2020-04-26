const { getResource } = require( './utils')
const events = require( './events')
const { serverState } = require( './state')
const lightning = require('./lightning')


function checkForChargedEvent( resourceId ){
    let charged
    serverState.bookings.forEach( b => {
        if (resourceId === b.resourceId) {
            let dnow = new Date()
            let now = dnow.getTime()
            let tsUntilStart = parseInt(b.startTs) - now
            let tsUntilEnd = parseInt(b.endTs) - now
            let current = (tsUntilStart < 0 && tsUntilEnd > 0)
            if (current && b.charge > 0){
                charged = b.charge
            }
        }
    })
    return charged
}

function reactions(ev){
    process.nextTick( err => {
        switch (ev.type) {
            case 'task-boosted':
            case 'task-boosted-lightning':
                let optionList = []
                let defaultPrice
                let resourceId
                let resourceList = serverState.resources.map(r => r.resourceId)
                let amount = parseFloat(ev.amount)

                serverState.tasks.some(t => {
                    if (resourceList.indexOf(t.taskId) > -1 && t.priorities.indexOf(ev.taskId) > -1){
                        resourceId = t.taskId
                        return true
                    }
                })
                if (resourceId){
                    console.log("got resourceId, attempting trigger", resourceId)
                    serverState.resources.some(r => {
                      if (r.resourceId === resourceId){
                        defaultPrice = r.charge
                        return true
                      }
                    })
                    serverState.tasks.some(t => {
                      if (ev.taskId === t.taskId){
                        let str = t.name
                        let cashTagLocation = str.search(/\$/)
                        let customPrice = parseFloat( str.slice(cashTagLocation + 1, cashTagLocation + 5) )
                        if (customPrice > 0){
                          console.log("using custom price, ", customPrice)
                          defaultPrice = customPrice
                        }
                        let hopper = t.name.split(':')[0]
                        events.resourceUsed(resourceId, '', defaultPrice, hopper, console.log)
                        return true
                      }
                    })
                }
                break
            case 'member-field-updated':
                break
            case 'member-paid':
                break
            case 'resource-stocked':
                events.memberActivated(ev.memberId)
                break
            case 'resource-stocked':
                break
            case 'member-created':
                break
            case 'resource-created':
                break
            case 'task-created':
                lightning.newAddress()
                    .then(result => {
                        events.addressUpdated(
                            ev.taskId,
                            result['p2sh-segwit'],
                        )
                    })
                    .catch(err => console.log("tcre newaddr", err))
                break
            case 'resource-created':
                lightning.newAddress()
                    .then(result => {
                        events.addressUpdated(
                            ev.resourceId,
                            result['p2sh-segwit'],
                        )
                    })
                    .catch(err => console.log("rcre newaddr", err))
                break
            case 'member-created':
                lightning.newAddress()
                    .then(result => {
                        events.addressUpdated(
                            ev.memberId,
                            result['p2sh-segwit'],
                            utils.buildResCallback(res)
                        )
                    })
                    .catch(err => console.log("mcr newaddr", err))
                break
        }
    })
}

module.exports = reactions
