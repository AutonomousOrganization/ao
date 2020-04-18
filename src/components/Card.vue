<template lang='pug'>
.task(:class="cardInputSty"  ref='wholeCard').dont-break-out.agedwrapper
    .agedbackground.freshpaper(v-if='cardAge < 8')
    .agedbackground.weekoldpaper(v-else-if='cardAge < 30')
    .agedbackground.montholdpaper(v-else-if='cardAge < 90')
    .agedbackground.threemontholdpaper(v-else='cardAge >= 90')
    bird(:b='b', :inId='inId')
    flag(:b='b', :inId='inId')
    tally(:b='b')
    .dogecoin.tooltip(v-if='w > 0')
        img(v-for='n in parseInt(Math.floor(w))'  src='../assets/images/sun.svg')
        img(v-if='w % 1 > 0 || w < 1'  :class="['sixteenth' + fractionalReserveDoge]"  src='../assets/images/sun.svg')
    .buffertop
      preview-deck(v-if='$store.getters.contextCard.taskId !== b.taskId'  :task='b')
      .cardbody
          linky.cardhud(:x='b.name' v-if='!member')
          current(v-else  :memberId='member.memberId')
    div(v-if='b.taskId !== $store.getters.member.action  && b.taskId !== $store.getters.contextCard.taskId')
        simple-priorities(:taskId="b.taskId", :inId='b.taskId')
    .passed
        div.totop(v-if='b.passed.length + links.length > 0  && $store.state.upgrades.bird')
            div(@click='toggleBird')
                template(v-for='n in b.passed')
                    .row.pad.centered
                        current(:memberId='n[0]')
                        img.send(src='../assets/images/send.svg')
                        current(:memberId='n[1]')
                template(v-for='l in links')
                    .row.pad.centered
                        h6 {{l.slice(0,8)}}
    div
        .scrol.faded(ref='scuttle')
            img.scrolly(src='../assets/images/downboat.svg'  :id='uuid')
        .vine.faded(@click='goIn')
            img.viney.adjtooltip(src='../assets/images/orb.svg')
            .tooltiptext.correctspot(v-if='b.deck.length > 0')
                current.block(v-for='memberId in b.deck'  :memberId='memberId')
        .singlebird(v-if='links.length + b.passed.length > 0'  @click='toggleBird')
            .row.pad.centered(:class='{faded:!$store.state.upgrades.bird}')
                span(v-if='links.length > 0')
                    img.send(src='../assets/images/ao.svg')
                    span {{ links.length}}
                span(v-if='b.passed.length > 0')
                    img.send(src='../assets/images/send.svg')
                    span {{ b.passed.length}}
</template>

<script>
import calculations from '../calculations'
import Hammer from 'hammerjs'
import Propagating from 'propagating-hammerjs'

import Tally from './Tally'
import SimplePriorities from './SimplePriorities'
import Linky from './Linky'
import Current from './Current'
import PreviewDeck from './PreviewDeck'

import Bird from './Bird'
import Flag from './Flag'
import Coin from './Coin'


export default {
    props: ['b', 'inId', 'c'],
    components: { PreviewDeck, Bird, Flag, Coin, Linky, SimplePriorities, Current, Tally},
    mounted() {
        let el2 = this.$refs.scuttle

        let mc = Propagating(new Hammer.Manager(el2))
        // find out if this is a subtask that breaks it?
        let Tap = new Hammer.Tap({ time: 400 })
        let Press = new Hammer.Press({ time: 500 })
        mc.add([Tap, Press])
        mc.on('tap', (e) => {
            let parentId = this.$store.state.context.parent[this.$store.state.context.parent.length-1]
            if (this.$store.getters.member.action === this.b.taskId){

                if (this.$store.getters.contextCard.priorities.length <= 1){
                    this.$store.commit('setMode', 0)
                    this.$router.push('/doge')
                }
                this.$store.dispatch("makeEvent", {
                  type: 'task-de-sub-tasked',
                  subTask: this.b.taskId,
                  taskId: this.inId,
                })
                this.$store.commit('setAction', false)
            } else if (this.inId){
                this.$store.dispatch("makeEvent", {
                  type: 'task-de-sub-tasked',
                  subTask: this.b.taskId,
                  taskId: this.inId,
                })
            } else if (parentId) {
              this.$store.dispatch("makeEvent", {
                type: 'task-de-sub-tasked',
                subTask: this.b.taskId,
                taskId: parentId,
              })
              let newPanel = _.filter(this.$store.state.context.panel, tId => tId !== this.b.taskId)
              let newTop = Math.min(this.$store.state.context.top, newPanel.length -1)
              if (newPanel.length > 0){
                  this.$store.commit('setPanel', newPanel)
                  this.$store.commit('setTop', newTop)
              } else {
                  this.$store.dispatch('goUp', {
                    target: parentId,
                    panel: [parentId],
                    top: 0
                  })
              }
            } else {
                this.$store.dispatch("makeEvent", {
                  type: 'task-de-sub-tasked',
                  subTask: this.b.taskId,
                  taskId: this.b.taskId,
                })
            }
            e.stopPropagation()
        })
        mc.on('press', (e) => {
            this.$store.dispatch("makeEvent", {
              type: 'task-popped',
              taskId: this.b.taskId,
              inId: this.$store.getters.contextCard.taskId,
            })
            e.stopPropagation()
        })
        let el = this.$refs.wholeCard
        if(!el) return
        let mc2 = Propagating(new Hammer.Manager(el))

        let doubleTap = new Hammer.Tap({ event: 'doubletap', taps: 2, time: 400, interval: 400 })
        let longPress = new Hammer.Press({ time: 600 })

        mc2.add([doubleTap, longPress])

        longPress.recognizeWith([doubleTap])
        longPress.requireFailure([doubleTap])

        mc2.on('doubletap', (e) => {
            this.goIn()
            e.stopPropagation()
        })

        mc2.on('press', (e) => {
            this.copyCardToClipboard()
        })
    },
    methods: {
        toggleBird(){
            this.$store.commit('toggleBird')
        },
        goIn(){
            let panel = this.c
            if (panel && panel.length && panel.length > 0){

            } else {
                panel = _.uniq( [this.b.taskId].concat(this.$store.state.context.panel) )
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
            let shouldPath = "/" + this.$store.state.upgrades.mode
            let shouldRouter = this.$router.currentRoute.path !== shouldPath
            if (shouldRouter){
                this.$router.push(shouldPath)
            }

            let shouldGrab = this.b.deck.indexOf(this.$store.getters.member.memberId) === -1
            if (shouldGrab) {
                this.$store.dispatch("makeEvent", {
                    type: 'task-grabbed',
                    taskId: this.b.taskId,
                    memberId: this.$store.getters.member.memberId,
                })
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
        w(){
            return this.$store.getters.weights[this.b.taskId]
        },
        links(){
            let links = []
            this.$store.state.ao.forEach(a => {
              if (a.links.indexOf(this.b.taskId) > -1) {
                links.push(a.address)
              }
            })
            return links
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
            return Math.max(Math.floor((this.w % 1) * 16), 1)
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

.faded
    opacity: .1

.tooltiptext.correctspot
    position: absolute
    top: calc(100% - 1.75em)
    right: 2em
    z-index: 9000

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
    margin:10px 0
    padding:20px

.row
    width: 100%
    .mainColumn
      width:calc(100% - 75px - 4%)
    .secondaryColumn
      width:75px
      button
        height:75px

.btn
    width:100%
    margin-top: 2em
    max-height: 3em

select
    background-color: lightteal

select.form-control
    color: black

.curs
    cursor: pointer;

label
    color: black
    text-align: center
    padding: 0
    margin-bottom: -50px

.scrolly
    position: absolute
    left: 0.5em
    bottom: 0.5em
    height: 1.3em
    cursor: pointer

.vine
    width: 100%

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
    margin:10px 0
    padding:20px

.row
    width: 100%
    .mainColumn
      width:calc(100% - 75px - 4%)
    .secondaryColumn
      width:75px
      button
        height:75px

.btn
    width:100%
    margin-top: 2em
    max-height: 3em

select
    background-color: lightteal

select.form-control
    color: black

.curs
    cursor: pointer;

label
    color: black
    text-align: center
    padding: 0
    margin-bottom: -50px

.viney
    height: 1.3em
    position: absolute
    bottom: 0.5em
    right: 0.5em
    cursor: pointer
    opacity: 0.8321

.row
    width: 100%

.send
    height: 1.5em

.accept, .dontaccept
    width: 100%
    background: accent5
    padding: .789em
    border-style: none
    img
        background: white
        padding: .1em
        border-radius: 3px

.arrow
    height: 3.35em

.fl
    float: left
.fr
    float: right

.totop
    z-index: 1000

.pad
    margin-top: 0em
    margin-bottom: 0em

.centered
    text-align: center

.fw
    width:100%

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
