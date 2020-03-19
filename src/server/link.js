
const cron = require('cron')
const events = require('./events')
const {serverState} = require('./state')
const connector = require( './connector')
const calculations = require('../calculations')

const syncLink = new cron.CronJob({
  cronTime: '0 */7 * * * *',
  onTick: sync,
  start: false,
  timeZone: 'America/Los_Angeles'
})

function sync(){
    console.log('sync trig')
    serverState.ao.forEach(a => {
        a.links.forEach(l => {
            let crawlered = calculations.crawler(serverState.tasks, l)
            let expectedHash = calculations.crawlerHash(serverState.tasks, l)
            connector.checkHash(a.address, a.outboundSecret, l, hashRes => {
                console.log({expectedHash, hashRes})
                if (expectedHash !== hashRes){
                    connector.postEvent(a.address, a.outboundSecret, {
                      type: 'tasks-received',
                      tasks: getList(crawlered)
                    }, (connectorRes) => {
                      console.log("ao relay response", {connectorRes})
                    })
                }
            })
        })
    })
}

function getList(taskIds){
    return serverState.tasks.filter(t => taskIds.indexOf(t.taskId) > -1)
}

module.exports = function (){
    syncLink.start()
}
