const Vue = require( 'vue')
const satsPerBtc = 100000000 // one hundred million per btc
const _ = require('lodash')
const cryptoUtils = require('./crypto')

function access(active, memberBoost, charged){
    console.log({active, memberBoost, charged})
    if (active <= 0  || charged < 0){
        return false
    }
    let newBalance = memberBoost - charged
    return newBalance >= 0
}

function crawlerHash(tasks, taskId){
    return cryptoUtils.createHash(Buffer.from(crawler(tasks, taskId)))
}

function crawler(tasks, taskId){
  let history = []
  tasks.forEach(task => {
      if(task.taskId === taskId) {
          let crawler = [taskId]
          do {
              newCards = []
              crawler.forEach(t => {
                  if(history.indexOf(t) >= 0) return
                  history.push(t)
                  let subTask = tasks.filter(pst => pst.taskId === t)[0]
                  if (subTask){
                      newCards = newCards.concat(subTask.subTasks).concat(subTask.priorities).concat(subTask.completed)
                  }
              })
              crawler = newCards
          } while(crawler.length > 0)
      }
  })
  return history
}

function shortName(name) {
    let limit = 280
    let shortened = name.substring(0, limit)
    if(name.length > limit) {
        shortened += '…'
    }
    return shortened
}

function cardColorCSS(color) {
    return {
        redwx : color == 'red',
        bluewx : color == 'blue',
        greenwx : color == 'green',
        yellowwx : color == 'yellow',
        purplewx : color == 'purple',
        blackwx : color == 'black',
    }
}

function blankMember(memberId, name, fob, secret, lastUsed){
    return {
      memberId,
      name,
      fob,
      secret,
      lastUsed,
      active: 0,
      lastUsed: 0,
      muted: true,
      tooltips: true,
      stacks: 1,
      payments: 0,
      boats: true,
      action: false,
      guides:true,
      red: "#000000a0",
      yellow: "#000000a0",
      green: "#00f000a0",
      purple: "#000000a0",
      blue: "#000000a0",
    }
}

function blankCard(taskId, name, color, deck = []) {
    let newCard = {
        taskId,
        color,
        deck,
        name: name.trim(),
        btcAddr: false,
        bolt11: false,
        book: {},
        boost: 0,
        priorities: [],
        subTasks: [],
        completed: [],
        claimed: [],
        passed: [],
        actions: [],
        guild: false,
        lastClaimed: 0,
        completeValue: 0,
        payment_hash: '',
        highlights: [],
        claims: [],
        stackView: {
            all: 0,
            red: -1,
            blue: -1,
            yellow: 0,
            green: 0,
            purple: 0,
        },
        // actions: [], //
        // clocks: [],
    }
    return newCard
}

// function safeClone(card) {
//     // XXX type check all this
//     let safeClone = {
//         taskId: card.taskId,
//         name: card.name,
//         claimed: [],
//         completed: card.completed,
//         passed: [],
//         guild: card.guild,
//         subTasks: card.subTasks,
//         lastClaimed: 0,
//         book: card.book,
//         priorities: card.priorities,
//         deck: [],
//         color: card.color,
//         address: card.address,
//         bolt11: card.bolt11,
//         payment_hash: '',
//         boost: 0,
//     }
//     return safeClone
// }

function isString(x) {
  return Object.prototype.toString.call(x) === "[object String]"
}

function safeMerge(cardA, cardZ) {
    cardA.subTasks = [...new Set(cardA.subTasks.concat(cardZ.subTasks))]
    cardA.priorities = [...new Set(cardA.priorities.concat(cardZ.priorities))]
    cardA.completed = [...new Set(cardA.completed.concat(cardZ.completed))]
    // XXX only add in merge for now
    // XXX bolt11 / address need to clearly indicate origin ao
    // XXX book should be a list?
}

function cadToSats(cadAmt, spot){
    let sats = parseFloat( cadAmt ) / parseFloat( spot ) * satsPerBtc
    return parseInt(sats)
}

function satsToCad(sats, spot){
    let cad = sats * (spot / satsPerBtc)
    return cad.toFixed(2)
}

function calculateMsThisMonth(){
    let today = new Date()
    let daysThisMonth = new Date(today.getYear(), today.getMonth(), 0).getDate()
    return daysThisMonth * 24 * 60 * 60 * 1000
}

function getMeridienTime(ts){

    let d = new Date( parseInt(ts) )
    let hour24 = d.getHours()

    let rollover = 0
    if (hour24 >= 24){
        rollover = 1
        hour24 %= 24
    }

    let hour, meridien
    if (hour24 > 12){
        meridien = 'pm'
        hour = hour24 - 12
    } else {
        meridien = 'am'
        hour = hour24
    }

    let date = d.getDate() + rollover
    let month = d.getMonth() + 1
    let minute = d.getMinutes()
    let year = d.getFullYear()

    let weekday = d.toString().slice(0,3)

    return { weekday, year, month, date, hour, minute, meridien }
}

module.exports = {
  cadToSats,
  satsToCad,
  getMeridienTime,
  shortName,
  cardColorCSS,
  blankCard,
  blankMember,
  // safeClone,
  safeMerge,
  crawler,
  crawlerHash,
  access,
}
