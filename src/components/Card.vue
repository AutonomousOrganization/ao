<template lang='pug'>
.task(:class="cardInputSty"  ref='wholeCard').dont-break-out.agedwrapper
    .agedbackground.freshpaper(v-if='cardAge < 8')
    .agedbackground.weekoldpaper(v-else-if='cardAge < 30')
    .agedbackground.montholdpaper(v-else-if='cardAge < 90')
    .agedbackground.threemontholdpaper(v-else='cardAge >= 90')
    bird(:b='b', :inId='inId')
    flag(:b='b', :inId='inId')
    tally(:b='b')
    .dogecoin.tooltip(v-if='b.weight && b.weight > 0'  :key='dogers')
        img(v-for='n in parseInt(Math.floor(b.weight))'  :key='n'  src='../assets/images/sun.svg')
        img(v-if='b.weight % 1 > 0 || b.weight < 1'  :class="['sixteenth' + fractionalReserveDoge]"  src='../assets/images/sun.svg'  :key='dogers')
        .tooltiptext
            p prioritized by:
            current(v-for='doger in b.dogers'  :memberId='doger'  :key='dogers')
    .buffertop
      preview-deck(:task='b')
      .cardbody
          .cardhud(v-if='cardStart')
              img.smallguild(src='../assets/images/timecube.svg')
              span {{ cardStart.days.toFixed(1) }} days
          linky.cardhud(:x='b.name' v-if='!member')
          current(v-else  :memberId='member.memberId')
    simple-priorities(:taskId="b.taskId", :inId='b.taskId')
    passed(:b='b')
    linked(:b='b')
    .spacer
    div
        scroll.faded(:b='b', :inId='inId')
        vine.faded(:b='b')
        coin(:b='b')
</template>

<script>
import Hammer from 'hammerjs'
import Propagating from 'propagating-hammerjs'

import calculations from '../calculations'
import PreviewDeck from './PreviewDeck'
import Bird from './Bird'
import Flag from './Flag'
import Scroll from './Scroll'
import Vine from './Vine'
import Coin from './Coin'
import Passed from './Passed'
import Tally from './Tally'
import Linky from './Linky'
import SimplePriorities from './SimplePriorities'
import Current from './Current'
import Linked from './Linked'

export default {
    props: ['b', 'inId', 'c'],
    components: { PreviewDeck, Bird, Flag, Scroll, Vine, Coin, Passed, Linky, SimplePriorities, Current, Tally, Linked},
    mounted() {
        let el = this.$refs.wholeCard
        if(!el) return
        let mc = Propagating(new Hammer.Manager(el))

        let doubleTap = new Hammer.Tap({ event: 'doubletap', taps: 2, time: 400, interval: 400 })
        let longPress = new Hammer.Press({ time: 600 })

        mc.add([doubleTap, longPress])

        longPress.recognizeWith([doubleTap])
        longPress.requireFailure([doubleTap])

        mc.on('doubletap', (e) => {
            console.log('goin triggered by doubletap')
            this.goIn()
            e.stopPropagation()
        })

        mc.on('press', (e) => {
            this.copyCardToClipboard()
        })
    },
    methods: {
        goIn(){
            let panel = this.c
            if (panel && panel.length && panel.length > 0){

            } else {
                panel = [this.b.taskId]
            }

            let top = panel.indexOf(this.b.taskId)

            if (top > -1){

            } else {
                top = 0
            }

            let parents = []

            parents.push(this.$store.getters.contextCard.taskId)
            if (this.inId && parents.indexOf(this.inId) < 0){
                parents.push(this.inId)
            }
            this.$store.dispatch("goIn", {
                parents,
                top,
                panel,
            })
            if(this.$store.state.upgrades.mode === 'doge' && this.$store.getters.contextCard.priorities.length > 0) {
                this.$store.commit("setMode", 1)
            }
            let shouldRouter = this.$router.currentRoute.path !== "/" + this.$store.state.upgrades.mode
            if (shouldRouter){
                this.$router.push("/" + this.$store.state.upgrades.mode)
            }
        },
        purge(){
          this.$store.dispatch("makeEvent", {
              type: 'task-removed',
              taskId: this.b.taskId,
          })
        },
        copyCardToClipboard(){
          navigator.clipboard.writeText(this.b.name)
              .then(x => console.log('success', x))
              .catch(err => {
                  console.log('failed to copy: ' + this.b.name, {err}) // XXX firefox, null error
              })
        },
        deaction(){
          this.$store.commit("setAction", false)
        },
    },
    computed: {
        cardStart(){
            if ( this.b.book.startTs ){
              let now = Date.now()
              let msTill = this.b.book.startTs - now
              let days = msTill / (1000 * 60 * 60 * 24)
              let hours = 0
              let minutes = 0
              return {
                  days,
                  hours,
                  minutes
              }
            }
        },
        cardInputSty(){
          if(!this.b) {
            return
          }
          return {
              redwx : this.b.color == 'red',
              bluewx : this.b.color == 'blue',
              greenwx : this.b.color == 'green',
              yellowwx : this.b.color == 'yellow',
              purplewx : this.b.color == 'purple',
              blackwx : this.b.color == 'black',
          }
        },
        cardAge(){
          let now = Date.now()
          let msSince = now - this.b.timestamp
          let days = msSince / (1000 * 60 * 60 * 24)
          return days
        },
        member(){
          let mc
          this.$store.state.members.forEach( m => {
              if (this.b.name === m.memberId ){
                  mc = m
              }
          })
          return mc
        },
        fractionalReserveDoge() {
            return Math.max(Math.floor((this.b.weight % 1) * 16), 1)
        },
    },
}

</script>

<style lang="stylus" scoped>

@import '../styles/colours'
@import '../styles/skeleton'
@import '../styles/grid'
@import '../styles/button'
@import '../styles/spinners'
@import '../styles/tooltips'

.count
    float: right

.activated
    border-style: solid
    border-width: thick
    border-color: white

.upgrade
    height: 3em

.task
    color: white
    margin:0
    margin-bottom: .25em
    padding:1em
    //border-radius: 12px
    box-shadow: -7px 7px 7px 1px rgba(21, 21, 21, 0.5)
    position: relative

.dont-break-out
  overflow-wrap: break-word
  word-wrap: break-word
  word-break: break-word
  hyphens: auto

.brder
    label
        text-align: center

.tooltip .tooltiptext
    font-size: 1em
    padding-bottom: 1em

.arrow
    height: 3.35em

.thumbnail-container {
  width: calc(1440px * 0.19)
  height: calc(900px * 0.19)
  display: inline-block
  overflow: hidden
  position: relative
}

.thumbnail {
  width: calc(1440px)
  height: calc(900px)
  position: relative
  -ms-zoom: 0.19
  -moz-transform: scale(0.19)
  -moz-transform-origin: 0 0
  -o-transform: scale(0.19)
  -o-transform-origin: 0 0
  -webkit-transform: scale(0.19)
  -webkit-transform-origin: 0 0
}

.thumbnail iframe {
  width: 1440px
  height: 900px
}

.thumbnail:after {
  content: ""
  display: block
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
}

.faded
    opacity: 0.235654

.faded:hover
    opacity: 1

.agedwrapper
    position: relative

.agedbackground
    background-image: url('/paper.jpg')
    background-repeat: no-repeat
    background-position: center center
    background-size: cover
    top: 0
    left: 0
    bottom: 0
    right: 0
    position: absolute
    width: 100%
    height: 100%
    pointer-events: none

.freshpaper
    background-image: url('/paper.jpg')
    opacity: 0.2

.weekoldpaper
    background-image: url('/paper_aged_1.png')
    opacity: 0.25

.montholdpaper
    background-image: url('/paper_aged_2.png')
    opacity: 0.3

.threemontholdpaper
    background-image: url('/paper_aged_3.png')
    opacity: 0.35

.smallguild
    height: 1.67em

.bold
    height: 1.21
    font-weight: bolder

.spacer
    clear: both
    height: 2.25em
    width: 100%
    margin-top: 1.5em

.cardhud
    margin-bottom: 1em
    position: relative
    z-index: 14

.cardheader
    margin: 0 auto
    font-size: 1.2em

.cardname
    z-index: 15
    position: relative

.dogecoin
    position: absolute
    top: -0.66em
    left: 50%
    transform: translateX(-50%)
    z-index: 154

.dogecoin .tooltiptext
    left: 3em

.dogecoin img
    width: 1.3em

.sixteenth1
    clip-path: polygon(50% 50%, 50% 0, 25% 0)

.sixteenth2
    clip-path: polygon(50% 50%, 50% 0, 0 0)

.sixteenth3
    clip-path: polygon(50% 50%, 50% 0, 0 0, 0 25%)

.sixteenth4
    clip-path: polygon(50% 50%, 50% 0, 0 0, 0 50%)

.sixteenth5
    clip-path: polygon(50% 50%, 50% 0, 0 0, 0 75%)

.sixteenth6
    clip-path: polygon(50% 50%, 50% 0, 0 0, 0 100%)

.sixteenth7
    clip-path: polygon(50% 50%, 50% 0, 0 0, 0 100%, 25% 100%)

.sixteenth8
    clip-path: polygon(50% 50%, 50% 0, 0 0, 0 100%, 50% 100%)

.sixteenth9
    clip-path: polygon(50% 50%, 50% 0, 0 0, 0 100%, 75% 100%)

.sixteenth10
    clip-path: polygon(50% 50%, 50% 0, 0 0, 0 100%, 100% 100%)

.sixteenth11
    clip-path: polygon(50% 50%, 50% 0, 0 0, 0 100%, 100% 100%, 100 75%)

.sixteenth12
    clip-path: polygon(50% 50%, 50% 0, 0 0, 0 100%, 100% 100%, 100% 50%)

.sixteenth13
    clip-path: polygon(50% 50%, 50% 0, 0 0, 0 100%, 100% 100%, 100% 25%)

.sixteenth14
    clip-path: polygon(50% 50%, 50% 0, 0 0, 0 100%, 100% 100%, 100% 0)

.sixteenth15
    clip-path: polygon(50% 50%, 50% 0, 0 0, 0 100%, 100% 100%, 100% 0, 75% 0)

.sixteenth16
    clip-path: polygon(50% 50%, 50% 0, 0 0, 0 100%, 100% 100%, 100% 0, 50% 0)

.buffertop
    margin-top: 2em
    clear: both
    width: 100%

.cardbody
    width: 100%

.preview
    width: 15%
    float: right
    margin-left: 0.5em
    margin-bottom: 0.5em

.tally
    position: absolute
    right: 2.5em
    top: 0.85em
</style>
