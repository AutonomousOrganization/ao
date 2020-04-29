const _ = require( 'lodash')
const state = require( './state')

module.exports = {
  isAmount(val, errRes){
      let parsed = parseFloat(val)
      if (parsed !== 0 && !parsed) {
          errRes.push('amount must be a number')
          return false
      }
      if (parsed < 0){
          errRes.push('amount must be positive')
          return false
      }
      return parsed >= 0
  },
  isField(val, errRes){
      let isField = (
          val === 'name' ||
          val === 'email' ||
          val === 'secret' ||
          val === 'fob' ||
          val === 'muted' ||
          val === 'tooltips' ||
          val === 'stacks' ||
          val === 'action' ||
          val === 'guides' ||
          val === 'payments'
      )
      if (!isField) {
          errRes.push('invalid field')
          return false
      }
      return isField
  },
  isAddress(val, errRes){
      let result = state.serverState.ao.some(ao =>{
          if (val === ao.address){
            return true
          }
      })
      if (!result) {
          errRes.push('invalid address')
      }
      return result
  },
  isMemberId(val, errRes){
      let member = false
      let result = state.serverState.members.some(m =>{
          if (val === m.memberId){
            member = m
            return true
          }
      })
      if (!result) {
          errRes.push('invalid member')
      }
      return member
  },

  isActiveMemberId(val, errRes){
      let member = false
      let result = state.serverState.members.some(m =>{
          if (val === m.memberId && m.active > 0){
              member = m
              return true
          }
      })
      if (!result) {
          errRes.push('invalid member')
      }
      return member
  },
  isTaskId(val, errRes){
      let task = false
      let result = state.serverState.tasks.some(t =>{
          if (val === t.taskId){
            task = t
            return true
          }
      })
      if (!result) {
          errRes.push('invalid task')
      }
      return task
  },
  isSession(val, errRes){
      let result = false
      state.serverState.sessions.forEach(s => {
          if (val === s.session){
            result = true
          }
      })
      if (!result) {
          errRes.push('invalid session')
      }
      return result
  },
  isResourceId(val, errRes){
      let resource
      let result = state.serverState.resources.some(r =>{
          if (val === r.resourceId){
            resource = r
            return true
          }
      })
      if (!result) {
          errRes.push('invalid resource')
      }
      return resource
  },
  isNewResourceId(val, errRes){
      let isNew = true
      state.serverState.resources.forEach(resource =>{
          if (val == resource.resourceId){
            isNew = false
          }
      })
      if (!isNew){
          errRes.push('resourceId exists')
      }
      return isNew
  },
  isBool(val, errRes){
      let isBool = (typeof val === 'boolean')
      if (!isBool){
          errRes.push('field requires boolean')
      }
      return isBool
  },
  isNotes(val, errRes){
      return true
  }
}
