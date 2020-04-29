<template lang='pug'>

.helm(@contextmenu.prevent)
    button.moderight.adjtooltip(v-if='$store.state.upgrades.mode || !$store.getters.isLoggedIn' id='helmright'  @mousedown='$store.dispatch("flashHelm",1)')
        img.upg(:src='"../assets/images/" + futureMode + ".svg"')
    .tooltiptext.r(v-if='$store.getters.member.tooltips')
        p.suggest set mode {{futureMode}}
    button.topcenter.adjtooltip(id='helm'  :class='helmClasses'  @mousedown='$store.dispatch("flashHelm",1)')
        img.upg(:src='"../assets/images/" + $store.state.upgrades.mode + ".svg"')
    .tooltiptext.m(v-if='$store.getters.member.tooltips')
        p.suggest next mode
    button.modeleft.adjtooltip(v-if='$store.state.upgrades.mode || !$store.getters.isLoggedIn'  id='helmleft'  :class='{ boat : $store.state.upgrades.mode === "badge" }'  @mousedown='$store.dispatch("flashHelm",1)')
        img.upg(:src='"../assets/images/" + pastMode + ".svg"')
    .tooltiptext.l(v-if='$store.getters.member.tooltips')
        p.suggest set mode {{pastMode}}
    div(v-if='isBull')
        .satspot 1 = {{ $store.getters.satPointSpot.toLocaleString() }}&#12471;
        .logout(v-if='$store.getters.isLoggedIn'  @click="killSession") log out
    img.l.adjtooltip(src="../assets/images/sun.svg"  ref='sun'  :class='{ bigger : isSun, faded: $store.state.upgrades.dimension !== "sun" }')
    .tooltiptext.s(v-if='$store.getters.member.tooltips')
        p.suggest overview ao
        div
          p(@click='goFront("doge")'  :class='{ dabstination : $store.state.upgrades.mode === "doge" && isSun }')
              img.lil(src='../assets/images/doge.svg')
              span Oracle
          p(@click='goFront("boat")'  :class='{ dabstination : $store.state.upgrades.mode === "boat" && isSun }')
              img.lil(src='../assets/images/boat.svg')
              span Port
          p(@click='goFront("timecube")'  :class='{ dabstination : $store.state.upgrades.mode === "timecube" && isSun }')
              img.lil(src='../assets/images/timecube.svg')
              span Events
          p(@click='goFront("chest")'  :class='{ dabstination : $store.state.upgrades.mode === "chest" && isSun }')
              img.lil(src='../assets/images/chest.svg')
              span Bounties
          p(@click='goFront("badge")'  :class='{ dabstination : $store.state.upgrades.mode === "badge" && isSun }')
              img.lil(src='../assets/images/badge.svg')
              span Tags
    img.r.adjtooltip(ref='bull'  src="../assets/images/bull.svg"    :class='{ bigger : isBull, faded: $store.state.upgrades.dimension !== "bull" }')
    .tooltiptext.b(v-if='$store.getters.member.tooltips')
        p.suggest manage ao
        p(@click='goDash("doge")'  :class='{ dabstination : $store.state.upgrades.mode === "doge" && isBull }')
            img.lil(src='../assets/images/doge.svg')
            span Access
        p(@click='goDash("boat")'  :class='{ dabstination : $store.state.upgrades.mode === "boat" && isBull }')
            img.lil(src='../assets/images/boat.svg')
            span Connect
        p(@click='goDash("timecube")'  :class='{ dabstination : $store.state.upgrades.mode === "timecube" && isBull }')
            img.lil(src='../assets/images/timecube.svg')
            span Reserve
        p(@click='goDash("chest")'  :class='{ dabstination : $store.state.upgrades.mode === "chest" && isBull }')
            img.lil(src='../assets/images/chest.svg')
            span Wallet
        p(@click='goDash("badge")'  :class='{ dabstination : $store.state.upgrades.mode === "badge" && isBull }')
            img.lil(src='../assets/images/badge.svg')
            span Accounts
</template>

<script>

import Hammer from 'hammerjs'
import Propagating from 'propagating-hammerjs'

import Status from './Status'

export default {
    mounted() {
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
                this.$router.push('/' + this.$store.state.upgrades.mode)
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
                this.$router.push('/' + this.$store.state.upgrades.mode)
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

        let el = document.getElementById('helm')
        let mc = Propagating(new Hammer.Manager(el))

        let Swipe = new Hammer.Swipe()
        mc.add(Swipe)
        mc.on('swipeleft', (e) => {
            this.$store.dispatch('previousUpgradeMode', this.$router)
            e.stopPropagation()
        })

        mc.on('swiperight', (e) => {
            this.$store.dispatch('nextUpgradeMode', this.$router)
            e.stopPropagation()
        })

        mc.on('swipeup', (e) => {
            this.$store.commit("closeUpgrades")
            e.stopPropagation()
        })

        mc.on('swipedown', (e) => {
            this.$store.dispatch('nextUpgradeMode', this.$router)
            e.stopPropagation()
        })

        let helmTap = new Hammer.Tap({ time: 400 })
        let helmDoubleTap = new Hammer.Tap({ event: 'doubletap', taps: 2, time: 400, interval: 400 })
        let helmTripleTap = new Hammer.Tap({ event: 'tripletap', taps: 3, time: 400, interval: 400 })
        let helmQuadrupleTap = new Hammer.Tap({ event: 'quadrupletap', taps: 4, time: 400, interval: 400 })
        let helmQuintupleTap = new Hammer.Tap({ event: 'quintupletap', taps: 5, time: 400, interval: 400 })
        let helmPress = new Hammer.Press({ time: 600 })
        // is this really ne
        mc.add([helmPress, helmQuintupleTap, helmQuadrupleTap, helmTripleTap, helmDoubleTap, helmTap])
        helmPress.recognizeWith([helmQuintupleTap, helmQuadrupleTap, helmTripleTap, helmDoubleTap, helmTap])
        helmTap.recognizeWith([helmQuintupleTap, helmQuadrupleTap, helmTripleTap, helmDoubleTap])
        helmTap.requireFailure([helmQuintupleTap, helmQuadrupleTap, helmTripleTap, helmDoubleTap])
        helmDoubleTap.recognizeWith([helmQuintupleTap, helmQuadrupleTap, helmTripleTap])
        helmDoubleTap.requireFailure([helmQuintupleTap, helmQuadrupleTap, helmTripleTap])
        helmTripleTap.recognizeWith([helmQuintupleTap, helmQuadrupleTap])
        helmTripleTap.requireFailure([helmQuintupleTap, helmQuadrupleTap])
        helmQuadrupleTap.recognizeWith(helmQuintupleTap)
        helmQuadrupleTap.requireFailure(helmQuintupleTap)

        mc.on('tap', (e) => {
            this.$store.dispatch('nextUpgradeMode', this.$router)
            e.stopPropagation()
        })

        mc.on('doubletap', (e) => {
            console.log("double click")
            this.$store.dispatch('flashHelm', 0.5)
            this.goUni('boat')
            e.stopPropagation()
        })

        mc.on('tripletap', (e) => {
            console.log("triple click")
            this.$store.dispatch('flashHelm', 0.5)
            this.goUni('badge')
            e.stopPropagation()
        })

        mc.on('quadrupletap', (e) => {
            this.$store.dispatch('flashHelm', 0.5)
            this.goUni('chest')
            e.stopPropagation()
        })

        mc.on('quintupletap', (e) => {
            this.$store.dispatch('flashHelm', 0.5)
            this.goUni('timecube')
            e.stopPropagation()
        })

        mc.on('press', (e) => {
            if(this.isUni){
                if(this.$store.state.upgrades.mode === 'doge' && this.$store.getters.contextCard.taskId === this.$store.getters.memberCard.taskId) {
                    this.$store.dispatch('flashHelm', 5)
                    this.goFront('doge')
                } else {
                    this.$store.dispatch('flashHelm', 2)
                    this.goUni('doge', true)
                    if(this.$store.getters.contextCard.taskId !== this.$store.getters.memberCard.taskId) {
                        this.goHome()
                    }
                }
            } else {
                this.$store.dispatch('flashHelm', 2)
                this.goUni('doge')
                if(this.$store.getters.contextCard.taskId !== this.$store.getters.memberCard.taskId) {
                    this.goHome()
                }
            }
            e.stopPropagation()
        })

        let rel = document.getElementById('helmright')
        let rmc = new Hammer.Manager(rel)

        let Tap2 = new Hammer.Tap({ time: 400 })
        rmc.add(Tap2)
        rmc.on('tap', (e) => {
            this.$store.dispatch('nextUpgradeMode', this.$router)
        })

        let lel = document.getElementById('helmleft')
        let lmc = new Hammer.Manager(lel)

        let Tap3 = new Hammer.Tap({ time: 400 })
        lmc.add(Tap3)
        lmc.on('tap', (e) => {
            this.$store.dispatch('previousUpgradeMode', this.$router)
        })
    },
    methods: {
        goFront(mode) {
            if(!mode) {
                mode = this.$store.state.upgrades.mode
            }
            this.$store.commit('setDimension', 1)
            this.$router.push('/front/' + mode)
        },
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

            console.log('godash called')
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
        goUni(mode, silent = false) {

            this.$router.push('/' + mode)
        },
        goHome(taskId){
            let parents = []
            if (this.$store.getters.contextCard.taskId){
                parents.push(this.$store.getters.contextCard.taskId)
            }
            this.$store.dispatch("goIn", {
                panel: [this.$store.getters.memberCard.taskId],
                top: 0,
                parents
            })
            if(this.$store.state.upgrades.mode === 'doge' && this.$store.getters.contextCard.priorities.length > 0) {
                this.$store.commit("setMode", 1)
            }
            this.$router.push("/" + this.$store.state.upgrades.mode)
        },
    },
    computed: {
        helmClasses(){
            let x = {
                bull:this.$store.state.upgrades.dimension === "bull",
                sun: this.$store.state.upgrades.dimension === "sun"
            }
            return _.merge(this.$store.state.upgrades.flashClasses, x)
        },
        pastMode(){
            let newMode = this.$store.state.upgrades.modes.indexOf(this.$store.state.upgrades.mode) - 1
            if (newMode < 0){
                newMode = 4
            }
            return this.$store.state.upgrades.modes[newMode]
        },
        futureMode(){
            let newMode = this.$store.state.upgrades.modes.indexOf(this.$store.state.upgrades.mode) + 1
            if (newMode > 4) {
                newMode = 0
            }
            return this.$store.state.upgrades.modes[newMode]
        },
        isUni() {
            return this.$store.state.upgrades.dimension === "unicorn"
        },
        isBull(){
            return this.$store.state.upgrades.dimension === "bull"
        },
        isSun() {
            return this.$store.state.upgrades.dimension === "sun"
        },
    }
}

</script>

<style lang="stylus" scoped>

@import '../styles/colours'
@import '../styles/grid'
@import '../styles/tooltips'

.tooltiptext
    position: absolute
    z-index: 4000000

.tooltiptext.m
    top: 2em
    left: 50%

.tooltiptext.l
    left: calc(50% - 15em)
    top: 2.7em

.tooltiptext.r
    left: calc(50% + 3em)
    top: 2.7em


@media only screen and (max-width: 550px) {
  .modeleft, .moderight {
    display: none
  }
}

#helm
    cursor: pointer
    opacity: .3
    :hover
        opacity: 1

.upg
    height: 2em
    pointer-events: none

.topcenter
    position: fixed
    top: 0
    left: 50%
    transform: translateX(-50%)
    width: 10em
    max-width: 33%
    background: softGray
    color: main
    padding-left: 2em
    padding-right: 2em
    padding-top: .29em
    padding-bottom: .29em
    z-index: 77777
    opacity: 0.71
    border-bottom-left-radius: 50%
    border-bottom-right-radius: 50%
    border-top: none

.topcenter.bull
    background: lightteal

.topcenter.sun
    background: yellow

.modeleft, .moderight
    position: fixed
    top: 0
    left: calc(50% - 10em)
    opacity: 0.4
    // background: white
    // box-shadow: rgba(255, 255, 255, 0.65) 0px 0px 10px
    background: none
    border: none
    z-index: 153

.modeleft
    transform: translateX(50%)

.moderight
    left: calc(50% + 7.5em)
    transform: translateX(-50%)

.closed
    opacity: 1
    position: absolute

@keyframes flashhalf
    0% { background-color: #9ff; border-color: #aff }
    100% { background-color: softGray; border-color: buttonface }

@keyframes flash
    // 0% { background-color: softGray; border-color: buttonface }  // this makes the flash start late when there is GUI lag. but looks better.
    0% { background-color: #9ff; border-color: #aff }
    50% { background-color: #9ff; border-color: #aff }
    100% { background-color: softGray; border-color: buttonface }

.topcenter.flash
    animation-name: flash
    animation-duration: 0.35s
    animation-iteration-count: 1
    transition-timing-function: ease
    transition-property: background-color

.topcenter.flash.half
    animation-name: flashhalf
    animation-duration: 0.245s

.topcenter.flash.twice
    animation-duration: 0.1725
    animation-iteration-count: 2

.topcenter.flash.five
    animation-duration: calc(0.1725 * 5)
    animation-iteration-count: 5

.topcenter:hover
    background-color: #d3e3e3

.tooltiptext.b
    position: absolute
    top:2em
    right: 2em
.faded
    opacity: 0.145654

.faded:hover
    opacity: 1

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
    background: lightGrey
    color: black

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

.tooltiptext.s
    position: absolute
    top:2em
    left: 2em
.faded
    opacity: 0.145654

.faded:hover
    opacity: 1

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


.space
    padding-left: .654321em

.click
    cursor: pointer

.checkmark
    height: 1.58em
.check
    padding: 0.5em

</style>
