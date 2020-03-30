import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import modules from './modules'
import loader from './modules/loader'
import eventstream from './modules/eventstream'
import upgrades from './modules/upgrades'
import context from './modules/context'
import calculations from './calculations'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
      loader, eventstream, upgrades, context,
      ao: modules.ao,
      members: modules.members,
      tasks: modules.tasks,
      resources: modules.resources,
      cash: modules.cash,
      sessions: modules.sessions,
  },
  getters: {
      warpDrive(state, getters){
          return getters.liveConnections[state.upgrades.warp]
      },
      memberCard(state, getters){
          let memberCard = _.merge(calculations.blankCard('', '', ''), getters.hashMap[getters.member.memberId])
          return memberCard
      },
      contextCard(state, getters){
          let contextCard = _.merge(calculations.blankCard('', '', ''), getters.hashMap[state.context.panel[state.context.top]])
          return contextCard
      },
      contextDeck(state, getters){
          return getters.contextCard.subTasks.slice().reverse().map(t => getters.hashMap[t]).filter(t => !!t && t.color )
      },
      contextCompleted(state, getters){
          let upValence = []
          let downValence = []
          getters.contextCard.highlights.forEach(h => {
            if (h.valence){
              upValence.push(h.memberId)
            } else {
              downValence.push(h.memberId)
            }
          })
          return getters.contextCard.completed
              .map(tId => getters.hashMap[tId])
              .filter(t => {
                  return (
                      upValence.every(mId => t.claimed.indexOf(mId) > -1) &&
                      downValence.every(mId => t.claimed.indexOf(mId) === -1)
                  )
              })
      },
      contextMember(state, getters){
          let contextMem = false
          state.members.some(m => {
              if (m.memberId === getters.contextCard.taskId){
                  contextMem = m
              }
          })
          return contextMem
      },
      // contextGuilds(state, getters){
      //     if (getters.contextMember){
      //         return state.tasks.filter(t => t.deck.indexOf(getters.contextMember.memberId) > -1)
      //     }
      // },
      contextResource(state, getters){
        let contextRes = false
        state.resources.some(r => {
            if (r.resourceId === getters.contextCard.taskId){
                contextRes = r
            }
        })
        return contextRes
      },
      contextRelevantMembers(state, getters){
          let byCompletion = []
          getters.contextCompleted.forEach(c => {
              c.claimed.forEach(mId => {
                  byCompletion.push(mId)
              })
          })
          getters.contextCard.deck.forEach(mId => {
              byCompletion.push(mId)
          })
          getters.contextCard.passed.map(p => {
              byCompletion.push(p[1])
          })
          return _.uniq(byCompletion)
      },
      all(state, getters){
          if (state.context.completed){
              return getters.contextCompleted
          }
          return getters.contextDeck
      },
      red(state, getters){
          if (state.context.completed){
              return getters.contextCompleted.filter(d => d.color === 'red')
          }
          return getters.contextDeck.filter(d => d.color === 'red')
      },
      yellow(state, getters){
          if (state.context.completed){
              return getters.contextCompleted.filter(d => d.color === 'yellow')
          }
          return getters.contextDeck.filter(d => d.color === 'yellow')
      },
      green(state, getters){
          if (state.context.completed){
              return getters.contextCompleted.filter(d => d.color === 'green')
          }
          return getters.contextDeck.filter(d => d.color === 'green')
      },
      purple(state, getters){
          if (state.context.completed){
              return getters.contextCompleted.filter(d => d.color === 'purple')
          }
          return getters.contextDeck.filter(d => d.color === 'purple')
      },
      blue(state, getters){
          if (state.context.completed){
              return getters.contextCompleted.filter(d => d.color === 'blue')
          }
          return getters.contextDeck.filter(d => d.color === 'blue')
      },
      hashMap(state){
          let hashMap = {}
          state.tasks.forEach(t => {
              Vue.set(hashMap, t.taskId, t)
          })
          return hashMap
      },
      connectionUris(state, getters){
          return state.cash.info.address.map(a => {
              return state.cash.info.id + "@" + a.address + ":" + a.port
          })
      },
      memberIds(state, getters){
          return state.members.map(c => c.memberId)
      },
      presentIds(state, getters){
          let now = Date.now()
          return state.members
              .filter(c => c.memberId && now - c.lastUsed < 3600000 * 4)
              .map(c => c.memberId)
      },
      resourceIds(state, getters){
          return state.resources.map(c => c.resourceId)
      },
      myGuilds(state, getters){
          let my = state.tasks.filter(t => {
              if(!t.guild) return false
              if(t.deck.indexOf(getters.member.memberId) === -1) {
                return false
              }
              return true
          })
          my = _.filter(my, st => !my.some(t => t.subTasks.concat(t.priorities, t.completed).indexOf(st.taskId) > -1))
          my.forEach(g => {
              g.tempLastClaimed = 0
              let completions = g.completed.map(t => getters.hashMap[t])
              completions.forEach(c => {
                  if(typeof c === 'undefined') {
                      console.log("invalid data due to broken subTaskId links in completed list")
                      return
                  }
                  if(c.lastClaimed > g.tempLastClaimed) {
                      g.tempLastClaimed = c.lastClaimed
                  }
              })
          })
          my.sort((a, b) => {
              return b.tempLastClaimed - a.tempLastClaimed
          })
          return my
      },
      pubguilds(state, getters){
          let guilds = []
          let uniqueG = []
          state.tasks.forEach((c, i) => {
              if (c.guild){
                  let l = uniqueG.indexOf(c.guild)
                  if (l === -1){
                    guilds.push(c)
                    uniqueG.push(c.guild)
                  } else {
                    let o = guilds[l]
                    if (o.deck.length <= c.deck.length){
                      guilds[l] = c
                    }
                  }
              }
          })
          guilds = _.filter(guilds, st => !guilds.some(t => t.subTasks.concat(t.priorities, t.completed).indexOf(st.taskId) > -1))
          guilds.sort( (a, b) => {
              let aVal = a.deck.length
              let bVal = b.deck.length
              return bVal - aVal
          })

          if (guilds.length > 11){
              return guilds.slice(0,11)
          }
          return guilds
      },
      sendableGuilds(state, getters) {
          let guilds = _.filter(getters.myGuilds, st => !getters.pubguilds.some(t => { return t.taskId === st.taskId } ))
          guilds = getters.pubguilds.concat(guilds)
          guilds = _.filter(guilds, st => !guilds.some(t => t.subTasks.concat(t.priorities, t.completed).indexOf(st.taskId) > -1))
          guilds.forEach(g => {
              g.subTasks.concat(g.priorities, g.completed).forEach(p => {
                  let task = getters.hashMap[p]
                  if(!task) {
                      console.log("null taskId found, this means cleanup is not happening elsewhere and is very bad")
                  } else if(task.guild) {
                      task.subTasks.concat(task.priorities, task.completed).forEach(sp => {
                          let subtask = getters.hashMap[sp]
                          if(!subtask) {
                              console.log("null subtaskId found, this means cleanup is not happening elsewhere and is very bad")
                          } else if(subtask.guild) {
                              if(!task.guilds) {
                                  task.guilds = []
                              }
                              if(task.guilds.indexOf(subtask) === -1) {
                                  task.guilds.push(subtask)
                              }
                          }
                      })
                      if(!g.guilds) {
                          g.guilds = []
                      }
                      if(g.guilds.indexOf(task) === -1) {
                          g.guilds.push(task)
                      }
                  }
              })
          })
          console.log('sendableGuilds ', guilds)
          return guilds
      },
      isLoggedIn(state, getters){
          let isLoggedIn = !!getters.member.memberId
          return isLoggedIn
      },
      member(state, getters){
          let loggedInMember = {}
          let memberId = false
          state.sessions.forEach(session => {
              if (state.loader.session === session.session){
                  memberId = session.ownerId
              }
          })

          state.members.forEach( m => {
              if (m.memberId === memberId) {
                  _.assign(loggedInMember, m)
              }
          })
          return loggedInMember
      },
      inbox(state, getters){
          let passedToMe = []
          if (getters.isLoggedIn){
              state.tasks.forEach(t => {
                  t.passed.forEach(p => {
                      if (p[1] ===  getters.member.memberId){
                          passedToMe.push(t)
                      }
                  })
              })
          }
          return passedToMe
      },
      confirmedBalance(state, getters){
          let confirmedBalance = 0
          state.cash.outputs.forEach(o => {
              confirmedBalance += o.value
          })
          return confirmedBalance
      },
      totalLocal(state, getters){
          let totalLocal = 0
          state.cash.channels.forEach(c => {
              totalLocal += c.channel_sat
          })
          return totalLocal
      },
      totalRemote(state, getters){
          let totalRemote = 0
          state.cash.channels.forEach(c => {
              totalRemote += (c.channel_total_sat - c.channel_sat)
          })
          return totalRemote
      },
      totalWallet(state, getters){
          return parseInt( getters.totalLocal ) +  parseInt( getters.confirmedBalance )
      },
      satPointSpot(state, getters){
          if (state.cash.spot > 0){
              return calculations.cadToSats(1, state.cash.spot)
          }
          return 1000
      },
      membersVouches(state, getters){
          let members = state.members.slice()
          let vouches = []
          members.forEach(m => {
              let memberCard = getters.hashMap[m.memberId]
              memberCard.deck.forEach(v => {
                  let prevCount = vouches.find(c => c.memberId === v)
                  if(!prevCount) {
                      vouches.push({ memberId: v, count: 0 })
                  } else {
                      prevCount.count++
                  }
              })
          })
          return vouches
      },
      liveConnections(state, getters){
          return state.ao.filter(r => r.state && r.state.cash && r.state.cash.alias)
      },
  },
  middlewares: [],
  strict: process.env.NODE_ENV !== 'production'
})
