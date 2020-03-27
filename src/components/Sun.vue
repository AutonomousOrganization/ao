<template lang='pug'>
div
  img.l(src="../assets/images/sun.svg"  ref='sun'  :class='{ bigger : isSun }')
  div.sunmenu(v-if='isSun && $store.getters.member.tooltips')
      p(@click='goFront("doge")'  :class='{ dabstination : $store.state.upgrades.mode === "doge" }')
          img.lil(src='../assets/images/buddadoge.svg')
          span Oracle
      p(@click='goFront("boat")'  :class='{ dabstination : $store.state.upgrades.mode === "boat" }')
          img.lil(src='../assets/images/boat.svg')
          span Top
      p(@click='goFront("badge")'  :class='{ dabstination : $store.state.upgrades.mode === "badge" }')
          img.lil(src='../assets/images/badge.svg')
          span Recent
      p(@click='goFront("chest")'  :class='{ dabstination : $store.state.upgrades.mode === "chest" }')
          img.lil(src='../assets/images/chest.svg')
          span Bounties
      p(@click='goFront("timecube")'  :class='{ dabstination : $store.state.upgrades.mode === "timecube" }')
          img.lil(src='../assets/images/timecube.svg')
          span Upcoming
      p.closemenu(@click='close(false)')
          img(src='../assets/images/loggedOut.svg')
          span
</template>

<script>
import Hammer from 'hammerjs'
import Propagating from 'propagating-hammerjs'

export default {
  computed:{
      isSun() {
          return this.$store.state.upgrades.dimension === "sun"
      },
  },
  methods: {
    nextMode() {
        this.$store.commit('nextMode')
    },
    goFront(mode) {
        if(!mode) {
            mode = this.$store.state.upgrades.mode
        }
        this.$store.commit('setDimension', 1)
        this.$store.commit('startLoading', 'sun-' + mode)

        this.$router.push('/front/' + mode)
    },
    close(mode){
        if(!mode) {
            mode = this.$store.state.upgrades.mode
        }
        this.$store.commit('setDimension', 0)
        this.$router.push('/' + mode)
    },
  },
  components:{},
  mounted(){
    let sunel = this.$refs.sun
    let sunmc = Propagating(new Hammer.Manager(sunel))
    let sunTap = new Hammer.Tap({ time: 400 })
    let sunDoubleTap = new Hammer.Tap({ event: 'doubletap', taps: 2, time: 400, interval: 400 })
    let sunTripleTap = new Hammer.Tap({ event: 'tripletap', taps: 3, time: 400, interval: 400 })
    let sunQuadrupleTap = new Hammer.Tap({ event: 'quadrupletap', taps: 4, time: 400, interval: 400 })
    let sunQuintupleTap = new Hammer.Tap({ event: 'quintupletap', taps: 5, time: 400, interval: 400 })
    let sunPress = new Hammer.Press({ time: 600 })
    sunmc.add([sunPress, sunQuintupleTap, sunQuadrupleTap, sunTripleTap, sunDoubleTap, sunTap])
    sunPress.recognizeWith([sunQuintupleTap, sunQuadrupleTap, sunTripleTap, sunDoubleTap, sunTap])
    sunTap.recognizeWith([sunQuintupleTap, sunQuadrupleTap, sunTripleTap, sunDoubleTap])
    sunTap.requireFailure([sunQuintupleTap, sunQuadrupleTap, sunTripleTap, sunDoubleTap])
    sunDoubleTap.recognizeWith([sunQuintupleTap, sunQuadrupleTap, sunTripleTap])
    sunDoubleTap.requireFailure([sunQuintupleTap, sunQuadrupleTap, sunTripleTap])
    sunTripleTap.recognizeWith([sunQuintupleTap, sunQuadrupleTap])
    sunTripleTap.requireFailure([sunQuintupleTap, sunQuadrupleTap])
    sunQuadrupleTap.recognizeWith(sunQuintupleTap)
    sunQuadrupleTap.requireFailure(sunQuintupleTap)

    sunmc.on('tap', (e) => {
        if(!this.isSun) {
            this.goFront(false)

        } else {
            this.nextMode()
            this.goFront(false)
        }
        e.stopPropagation()
    })

    sunmc.on('doubletap', (e) => {
        console.log("double click")
        this.goFront('boat')
        e.stopPropagation()
    })

    sunmc.on('tripletap', (e) => {
        console.log("triple click")
        this.goFront('badge')
        e.stopPropagation()
    })

    sunmc.on('quadrupletap', (e) => {
        this.goFront('chest')
        e.stopPropagation()
    })

    sunmc.on('quintupletap', (e) => {
        this.goFront('timecube')
        e.stopPropagation()
    })

    sunmc.on('press', (e) => {
        this.goFront('doge')
        e.stopPropagation()
    })
  }
}

</script>

<style lang='stylus' scoped>

@import '../styles/colours'

.l
    position: fixed
    top: 0
    cursor: pointer
    z-index: 152
    height: 3.5555555555em
    left: 0

.sunmenu
    position: fixed
    top: 5em
    background: yellow
    left: 1em
    color: main
    border-radius: 3px
    padding: 1em
    opacity: 0.8
    z-index: 9009
    p
        cursor: pointer
        padding: 0.7654321

p:hover
    background: rgba(255,255,255, 0.4)

.dabstination:before
    content: ""
    border: 1px solid white
    border-width: 2px 2px 0 0
    display: block
    height: 0
    width: 0
    position: absolute
    top: 0.42em
    left: -2.5em
    height: 5px
    width: 5px
    transform: rotate(45deg)

.dabstination
    font-weight: bold

.lil
    height: 1em
    transform: translateX(-5%)

.closemenu
    align-content: center
    img
        transform: translateX(50%)
        height: 1.1em

.bigger
    height: 5.5555555555em

</style>
