<template lang='pug'>

#tasks(@contextmenu.capture.prevent)
    .row.ptr(v-show="topCard  &&  c.length > 1"  ref='swipebar')
        .three.grid.tooltip(ref='previous')
            span &nbsp;
            img.fl(v-if='!open'  src='../assets/images/back.svg')
            .tooltiptext(v-if='$store.getters.member.tooltips')
                p.suggest previous
        .one.grid.horizcenter()
            .box.verticalcenter
                h3(v-if='!open') {{ top + 1 }}
        .four.grid.horizcenter()
            .mandalign.tooltip(ref='mandelorb')
                img(src='../assets/images/orb.svg')
                .tooltiptext(v-if='$store.getters.member.tooltips')
                    p(v-if='!open').suggest show all
                    p(v-else).suggest show stack
        .one.grid.horizcenter()
            .box.verticalcenter
                h3(v-if='!open') {{ c.length }}
        .three.grid.tooltip(ref='next')
            span &nbsp;
            img.fr(v-if='!open'  src='../assets/images/forward.svg')
            .tooltiptext(v-if='$store.getters.member.tooltips')
                p.suggest next
    .open(v-if='open')
        div(v-for='(b, i) in c'  :key="b.taskId")
            img.orby(v-if='i > 0'  src='../assets/images/orb.svg'  @click='orbswap(b.taskId)')
            hypercard(:b="b"  :key="b.taskId"  :inId='taskId'  :c='panelIds')
    .box(v-else)
        hypercard(:b="c[top]"  :key="componentKey"  :inId='taskId'  :c='panelIds')
</template>

<script>
import uuidv1 from 'uuid/v1'
import Hammer from 'hammerjs'
import Propagating from 'propagating-hammerjs'

import Hypercard from "./Card"

export default {
  props: ['c', 'taskId'],
  mounted(){
        let orbel = this.$refs.mandelorb
        if(!orbel) return
        let orbmc = Propagating(new Hammer.Manager(orbel))

        let orbTap = new Hammer.Tap({ time: 400 })
        orbmc.add(orbTap)
        orbmc.on('tap', (e) => {
            this.toggleOpen()
            e.stopPropagation()
        })

        let barel = this.$refs.swipebar
        if(!barel) return
        let barmc = Propagating(new Hammer.Manager(barel))

        let barSwipe = new Hammer.Swipe({ threshold: 50 })
        barmc.add(barSwipe)

        barmc.on('swipeleft', (e) => {
          this.previous()
          e.stopPropagation()
        })

        barmc.on('swiperight', (e) => {
          this.next()
          e.stopPropagation()
        })

        let orbSwipe = new Hammer.Swipe({ threshold: 50 })
        orbmc.add(orbSwipe)

        orbmc.on('swipeup', (e) => {
            this.swap(-1)
            this.previous()
            e.stopPropagation()
        })

        orbmc.on('swipedown', (e) => {
            this.swap(1)
            e.stopPropagation()
        });

        let orbPress = new Hammer.Press({ time: 400 })
        orbmc.add(orbPress)
        orbmc.on('press', (e) => {

            this.toggleStacks()
            e.stopPropagation()
        })

        let prevel = this.$refs.previous
        if(!prevel) return
        let prevmc = Propagating(new Hammer.Manager(prevel))

        let prevTap = new Hammer.Tap({ time: 400 })
        prevmc.add(prevTap)
        prevmc.on('tap', (e) => {
            this.previous()
            e.stopPropagation()
        })

        let prevPress = new Hammer.Press({ time: 400 })
        prevmc.add(prevPress)
        prevmc.on('press', (e) => {

            this.first()
            e.stopPropagation()
        })

        let nextel = this.$refs.next
        if(!nextel) return
        let nextmc = Propagating(new Hammer.Manager(nextel))

        let nextTap = new Hammer.Tap({ time: 400 })
        nextmc.add(nextTap)
        nextmc.on('tap', (e) => {
            this.next()
            e.stopPropagation()
        })

        let nextPress = new Hammer.Press({ time: 400 })
        nextmc.add(nextPress)
        nextmc.on('press', (e) => {

        this.last()
        e.stopPropagation()
        })
  },
  data(){
      return {
          open: false,
          top: 0,
          orbuuid: uuidv1(),
          componentKey: 0,
      }
  },
  methods:{
    toggleOpen(){
        if(!this.open) {

        } else {

        }
        this.open = !this.open
    },
    first() {

        this.top = 0
    },
    previous(){
        this.playSound()
        this.top = (this.top - 1) % this.c.length
        if (this.top === -1) {
            this.top = this.c.length - 1
        }
        this.componentKey ++
    },
    next(){
        this.playSound()
        this.top = (this.top + 1) % this.c.length
        this.componentKey ++
    },
    last() {

        this.top = this.c.length - 1
    },
    orbswap(swapId1){
        let swapId2 = this.panelIds[ this.panelIds.indexOf(swapId1) - 1 ]
        this.$store.dispatch("makeEvent", {
            type: 'task-swapped',
            taskId: this.taskId,
            swapId1,
            swapId2,
            direction: 'up',
        })
    },
    swap(direction){
        let cardIndex
        this.c.forEach((t, i) => {
          if(t.taskId === this.topCard.taskId) {
            cardIndex = i
          }
        })
        let swapIndex = (cardIndex + direction) % this.c.length
        if (swapIndex === -1) {
            swapIndex = this.c.length - 1
        } else if (swapIndex > this.c.length - 1) {
            swapIndex = 0
        }

        this.$store.dispatch("makeEvent", {
            type: 'task-swapped',
            taskId: this.taskId,
            swapId1: this.topCard.taskId,
            swapId2: this.c[swapIndex].taskId,
            direction: 'up',
        })
    },
    playSound(){
      if (!this.$store.getters.member.muted){
        try {
          let flip = new Audio(require('../assets/sounds/pageturn.wav'))
          flip.volume = flip.volume * 0.33
          flip.play()
        } catch (err){}
      }
    },
    toggleStacks(){
        if(this.$store.state.upgrades.stacks === 1) {

        } else {

        }
        this.$store.commit('toggleStacks')
    },
  },
  computed: {
    topCard(){
        this.componentKey ++
        if(this.top >= this.c.length) {
            this.top = 0
        }
        if (this.c.length > 0) {
            return this.c[this.top]
        }
        return false
    },
    panelIds() {
        return this.c.map(g => g.taskId)
    }
  },
  components:{
      Hypercard,
  },
}

</script>

<style lang="stylus" scoped>

@import '../styles/colours'
@import '../styles/grid'
@import '../styles/button'
@import '../styles/tooltips'

.orby
    height: 2.2em
    margin-top: -1em
    margin-bottom: -1em
    margin-left: 4.45em

#tasks
    width: 100%
    color: lightGrey

tr
    border-color: accent4
    border-top-style: solid
    border-bottom-style: solid
    border-width: 3px
    vertical-align:middle

thead
    tr
        text-align: center

td
    vertical-align: middle
    color: accent2
    font-size: 1.34em
    text-align: center

li
    text-align: left

table
    text-align:center
    width: 100%
th
    font-family: sans-serif
    font-weight: lighter
    font-size: 1.1em
    color: accent1
    border-color: accent1

td
    color: accent3

.padding
    padding: 1.987654321em

li
    margin-left: 1em

.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

img
    height: 3em
    user-drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -ms-user-select: none;

.ptr
    margin-bottom: 0
    margin: 1em 0 0.5em 0
    background-color: rgba(51, 51, 51, 0.3)
    border-radius: 40px
    opacity: 0.77
.fr
    float: right
    margin-left: 0.5em
    margin-top: 0.5em
    //margin-bottom: 0.8em
    margin-right: 0.5em
    cursor: pointer

.fl
    float: left
    margin-right: 0.5em
    margin-top: 0.5em
    //margin-bottom: 0.8em
    margin-left: 0.5em
    cursor: pointer

.fadey
    opacity: 0.36

.box
    min-height: 1em

.bar
    min-height: 1em
    background: softGrey

.verticalcenter
    margin-top: 1em

.horizcenter
    text-align: center

.mandalign
    margin-top: 5px
    cursor: pointer
    padding: 0.77em
    user-drag:none
    img
        height: 1.7em

.center
    text-align: center
</style>
