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
      return true
  },
  isField(val, errRes){
      let isField = (
          val === 'name' ||
          val === 'email' ||
          val === 'secret' ||
          val === 'fob'
      )
      if (!isField) {
          errRes.push('invalid field')
          return false
      }
      return isField
  },
  isAddress(val, errRes){
      let result = false
      state.serverState.ao.forEach(ao =>{
          if (val === ao.address){
            result = true
          }
      })
      if (!result) {
          errRes.push('invalid address')
      }
      return result
  },
  isMemberId(val, errRes){
      let result = false
      state.serverState.members.forEach(member =>{
          if (val === member.memberId){
            result = true
          }
      })
      if (!result) {
          errRes.push('invalid member')
      }
      return result
  },
  isActiveMemberId(val, errRes){
      let result = false
      state.serverState.members.forEach(member =>{
          if (val === member.memberId && member.active > 0){
            result = true
          }
      })
      if (!result) {
          errRes.push('invalid member')
      }
      return result
  },
  isTaskId(val, errRes){
      let result = false
      state.serverState.tasks.forEach(task =>{
          if (val == task.taskId){
            result = true
          }
      })
      if (!result) {
          errRes.push('invalid task')
      }
      return result
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
      let result = false
      state.serverState.resources.forEach(resource =>{
          if (val === resource.resourceId){
            result = true
          }
      })
      if (!result) {
          errRes.push('invalid resource')
      }
      return result
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
