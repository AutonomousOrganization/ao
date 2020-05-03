const _ = require( 'lodash')

let memes = [
    'very database',
    'such create',
    'wow',
    'much store',
    'wow',
    'very happen',
    'much do',
    'no spoon',
    'wow',
]

let colors = [
    'white',
    'red',
    'yellow',
    'lime',
    'aqua',
    'blue',
    'fuchsia',
]

function bestMeme(){
  return memes[Math.floor(Math.random()*memes.length)];
}

const state = []

const mutations = {
    show(state, ev){
        let newBubble = {
            meme: bestMeme(),
            type: "",
            showEvent: false,
            randomX: '45%',
            randomColors: [],
            randomXs: [],
            randomYs: []
        }
        _.assign(newBubble, ev)
        newBubble.meme = bestMeme()
        newBubble.showEvent = true
        newBubble.randomX = Math.random().toFixed(2) * 91 + '%'
        for(let i = 0; i < 2; i++) newBubble.randomColors.push(colors[Math.floor(Math.random() * colors.length)])
        for(let i = 0; i < 2; i++) newBubble.randomXs.push(Math.floor(Math.random() * 100) + '%')
        for(let i = 0; i < 2; i++) newBubble.randomYs.push(Math.floor(Math.random() * 100) + '%')

        // let notTheseOnes = ["funds-set", "get-node-info", 'member-field-updated', 'task-touched', 'task-swapped', 'address-updated', 'invoice-created', 'task-valued', 'task-de-sub-tasked', 'task-prioritized']
        let onlyThese = ['task-created', 'task-sub-tasked']
        if (onlyThese.indexOf(newBubble.type) > -1){
            if (state.every(e => e.timestamp !== ev.timestamp)){
                state.push(newBubble)
            }
        }
    },
    hide(state){
        let canHide = state[0]
        if (canHide){
            canHide.showEvent = false
            state.shift()
        }
    }
}

const actions = {
    displayEvent({commit, getters}, ev){
        if(ev.type === 'doge-barked' || ev.type === 'resource-used') {
            if (getters.member && !getters.member.muted){
                let flip = new Audio(require('../assets/sounds/ping.wav'))
                flip.play()
            }
            commit('bark')
        }
        commit('show', ev)
        setTimeout(()=>{
            commit('hide')
        }, 3567)
    }
}

module.exports = {
  state,
  mutations,
  actions
}
