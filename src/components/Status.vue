<template lang='pug'>

.status.small.always.left
    .tooltip(@click='bark')
        img.doge(v-if='!$store.state.upgrades.barking'  src='/doge_faded.png'  id='dogecomm'  :class='{ red : $store.state.loader.connected !== "connected" }')
        img.doge.flip(v-else  src='../assets/images/loud.svg'  id='dogecomm'  :class='{ red : $store.state.loader.connected !== "connected" }')
        .tooltiptext.bottom
            span(v-for='(n, i) in $store.getters.presentIds'  :key='n')
                current(:memberId='n')
                br(v-if='i%3 === 2')
    .wowdar
        .ringbase.ring1
        .ringbase.ring2
        .pulse
        .pointer
            .div
        .ping.pos1
        .ping.pos2
    .ringbase.ring3.big(:class='{ showping : $store.state.upgrades.pinging }')
</template>

<script>

import Hammer from 'hammerjs'
import Propagating from 'propagating-hammerjs'
import Current from './Current'

export default {
    name: 'status',
    components: {Current},
    mounted() {
        let dogeel = document.getElementById('dogecomm')
        let dogemc = Propagating(new Hammer.Manager(dogeel))

        let Press2 = new Hammer.Press({
            time: 800
        })
        dogemc.add(Press2)
        dogemc.on('press', (e) => {
            if(this.$store.getters.member.muted) {
                return
            }

        })
    },
    methods: {
        bark(){
            this.$store.dispatch("makeEvent", {
                type: "doge-barked",
                memberId: this.$store.getters.member.memberId
            })
        },
        toggleMute() {
            if(this.$store.getters.member.muted) {
                this.$store.dispatch("makeEvent", {
                    type: "doge-unmuted",
                    memberId: this.$store.getters.member.memberId
                })
            } else {
                this.$store.dispatch("makeEvent", {
                    type: "doge-muted",
                    memberId: this.$store.getters.member.memberId
                })
            }
        },
    },
    computed: {
        liveConnections(){
            return this.$store.state.ao.filter(r => r.state && r.state.cash && r.state.cash.alias)
        },
        dotClass(){
            return {
                redwx: this.$store.state.loader.connected === 'disconnected',
                yellowwx: this.$store.state.loader.connected === 'connecting',
                greenwx: this.$store.state.loader.connected === 'connected',
                purplewx: !!this.$store.state.loader.connectionError
            }
        }
    }
}
</script>

<style lang="stylus" scoped>

@import '../styles/colours'
@import '../styles/grid'
@import '../styles/tooltips'

.dot
  height: 0.5em
  width: 0.5em
  border-radius: 50%
  display: inline-block
  margin-right: 0.5em

.small.always.left
    position: fixed
    bottom: 0
    left: 0
    margin-left: 0.5em
    margin-bottom: 0.3em
    z-index: 151

body
    background-color: #333
    padding: 50px

.wowdar, altwowdar
    float:left
    position:relative
    width:70px
    height:70px
    background-size: 100% 100%
    border-radius:35px
    box-shadow:0 1px 1px 0 rgba(0,0,0,0.4), 0 0 4px 1px rgba(0,0,0,0.2), inset 0 1px 1px 0 rgba(255,255,255,0.2), inset 0 2px 4px 1px rgba(255,255,255,0.1)
    display: none

@keyframes wow
  0% { opacity: 0 }
  100% { opacity: 1 }

.tooltip:hover > .tooltiptext
    animation-name: wow
    animation-duration: 0.5s
    transition-timing-function: ease
    transition-property: opacity

.tooltip:hover+.wowdar
    display: block
    animation-name: wow
    animation-duration: 0.2s
    transition-timing-function: ease
    transition-property: opacity

.pulse
  position:absolute
  top:0
  left:0
  width:70px
  height:70px
  border-radius:35px
  background:#dcf48a
  -moz-animation: pulsating 2s ease-in-out
  -moz-animation-iteration-count: infinite
  -webkit-animation: pulsating 2s ease-in-out
  -webkit-animation-iteration-count: infinite
  opacity:0.0
  z-index:5

.ringbase {
  position:absolute
  top:0
  left:0
  width:70px
  height:70px
  border-radius:35px
  opacity:0.0
  z-index:10
}

.ring1 {
  box-shadow:0 0 2px 1px #8eb716, inset 0 0 2px 1px #00f400
  -moz-animation: ring 2s ease-in-out
  -moz-animation-iteration-count: infinite
  -webkit-animation: ring 2s ease-in-out
  -webkit-animation-iteration-count: infinite
  animation: ring 2s ease-in-out
  animation-iteration-count: infinite
}

.ring2 {
  box-shadow:0 0 1px 0px #cbe572, inset 0 0 1px 0px #00f400
  -moz-animation: ring 2s ease-in-out
  -moz-animation-iteration-count: infinite
  -moz-animation-delay: 0.5s
  -webkit-animation: ring 2s ease-in-out
  -webkit-animation-iteration-count: infinite
  -webkit-animation-delay: 0.5s
  animation: ring 2s ease-in-out
  animation-iteration-count: infinite
  animation-delay: 0.5s
}

.ring3 {
  box-shadow:0 0 3px 0px #cbe572, inset 0 0 1px 0px #cbe572
  -moz-animation: ring 1.5s ease-in-out
  -moz-animation-iteration-count: infinite
  -moz-animation-delay: 0.5s
  -webkit-animation: ring 1.5s ease-in-out
  -webkit-animation-iteration-count: infinite
  -webkit-animation-delay: 0.5s
  animation: ring 1.5s ease-in-out
  animation-iteration-count: infinite
  animation-delay: 0.5s
  display: block
}

@-webkit-keyframes pulsating {
  0% {opacity: 0.0}
  50% {opacity: 0.2}
  100% {opacity: 0.0}
}

@-moz-keyframes pulsating {
  0% {opacity: 0.0}
  50% {opacity: 0.2}
  100% {opacity: 0.0}
}

@keyframes pulsating {
  0% {opacity: 0.0}
  50% {opacity: 0.2}
  100% {opacity: 0.0}
}

@-webkit-keyframes ring {
  0% {-webkit-transform: scale(0.4, 0.4); opacity: 0.0}
  50% {opacity: 0.6}
  100% {-webkit-transform: scale(1.1, 1.1); opacity: 0.0}
}

@-moz-keyframes ring {
  0% {-moz-transform: scale(0.4, 0.4); opacity: 0.0}
  50% {opacity: 0.6}
  100% {-moz-transform: scale(1.1, 1.1); opacity: 0.0}
}

@keyframes ring {
  0% {transform: scale(0.4, 0.4); opacity: 0.0}
  50% {opacity: 0.6}
  100% {transform: scale(1.1, 1.1); opacity: 0.0}
}


.pointer {
  position: absolute
  width: 70px
  top: 35px
  -webkit-animation: circling 2s linear
  -webkit-animation-iteration-count: infinite
  -moz-animation: circling 2s linear
  -moz-animation-iteration-count: infinite
  animation: circling 2s linear
  animation-iteration-count: infinite
  z-index: 20
}

.pointer div {
  width: 49%
  border-bottom:2px solid #00f400
}

.ping {
  opacity: 0
  border: 3px solid #e0f400
  border-radius: 100%
  position:absolute
  -webkit-animation: blink 2s ease-out
  -webkit-animation-iteration-count: infinite
  -moz-animation: blink 2s ease-out
  -moz-animation-iteration-count: infinite
  animation: blink 2s ease-out
  animation-iteration-count: infinite
  z-index: 25
}

.ping.pos1 {
  left:10px
  top:38px
}

.ping.pos2 {
  left:40px
  top:18px
  -webkit-animation-delay: 0.6s
  -moz-animation-delay: 0.6s
  animation-delay: 0.6s
}

@-webkit-keyframes circling {
  0% {-webkit-transform: rotate(0deg)}
  50% {-webkit-transform: rotate(180deg)}
  100% {-webkit-transform: rotate(360deg)}
}

@-moz-keyframes circling {
  0% {-moz-transform: rotate(0deg)}
  50% {-moz-transform: rotate(180deg)}
  100% {-moz-transform: rotate(360deg)}
}

@keyframes circling {
  0% {transform: rotate(0deg)}
  50% {transform: rotate(180deg)}
  100% {transform: rotate(360deg)}
}

@-webkit-keyframes blink {
  0% { opacity: 1 }
  100% { opacity: 0 }
}

@-moz-keyframes blink {
  0% { opacity: 1 }
  100% { opacity: 0 }
}

@keyframes blink {
  0% { opacity: 1 }
  100% { opacity: 0 }
}

.doge
    left: 25px
    bottom: 23px
    position: fixed
    opacity: 0.5
    height: 35px
    width: 35px
    cursor: pointer
    z-index: 9001

.doge.red
    filter: hue-rotate(-38deg)
    transform: scaleX(-1)

.big
    position: fixed
    left: -85%
    bottom: 27px
    width: 2000px
    height: 2000px
    border-radius: 50%
    display: none

.showping
    display: block

.flip
    transform: scaleX(-1)

.pong
    margin-left: 0.25em

.tooltiptext.bottom
    min-width: 20em
    position: absolute
    left: 0.5em
    bottom: -2.5em
    top: unset

.tooltiptext.bottom.breadpad
    left: 4em
    bottom: 0.25em
</style>
