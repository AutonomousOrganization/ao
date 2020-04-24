const config = require( '../../configuration.js')
const uuidV1 = require( 'uuid/v1')
const express = require( 'express')
const lightningRouter = express.Router()
const allEvents = require('./events')
const calculations = require( '../calculations')
const LightningClient = require( 'lightning-client')
const {serverState} = require( './state')
const client = new LightningClient(config.clightning.dir, true);

lightningRouter.post('/lightning/channel',(req, res) => {
    client.fundchannel(req.body.id, 'all') // XXX
        .then(channel => {
            console.log(channel)
            res.send(true)
        })
})

function confirmTaskAddrs(){
    serverState.tasks.forEach(t => {
        if (!t.btcAddr){
            newAddress()
                .then(result => {
                    allEvents.addressUpdated(
                        t.taskId,
                        result['p2sh-segwit'],
                    )
                })
                .catch(err => console.log("confirm newaddr", err))
        }
    })
}

function createInvoice(sat, label, description, expiresInSec){
    return client.invoice(sat * 1000, label, description, expiresInSec)
}

function newAddress(){
    return client.newaddr('p2sh-segwit')
}

function updateAll(){
    checkFunds()
    getInfo()
}

function watchOnChain(){
    confirmTaskAddrs()
    setInterval(updateAll, 1000 * 60 * 10)
    setTimeout( () => {
        updateAll()
    }, 560)
}

function checkFunds(){
    return client
        .listfunds()
        .then(result => {
            try {
                allEvents.fundsSet(result.outputs, result.channels)
                result.outputs.forEach( o => {
                    if (o.status === 'confirmed' && serverState.cash.usedTxIds.indexOf(o.txid) === -1){
                        serverState.tasks.forEach( t => {
                            if (t.btcAddr === o.address){
                                let spot = serverState.cash.spot
                                if (spot <= 0){
                                    spot = 10000
                                }
                                let cadAmt = calculations.satsToCad(o.value, spot)
                                allEvents.taskBoosted(t.taskId, cadAmt, o.txid)
                            }
                        })
                    }
                })
            } catch (err) {console.log("lighting error; maybe lightningd (c-lightning) is not running")}
        })
        .catch(console.log)
}

function getInfo(){
    return client
        .getinfo()
        .then(result => {
            client.listpeers()
                .then(peers => {
                  try {
                    result.peers = peers.peers.map(p => {
                        return {
                            id: p.id,
                            channels: p.channels.length > 0
                        }
                    })
                  } catch (err){

                  }
                  try {
                      allEvents.getNodeInfo(result)
                  } catch (err) {
                      console.log('getNodeInfo error:  ', err)
                  }
                })
                .catch(err => {

                })
        })
        .catch(console.log)
}

function recordEveryInvoice(start){
    client.waitanyinvoice(start)
        .then(invoice => {
            let satoshis = invoice.msatoshi / 1000
            let spot = serverState.cash.spot
            let cadAmt = calculations.satsToCad(satoshis, spot)
            serverState.tasks.forEach( t => {
                if (t.payment_hash === invoice.payment_hash){
                    allEvents.taskBoostedLightning(t.taskId, cadAmt, invoice.payment_hash, invoice.pay_index)
                }
            })
            recordEveryInvoice(start + 1)
        })
        .catch(console.log)
}

module.exports = {
    createInvoice,
    newAddress,
    recordEveryInvoice,
    watchOnChain,
    lightningRouter
}
