const _ = require( 'lodash')
const dctrlDb = require( './dctrlDb')
const M = require( '../mutations')
const modules = require( '../modules')
const config = require( '../../configuration')

const serverState = {
  ao: [],
  sessions: [],
  members: [],
  tasks: [],
  resources: [],
  cash: {
    address: config.tor.hostname,
    alias: 'dctrl',
    currency: 'CAD',
    spot: 0,
    rent: 0,
    cap: 75,
    pay_index: 0,
    usedTxIds: [],
    outputs: [],
    channels: [],
    info: {},
  },
}

const pubState = {
  ao: [],
  sessions: [],
  members: [],
  tasks: [],
  resources: [],
  cash: {
    address: config.tor.hostname,
    alias: '',
    currency: 'CAD',
    spot: 0,
    rent: 0,
    cap: 75,
    pay_index: 0,
    usedTxIds: [],
    outputs: [],
    channels: [],
    info: {},
  },
}

function setCurrent(state, b){
    modules.cash.mutations.setCurrent(state.cash, b)
    modules.tasks.mutations.setCurrent(state.tasks, b)
    modules.sessions.mutations.setCurrent(state.sessions, b)
    modules.ao.mutations.setCurrent(state.ao, b)
    modules.members.mutations.setCurrent(state.members, b)
    modules.resources.mutations.setCurrent(state.resources, b)
}

function applyBackup(b){
    let b1 = Object.assign({}, b)
    setCurrent(serverState, b1)
    b.resources = b.resources.map(removeSensitive)
    b.members = b.members.map(removeSensitive)
    b.ao = b.ao.map(removeSensitive)
    b.tasks = b.tasks.map(removeSensitive)
    setCurrent(pubState, b)
}

function applyEvent(state, ev) {
    M.cashMuts(state.cash, ev)
    M.membersMuts(state.members, ev)
    M.resourcesMuts(state.resources, ev)
    M.sessionsMuts(state.sessions, ev)
    M.tasksMuts(state.tasks, ev)
    M.aoMuts(state.ao, ev)
}

function initialize(callback) {
    let start = Date.now()
    dctrlDb.recover((err, backup) => {
          let ts = 0
          if (backup.length > 0){
              ts = backup[0].timestamp
              console.log('using backup from ', Date(ts))
              applyBackup(backup[0])
          }
          dctrlDb.getAll(ts, (err, all) => {
              if (err) return callback(err)
              console.log('applying ', all.length , ' events')
              all.forEach( ev => {
                  applyEvent(serverState, Object.assign({}, ev) )
                  applyEvent(pubState, removeSensitive( Object.assign({}, ev) ))
              })
              console.log('finished in ', Date.now() - start , 'ms')
              callback(null)
          })
    })
}

function backupState(){
    dctrlDb.insertBackup(serverState)
}

function removeSensitive(ev){
      let secretStuff = ['fob', 'secret', 'token', 'email', 'payment_hash', 'inboundSecret', 'outboundSecret']
      if (ev.type === 'member-field-updated'){
          ['fob', 'secret', 'email'].forEach( str => {
              if (ev.field === str){
                  secretStuff.push('newfield')
              }
          })
      }
      return _.omit(ev, secretStuff)
}

module.exports = {
    serverState,
    pubState,
    initialize,
    applyEvent,
    removeSensitive,
    setCurrent,
}
