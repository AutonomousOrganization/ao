<template lang='pug'>
div
    div(ref='bull')
        img.r(src="../assets/images/bull.svg"    :class='{ bigger : isBull }')
    .bullmenu(v-if='isBull && $store.getters.member.tooltips')
        p(@click='goDash("doge")'  :class='{ dabstination : $store.state.upgrades.mode === "doge" }')
            img.lil(src='../assets/images/doge.svg')
            span Access
        p(@click='goDash("boat")'  :class='{ dabstination : $store.state.upgrades.mode === "boat" }')
            img.lil(src='../assets/images/boat.svg')
            span Connect
        p(@click='goDash("timecube")'  :class='{ dabstination : $store.state.upgrades.mode === "timecube" }')
            img.lil(src='../assets/images/timecube.svg')
            span Reserve
        p(@click='goDash("chest")'  :class='{ dabstination : $store.state.upgrades.mode === "chest" }')
            img.lil(src='../assets/images/chest.svg')
            span Wallet
        p(@click='goDash("badge")'  :class='{ dabstination : $store.state.upgrades.mode === "badge" }')
            img.lil(src='../assets/images/badge.svg')
            span Accounts
        p(@click='close(false)')
            img.lil(src='../assets/images/uni.svg')
            span close
        p.check.click(@click='toggleTooltips')
            img.checkmark(v-if='$store.getters.member.tooltips', src='../assets/images/completed.svg')
            img.checkmark(v-else, src='../assets/images/uncompleted.svg')
            span.space tips
    div(v-if='isBull')
        status
        .satspot 1 = {{ $store.getters.satPointSpot.toLocaleString() }}&#12471;
            //- span  1BTC = ${{ $store.state.cash.spot.toLocaleString() }}
        .logout(v-if='$store.getters.isLoggedIn'  @click="killSession") log out
</template>

<script>
import Hammer from 'hammerjs'
import Propagating from 'propagating-hammerjs'
import Status from './Status'

export default {
  components: { Status },
  computed: {
      isBull(){
          return this.$store.state.upgrades.dimension === "bull"
      }
  },
  methods: {
    toggleTooltips(){
        this.$store.dispatch('makeEvent', {
            type: "member-field-updated",
            field: 'tooltips',
            newfield: !this.$store.getters.member.tooltips,
            memberId: this.$store.getters.member.memberId
        })
    },
    killSession(){
        this.$store.dispatch("makeEvent", {
            type: "session-killed",
            session: this.$store.state.loader.session
        })
        window.localStorage.removeItem("token")
        window.localStorage.removeItem("session")
        window.localStorage.clear()
        this.$store.commit('setAuth', {
            token: '', session: ''
        })
        window.location.replace('/')
    },
    goDash(mode) {
        if(!mode) {
            mode = this.$store.state.upgrades.mode
        }
        this.$store.commit('setDimension', 2)
        this.$store.commit('startLoading', 'bull-' + mode)

        this.$router.push('/dash/' + mode)
    },
    close(mode){
        if(!mode) {
            mode = this.$store.state.upgrades.mode
        }
        this.$store.commit('setDimension', 0)
        this.$router.push('/' + mode)
    },
    nextMode() {
        this.$store.commit('nextMode')
    },
  },
  mounted(){
    let bullel = this.$refs.bull
    let bullmc = Propagating(new Hammer.Manager(bullel))
    let bullTap = new Hammer.Tap({ time: 400 })
    let bullDoubleTap = new Hammer.Tap({ event: 'doubletap', taps: 2, time: 400, interval: 400 })
    let bullTripleTap = new Hammer.Tap({ event: 'tripletap', taps: 3, time: 400, interval: 400 })
    let bullQuadrupleTap = new Hammer.Tap({ event: 'quadrupletap', taps: 4, time: 400, interval: 400 })
    let bullQuintupleTap = new Hammer.Tap({ event: 'quintupletap', taps: 5, time: 400, interval: 400 })
    let bullPress = new Hammer.Press({ time: 600 })
    bullmc.add([bullPress, bullQuintupleTap, bullQuadrupleTap, bullTripleTap, bullDoubleTap, bullTap])
    bullPress.recognizeWith([bullQuintupleTap, bullQuadrupleTap, bullTripleTap, bullDoubleTap, bullTap])
    bullTap.recognizeWith([bullQuintupleTap, bullQuadrupleTap, bullTripleTap, bullDoubleTap])
    bullTap.requireFailure([bullQuintupleTap, bullQuadrupleTap, bullTripleTap, bullDoubleTap])
    bullDoubleTap.recognizeWith([bullQuintupleTap, bullQuadrupleTap, bullTripleTap])
    bullDoubleTap.requireFailure([bullQuintupleTap, bullQuadrupleTap, bullTripleTap])
    bullTripleTap.recognizeWith([bullQuintupleTap, bullQuadrupleTap])
    bullTripleTap.requireFailure([bullQuintupleTap, bullQuadrupleTap])
    bullQuadrupleTap.recognizeWith(bullQuintupleTap)
    bullQuadrupleTap.requireFailure(bullQuintupleTap)

    bullmc.on('tap', (e) => {
        if(!this.isBull) {
            this.goDash(false)
        } else {
            this.nextMode()
            this.goDash(false)
        }
        e.stopPropagation()
    })

    bullmc.on('doubletap', (e) => {
        this.goDash('boat')
        e.stopPropagation()
    })

    bullmc.on('tripletap', (e) => {
        this.goDash('badge')
        e.stopPropagation()
    })

    bullmc.on('quadrupletap', (e) => {
        this.goDash('chest')
        e.stopPropagation()
    })

    bullmc.on('quintupletap', (e) => {
        this.goDash('timecube')
        e.stopPropagation()
    })

    bullmc.on('press', (e) => {
        this.goDash('doge')
        e.stopPropagation()
    })
  }
}

</script>

<style lang='stylus' scoped>
@import '../styles/tooltips'
@import '../styles/colours'

p:hover
    background: rgba(255,255,255, 0.4)

.r
    position: fixed
    top: 0
    cursor: pointer
    z-index: 152
    height: 3.5555555555em
    right: 0

.lil
    height: 1em
    transform: translateX(-5%)

.bigger
    height: 5.5555555555em

.bullmenu
    position: fixed
    top: 5em
    background: teal
    right: 1em
    color: main
    border-radius: 3px
    padding: 1em
    opacity: 0.8
    z-index: 9009
    p
        cursor: pointer
        padding: 0.7654321

.satspot
    position: fixed
    top: 1em
    left: 4em
    z-index: 9000

.logout
    position: fixed
    right: 1em
    bottom: 1em
    color: teal
    font-size: 1.3em
    font-weight: bold
    cursor: pointer

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

.closemenu
    align-content: center
    img
        transform: translateX(50%)
        height: 1.1em

.space
    padding-left: .654321em

.click
    cursor: pointer

.checkmark
    height: 1.58em
.check
    padding: 0.5em

</style>
