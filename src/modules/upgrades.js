const Vue = require( 'vue')
const modes = ["doge", "boat", "timecube", "chest", "badge"]
const payments = ["bitcoin", "lightning"]
const dimensions = ["unicorn", "sun", "bull"]

const state = {
    search: '',
    modes,
    mode: modes[0],
    dimension: dimensions[0],
    bird: false,
    barking: false,
    pinging: false,
    chosenDay: false,
    flashClasses: {
        flash: false,
        half: false,
        twice: false,
        five: false
    },
}

const mutations = {
    chooseDay(state, x){
        state.chosenDay = x
        console.log(state.chosenDay, 'chosen')
    },
    setSearch(state, x){
        state.search = x
    },
    flash(state){
        state.flashClasses.flash = true
    },
    flashHalf(state){
        state.flashClasses.half = true
    },
    flashTwice(state){
        state.flashClasses.twice = true
    },
    flashFive(state){
        state.flashClasses.five = true
    },
    flashOff(state){
        state.flashClasses.flash = false
        state.flashClasses.half = false
        state.flashClasses.twice = false
        state.flashClasses.five = false
    },
    toggleBird(state){
        state.bird = !state.bird
    },
    nextMode(state) {
        let currentIndex = modes.indexOf(state.mode)
        let nextIndex = (currentIndex + 1) % modes.length
        state.mode = modes[nextIndex]
    },
    previousMode(state) {
        let currentIndex = modes.indexOf(state.mode)
        let prevIndex = (currentIndex <= 0) ? modes.length - 1 : (currentIndex - 1)
        state.mode = modes[prevIndex]
    },
    setMode(state, index) {
        state.mode = modes[index]
    },
    closeUpgrades(state) {
        state.mode = modes[0]
    },
    setPayMode(state, index) {
        state.payment = payments[index]
    },
    closePayMode(state) {
        state.payment = false
    },
    setDimension(state, index) {
        state.dimension = dimensions[index]
    },
    closeDimension(state) {
        state.dimension = false
    },
    bark(state) {
        state.barking = true
        state.pinging = true
        // XXX - should be sync? Works!?
        setTimeout(()=> {
            state.barking = false
        }, 1000)
        setTimeout(()=> {
            state.pinging = false
        }, 2000)
    }
}

const actions = {
    nextUpgradeMode({commit, state}, router) {
        commit("nextMode")


        if(state.dimension === 'sun'){
            return router.push('/front/' + state.mode)
        }
        if(state.dimension === 'bull'){
            return router.push('/dash/' + state.mode)
        }
        router.push('/' + state.mode)
    },
    previousUpgradeMode({commit, state}, router) {
        commit("previousMode")


        if(state.dimension === 'sun'){
            return router.push('/front/' + state.mode)
        }
        if(state.dimension === 'bull'){
            return router.push('/dash/' + state.mode)
        }
        router.push('/' + state.mode)
  },
  flashHelm({commit, state}, flashes){
      commit('flash')
      let ms = 350
      if(flashes < 1) {
          commit('flashHalf')
          ms *= 0.7
      } else if(flashes === 2) {
          commit('flashTwice')
          ms *= flashes
      } else if(flashes === 5) {
          commit('flashFive')
          ms *= flashes
      }
      setTimeout( () => {
          commit('flashOff')
      }, ms)

  }

}
const getters = {}

module.exports = {
    state,
    mutations,
    actions,
    getters,
}
