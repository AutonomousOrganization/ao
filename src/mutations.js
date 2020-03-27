// Mutations are state builders.
// The current state is the result of all the events in the system fed through the mutation functions.
// `server/state.js` for server; `modules/*` for vuex.

// const Vue = require('vue')
const _ = require( 'lodash')
const uuidv1 = require( 'uuid/v1')
const cryptoUtils = require( './crypto')
const calculations = require( './calculations')

function aoMuts(aos, ev) {
    switch (ev.type) {
        case "ao-linked":
            aos.forEach( (ao, i) => {
                if (ao.address === ev.address) {
                    ao.links.push(ev.taskId)
                }
            })
            break
  			case "ao-inbound-connected":
            let inAddressConnect = aos.some(a => {
                if (a.address === ev.address){
                    a.inboundSecret = ev.secret
                    a.lastContact = Date.now()
                    return true
                }
            })
            if (!inAddressConnect){
                let newEv = {
                    address: ev.address,
                    outboundSecret: false,
                    inboundSecret: ev.secret,
                    lastContact: Date.now(),
                    links: []
                }
                aos.push(newEv)
            }
  				  break
        case "ao-outbound-connected":
            let outAddressConnect = aos.some(a => {
                if (a.address === ev.address){
                    a.outboundSecret = ev.secret
                    a.lastContact = Date.now()
                    return true
                }
            })
            if (!outAddressConnect){
                let newEv = {
                    address: ev.address,
                    outboundSecret: ev.secret,
                    inboundSecret: false,
                    lastContact: Date.now(),
                    links: []
                }
                aos.push(newEv)
            }
            break
        case "ao-disconnected":
            aos.forEach( (ao, i) => {
                if (ao.address === ev.address) {
                    aos.splice(i, 1)
                }
            })
            break
    }
}

function cashMuts(cash, ev){
		switch (ev.type) {
			case "ao-named":
				cash.alias = ev.alias
				break
			case "spot-updated":
				cash.spot = ev.spot
				break
			case "currency-switched":
				cash.currency = ev.currency
				break
			case "rent-set":
				cash.rent = parseFloat(ev.amount)
				break
			case "cap-set":
				cash.cap = ev.amount
				break
			case "funds-set":
				cash.outputs = ev.outputs
				cash.channels = ev.channels
				break
			case "task-boosted":
				cash.usedTxIds.push(ev.txid)
				break
			case "task-boosted-lightning":
				cash.pay_index = ev.pay_index
				break
			case "get-node-info":
				cash.info = ev.info
				break
		}
}

function membersMuts(members, ev){
  switch (ev.type){
      case "ao-outbound-connected":
          break
      case "ao-disconnected":
          break
      case "member-created":
          ev.lastUsed = ev.timestamp
          members.push(ev)
          break
      case "member-activated":
          members.forEach( member => {
              if (member.memberId === ev.memberId){
                  if ( member.active < 0) {
                      member.active = -1 * member.active
                  } else {
                      member.active ++
                  }
              }
          })
          break
      case "task-boosted":
          members.forEach( member => {
              if (member.memberId === ev.taskId){
                  if ( member.active < 0) {
                      member.active = -1 * member.active
                  } else {
                      member.active ++
                  }
              }
          })
          break
      case "task-boosted-lightning":
          members.forEach( member => {
              if (member.memberId === ev.taskId){
                  if ( member.active < 0) {
                      member.active = -1 * member.active
                  } else {
                      member.active ++
                  }
              }
          })
          break
      case "member-deactivated":
          members.forEach( member => {
              if (member.memberId === ev.memberId){
                  if (member.active > 0){
                      member.active = -1 * member.active - 1
                  }
              }
          })
          break
      case "member-purged":
          members.forEach( (member, i) => {
              if (member.memberId === ev.memberId) {
                      members.splice(i, 1)
              }
          })
          break
      case "resource-used":
          members.forEach( member => {
              if (member.memberId === ev.memberId){
                  member.lastUsed = ev.timestamp
              }
          })
          break
      case "member-field-updated":
          members.forEach( member => {
              if (member.memberId === ev.memberId){
                  member[ev.field] = ev.newfield
              }
          })
          break
      case "doge-barked":
          members.forEach( member => {
              if (member.memberId === ev.memberId){
                  member.lastUsed = ev.timestamp
              }
          })
          break
  }
}

function resourcesMuts(resources, ev){
	switch (ev.type) {
		case "resource-created":
			let resourceIds = resources.map(r => r.resourceId)
			if (resourceIds.indexOf(ev.resourceId) === -1){
					resources.push(ev)
			} else {
					console.log("BAD data duplicate resource rejected in mutation, dup resource task likely created")
			}
			break
		case "resource-used":
			resources.forEach( resource => {
				if (resource.resourceId == ev.resourceId){
					resource.stock -= parseInt(ev.amount)
				}
			})
			break
		case "resource-purged":
				resources.forEach( (r, i) => {
						if (r.resourceId === ev.resourceId) {
								resources.splice(i, 1)
						}
				})
				break
		case "resource-stocked":
			resources.forEach( resource => {
				if (resource.resourceId == ev.resourceId){
						resource.stock += parseInt(ev.amount)
				}
			})
			break
	}
}


function sessionsMuts(sessions, ev){
		switch (ev.type) {
				case "session-created":
						let idHasSession = sessions.some(session => {
								// replace that sessions creds,
								let match = false
								if (session.ownerId === ev.ownerId){
										match = true
										_.merge(session, ev)
								}
								return match // true terminates the some loop & idHasSession->true too
						})

						if (idHasSession){
							 // edited in session
						} else {
								// id didn't previously have session
								sessions.push(ev)
						}
						break
				case "session-killed":
						sessions.forEach( (s, i) => {
								if (s.session == ev.session){
										_.pullAt(sessions, i)
								}
						})
						break
				case "ao-outbound-connected":
						sessions.push({
								ownerId: ev.address,
								token: ev.secret,
								session: ev.address,
						})
						break
	}
}

function tasksMuts(tasks, ev) {
    switch (ev.type) {
        case "task-popped":
            let explodingTask, absorbingTask
            tasks.forEach( task => {
                if (task.taskId === ev.taskId){
                    explodingTask = task
                }
                if (task.taskId === ev.inId){
                    absorbingTask = task
                }
            })
            if (explodingTask, absorbingTask){
              absorbingTask.priorities = _.filter(absorbingTask.priorities, taskId => taskId !== ev.taskId )
              absorbingTask.subTasks = _.filter(absorbingTask.subTasks, taskId => taskId !== ev.taskId )
              absorbingTask.completed = _.filter(absorbingTask.completed, taskId => taskId !== ev.taskId )
              absorbingTask.subTasks = absorbingTask.subTasks.concat(explodingTask.subTasks)
              absorbingTask.priorities = absorbingTask.priorities.concat(explodingTask.priorities)
              absorbingTask.completed = absorbingTask.completed.concat(explodingTask.completed)
            }
            break
        case "pile-prioritized":
            tasks.forEach( task => {
                if (task.taskId === ev.inId){
                    task.priorities = task.priorities.concat(task.subTasks)
                    task.subTasks = []
                }
            })
            break
        case "pile-refocused":
            tasks.forEach( task => {
                if (task.taskId === ev.inId){
                    task.priorities.forEach(stId => {
                        tasks.forEach(st => {
                            if (st.taskId === stId){
                                if(st.claimed && (st.claimed.length >= 1)){
                                    task.completed.push(stId)
                                } else {
                                    task.subTasks.push(stId)
                                }
                            }
                        })
                        task.priorities = []
                    })
                }
            })
            break
        case "pile-de-sub-tasked":
            tasks.forEach( task => {
                if (task.taskId === ev.inId){
                    task.subTasks = []
                }
            })
            break
        case "highlighted":
            tasks.forEach( task => {
                if (task.taskId === ev.taskId){
                    let didUpdateInline = false
                    task.highlights.forEach((h, i) => {
                        if (h.memberId === ev.memberId){
                            didUpdateInline = true
                            if (h.valence === ev.valence){
                                task.highlights.splice(i, 1)
                            } else {
                                h.valence = ev.valence
                            }
                        }
                    })
                    if (!didUpdateInline){
                        task.highlights.push({
                          memberId: ev.memberId,
                          valence: ev.valence
                        })
                    }
                }
            })
            break
        case "ao-outbound-connected":
            tasks.push(calculations.blankCard(ev.address, ev.address, 'purple'))
            break
        case "ao-disconnected":
            break
        case "resource-created":
            tasks.push(calculations.blankCard(ev.resourceId, ev.resourceId, 'red'))
            break
        case "member-created":
            tasks.push(calculations.blankCard(ev.memberId, ev.memberId, 'blue'))
            break
        case "task-created":
            tasks.push(calculations.blankCard(ev.taskId, ev.name, ev.color, ev.deck))
            tasks.forEach(task => {
                if (task.taskId === ev.inId) {
                    task.subTasks = _.filter(task.subTasks, tId => tId !== ev.taskId)
                    task.subTasks.push(ev.taskId)
                }
            })
            break
        case "address-updated":
            tasks.forEach( t => {
                if (t.taskId === ev.taskId){
                    t.address = ev.address
                }
            })
            break
        case "task-passed":
            tasks.forEach(task => {
                if (task.taskId === ev.taskId) {
                    let pass = [ev.fromMemberId, ev.toMemberId]

                    if( !task.passed.some(p => {
                        if( p[0] === pass[0] && p[1] === pass[1]) {
                            return true
                        }
                    })) {
                        task.passed.push(pass)
                    }
                }
            })
            break
        case "task-grabbed":
            tasks.forEach(task => {
                if (task.taskId === ev.taskId) {
                    task.passed = _.filter( task.passed, d => d[1] !== ev.memberId )
                    if(task.deck.indexOf(ev.memberId) === -1) {
                        if(ev.taskId !== ev.memberId && ev.memberId) {
                            task.deck.push(ev.memberId)
                        }
                    }
                }
            })
            break
        case "pile-grabbed":
            if(!ev.memberId) {
                break
            }
            tasks.forEach(task => {
                if(task.taskId === ev.taskId) {
                    task.passed = _.filter(task.passed, d => d[1] !== ev.memberId)
                    let crawler = [ev.taskId]
                    let history = []
                    let newCards = []
                    do {
                        newCards = []
                        crawler = crawler.forEach(t => {
                            if(history.indexOf(t) >= 0) return
                            let subTask = tasks.filter(pst => pst.taskId === t)
                            if(subTask.length < 1) {
                                console.log("missing subtask, this is messy")
                                return
                            }
                            if(subTask.length > 1) {
                                console.log("duplicate task found, this is very bad")
                            }
                            subTask = subTask[0]
                            if(subTask === undefined || subTask.subTasks === undefined || subTask.priorities === undefined || subTask.completed === undefined) {
                                console.log("invalid task data found, this is very bad")
                                return
                            }

                            history.push(t)

                            if(subTask.deck.indexOf(ev.memberId) === -1 && ev.taskId !== ev.memberId) {
                                subTask.passed = _.filter(subTask.passed, d => d[1] !== ev.memberId)
                                subTask.deck.push(ev.memberId)
                            }
                            newCards = newCards.concat(subTask.subTasks).concat(subTask.priorities).concat(subTask.completed)
                        })
                        crawler = newCards
                    } while(crawler.length > 0)
                }
            })
            break
        case "task-dropped":
            tasks.forEach(task => {
                if (task.taskId === ev.taskId) {
                    task.deck = _.filter(task.deck, d => d !== ev.memberId)
                }
            })
            break
        case "pile-dropped":
            if(!ev.memberId) {
                break
            }
            tasks.forEach(task => {
                if(task.taskId === ev.taskId) {
                    task.passed = _.filter(task.passed, d => d[1] !== ev.memberId)
                    let crawler = [ev.taskId]
                    let history = []
                    let newCards = []
                    do {
                        newCards = []
                        crawler = crawler.forEach(t => {
                            if(history.indexOf(t) >= 0) return
                            let subTask = tasks.filter(pst => pst.taskId === t)
                            if(subTask.length < 1) {
                                console.log('missing subtask, this is messy')
                                return
                            }
                            if(subTask.length > 1) {
                                console.log('duplicate task found, this is very bad')
                            }
                            subTask = subTask[0]
                            if(subTask === undefined || subTask.subTasks === undefined || subTask.priorities === undefined || subTask.completed === undefined) {
                                console.log('invalid task data found, this is very bad')
                                return
                            }

                            history.push(t)

                            if(subTask.deck.indexOf(ev.memberId) >= 0 && ev.taskId !== ev.memberId) {
                                subTask.passed = _.filter(subTask.passed, d => d[1] !== ev.memberId)
                                subTask.deck = _.filter(subTask.deck, d => d !== ev.memberId)
                            }
                            newCards = newCards.concat(subTask.subTasks).concat(subTask.priorities).concat(subTask.completed)
                        })
                        crawler = newCards
                    } while(crawler.length > 0)
                }
            })
            break
        case "member-purged":
            tasks.forEach((task, i) => {
                if (task.taskId === ev.memberId) {
                        tasks.splice(i, 1)
                }
            })
            tasks.forEach( t => {
                    t.subTasks = t.subTasks.filter(st => st !== ev.memberId)
                    t.priorities = t.priorities.filter(st => st !== ev.memberId)
                    t.claimed = t.claimed.filter(st => st !== ev.memberId)
                    t.deck = t.deck.filter(st => st !== ev.memberId)
                    t.passed = t.passed.filter(p => !(p[0] === ev.memberId || p[1] === ev.memberId))
            })
            break
        case "task-removed":
            tasks.forEach((task, i) => {
                if (task.taskId === ev.taskId) {
                        tasks.splice(i, 1)
                }
            })
            tasks.forEach( t => {
                    t.subTasks = t.subTasks.filter(st => st !== ev.taskId)
                    t.priorities = t.priorities.filter(st => st !== ev.taskId)
                    t.completed = _.filter(t.completed, st => st !== ev.taskId)
            })
            break
        case "task-prioritized":
            tasks.forEach( task => {
              if (task.taskId === ev.inId){
                  task.priorities = _.filter(task.priorities, taskId => taskId !== ev.taskId )
                  task.subTasks = _.filter(task.subTasks, taskId => taskId !== ev.taskId )
                  task.completed = _.filter(task.completed, taskId => taskId !== ev.taskId )
                  task.priorities.push(ev.taskId)
              }
            })
            break
        case "task-refocused":
            let claimed
            tasks.forEach( task => {
                if (task.taskId === ev.taskId) {
                    claimed = task.claimed
                }
            })
            tasks.forEach( task => {
                if (task.taskId === ev.inId){
                    task.priorities = _.filter(task.priorities, taskId => taskId !== ev.taskId )
                    task.subTasks = _.filter(task.subTasks, taskId => taskId !== ev.taskId)
                    if(claimed && claimed.length >= 1) {
                        task.completed.push(ev.taskId)
                    } else {
                        task.subTasks.push(ev.taskId)
                    }
                }
            })
            break
        case "task-sub-tasked":
            tasks.forEach(task => {
                if(task.taskId === ev.subTask) {
                    task.passed = _.filter(task.passed, d => d[1] !== ev.memberId)
                    if(ev.memberId && task.deck.indexOf(ev.memberId) === -1) {
                        if(ev.subTask !== ev.memberId) {
                            task.deck.push(ev.memberId)
                        }
                    }
                }
                if(task.taskId === ev.taskId) {
                    task.subTasks = _.filter(task.subTasks, tId => tId !== ev.subTask)
                    task.subTasks.push(ev.subTask)
                }
            })
            break
        case "task-de-sub-tasked":
            tasks.forEach(task => {
                if (task.taskId === ev.taskId) {
                    task.passed = _.filter(task.passed, d => d[1] !== ev.memberId)
                    task.subTasks = _.filter(task.subTasks, tId => tId !== ev.subTask )
                    task.completed = _.filter(task.completed, tId => tId !== ev.subTask )
                }

            })
            break
        case "task-guilded":
            tasks.forEach(task => {
                if(task.taskId === ev.taskId) {
                    task.guild = ev.guild
                }
            })
            break
        case "task-claimed":
            let bounty = 0
            tasks.forEach(task => {
                let found = false
                if(task.taskId === ev.memberId) {
                    task.boost += parseFloat(ev.paid)
                }

                task.priorities.some(taskId => {
                    if(taskId !== ev.taskId) {
                        return false
                    } else {
                        found = true
                        return true
                    }
                })

                task.subTasks.some(taskId => {
                    if(taskId !== ev.taskId) {
                        return false
                    } else {
                        found = true
                        return true
                    }
                })

                if(found) {
                    if(task.priorities.indexOf(ev.taskId) === -1) {
                        task.subTasks = _.filter(task.subTasks, tId => tId !== ev.subTask )
                        task.completed = _.filter(task.completed, tId => tId !== ev.subTask )
                        task.completed.push(ev.taskId)
                    }
                }
                if (task.taskId === ev.taskId) {
                    task.passed = _.filter( task.passed, d => d[1] !== ev.memberId )
                    if(task.deck.indexOf(ev.memberId) === -1) {
                        if(ev.taskId !== ev.memberId && ev.memberId) {
                            task.deck.push(ev.memberId)
                        }
                    }
                    if(task.claimed.indexOf(ev.memberId) === -1) {
                        task.claimed.push(ev.memberId)
                    }
                    task.lastClaimed = ev.timestamp
                }
            })
            break
        case "task-unclaimed":
            tasks.forEach(task => {
                if(task.taskId === ev.taskId) {
                    task.claimed = task.claimed.filter(mId => mId !== ev.memberId)
                    if(task.claimed.length < 1) {
                        tasks.forEach(p => {
                            if(p.priorities.indexOf(ev.taskId) === -1 && p.completed.indexOf(ev.taskId) > -1) {
                                task.completed = task.completed.filter(taskId => taskId !== ev.taskId)
                                task.subTasks = task.subTasks.filter(taskId => taskId !== ev.taskId)
                                task.subTasks.push(ev.taskId)
                            }
                        })
                    }
                }
            })
            break
        case "task-boosted":
            tasks.forEach(task => {
                if (task.taskId === ev.taskId) {
                    let amount = parseFloat(ev.amount)
                    let boost  = parseFloat(task.boost)
                    if (amount > 0){
                        task.boost = amount + boost
                        task.address = ""
                    }
                }
            })
            break
        case "task-boosted-lightning":
            tasks.forEach(task => {
                if (task.payment_hash === ev.payment_hash) {
                        let amount = parseFloat(ev.amount)
                        let boost  = parseFloat(task.boost)
                        if (amount > 0){
                          task.boost = amount + boost
                          task.bolt11 = ""
                          task.payment_hash = ""
                        }
                }
            })
            break
        case "resource-booked":
            tasks.forEach( task => {
                if (task.taskId === ev.resourceId) {
                    task.book = ev
                }
            })
            break
        case "resource-used":
            tasks.forEach(task => {
                let charged = parseFloat(ev.charged)
                if (charged > 0){
                  if (task.taskId === ev.memberId){
                        task.boost -= charged
                  }
                  if (task.taskId === ev.resourceId){
                        task.boost += charged
                  }
                }
            })
            break
        case "invoice-created":
            tasks.forEach( task => {
                if (task.taskId === ev.taskId) {
                    task.payment_hash = ev.payment_hash
                    task.bolt11 = ev.bolt11
                }
            })
            break
        case "task-swapped":
            let task
            tasks.forEach((t) => {
                if (t.taskId === ev.taskId) {
                    task = t
                }
            })

            if(task){
                let originalIndex = task.subTasks.indexOf(ev.swapId1)
                let swapIndex = task.subTasks.indexOf(ev.swapId2)

                let originalIndexCompleted = task.completed.indexOf(ev.swapId1)
                let swapIndexCompleted = task.completed.indexOf(ev.swapId2)

                if ( originalIndex > -1 && swapIndex > -1 ){
                    let newST = task.subTasks.slice()
                    newST[originalIndex] = ev.swapId2
                    newST[swapIndex] = ev.swapId1
                    task.subTasks = newST
                }

                if ( originalIndexCompleted > -1 && swapIndexCompleted > -1 ){
                    let newCompleted = task.completed.slice()
                    newCompleted[originalIndexCompleted] = ev.swapId2
                    newCompleted[swapIndexCompleted] = ev.swapId1
                    task.completed = newCompleted
                }
            }
            break
        case "tasks-received":
            ev.tasks.forEach(newT => {
                if(!tasks.some((cur, i) => {
                    if(cur.taskId === newT.taskId) {
                        calculations.safeMerge(cur, newT)
                        return true
                    }
                })) {
                    tasks.push(newT) /// XXX safeclone?
                }
            })
            break
        case "member-charged":
            tasks.forEach(task => {
                if (task.taskId === ev.memberId){
                    task.boost -= parseFloat(ev.charged)
                    if (task.boost < 0){
                        task.boost = 0
                    }
                }
            })
            break
    }
}

module.exports = {
    aoMuts,
    cashMuts,
    membersMuts,
    resourcesMuts,
    sessionsMuts,
    tasksMuts,
}
